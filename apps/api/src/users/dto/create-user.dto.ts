import { IsBase58 } from "class-validator";

export class CreateUserDto {
  @IsBase58()
  readonly publicKey: string;
}
