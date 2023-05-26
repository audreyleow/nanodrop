use anchor_lang::prelude::*;

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

pub fn get_metadata_uri(base_uri: &String, mint_index: u32) -> String {
    format!(
        "{}{}.json",
        base_uri.trim_matches(NULL_STRING.chars().next().unwrap()),
        mint_index.to_string()
    )
    .trim()
    .to_string()
}
