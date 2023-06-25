import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { NanoMachinesService } from "./nano-machines.service";
import { CreateNanoMachineDto } from "./dto/create-nano-machine.dto";
import { ValidateUserDto } from "src/auth/dto/validate-user.dto";
import { WalletSignatureAuthGuard } from "src/auth/auth.guard";

@Controller("nano-machines")
export class NanoMachinesController {
  constructor(private readonly nanoMachinesService: NanoMachinesService) {}

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

  @Post("mint")
  @HttpCode(200)
  buildMintTransaction() {
    return this.nanoMachinesService.buildMintTransaction();
  }

  @Post("secret/:nanoMachineId")
  @UseGuards(WalletSignatureAuthGuard)
  findJwtSecret(
    @Body() validateUserDto: ValidateUserDto,
    @Param("nanoMachineId") nanoMachineId: string
  ) {
    return this.nanoMachinesService.findJwtSecret(
      validateUserDto.publicKey,
      nanoMachineId
    );
  }
}
