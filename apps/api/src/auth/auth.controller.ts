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
import { BuildLogTransactionDto } from "./dto/build-log-transaction";
import { VerifyAuthRequestDto } from "./dto/verify-auth-request";

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

  @Post("verify")
  async verifyAuthRequest(@Body() verifyAuthRequestDto: VerifyAuthRequestDto) {
    return this.authService.verifyAuthRequest(verifyAuthRequestDto);
  }

  @Post()
  @HttpCode(200)
  async buildLogTransaction(
    @Query("messageHash") messageHash: string,
    @Query("solanaPayReference") solanaPayReference: string,
    @Body() buildLogTransactionDto: BuildLogTransactionDto
  ) {
    return this.authService.buildLogTransaction(
      messageHash,
      solanaPayReference,
      buildLogTransactionDto.account
    );
  }

  @Get(":publicKey")
  async getAuthMessage(@Param("publicKey") publicKey: string) {
    return this.authService.getAuthMessage(publicKey);
  }
}
