use anchor_lang::prelude::*;

#[account]
pub struct Config {
    pub version: ConfigVersion,
    pub co_signer: Pubkey,
}

impl Config {
    pub const LEN: usize = 8 // discriminator
    + 1                      // version
    + 32; // co_signer
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub enum ConfigVersion {
    #[default]
    V1,
}
