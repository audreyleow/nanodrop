import { IsBase58, IsOptional, IsUrl } from "class-validator";

export class CreateNanoMachineDto {
  @IsBase58()
  readonly nanoMachineId: string;

  @IsUrl()
  @IsOptional()
  readonly backgroundImageUrl?: string;
}
