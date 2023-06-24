import { Injectable } from "@nestjs/common";
import * as anchor from "@coral-xyz/anchor";
import { IDL, NANODROP_PROGRAM_ID, Nanodrop } from "@nanodrop/contracts";
import { Connection, Keypair } from "@solana/web3.js";

@Injectable()
export class SolanaService {
  private readonly _nanodropProgram: anchor.Program<Nanodrop>;
  private readonly _connection: Connection;
  private readonly _coSignerKeypair: Keypair;

  constructor() {
    this._connection = new Connection(process.env.RPC_ENDPOINT, "confirmed");
    this._coSignerKeypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(process.env.CO_SIGNER_KEYPAIR))
    );

    this._nanodropProgram = new anchor.Program(
      IDL,
      NANODROP_PROGRAM_ID,
      new anchor.AnchorProvider(
        this._connection,
        new anchor.Wallet(this._coSignerKeypair),
        {
          commitment: "confirmed",
        }
      )
    );
  }

  get nanodropProgram() {
    return this._nanodropProgram;
  }

  get connection() {
    return this._connection;
  }

  get coSignerKeypair() {
    return this._coSignerKeypair;
  }
}
