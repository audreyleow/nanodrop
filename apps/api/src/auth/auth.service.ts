import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as crypto from "crypto";
import { AuthRequest } from "./schemas/auth-request.schema";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthRequest.name)
    private readonly authRequestModel: Model<AuthRequest>
  ) {}

  async getAuthMessage(publicKey: string) {
    const message = crypto.randomBytes(32).toString("base64");
    const messageHash = crypto
      .createHash("sha256")
      .update(message)
      .digest("base64");

    await this.authRequestModel.create({
      publicKey,
      message,
      messageHash,
    });

    return message;
  }
}
