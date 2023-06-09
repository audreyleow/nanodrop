use anchor_lang::prelude::*;
use mpl_token_metadata::state::MAX_URI_LENGTH;

use crate::{errors::NanoError, utils::pad_string_or_throw};

#[account]
#[derive(Default, Debug)]
pub struct NanoMachine {
    pub version: AccountVersion,
    pub creator: Pubkey,
    pub collection_mint: Pubkey,
    /// nft name
    pub name: String,
    /// background image for the collection mint page
    pub background_image_uri: String,
    pub items_redeemed: u64,
    pub symbol: String,
    pub merkle_tree: Pubkey,
    pub phases: Vec<Phase>,
}

impl NanoMachine {
    pub fn validate(&self) -> Result<()> {
        if self.phases.len() < 1 {
            return err!(NanoError::NoMintPhaseFound);
        }

        let mut updated_mint_phases: Vec<Phase> = vec![];
        for phase in self.phases {
            if phase.start_date < 0 || phase.end_date < 0 {
                return err!(NanoError::InvalidPhaseDates);
            }

            if phase.start_date > phase.end_date {
                return err!(NanoError::InvalidPhaseDates);
            }

            updated_mint_phases.push(Phase {
                start_date: phase.start_date,
                end_date: phase.end_date,
                metadata_uri: pad_string_or_throw(phase.metadata_uri, MAX_URI_LENGTH).unwrap(),
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
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub enum AccountVersion {
    #[default]
    V1,
}
