use anchor_lang::prelude::*;

pub const CONFIG_SEED: &[u8; 6] = b"config";
pub const AUTHORITY_SEED: &[u8; 12] = b"nano_machine";

/// Shared tree used for all mints (for now, each collection should have its own tree in the future)
pub use shared_tree::ID as SHARED_TREE;
mod shared_tree {
    use super::*;
    declare_id!("CeQFpf5USvUFkfLjvSwr5RjFA3CqCjYjGJMuQaG2bYBR");
}
