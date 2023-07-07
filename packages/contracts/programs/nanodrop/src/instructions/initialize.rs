use anchor_lang::{prelude::*, Discriminator};
use mpl_bubblegum::state::metaplex_anchor::MplTokenMetadata;

use crate::{
    constants::CONFIG_SEED,
    state::{AccountVersion, Config, NanoMachine, Phase},
    utils::get_space_for_nano_machine,
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

    pub system_program: Program<'info, System>,

    /// CHECK: account constraint checked in account trait
    pub token_metadata_program: Program<'info, MplTokenMetadata>,
}
