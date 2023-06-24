import { IsBase58, IsString } from "class-validator";

export class ValidateUserDto {
  @IsBase58()
  readonly publicKey: string;

  @IsString()
  readonly signedMessage: string;

  @IsString()
  readonly issuedAt: string;
}
