use anchor_lang::prelude::*;
use mpl_token_metadata::state::MAX_NAME_LENGTH;

use crate::{errors::NanoError, utils::pad_string_or_throw};

#[account]
#[derive(Default, Debug)]
pub struct NanoMachine {
    pub version: AccountVersion,
    /// The creator of the nano machine
    pub creator: Pubkey,
    /// Number of NFTs minted
    pub items_redeemed: u64,
    /// Secondary sales royalty basis points (0-10000)
    pub seller_fee_basis_points: u16,
    /// Is this a private drop
    pub is_private: bool,
    /// Minting phases
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
        for phase in &self.phases {
            updated_mint_phases.push(Phase {
                start_date: phase.start_date,
                index: phase.index,
                nft_name: pad_string_or_throw(phase.nft_name.clone(), MAX_NAME_LENGTH).unwrap(),
            });
        }

        self.phases = updated_mint_phases;

        Ok(())
    }
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Phase {
    pub start_date: i64,
    pub index: u32,
    pub nft_name: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub enum AccountVersion {
    #[default]
    V1,
}
