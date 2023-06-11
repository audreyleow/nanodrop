use anchor_lang::prelude::*;

pub const CONFIG_SEED: &[u8; 6] = b"config";
pub const AUTHORITY_SEED: &[u8; 12] = b"nano_machine";
pub const TREE_DELEGATE_SEED: &[u8; 13] = b"tree_delegate";

/// Shared tree used for mints of expected supply < 100
pub use shared_tree::ID as SHARED_TREE;
mod shared_tree {
    use super::*;
    declare_id!("CeQFpf5USvUFkfLjvSwr5RjFA3CqCjYjGJMuQaG2bYBR");
}
