import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { BuildLogTransactionDto } from "./dto/BuildLogTransaction.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getSolanaPayMetadata() {
    return {
      label: "NanoDrop",
      icon: "https://nanodrop.it/android-chrome-512x512.png",
    };
  }

  @Post()
  @HttpCode(200)
  async buildLogTransaction(
    @Query("messageHash") messageHash: string,
    @Body() buildLogTransactionDto: BuildLogTransactionDto
  ) {
    return this.authService.buildLogTransaction(
      messageHash,
      buildLogTransactionDto.account
    );
  }

  @Get(":publicKey")
  async getAuthMessage(@Param("publicKey") publicKey: string) {
    return this.authService.getAuthMessage(publicKey);
  }
}
