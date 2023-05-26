use anchor_lang::prelude::*;
use mpl_token_metadata::state::MAX_CREATOR_LIMIT;

use crate::errors::NanoError;

#[account]
#[derive(Default, Debug)]
pub struct NanoMachine {
    pub version: AccountVersion,
    pub authority: Pubkey,
    pub collection_mint: Pubkey,
    /// base name for each NFT
    pub base_name: String,
    /// nft assets base uri
    pub base_uri: String,
    /// background image for the collection mint page
    pub background_image_uri: String,
    pub items_redeemed: u64,
    pub items_available: u64,
    pub price: u64,
    pub symbol: String,
    /// Secondary sales royalty basis points (0-10000)
    pub seller_fee_basis_points: u16,
    /// List of creators
    pub creators: Vec<Creator>,
    pub go_live_date: Option<i64>,
    pub payment_mint: Pubkey,
    pub merkle_tree: Pubkey,
    // hidden data section to avoid deserialization:
    // - (u32 * items_available) mint indices
}

impl NanoMachine {
    pub fn validate(&self) -> Result<()> {
        if self.seller_fee_basis_points > 10000 {
            return err!(NanoError::FeeBasisPointTooHigh);
        }

        // (MAX_CREATOR_LIMIT - 1) because the nano machine id is going to be a creator
        if self.creators.len() > MAX_CREATOR_LIMIT - 1 {
            return err!(NanoError::TooManyCreators);
        }

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Creator {
    pub address: Pubkey,
    pub verified: bool,
    // Share of secondary sales royalty
    pub percentage_share: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub enum AccountVersion {
    #[default]
    V1,
}
