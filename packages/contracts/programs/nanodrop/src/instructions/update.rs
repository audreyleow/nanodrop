use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::{errors::NanoError, state::NanoMachine};

pub fn update_v1(ctx: Context<Update>, update_params: UpdateParams) -> Result<()> {
    let nano_machine = &mut ctx.accounts.nano_machine;
    nano_machine.go_live_date = update_params.go_live_date;

    let clock = Clock::get()?;
    let should_allow_price_update = nano_machine.items_redeemed == 0
        && nano_machine.go_live_date.is_some()
        && clock.unix_timestamp < nano_machine.go_live_date.unwrap();

    match update_params.price {
        Some(price) => {
            if !should_allow_price_update {
                return err!(NanoError::NoPriceUpdatesAfterMintOrGoLiveDate);
            }
            nano_machine.price = price;
        }
        None => (),
    }

    match &ctx.accounts.payment_mint {
        Some(payment_mint) => {
            if !should_allow_price_update {
                return err!(NanoError::NoPriceUpdatesAfterMintOrGoLiveDate);
            }
            nano_machine.payment_mint = payment_mint.key();
        }
        None => (),
    }

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct UpdateParams {
    pub go_live_date: Option<i64>,
    pub price: Option<u64>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(
        mut,
        constraint = nano_machine.authority.key() == authority.key(),
    )]
    pub nano_machine: Box<Account<'info, NanoMachine>>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub payment_mint: Option<Account<'info, Mint>>,
    pub clock: Sysvar<'info, Clock>,
}
