import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  Query,
} from "@nestjs/common";
import { NanoMachinesService } from "./nano-machines.service";
import { CreateNanoMachineDto } from "./dto/create-nano-machine.dto";
import { BuildMintTransactionDto } from "./dto/build-mint-transaction.dto";

@Controller("nano-machines")
export class NanoMachinesController {
  constructor(private readonly nanoMachinesService: NanoMachinesService) {}

  @Get("mint")
  getSolanaPayMetadata() {
    return {
      label: "NanoDrop",
      icon: "https://nanodrop.it/android-chrome-512x512.png",
    };
  }

  @Post("mint")
  @HttpCode(200)
  buildMintTransaction(
    @Query("token") token: string,
    @Body() buildMintTransactionDto: BuildMintTransactionDto
  ) {
    return this.nanoMachinesService.buildMintTransaction(
      token,
      buildMintTransactionDto.account
    );
  }

  @Post()
  create(@Body() createNanoMachineDto: CreateNanoMachineDto) {
    return this.nanoMachinesService.create(createNanoMachineDto);
  }

  @Get(":userPublicKey")
  findAll(@Param("userPublicKey") userPublicKey: string) {
    return this.nanoMachinesService.findAll(userPublicKey);
  }

  @Get(":userPublicKey/:nanoMachineId")
  findOne(
    @Param("userPublicKey") userPublicKey: string,
    @Param("nanoMachineId") nanoMachineId: string
  ) {
    return this.nanoMachinesService.findOne(userPublicKey, nanoMachineId);
  }
}
