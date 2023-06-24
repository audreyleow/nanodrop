import { Controller, Get, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(":publicKey")
  getAuthMessageParams(@Param("publicKey") publicKey) {
    return this.authService.getAuthMessageParams(publicKey);
  }
}
