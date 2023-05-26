use std::str::FromStr;

use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, sysvar},
    Discriminator,
};
use anchor_spl::token::Mint;
use mpl_bubblegum::state::{
    metaplex_anchor::{MasterEdition, MplTokenMetadata, TokenMetadata},
    TreeConfig,
};
use mpl_token_metadata::{
    instruction::approve_collection_authority,
    state::{MAX_SYMBOL_LENGTH, MAX_URI_LENGTH},
};

use crate::{
    constants::{
        AUTHORITY_SEED, HIDDEN_SECTION_START, MAX_BASE_NAME_LENGTH, MAX_BASE_URI_LENGTH,
        NATIVE_MINT,
    },
    state::{AccountVersion, Creator, NanoMachine},
    utils::pad_string_or_throw,
};

pub fn initialize_v1(
    ctx: Context<Initialize>,
    initialization_params: InitializationParams,
) -> Result<()> {
    // initialize the nano_machine account
    let nano_machine_account = &mut ctx.accounts.nano_machine;

    let new_nano_machine = NanoMachine {
        version: AccountVersion::V1,
        authority: ctx.accounts.authority.key(),
        collection_mint: ctx.accounts.collection_mint.key(),
        base_name: pad_string_or_throw(initialization_params.base_name, MAX_BASE_NAME_LENGTH)?,
        base_uri: pad_string_or_throw(initialization_params.base_uri, MAX_BASE_URI_LENGTH)?,
        background_image_uri: pad_string_or_throw(
            initialization_params.background_image_uri,
            MAX_URI_LENGTH,
        )?,
        items_redeemed: 0,
        items_available: initialization_params.items_available,
        price: initialization_params.price,
        payment_mint: match &ctx.accounts.payment_mint {
            Some(payment_mint) => payment_mint.key(),
            None => Pubkey::from_str(NATIVE_MINT).unwrap(),
        },
        symbol: pad_string_or_throw(initialization_params.symbol, MAX_SYMBOL_LENGTH)?,
        seller_fee_basis_points: initialization_params.seller_fee_basis_points,
        creators: initialization_params.creators,
        go_live_date: initialization_params.go_live_date,
        merkle_tree: ctx.accounts.merkle_tree.key(),
    };
    new_nano_machine.validate()?;

    let mut struct_data = NanoMachine::discriminator().try_to_vec().unwrap();
    struct_data.append(&mut new_nano_machine.try_to_vec().unwrap());

    let mut account_data = nano_machine_account.data.borrow_mut();
    account_data[..struct_data.len()].copy_from_slice(&struct_data);

    // initialize mint indices
    for i in 0..initialization_params.items_available {
        let mint_index = (i as u32).to_le_bytes();
        let start = HIDDEN_SECTION_START + ((i as usize) * 4);
        let end = start + 4;
        account_data[start..end].copy_from_slice(&mint_index);
    }

    // approve collection delegate authority
    let approve_collection_authority_ix = approve_collection_authority(
        ctx.accounts.token_metadata_program.key(),
        ctx.accounts.collection_authority_record.key(),
        ctx.accounts.nano_machine_pda_authority.key(),
        ctx.accounts.authority.key(),
        ctx.accounts.authority.key(),
        ctx.accounts.collection_metadata.key(),
        ctx.accounts.collection_mint.key(),
    );
    invoke(
        &approve_collection_authority_ix,
        vec![
            ctx.accounts.collection_authority_record.to_account_info(),
            ctx.accounts.nano_machine_pda_authority.to_account_info(),
            ctx.accounts.authority.to_account_info(),
            ctx.accounts.collection_metadata.to_account_info(),
            ctx.accounts.collection_mint.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ]
        .as_slice(),
    )?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct InitializationParams {
    /// Number of assets available
    pub items_available: u64,
    /// Symbol for the asset
    pub symbol: String,
    /// Secondary sales royalty basis points (0-10000)
    pub seller_fee_basis_points: u16,
    /// List of creators
    pub creators: Vec<Creator>,
    /// base name for each NFT
    pub base_name: String,
    /// nft assets base uri
    pub base_uri: String,
    /// background image for the collection mint page
    pub background_image_uri: String,
    pub price: u64,
    pub go_live_date: Option<i64>,
}

#[derive(Accounts)]
#[instruction(initialization_params: InitializationParams)]
pub struct Initialize<'info> {
    /// CHECK: account constraints checked in account trait
    #[account(
        zero,
        rent_exempt = skip,
        constraint = nano_machine.to_account_info().owner == program_id
            && nano_machine.to_account_info().data_len() >= get_space_for_nano_machine(*&initialization_params.items_available)
    )]
    pub nano_machine: UncheckedAccount<'info>,

    pub authority: Signer<'info>,

    pub collection_mint: Box<Account<'info, Mint>>,

    #[account(
        constraint = collection_metadata.collection_details.is_some() == true // check for sized collection
    )]
    pub collection_metadata: Box<Account<'info, TokenMetadata>>,

    pub collection_master_edition: Box<Account<'info, MasterEdition>>,

    /// CHECK: account checked in seeds constraint and in CPI
    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key.as_ref(),
            collection_mint.key().as_ref(),
            b"collection_authority",
            nano_machine_pda_authority.key.as_ref()
        ],
        seeds::program = mpl_token_metadata::id(),
        bump,
        constraint = collection_authority_record.data_is_empty() == true
    )]
    pub collection_authority_record: UncheckedAccount<'info>,

    /// CHECK: This is just used as a signing PDA.
    #[account(
        seeds = [AUTHORITY_SEED, nano_machine.key().as_ref()],
        bump
    )]
    pub nano_machine_pda_authority: UncheckedAccount<'info>,

    #[account(
        seeds = [merkle_tree.key().as_ref()],
        seeds::program = mpl_bubblegum::id(),
        bump,
        constraint = tree_authority.tree_creator == authority.key()
            && tree_authority.tree_delegate == nano_machine_pda_authority.key()
    )]
    pub tree_authority: Account<'info, TreeConfig>,

    /// CHECK: unsafe
    #[account(
        constraint =
            merkle_tree.to_account_info().owner.as_ref() == spl_account_compression::id().key().as_ref()
    )]
    pub merkle_tree: UncheckedAccount<'info>,

    pub payment_mint: Option<Account<'info, Mint>>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: account constraint checked in account trait
    #[account(address = sysvar::instructions::id())]
    pub sysvar_instructions: UncheckedAccount<'info>,
    /// CHECK: account constraint checked in account trait
    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program: Program<'info, MplTokenMetadata>,
}

pub fn get_space_for_nano_machine(items_available: u64) -> usize {
    HIDDEN_SECTION_START + ((items_available as usize) * 4) + 4
    // mint indices + u32 to support swapping from last index to first index
}
