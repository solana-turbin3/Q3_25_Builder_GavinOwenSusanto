#![allow(unexpected_cfgs)]
#![allow(deprecated)]
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("vnR66zKJw64eKM5QHjJuAtGPUCSxBq5bVCdRzPwa4dQ");

#[program]
pub mod anchor_escrow {
    use super::*;

}
