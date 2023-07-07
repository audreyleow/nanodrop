import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as crypto from "crypto";
import { AuthRequest } from "./schemas/auth-request.schema";
import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { SolanaService } from "src/solana/solana.service";

const NOOP_PROGRAM_ID = new PublicKey(
  "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV"
);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthRequest.name)
    private readonly authRequestModel: Model<AuthRequest>,
    private readonly solanaService: SolanaService
  ) {}

  async buildLogTransaction(messageHash: string, publicKey: string) {
    const logIx = new TransactionInstruction({
      keys: [
        {
          isSigner: true,
          isWritable: false,
          pubkey: new PublicKey(publicKey),
        },
      ],
      programId: NOOP_PROGRAM_ID,
      data: Buffer.from(messageHash),
    });

    const blockhash = await this.solanaService.connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);
    const messageV0 = new TransactionMessage({
      payerKey: this.solanaService.coSignerKeypair.publicKey,
      instructions: [logIx],
      recentBlockhash: blockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([this.solanaService.coSignerKeypair]);

    return {
      transaction: Buffer.from(transaction.serialize()).toString("base64"),
      message: "Unlock minting QR code",
    };
  }

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
