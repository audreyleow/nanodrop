import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { NanoMachinesModule } from "./nano-machines/nano-machines.module";
import { SolanaService } from "./solana/solana.service";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      autoIndex: true,
      autoCreate: true,
    }),
    UsersModule,
    NanoMachinesModule,
    AuthModule,
  ],
  providers: [SolanaService],
})
export class AppModule {}
