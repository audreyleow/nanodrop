import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { NanoMachinesModule } from "./nano-machines/nano-machines.module";
import { SolanaService } from "./solana/solana.service";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/nanodrop", {
      autoIndex: true,
      autoCreate: true,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    NanoMachinesModule,
    AuthModule,
  ],
  providers: [SolanaService],
})
export class AppModule {}
