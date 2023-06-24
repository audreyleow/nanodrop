use anchor_lang::{prelude::*, Discriminator};
use anchor_spl::token::Mint;
use mpl_bubblegum::state::metaplex_anchor::{MasterEdition, MplTokenMetadata, TokenMetadata};
use mpl_token_metadata::{state::{MAX_SYMBOL_LENGTH, CollectionAuthorityRecord}};

use crate::{
    constants::{AUTHORITY_SEED, CONFIG_SEED},
    state::{AccountVersion, Config, NanoMachine, Phase},
    utils::{get_space_for_nano_machine, pad_string_or_throw}, errors::NanoError,
};

pub fn initialize_v1(
    ctx: Context<Initialize>,
    initialization_params: InitializationParams,
) -> Result<()> {
    // check collection authority record
    let data = ctx.accounts.collection_authority_record.try_borrow_data()?;
    let record = CollectionAuthorityRecord::from_bytes(&data)?;
    if record.update_authority.unwrap() != ctx.accounts.creator.key() {
        return err!(NanoError::InvalidCollectionUpdateAuthority);
    }

    // initialize the nano_machine account
    let nano_machine_account = &mut ctx.accounts.nano_machine;

    let mut new_nano_machine = NanoMachine {
        version: AccountVersion::V1,
        creator: ctx.accounts.creator.key(),
        symbol: pad_string_or_throw(initialization_params.symbol, MAX_SYMBOL_LENGTH)?,
        collection_mint: ctx.accounts.collection_mint.key(),
        items_redeemed: 0,
        seller_fee_basis_points: initialization_params.seller_fee_basis_points,
        is_private: initialization_params.is_private,
        phases: initialization_params.phases,
    };
    new_nano_machine.validate()?;

    // initialize the nano_machine account
    let mut struct_data = NanoMachine::discriminator().try_to_vec().unwrap();
    struct_data.append(&mut new_nano_machine.try_to_vec().unwrap());
    let mut account_data = nano_machine_account.data.borrow_mut();
    account_data[..struct_data.len()].copy_from_slice(&struct_data);

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct InitializationParams {
    /// Symbol for all the NFTs minted
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

    /// CHECK: account not read from or written to
    pub creator: UncheckedAccount<'info>,

    #[account(
		seeds = [CONFIG_SEED],
        bump,
	)]
    pub config: Account<'info, Config>,

    #[account(
        address = config.co_signer,
    )]
    pub co_signer: Signer<'info>,

    pub collection_mint: Box<Account<'info, Mint>>,

    #[account(
        constraint = collection_metadata.collection_details.is_some() == true // check for sized collection
    )]
    pub collection_metadata: Box<Account<'info, TokenMetadata>>,

    pub collection_master_edition: Box<Account<'info, MasterEdition>>,

    /// CHECK: account checked in seeds constraint and in instruction
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
        seeds = [AUTHORITY_SEED, nano_machine.key().as_ref()],
        bump
    )]
    pub nano_machine_pda_authority: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,

    /// CHECK: account constraint checked in account trait
    pub token_metadata_program: Program<'info, MplTokenMetadata>,
}
