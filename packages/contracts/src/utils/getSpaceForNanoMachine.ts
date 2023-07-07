import { MAX_NAME_LENGTH, MAX_SYMBOL_LENGTH } from "../constants";

export const getSpaceForNanoMachine = (phasesCount: number) =>
  8 + //discriminator
  1 + // version
  32 + // creator
  8 + // items_redeemed
  2 + // seller_fee_basis_points
  1 + // is_private
  4 +
  phasesCount * (8 + 4 + (4 + MAX_NAME_LENGTH)); // u32 + phases * (start_date + index + (u32 + nft_name))
