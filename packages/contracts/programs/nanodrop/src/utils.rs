use anchor_lang::prelude::*;
pub use mpl_token_metadata::state::{
    MAX_CREATOR_LEN, MAX_CREATOR_LIMIT, MAX_NAME_LENGTH, MAX_SYMBOL_LENGTH, MAX_URI_LENGTH,
};

use crate::errors::NanoError;

pub const NULL_STRING: &str = "\0";

/// Return a padded string up to the specified length. If the specified
/// string `value` is longer than the allowed `length`, return an error.
pub fn pad_string_or_throw(value: String, length: usize) -> Result<String> {
    if length < value.len() {
        // the value is larger than the allowed length
        return err!(NanoError::ExceededLengthError);
    }

    let padding = NULL_STRING.repeat(length - value.len());
    Ok(value + &padding)
}

pub fn get_metadata_uri(phase_index: u32, nano_machine_id: Pubkey) -> String {
    format!("https://files.nanodrop.it/{}/{}.json", nano_machine_id, phase_index)
} 

pub fn get_space_for_nano_machine(phases: usize) -> usize {
    8                                                          //discriminator
    + 1                                                        // version
    + 32                                                       // creator
    + 4 + MAX_SYMBOL_LENGTH                                    // u32 + symbol
    + 32                                                       // collection_mint
    + 8                                                        // items_redeemed
    + 2                                                        // seller_fee_basis_points
    + 1                                                        // is_private
    + 4 + (phases * (8 + 4 + (4 + MAX_NAME_LENGTH)))           // u32 + phases * (start_date + index + (u32 + nft_name))
}
