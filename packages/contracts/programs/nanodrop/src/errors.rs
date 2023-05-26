use anchor_lang::prelude::*;

#[error_code]
pub enum NanoError {
    #[msg("Value longer than expected maximum value")]
    ExceededLengthError,

    #[msg("Can only provide up to 4 creators")]
    TooManyCreators,

    #[msg("Fee basis point cannot exceed 10000")]
    FeeBasisPointTooHigh,

    #[msg("Instruction could not be created")]
    InstructionBuilderFailed,

    #[msg("Nano machine is empty!")]
    NanoMachineEmpty,

    #[msg("Nano machine is not live!")]
    NanoMachineNotLive,

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
