import { IsString } from "class-validator";

export class VerifyAuthRequestDto {
  @IsString()
  readonly nanoMachineId: string;

  @IsString()
  readonly message: string;

  @IsString()
  readonly txId: string;
}
