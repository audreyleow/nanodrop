import { IsBase58 } from "class-validator";

export class BuildMintTransactionDto {
  @IsBase58()
  readonly account: string;
}
