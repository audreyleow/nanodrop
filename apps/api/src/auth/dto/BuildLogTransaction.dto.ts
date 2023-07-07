import { IsBase58 } from "class-validator";

export class BuildLogTransactionDto {
  @IsBase58()
  readonly account: string;
}
