use std::str::FromStr;

use anchor_lang::{prelude::*, solana_program::sysvar, system_program};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Token, TokenAccount},
};
use arrayref::array_ref;
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
    constants::{AUTHORITY_SEED, HIDDEN_SECTION_START, NATIVE_MINT},
    errors::NanoError,
    state::NanoMachine,
    utils::{get_metadata_uri, NULL_STRING},
};

pub fn mint_v1(ctx: Context<Mint>) -> Result<()> {
    // checks
    let nano_machine = &mut ctx.accounts.nano_machine;
    if nano_machine.items_redeemed >= nano_machine.items_available {
        return err!(NanoError::NanoMachineEmpty);
    }

    let clock = Clock::get()?;
    match nano_machine.go_live_date {
        Some(go_live_date) => {
            if clock.unix_timestamp < go_live_date {
                return err!(NanoError::NanoMachineNotLive);
            }
        }
        None => (),
    }

    // transfer mint price
    if nano_machine.price > 0 {
        if nano_machine.payment_mint.key() != Pubkey::from_str(NATIVE_MINT).unwrap() {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    token::Transfer {
                        from: ctx
                            .accounts
                            .nft_minter_ata
                            .as_ref()
                            .unwrap()
                            .to_account_info(),
                        to: ctx
                            .accounts
                            .nano_machine_authority_ata
                            .as_ref()
                            .unwrap()
                            .to_account_info(),
                        authority: ctx.accounts.nft_minter.to_account_info(),
                    },
                ),
                nano_machine.price,
            )?;
        } else {
            system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    system_program::Transfer {
                        from: ctx.accounts.nft_minter.to_account_info(),
                        to: ctx.accounts.nano_machine_authority.to_account_info(),
                    },
                ),
                nano_machine.price,
            )?;
        }
    }

    // select random index
    let recent_slothashes = &ctx.accounts.recent_slothashes;
    let data = recent_slothashes.data.borrow();
    let most_recent = array_ref![data, 12, 8];
    // seed for the random number is a combination of the slot_hash - timestamp
    let seed = u64::from_le_bytes(*most_recent).saturating_sub(clock.unix_timestamp as u64);
    let hidden_item_index = seed
        .checked_rem(nano_machine.items_available - nano_machine.items_redeemed)
        .unwrap();
    let data_index = HIDDEN_SECTION_START + ((hidden_item_index as usize) * 4);
    // get mint index
    let account_info = nano_machine.to_account_info();
    let mut account_data = account_info.data.borrow_mut();
    let mint_index = u32::from_le_bytes(*array_ref![account_data, data_index, 4]);
    // replace the item at the mint index with the last value
    let items_left = nano_machine.items_available - nano_machine.items_redeemed;
    let last_index = HIDDEN_SECTION_START + 4 + ((items_left - 1) * 4) as usize;
    let last_value = u32::from_le_bytes(*array_ref![account_data, last_index, 4]);
    account_data[data_index..data_index + 4].copy_from_slice(&u32::to_le_bytes(last_value));
    nano_machine.items_redeemed = nano_machine.items_redeemed.checked_add(1).unwrap();

    // mint nft
    let mut creators: Vec<mpl_bubblegum::state::metaplex_adapter::Creator> =
        vec![mpl_bubblegum::state::metaplex_adapter::Creator {
            address: ctx.accounts.nano_machine_pda_authority.key(),
            verified: true,
            share: 0,
        }];

    for creator in &nano_machine.creators {
        creators.push(mpl_bubblegum::state::metaplex_adapter::Creator {
            address: creator.address,
            verified: false,
            share: creator.percentage_share,
        });
    }

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
            name: format!(
                "{}{}",
                nano_machine
                    .base_name
                    .trim_matches(NULL_STRING.chars().next().unwrap()),
                (mint_index + 1).to_string()
            ),
            symbol: nano_machine.symbol.to_string(),
            uri: get_metadata_uri(&nano_machine.base_uri, mint_index),
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
        address = nano_machine.authority.key()
    )]
    pub nano_machine_authority: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = nft_minter,
        token::mint = payment_mint,
        token::authority = nano_machine_authority,
    )]
    pub nano_machine_authority_ata: Option<Box<Account<'info, TokenAccount>>>,

    #[account(address = nano_machine.payment_mint)]
    pub payment_mint: Option<Box<Account<'info, anchor_spl::token::Mint>>>,

    #[account(
        mut,
        seeds = [merkle_tree.key().as_ref()],
        seeds::program = mpl_bubblegum::id(),
        bump,
        constraint = tree_authority.tree_creator == nano_machine.authority.key()
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
        token::mint = payment_mint,
        token::authority = nft_minter,
    )]
    pub nft_minter_ata: Option<Box<Account<'info, TokenAccount>>>,

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
    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, MplTokenMetadata>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub clock: Sysvar<'info, Clock>,
    /// CHECK: account constraints checked in account trait
    #[account(address = sysvar::slot_hashes::id())]
    pub recent_slothashes: UncheckedAccount<'info>,
}
