import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import * as crypto from "crypto";
import { ValidateUserDto } from "./dto/validate-user.dto";
import { getAuthMessage } from "@nanodrop/contracts";
import * as nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";

const AUTH_MESSAGE_EXPIRY = 15 * 1000; // 15 seconds

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async getAuthMessageParams(publicKey: string) {
    const nonce = crypto.randomBytes(16).toString("base64");
    const result = await this.userModel
      .updateOne(
        { publicKey },
        {
          nonce,
        }
      )
      .exec();

    if (result.modifiedCount === 0) {
      throw new NotFoundException("User not found");
    }

    return {
      nonce,
      issuedAt: new Date().toISOString(),
    };
  }

  async validateUser(validateUserDto: ValidateUserDto) {
    const { publicKey, issuedAt, signedMessage } = validateUserDto;
    const user = await this.userModel
      .findOne({
        publicKey,
      })
      .exec();

    if (Date.now() - new Date(issuedAt).getTime() > AUTH_MESSAGE_EXPIRY) {
      throw new UnauthorizedException("Auth message expired");
    }

    const messageToSign = getAuthMessage({
      publicKey,
      nonce: user.nonce,
      issuedAt,
    });

    const isSignatureValid = nacl.sign.detached.verify(
      new TextEncoder().encode(messageToSign),
      Buffer.from(signedMessage, "base64"),
      Uint8Array.from(new PublicKey(publicKey).toBuffer())
    );

    return isSignatureValid;
  }
}
