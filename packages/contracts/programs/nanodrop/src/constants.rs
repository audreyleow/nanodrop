pub use mpl_token_metadata::state::{
    MAX_CREATOR_LEN, MAX_CREATOR_LIMIT, MAX_NAME_LENGTH, MAX_SYMBOL_LENGTH, MAX_URI_LENGTH,
};

pub const MAX_BASE_URI_LENGTH: usize = MAX_URI_LENGTH - (7 + 5); // give allowance for up to 7 digits for number and 4 characters for extension (dot is 1 character)
pub const MAX_BASE_NAME_LENGTH: usize = MAX_NAME_LENGTH - 7; // give allowance for up to 7 digits for number

pub const HIDDEN_SECTION_START: usize = 8   //discriminator
  + 1                                       // version
  + 32                                      // authority
  + 32                                      // collection_mint
  + 4 + MAX_BASE_NAME_LENGTH                // u32 + max base_name length
  + 4 + MAX_BASE_URI_LENGTH                 // u32 + base uri length
  + 4 + MAX_URI_LENGTH                      // u32 + background uri length
  + 4                                       // items_redeemed
  + 4                                       // items_available
  + 8                                       // price
  + 4 + MAX_SYMBOL_LENGTH                   // u32 + symbol length
  + 2                                       // seller_fee_basis_points
  + 4 + MAX_CREATOR_LIMIT * MAX_CREATOR_LEN // u32 + creators vec
  + 8                                       // go_live_date
  + 32                                      // payment_mint
  + 32; // merkle_tree

pub const AUTHORITY_SEED: &[u8; 12] = b"nano_machine";

pub const NATIVE_MINT: &str = "So11111111111111111111111111111111111111112";
