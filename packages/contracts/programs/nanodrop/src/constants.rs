use anchor_lang::prelude::*;

pub const CONFIG_SEED: &[u8; 6] = b"config";
pub const AUTHORITY_SEED: &[u8; 12] = b"nano_machine";

/// Shared tree used for all mints
pub use shared_tree::ID as SHARED_TREE;
mod shared_tree {
    use super::*;
    declare_id!("CeQFpf5USvUFkfLjvSwr5RjFA3CqCjYjGJMuQaG2bYBR");
}

pub use nanodrop_collection::ID as NANODROP_COLLECTION;
mod nanodrop_collection {
    use super::*;
    declare_id!("nano1S2JBDfXw1faH5kGEgyX8nJXQ1LiGR2LudqeFXD");
}
