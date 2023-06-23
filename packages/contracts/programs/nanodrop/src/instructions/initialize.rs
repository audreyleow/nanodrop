use anchor_lang::{prelude::*, solana_program::program::invoke, Discriminator};
use anchor_spl::token::Mint;
use mpl_bubblegum::state::{
    metaplex_anchor::{MasterEdition, MplTokenMetadata, TokenMetadata},
    TreeConfig,
};
use mpl_token_metadata::{instruction::approve_collection_authority, state::MAX_SYMBOL_LENGTH};

use crate::{
    constants::{AUTHORITY_SEED, SHARED_TREE, TREE_DELEGATE_SEED},
    state::{AccountVersion, NanoMachine, Phase},
    utils::{get_space_for_nano_machine, pad_string_or_throw},
};

pub fn initialize_v1(
    ctx: Context<Initialize>,
    initialization_params: InitializationParams,
) -> Result<()> {
    // initialize the nano_machine account
    let nano_machine_account = &mut ctx.accounts.nano_machine;

    let mut new_nano_machine = NanoMachine {
        version: AccountVersion::V1,
        creator: ctx.accounts.creator.key(),
        collection_mint: ctx.accounts.collection_mint.key(),
        items_redeemed: 0,
        symbol: pad_string_or_throw(initialization_params.symbol, MAX_SYMBOL_LENGTH)?,
        seller_fee_basis_points: initialization_params.seller_fee_basis_points,
        merkle_tree: ctx.accounts.merkle_tree.key(),
        is_private: initialization_params.is_private,
        phases: initialization_params.phases,
    };
    new_nano_machine.validate()?;

    // initialize the nano_machine account
    let mut struct_data = NanoMachine::discriminator().try_to_vec().unwrap();
    struct_data.append(&mut new_nano_machine.try_to_vec().unwrap());
    let mut account_data = nano_machine_account.data.borrow_mut();
    account_data[..struct_data.len()].copy_from_slice(&struct_data);

    // approve collection delegate authority
    let approve_collection_authority_ix = approve_collection_authority(
        ctx.accounts.token_metadata_program.key(),
        ctx.accounts.collection_authority_record.key(),
        ctx.accounts.nano_machine_pda_authority.key(),
        ctx.accounts.creator.key(),
        ctx.accounts.creator.key(),
        ctx.accounts.collection_metadata.key(),
        ctx.accounts.collection_mint.key(),
    );
    invoke(
        &approve_collection_authority_ix,
        vec![
            ctx.accounts.collection_authority_record.to_account_info(),
            ctx.accounts.nano_machine_pda_authority.to_account_info(),
            ctx.accounts.creator.to_account_info(),
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
    /// Symbol for the asset
    pub symbol: String,
    /// Secondary sales royalty basis points (0-10000)
    pub seller_fee_basis_points: u16,
    /// Is this a private drop
    pub is_private: bool,
    /// Minting phases
    pub phases: Vec<Phase>,
}

#[derive(Accounts)]
#[instruction(initialization_params: InitializationParams)]
pub struct Initialize<'info> {
    /// CHECK: account constraints checked in account trait
    #[account(
        zero,
        rent_exempt = skip,
        constraint = nano_machine.to_account_info().owner == program_id
            && nano_machine.to_account_info().data_len() >= get_space_for_nano_machine(*&initialization_params.phases.len())
    )]
    pub nano_machine: UncheckedAccount<'info>,

    pub creator: Signer<'info>,

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

    /// CHECK: This is just used as a signing PDA.
    #[account(
        seeds = [TREE_DELEGATE_SEED],
        bump
    )]
    pub tree_delegate: UncheckedAccount<'info>,

    #[account(
        seeds = [merkle_tree.key().as_ref()],
        seeds::program = mpl_bubblegum::id(),
        bump,
        constraint = (tree_authority.tree_creator == creator.key()
            && tree_authority.tree_delegate == tree_delegate.key())
            || (merkle_tree.key() == SHARED_TREE.key()
                && tree_authority.tree_delegate == tree_delegate.key())
    )]
    pub tree_authority: Account<'info, TreeConfig>,

    /// CHECK: unsafe
    #[account(
        constraint =
            merkle_tree.to_account_info().owner.as_ref() == spl_account_compression::id().key().as_ref()
    )]
    pub merkle_tree: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    /// CHECK: account constraint checked in account trait
    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program: Program<'info, MplTokenMetadata>,
}
