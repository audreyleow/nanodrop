use anchor_lang::prelude::*;

#[error_code]
pub enum NanoError {
    #[msg("Value longer than expected maximum value")]
    ExceededLengthError,

    #[msg("At least one mint phase is required")]
    NoMintPhaseFound,

    #[msg("Invalid phase dates")]
    InvalidPhaseDates,

    #[msg("Fee basis point cannot exceed 10000")]
    FeeBasisPointTooHigh,

    #[msg("Instruction could not be created")]
    InstructionBuilderFailed,

    #[msg("Mint has not started or has already ended!")]
    MintHasNotStarted,

    #[msg("Collection public key mismatch")]
    CollectionKeyMismatch,

    #[msg("Cannot update price after mint has started or begun")]
    NoPriceUpdatesAfterMintOrGoLiveDate,

    #[msg("Invalid payer ATA")]
    InvalidPayerAta,

    #[msg("Invalid Nano Machine authority ATA")]
    InvalidAuthorityAta,

    #[msg("Invalid payment mint")]
    InvalidPaymentMint,

    #[msg("Unable to create Nano Machine authority ATA")]
    UnableToCreateAuthorityAta,
}
