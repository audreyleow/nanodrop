import { Module } from "@nestjs/common";
import { NanoMachinesService } from "./nano-machines.service";
import { NanoMachinesController } from "./nano-machines.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { SolanaService } from "src/solana/solana.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [NanoMachinesController],
  providers: [NanoMachinesService, SolanaService],
})
export class NanoMachinesModule {}
