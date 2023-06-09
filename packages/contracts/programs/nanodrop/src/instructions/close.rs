use anchor_lang::prelude::*;

use crate::state::NanoMachine;

pub fn close_v1(_ctx: Context<Close>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(
        mut,
        constraint = nano_machine.creator.key() == creator.key(),
        close = creator
    )]
    pub nano_machine: Account<'info, NanoMachine>,

    #[account(mut)]
    pub creator: Signer<'info>,
}
