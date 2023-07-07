import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthRequest, AuthRequestSchema } from "./schemas/auth-request.schema";
import { SolanaService } from "src/solana/solana.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthRequest.name, schema: AuthRequestSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, SolanaService],
  exports: [AuthService],
})
export class AuthModule {}
