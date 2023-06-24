import { Type } from "class-transformer";
import {
  IsArray,
  IsBase58,
  IsOptional,
  IsUrl,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";

export class CreateNanoMachineDto {
  @IsBase58()
  readonly nanoMachineId: string;

  @IsBase58()
  readonly collectionMint: string;

  @IsBase58()
  readonly user: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @Type(() => Phase)
  readonly phases: Phase[];

  @IsUrl()
  @IsOptional()
  readonly backgroundImageUrl?: string;
}

class Phase {
  @IsDateString()
  startDate: string;

  @IsNumber()
  index: number;

  @IsString()
  nftName: string;
}
