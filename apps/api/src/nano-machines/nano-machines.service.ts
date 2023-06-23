import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNanoMachineDto } from "./dto/create-nano-machine.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/schemas/user.schema";

@Injectable()
export class NanoMachinesService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  create(createNanoMachineDto: CreateNanoMachineDto) {
    return "This action adds a new nanoMachine";
  }

  async findAll(userPublicKey: string) {
    const nanoMachines = (
      await this.userModel.findOne({ publicKey: userPublicKey }).exec()
    ).nanoMachines;

    return nanoMachines.map((nanoMachine) => ({
      nanoMachineId: nanoMachine.nanoMachineId,
      backgroundImageUrl: nanoMachine.backgroundImageUrl,
    }));
  }

  async findOne(userPublicKey: string, nanoMachineId: string) {
    const nanoMachines = (
      await this.userModel.findOne({ publicKey: userPublicKey }).exec()
    ).nanoMachines;

    const nanoMachine = nanoMachines.find(
      (nanoMachine) => nanoMachine.nanoMachineId === nanoMachineId
    );

    if (!nanoMachine) {
      throw new NotFoundException("Nano machine not found");
    }

    return {
      nanoMachineId: nanoMachine.nanoMachineId,
      backgroundImageUrl: nanoMachine.backgroundImageUrl,
    };
  }
}
