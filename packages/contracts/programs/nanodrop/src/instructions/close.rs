use anchor_lang::prelude::*;

use crate::state::NanoMachine;

pub fn close_v1(_ctx: Context<Close>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(
        mut,
        constraint = nano_machine.authority.key() == authority.key(),
        close = authority
    )]
    pub nano_machine: Account<'info, NanoMachine>,

    #[account(mut)]
    pub authority: Signer<'info>,
}
