use anchor_lang::prelude::*;
use mpl_token_metadata::state::{MAX_NAME_LENGTH, MAX_URI_LENGTH};

use crate::{errors::NanoError, utils::pad_string_or_throw};

#[account]
#[derive(Default, Debug)]
pub struct NanoMachine {
    pub version: AccountVersion,
    pub creator: Pubkey,
    pub collection_mint: Pubkey,
    /// background image for the collection mint page
    pub background_image_uri: String,
    pub items_redeemed: u64,
    pub symbol: String,
    /// Secondary sales royalty basis points (0-10000)
    pub seller_fee_basis_points: u16,
    pub merkle_tree: Pubkey,
    pub phases: Vec<Phase>,
}

impl NanoMachine {
    pub fn validate(&mut self) -> Result<()> {
        if self.seller_fee_basis_points > 10000 {
            return err!(NanoError::FeeBasisPointTooHigh);
        }

        if self.phases.len() < 1 {
            return err!(NanoError::NoMintPhaseFound);
        }

        let mut updated_mint_phases: Vec<Phase> = vec![];
        for i in 0..self.phases.len() {
            let phase = &self.phases[i];

            if i > 0 {
                let previous_phase = &self.phases[i - 1];
                if phase.start_date <= previous_phase.end_date {
                    return err!(NanoError::InvalidPhaseDates);
                }
            }

            if phase.start_date < 0 || phase.end_date < 0 {
                return err!(NanoError::InvalidPhaseDates);
            }

            if phase.start_date > phase.end_date {
                return err!(NanoError::InvalidPhaseDates);
            }

            updated_mint_phases.push(Phase {
                start_date: phase.start_date,
                end_date: phase.end_date,
                nft_name: pad_string_or_throw(phase.nft_name.clone(), MAX_NAME_LENGTH).unwrap(),
                metadata_uri: pad_string_or_throw(phase.metadata_uri.clone(), MAX_URI_LENGTH)
                    .unwrap(),
            });
        }

        self.phases = updated_mint_phases;

        Ok(())
    }
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Phase {
    pub start_date: i64,
    pub end_date: i64,
    pub metadata_uri: String,
    pub nft_name: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub enum AccountVersion {
    #[default]
    V1,
}
