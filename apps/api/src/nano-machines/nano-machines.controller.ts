import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { NanoMachinesService } from "./nano-machines.service";
import { CreateNanoMachineDto } from "./dto/create-nano-machine.dto";

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
}
