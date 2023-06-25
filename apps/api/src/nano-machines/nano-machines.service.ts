import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateNanoMachineDto } from "./dto/create-nano-machine.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { SolanaService } from "src/solana/solana.service";
import { BN } from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { NANODROP_PROGRAM_ID, SHARED_TREE_ID } from "@nanodrop/contracts";
import * as crypto from "crypto";
import { PROGRAM_ID as BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import * as jwt from "jsonwebtoken";

@Injectable()
export class NanoMachinesService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly solanaService: SolanaService
  ) {}

  async create(createNanoMachineDto: CreateNanoMachineDto) {
    await this.initializeNanoMachine(createNanoMachineDto);

    try {
      const result = await this.userModel
        .updateOne(
          {
            publicKey: createNanoMachineDto.user,
            "nanoMachines.nanoMachineId": {
              $ne: createNanoMachineDto.nanoMachineId,
            },
          },
          {
            $push: {
              nanoMachines: {
                nanoMachineId: createNanoMachineDto.nanoMachineId,
                backgroundImageUrl: createNanoMachineDto.backgroundImageUrl,
                jwtSecret: crypto.randomBytes(32).toString("base64"),
              },
            },
          }
        )
        .exec();

      if (result.modifiedCount === 0) {
        throw new InternalServerErrorException(
          "Failed to create nano machine. Either user does not exist or nano machine already exists"
        );
      }
    } catch (e: any) {
      if (e instanceof HttpException) {
        throw e;
      } else if (e.code === 11000) {
        // Duplicate key error
        throw new ConflictException("Nano Machine ID already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(userPublicKey: string) {
    const nanoMachines = (
      await this.userModel.findOne({ publicKey: userPublicKey }).exec()
    ).nanoMachines;

    return nanoMachines.map((nanoMachine) => ({
      nanoMachineId: nanoMachine.nanoMachineId,
      backgroundImageUrl: nanoMachine.backgroundImageUrl,
      createdAt: nanoMachine.createdAt,
      updatedAt: nanoMachine.updatedAt,
    }));
  }

  async findOne(userPublicKey: string, nanoMachineId: string) {
    const nanoMachines = (
      await this.userModel.findOne({ publicKey: userPublicKey }).exec()
    ).nanoMachines;

    const nanoMachine = nanoMachines.find(
      (nanoMachine) => nanoMachine.nanoMachineId === nanoMachineId
    );

    if (!nanoMachine) {
      throw new NotFoundException("Nano machine not found");
    }

    return {
      nanoMachineId: nanoMachine.nanoMachineId,
      backgroundImageUrl: nanoMachine.backgroundImageUrl,
      createdAt: nanoMachine.createdAt,
      updatedAt: nanoMachine.updatedAt,
    };
  }

  async findJwtSecret(userPublicKey: string, nanoMachineId: string) {
    const nanoMachines = (
      await this.userModel.findOne({ publicKey: userPublicKey }).exec()
    ).nanoMachines;

    const nanoMachine = nanoMachines.find(
      (nanoMachine) => nanoMachine.nanoMachineId === nanoMachineId
    );

    if (!nanoMachine) {
      throw new NotFoundException("Nano machine not found");
    }

    return nanoMachine.jwtSecret;
  }

  async buildMintTransaction(token: string, minterAddress: string) {
    const { collectionMint, nanoMachineId, creator } = jwt.decode(token) as {
      collectionMint: string;
      nanoMachineId: string;
      creator: string;
    };
    const jwtSecret = await this.findJwtSecret(creator, nanoMachineId);

    try {
      jwt.verify(token, jwtSecret);
    } catch (e) {
      throw new UnauthorizedException(e);
    }

    const transaction = await this.getMintFromNanoMachineTransaction(
      nanoMachineId,
      collectionMint,
      minterAddress
    );

    return {
      transaction,
      message: "Mint POAP",
    };
  }

  private async initializeNanoMachine(
    createNanoMachineDto: CreateNanoMachineDto
  ) {
    const collectionMint = new PublicKey(createNanoMachineDto.collectionMint);
    const [collectionMetadata] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        collectionMint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const [collectionMasterEdition] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        collectionMint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const nanoMachine = new PublicKey(createNanoMachineDto.nanoMachineId);
    const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("nano_machine"), nanoMachine.toBuffer()],
      NANODROP_PROGRAM_ID
    );
    const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        collectionMint.toBuffer(),
        Buffer.from("collection_authority"),
        nanoMachinePdaAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const [config] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      NANODROP_PROGRAM_ID
    );

    const instruction = await this.solanaService.nanodropProgram.methods
      .initialize({
        sellerFeeBasisPoints: 0,
        isPrivate: true,
        symbol: createNanoMachineDto.symbol,
        phases: createNanoMachineDto.phases.map((phase) => ({
          index: phase.index,
          nftName: phase.nftName,
          startDate: new BN(
            Math.floor(new Date(phase.startDate).getTime() / 1000)
          ),
        })),
      })
      .accounts({
        collectionAuthorityRecord,
        collectionMasterEdition,
        collectionMetadata,
        collectionMint,
        config,
        coSigner: this.solanaService.coSignerKeypair.publicKey,
        creator: new PublicKey(createNanoMachineDto.user),
        nanoMachine,
        nanoMachinePdaAuthority,
        systemProgram: SystemProgram.programId,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .instruction();

    const blockhash = await this.solanaService.connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);
    const messageV0 = new TransactionMessage({
      payerKey: this.solanaService.coSignerKeypair.publicKey,
      instructions: [instruction],
      recentBlockhash: blockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([this.solanaService.coSignerKeypair]);

    const txId = await this.solanaService.connection.sendRawTransaction(
      transaction.serialize()
    );

    const result = await this.solanaService.connection.confirmTransaction(txId);
    if (result.value.err) {
      throw new InternalServerErrorException(JSON.stringify(result.value.err));
    }

    return txId;
  }

  private async getMintFromNanoMachineTransaction(
    nanoMachineId: string,
    collectionMintId: string,
    minterAddress: string
  ) {
    const collectionMint = new PublicKey(collectionMintId);
    const [collectionMetadata] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        collectionMint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const [collectionMasterEdition] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        collectionMint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const nanoMachine = new PublicKey(nanoMachineId);
    const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("nano_machine"), nanoMachine.toBuffer()],
      NANODROP_PROGRAM_ID
    );
    const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        collectionMint.toBuffer(),
        Buffer.from("collection_authority"),
        nanoMachinePdaAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const [config] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      NANODROP_PROGRAM_ID
    );
    const [bubblegumSigner] = PublicKey.findProgramAddressSync(
      [Buffer.from("collection_cpi")],
      BUBBLEGUM_PROGRAM_ID
    );
    const [treeAuthority] = PublicKey.findProgramAddressSync(
      [SHARED_TREE_ID.toBuffer()],
      BUBBLEGUM_PROGRAM_ID
    );

    const instruction = await this.solanaService.nanodropProgram.methods
      .mint()
      .accounts({
        collectionAuthorityRecord,
        bubblegumProgram: BUBBLEGUM_PROGRAM_ID,
        bubblegumSigner,
        collectionMasterEdition,
        collectionMetadata,
        collectionMint,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        config,
        coSigner: this.solanaService.coSignerKeypair.publicKey,
        logWrapper: SPL_NOOP_PROGRAM_ID,
        nanoMachine,
        merkleTree: SHARED_TREE_ID,
        nanoMachinePdaAuthority,
        nftMinter: new PublicKey(minterAddress),
        systemProgram: SystemProgram.programId,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        treeAuthority,
      })
      .instruction();

    const blockhash = await this.solanaService.connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);
    const messageV0 = new TransactionMessage({
      payerKey: this.solanaService.coSignerKeypair.publicKey,
      instructions: [instruction],
      recentBlockhash: blockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([this.solanaService.coSignerKeypair]);

    return Buffer.from(transaction.serialize()).toString("base64");
  }
}
