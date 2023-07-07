import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as crypto from "crypto";
import { AuthRequest } from "./schemas/auth-request.schema";
import * as bs58 from "bs58";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { SolanaService } from "src/solana/solana.service";
import { VerifyAuthRequestDto } from "./dto/verify-auth-request";
import { NanoMachinesService } from "src/nano-machines/nano-machines.service";

const NOOP_PROGRAM_ID = new PublicKey(
  "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV"
);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthRequest.name)
    private readonly authRequestModel: Model<AuthRequest>,
    private readonly solanaService: SolanaService,
    private readonly nanoMachinesService: NanoMachinesService
  ) {}

  async buildLogTransaction(
    messageHash: string,
    solanaPayReference: string,
    publicKey: string
  ) {
    const logIx = new TransactionInstruction({
      keys: [
        {
          isSigner: true,
          isWritable: false,
          pubkey: new PublicKey(publicKey),
        },
        {
          isSigner: false,
          isWritable: false,
          pubkey: new PublicKey(solanaPayReference),
        },
      ],
      programId: NOOP_PROGRAM_ID,
      data: Buffer.from(messageHash),
    });

    const blockhash = await this.solanaService.connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);
    const transaction = new Transaction().add(logIx);
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = this.solanaService.coSignerKeypair.publicKey;
    transaction.partialSign(this.solanaService.coSignerKeypair);

    return {
      transaction: Buffer.from(
        transaction.serialize({ requireAllSignatures: false })
      ).toString("base64"),
      message: "Unlock minting QR code",
    };
  }

  async getAuthMessage(publicKey: string) {
    const message = crypto.randomBytes(32).toString("base64");

    await this.authRequestModel.create({
      publicKey,
      message,
    });

    return message;
  }

  async verifyAuthRequest(verifyAuthRequestDto: VerifyAuthRequestDto) {
    const { message, nanoMachineId, txId } = verifyAuthRequestDto;

    const authRequest = await this.authRequestModel
      .findOne({
        message,
      })
      .exec();

    if (!authRequest) {
      throw new UnauthorizedException("Invalid auth request");
    }

    const transactionResponse =
      await this.solanaService.connection.getTransaction(txId);

    const creator = authRequest.publicKey;
    const isSecondAccountCreator =
      transactionResponse?.transaction?.message?.accountKeys?.[1]?.toBase58() ===
      creator;
    const didCreatorSign =
      transactionResponse?.transaction?.message?.isAccountSigner(1);

    if (!isSecondAccountCreator || !didCreatorSign) {
      throw new UnauthorizedException(
        "Invalid creator, you might have scanned the QR code with the wrong account."
      );
    }

    const logData =
      transactionResponse?.transaction?.message?.instructions?.[0]?.data;

    if (!logData) {
      throw new UnauthorizedException("Invalid txId or log data");
    }

    const messageHash = Buffer.from(bs58.decode(logData)).toString("utf-8");

    if (
      messageHash !==
      crypto.createHash("sha256").update(message).digest("base64")
    ) {
      throw new UnauthorizedException("QR code has expired. Please try again.");
    }

    await authRequest.deleteOne();

    return this.nanoMachinesService.findJwtSecret(creator, nanoMachineId);
  }
}
