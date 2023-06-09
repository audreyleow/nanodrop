use anchor_lang::prelude::*;
use instructions::*;

mod constants;
mod errors;
mod instructions;
mod state;
mod utils;

#[cfg(feature = "test")]
declare_id!("testJc1yYCFZv4iFcSxdjcMcjFcAZNKE1eFoEu39f1T");

#[cfg(not(feature = "test"))]
declare_id!("nano4T4ujob2vtabhnoiSmHdq4gawScPTwwhF5HSwPJ");

#[program]
pub mod nanodrop {
    use super::*;

    pub fn setup(ctx: Context<Setup>) -> Result<()> {
        setup_v1(ctx)
    }

    pub fn initialize(
        ctx: Context<Initialize>,
        initialization_params: InitializationParams,
    ) -> Result<()> {
        initialize_v1(ctx, initialization_params)
    }

    pub fn mint(ctx: Context<Mint>) -> Result<()> {
        mint_v1(ctx)
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        close_v1(ctx)
    }
}
