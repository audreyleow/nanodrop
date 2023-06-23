use anchor_lang::prelude::*;
use mpl_bubblegum::{
    program::Bubblegum,
    state::{
        metaplex_adapter::{MetadataArgs, TokenProgramVersion, TokenStandard},
        metaplex_anchor::{MasterEdition, MplTokenMetadata, TokenMetadata},
        TreeConfig,
    },
};
use spl_account_compression::{program::SplAccountCompression, Noop};

use crate::{
    constants::{AUTHORITY_SEED, CONFIG_SEED},
    errors::NanoError,
    state::{Config, NanoMachine},
    utils::NULL_STRING,
};

pub fn mint_v1(ctx: Context<Mint>) -> Result<()> {
    // checks
    let nano_machine = &mut ctx.accounts.nano_machine;

    if nano_machine.is_private && !ctx.accounts.co_signer.is_signer {
        return err!(NanoError::Unauthorized);
    }

    let clock = Clock::get()?;
    let current_phase = nano_machine
        .phases
        .iter()
        .find(|phase| clock.unix_timestamp >= phase.start_date);

    if current_phase.is_none() {
        return err!(NanoError::MintHasNotStarted);
    }

    // mint nft
    let creators: Vec<mpl_bubblegum::state::metaplex_adapter::Creator> = vec![
        mpl_bubblegum::state::metaplex_adapter::Creator {
            address: ctx.accounts.nano_machine_pda_authority.key(),
            verified: true,
            share: 0,
        },
        mpl_bubblegum::state::metaplex_adapter::Creator {
            address: nano_machine.creator,
            verified: false,
            share: 100,
        },
    ];

    let nano_machine_pda_authority = &mut ctx.accounts.nano_machine_pda_authority.to_account_info();
    nano_machine_pda_authority.is_signer = true;
    mpl_bubblegum::cpi::mint_to_collection_v1(
        CpiContext::new_with_signer(
            ctx.accounts.bubblegum_program.to_account_info(),
            mpl_bubblegum::cpi::accounts::MintToCollectionV1 {
                bubblegum_signer: ctx.accounts.bubblegum_signer.to_account_info(),
                collection_mint: ctx.accounts.collection_mint.to_account_info(),
                collection_metadata: ctx.accounts.collection_metadata.to_account_info(),
                collection_authority: ctx.accounts.nano_machine_pda_authority.to_account_info(),
                collection_authority_record_pda: ctx
                    .accounts
                    .collection_authority_record
                    .to_account_info(),
                compression_program: ctx.accounts.compression_program.to_account_info(),
                edition_account: ctx.accounts.collection_master_edition.to_account_info(),
                leaf_delegate: ctx.accounts.nft_minter.to_account_info(),
                leaf_owner: ctx.accounts.nft_minter.to_account_info(),
                log_wrapper: ctx.accounts.log_wrapper.to_account_info(),
                merkle_tree: ctx.accounts.merkle_tree.to_account_info(),
                payer: ctx.accounts.nft_minter.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_metadata_program: ctx.accounts.token_metadata_program.to_account_info(),
                tree_authority: ctx.accounts.tree_authority.to_account_info(),
                tree_delegate: ctx.accounts.nano_machine_pda_authority.to_account_info(),
            },
            &[&[
                AUTHORITY_SEED,
                nano_machine.key().as_ref(),
                &[*ctx.bumps.get("nano_machine_pda_authority").unwrap()],
            ]],
        )
        .with_remaining_accounts(vec![nano_machine_pda_authority.clone()]),
        MetadataArgs {
            name: current_phase
                .unwrap()
                .nft_name
                .trim_matches(NULL_STRING.chars().next().unwrap())
                .to_string(),
            symbol: "POAP".to_string(),
            uri: current_phase
                .unwrap()
                .metadata_uri
                .trim_matches(NULL_STRING.chars().next().unwrap())
                .to_string(),
            seller_fee_basis_points: nano_machine.seller_fee_basis_points,
            primary_sale_happened: false,
            is_mutable: true,
            edition_nonce: Some(0),
            token_standard: Some(TokenStandard::NonFungible),
            collection: Some(mpl_bubblegum::state::metaplex_adapter::Collection {
                key: ctx.accounts.collection_mint.key(),
                verified: false,
            }),
            uses: None,
            token_program_version: TokenProgramVersion::Original,
            creators,
        },
    )?;

    nano_machine.items_redeemed = nano_machine.items_redeemed.checked_add(1).unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(
        mut,
        constraint = nano_machine.to_account_info().owner == program_id
    )]
    pub nano_machine: Box<Account<'info, NanoMachine>>,

    /// CHECK: This is just used as a signing PDA.
    #[account(
        seeds = [AUTHORITY_SEED, nano_machine.key().as_ref()],
        bump
    )]
    pub nano_machine_pda_authority: UncheckedAccount<'info>,

    /// CHECK: account constraints checked in account trait
    #[account(
        mut,
        address = nano_machine.creator.key()
    )]
    pub nano_machine_authority: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [merkle_tree.key().as_ref()],
        seeds::program = mpl_bubblegum::id(),
        bump,
        constraint = tree_authority.tree_creator == nano_machine.creator.key()
            && tree_authority.tree_delegate == nano_machine_pda_authority.to_account_info().key()
    )]
    pub tree_authority: Box<Account<'info, TreeConfig>>,

    /// CHECK: unsafe
    #[account(
        mut,
        address = nano_machine.merkle_tree.key()
    )]
    pub merkle_tree: UncheckedAccount<'info>,

    #[account(mut)]
    pub nft_minter: Signer<'info>,

    #[account(
        constraint =
            collection_mint.key() == nano_machine.collection_mint.key()
    )]
    pub collection_mint: Box<Account<'info, anchor_spl::token::Mint>>,

    #[account(mut)]
    pub collection_metadata: Box<Account<'info, TokenMetadata>>,

    pub collection_master_edition: Box<Account<'info, MasterEdition>>,

    /// CHECK: account constraints checked in account trait
    #[account(
        seeds = [
            b"metadata",
            token_metadata_program.key.as_ref(),
            collection_mint.key().as_ref(),
            b"collection_authority",
            nano_machine_pda_authority.key.as_ref()
        ],
        seeds::program = mpl_token_metadata::id(),
        bump
    )]
    pub collection_authority_record: UncheckedAccount<'info>,

    #[account(
		seeds = [CONFIG_SEED],
        bump,
	)]
    pub config: Account<'info, Config>,

    /// CHECK: account constraints checked in account trait
    #[account(
        address = config.co_signer,
    )]
    pub co_signer: UncheckedAccount<'info>,

    /// CHECK: This is just used as a signing PDA.
    #[account(
        seeds = [mpl_bubblegum::state::COLLECTION_CPI_PREFIX.as_ref()],
        bump,
        seeds::program = mpl_bubblegum::id(),
    )]
    pub bubblegum_signer: UncheckedAccount<'info>,
    pub bubblegum_program: Program<'info, Bubblegum>,
    pub log_wrapper: Program<'info, Noop>,
    pub compression_program: Program<'info, SplAccountCompression>,
    pub token_metadata_program: Program<'info, MplTokenMetadata>,
    pub system_program: Program<'info, System>,
}
