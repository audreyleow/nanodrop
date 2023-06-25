import { Module } from "@nestjs/common";
import { NanoMachinesService } from "./nano-machines.service";
import { NanoMachinesController } from "./nano-machines.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { SolanaService } from "src/solana/solana.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [NanoMachinesController],
  providers: [NanoMachinesService, SolanaService],
})
export class NanoMachinesModule {}
