use anchor_lang::prelude::*;

use crate::{
    constants::CONFIG_SEED,
    program::Nanodrop,
    state::{Config, ConfigVersion},
};

pub fn setup_v1(ctx: Context<Setup>) -> Result<()> {
    let config = &mut ctx.accounts.config;
    config.version = ConfigVersion::V1;
    config.co_signer = ctx.accounts.co_signer.key();

    Ok(())
}

#[derive(Accounts)]
pub struct Setup<'info> {
    #[account(mut)]
    pub program_authority: Signer<'info>,

    #[account(constraint = program.programdata_address()? == Some(program_data.key()))]
    pub program: Program<'info, Nanodrop>,

    #[account(constraint = program_data.upgrade_authority_address == Some(program_authority.key()))]
    pub program_data: Account<'info, ProgramData>,

    pub co_signer: Signer<'info>,

    #[account(
        init,
		seeds = [CONFIG_SEED],
        bump,
		payer = program_authority,
		space = Config::LEN
	)]
    pub config: Account<'info, Config>,

    pub system_program: Program<'info, System>,
}
