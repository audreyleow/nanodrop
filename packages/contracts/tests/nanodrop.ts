import * as anchor from "@coral-xyz/anchor";
import { createSetTreeDelegateInstruction } from "@metaplex-foundation/mpl-bubblegum";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { closeAccount } from "@solana/spl-token";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import { expect } from "chai";

import {
  COLLECTION_MINT,
  CONNECTION,
  INIT_BASE_ACCOUNTS,
  INITIALIZATION_ARGS,
  MERKLE_TREE,
  MINT_BASE_ACCOUNTS,
  MINTER,
  MINTER_MSOL_ATA,
  MSOL_ADDRESS,
  NANO_MACHINE_AUTHORITY,
  NANO_MACHINE_AUTHORITY_USDC_ATA,
  PROGRAM,
  TREE_AUTHORITY,
  TREE_WITH_WRONG_CREATOR,
  TREE_WITH_WRONG_CREATOR_AUTHORITY,
} from "./constants";
import { createNanoMachineAccount } from "./create-nano-machine-account";

let solNanoMachine: Keypair;
let splNanoMachine: Keypair;

describe("nanodrop", () => {
  // Configure the client to use the local cluster.

  anchor.setProvider(
    new anchor.AnchorProvider(
      CONNECTION,
      new anchor.Wallet(NANO_MACHINE_AUTHORITY),
      {
        commitment: "confirmed",
      }
    )
  );

  before(async () => {
    solNanoMachine = await createNanoMachineAccount(
      NANO_MACHINE_AUTHORITY,
      PROGRAM.programId,
      1
    );

    try {
      // close nano machine authority usdc token account
      await closeAccount(
        CONNECTION,
        NANO_MACHINE_AUTHORITY,
        NANO_MACHINE_AUTHORITY_USDC_ATA,
        NANO_MACHINE_AUTHORITY.publicKey,
        NANO_MACHINE_AUTHORITY
      );

      // close minter msol token account
      await closeAccount(
        CONNECTION,
        MINTER,
        MINTER_MSOL_ATA,
        MINTER.publicKey,
        MINTER
      );
    } catch {
      // ignore any errors from closing accounts
    }
  });

  it("should fail to initialize nano machine with a tree not created by nano machine authority", async () => {
    const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("nano_machine"), solNanoMachine.publicKey.toBuffer()],
      PROGRAM.programId
    );

    const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        COLLECTION_MINT.toBuffer(),
        Buffer.from("collection_authority"),
        nanoMachinePdaAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    try {
      await PROGRAM.methods
        .initialize(INITIALIZATION_ARGS)
        .accounts({
          ...INIT_BASE_ACCOUNTS,
          nanoMachine: solNanoMachine.publicKey,
          authority: NANO_MACHINE_AUTHORITY.publicKey,
          collectionAuthorityRecord,
          nanoMachinePdaAuthority,
          treeAuthority: TREE_WITH_WRONG_CREATOR_AUTHORITY,
          merkleTree: TREE_WITH_WRONG_CREATOR,
        })
        .rpc();
    } catch (e) {
      if (e instanceof anchor.AnchorError) {
        expect(e.error.errorCode.code).equals("ConstraintSeeds");
        return;
      }
    }

    throw new Error("should have failed");
  });

  /**
   * Test disabled as it costs some rent to delegate a tree authority
   */
  // it("should fail to initialize nano machine with a with non delegated tree", async () => {
  //   const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
  //     [Buffer.from("nano_machine"), solNanoMachine.publicKey.toBuffer()],
  //     PROGRAM.programId
  //   );

  //   const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
  //     [
  //       Buffer.from("metadata"),
  //       TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  //       COLLECTION_MINT.toBuffer(),
  //       Buffer.from("collection_authority"),
  //       nanoMachinePdaAuthority.toBuffer(),
  //     ],
  //     TOKEN_METADATA_PROGRAM_ID
  //   );

  //   try {
  //     await PROGRAM.methods
  //       .initialize(INITIALIZATION_ARGS)
  //       .accounts({
  //         ...INIT_BASE_ACCOUNTS,
  //         nanoMachine: solNanoMachine.publicKey,
  //         authority: NANO_MACHINE_AUTHORITY.publicKey,
  //         collectionAuthorityRecord,
  //         nanoMachinePdaAuthority,
  //         treeAuthority: TREE_AUTHORITY,
  //         merkleTree: MERKLE_TREE,
  //       })
  //       .rpc();
  //   } catch (e) {
  //     if (e instanceof anchor.AnchorError) {
  //       expect(e.error.errorCode.code).equals("ConstraintRaw");
  //       return;
  //     }
  //   }

  //   throw new Error("should have failed");
  // });

  it("should be able to initialize nano machine", async () => {
    const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("nano_machine"), solNanoMachine.publicKey.toBuffer()],
      PROGRAM.programId
    );

    const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        COLLECTION_MINT.toBuffer(),
        Buffer.from("collection_authority"),
        nanoMachinePdaAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const setTreeDelegateIx = createSetTreeDelegateInstruction({
      merkleTree: MERKLE_TREE,
      newTreeDelegate: nanoMachinePdaAuthority,
      treeAuthority: TREE_AUTHORITY,
      treeCreator: NANO_MACHINE_AUTHORITY.publicKey,
    });

    const initializationIx = await PROGRAM.methods
      .initialize(INITIALIZATION_ARGS)
      .accounts({
        ...INIT_BASE_ACCOUNTS,
        nanoMachine: solNanoMachine.publicKey,
        authority: NANO_MACHINE_AUTHORITY.publicKey,
        collectionAuthorityRecord,
        nanoMachinePdaAuthority,
        treeAuthority: TREE_AUTHORITY,
        merkleTree: MERKLE_TREE,
      })
      .instruction();

    const transaction = new Transaction()
      .add(setTreeDelegateIx)
      .add(initializationIx);
    transaction.feePayer = NANO_MACHINE_AUTHORITY.publicKey;
    const { blockhash } = await CONNECTION.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    await sendAndConfirmTransaction(CONNECTION, transaction, [
      NANO_MACHINE_AUTHORITY,
    ]);

    const { itemsAvailable, itemsRedeemed, backgroundImageUri, baseUri } =
      await PROGRAM.account.nanoMachine.fetch(solNanoMachine.publicKey);
    expect(itemsAvailable.toNumber()).equals(
      INITIALIZATION_ARGS.itemsAvailable.toNumber()
    );
    expect(itemsRedeemed.toNumber()).equals(0);
    expect(baseUri.replaceAll("\u0000", "").trim()).equals(
      INITIALIZATION_ARGS.baseUri
    );
    expect(backgroundImageUri.replaceAll("\u0000", "").trim()).equals(
      INITIALIZATION_ARGS.backgroundImageUri
    );
  });

  const updatedGoLiveDate = Math.ceil(Date.now() / 1000) + 24 * 60 * 60;
  it("should be able to update nano machine go live date only", async () => {
    await PROGRAM.methods
      .update({
        goLiveDate: new anchor.BN(updatedGoLiveDate),
        price: null,
      })
      .accounts({
        nanoMachine: solNanoMachine.publicKey,
        authority: NANO_MACHINE_AUTHORITY.publicKey,
        paymentMint: PROGRAM.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .rpc();

    await sleep(5000);

    const { goLiveDate, price, paymentMint } =
      await PROGRAM.account.nanoMachine.fetch(solNanoMachine.publicKey);

    expect(goLiveDate.toNumber()).equals(updatedGoLiveDate);
    expect(price.toNumber()).equals(INITIALIZATION_ARGS.price.toNumber());
    expect(paymentMint.toBase58()).equals(
      "So11111111111111111111111111111111111111112"
    );
  });

  it("should not be able to mint before go live date", async () => {
    const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("nano_machine"), solNanoMachine.publicKey.toBuffer()],
      PROGRAM.programId
    );

    const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        COLLECTION_MINT.toBuffer(),
        Buffer.from("collection_authority"),
        nanoMachinePdaAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    try {
      await PROGRAM.methods
        .mint()
        .accounts({
          ...MINT_BASE_ACCOUNTS,
          nanoMachine: solNanoMachine.publicKey,
          collectionAuthorityRecord,
          nanoMachinePdaAuthority,
          nanoMachineAuthorityAta: PROGRAM.programId,
          nftMinterAta: PROGRAM.programId,
          paymentMint: PROGRAM.programId,
        })
        .signers([MINTER])
        .rpc();
    } catch (e) {
      if (e instanceof anchor.AnchorError) {
        expect(e.error.errorCode.code).equals("NanoMachineNotLive");
        return;
      }
    }

    throw new Error("should have failed");
  });

  const newPrice = LAMPORTS_PER_SOL * 0.01;
  it("should be able to update nano machine price only", async () => {
    await PROGRAM.methods
      .update({
        goLiveDate: new anchor.BN(updatedGoLiveDate), // goLiveDate should be supplied on every update, if not it will be set to null
        price: new anchor.BN(newPrice),
      })
      .accounts({
        nanoMachine: solNanoMachine.publicKey,
        authority: NANO_MACHINE_AUTHORITY.publicKey,
        paymentMint: PROGRAM.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .rpc();

    await sleep(5000);

    const { goLiveDate, price, paymentMint } =
      await PROGRAM.account.nanoMachine.fetch(solNanoMachine.publicKey);

    expect(goLiveDate.toNumber()).equals(updatedGoLiveDate);
    expect(price.toNumber()).equals(newPrice);
    expect(paymentMint.toBase58()).equals(
      "So11111111111111111111111111111111111111112"
    );
  });

  it("should be able to clear nano machine price goLiveDate", async () => {
    await PROGRAM.methods
      .update({
        goLiveDate: null,
        price: null,
      })
      .accounts({
        nanoMachine: solNanoMachine.publicKey,
        authority: NANO_MACHINE_AUTHORITY.publicKey,
        paymentMint: PROGRAM.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .rpc();

    await sleep(5000);

    const { goLiveDate, price, paymentMint } =
      await PROGRAM.account.nanoMachine.fetch(solNanoMachine.publicKey);

    expect(goLiveDate).equals(null);
    expect(price.toNumber()).equals(newPrice);
    expect(paymentMint.toBase58()).equals(
      "So11111111111111111111111111111111111111112"
    );
  });

  it("should not be able to update nano machine price when goLiveDate has passed", async () => {
    try {
      await PROGRAM.methods
        .update({
          goLiveDate: null,
          price: new anchor.BN(newPrice),
        })
        .accounts({
          nanoMachine: solNanoMachine.publicKey,
          authority: NANO_MACHINE_AUTHORITY.publicKey,
          paymentMint: PROGRAM.programId,
          clock: SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();
    } catch (e) {
      if (e instanceof anchor.AnchorError) {
        expect(e.error.errorCode.code).equals(
          "NoPriceUpdatesAfterMintOrGoLiveDate"
        );
        return;
      }
    }

    throw new Error("should have failed");
  });

  it("should not be able to update nano machine mint when goLiveDate has passed", async () => {
    try {
      await PROGRAM.methods
        .update({
          goLiveDate: null,
          price: null,
        })
        .accounts({
          nanoMachine: solNanoMachine.publicKey,
          authority: NANO_MACHINE_AUTHORITY.publicKey,
          paymentMint: MSOL_ADDRESS,
          clock: SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();
    } catch (e) {
      if (e instanceof anchor.AnchorError) {
        expect(e.error.errorCode.code).equals(
          "NoPriceUpdatesAfterMintOrGoLiveDate"
        );
        return;
      }
    }

    throw new Error("should have failed");
  });

  it("should be able to mint from candy machine", async () => {
    const balance = await CONNECTION.getBalance(MINTER.publicKey);

    const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("nano_machine"), solNanoMachine.publicKey.toBuffer()],
      PROGRAM.programId
    );

    const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        COLLECTION_MINT.toBuffer(),
        Buffer.from("collection_authority"),
        nanoMachinePdaAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const mintIx = await PROGRAM.methods
      .mint()
      .accounts({
        ...MINT_BASE_ACCOUNTS,
        nanoMachine: solNanoMachine.publicKey,
        collectionAuthorityRecord,
        nanoMachinePdaAuthority,
        nanoMachineAuthorityAta: PROGRAM.programId,
        nftMinterAta: PROGRAM.programId,
        paymentMint: PROGRAM.programId,
      })
      .instruction();

    const transaction = new Transaction().add(mintIx);
    transaction.feePayer = MINTER.publicKey;
    const { blockhash } = await CONNECTION.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    await sendAndConfirmTransaction(CONNECTION, transaction, [MINTER]);

    await sleep(5000);

    const updatedBalance = await CONNECTION.getBalance(MINTER.publicKey);
    expect(balance - updatedBalance).equals(newPrice + 5000);
  });

  it("should not be able to mint from candy machine when supply is 0", async () => {
    const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("nano_machine"), solNanoMachine.publicKey.toBuffer()],
      PROGRAM.programId
    );

    const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        COLLECTION_MINT.toBuffer(),
        Buffer.from("collection_authority"),
        nanoMachinePdaAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    try {
      const mintIx = await PROGRAM.methods
        .mint()
        .accounts({
          ...MINT_BASE_ACCOUNTS,
          nanoMachine: solNanoMachine.publicKey,
          collectionAuthorityRecord,
          nanoMachinePdaAuthority,
          nanoMachineAuthorityAta: PROGRAM.programId,
          nftMinterAta: PROGRAM.programId,
          paymentMint: PROGRAM.programId,
        })
        .signers([MINTER])
        .rpc();
    } catch (e) {
      if (e instanceof anchor.AnchorError) {
        expect(e.error.errorCode.code).equals("NanoMachineEmpty");
        return;
      }
    }

    throw new Error("should have failed");
  });

  it("should not be able to update nano machine price when mint has started", async () => {
    try {
      await PROGRAM.methods
        .update({
          goLiveDate: new anchor.BN(updatedGoLiveDate), // goLiveDate should be supplied on every update, if not it will be set to null
          price: new anchor.BN(newPrice),
        })
        .accounts({
          nanoMachine: solNanoMachine.publicKey,
          authority: NANO_MACHINE_AUTHORITY.publicKey,
          paymentMint: PROGRAM.programId,
          clock: SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();
    } catch (e) {
      if (e instanceof anchor.AnchorError) {
        expect(e.error.errorCode.code).equals(
          "NoPriceUpdatesAfterMintOrGoLiveDate"
        );
        return;
      }
    }

    throw new Error("should have failed");
  });

  it("should not be able to update nano machine mint when mint has started", async () => {
    try {
      await PROGRAM.methods
        .update({
          goLiveDate: new anchor.BN(updatedGoLiveDate), // goLiveDate should be supplied on every update, if not it will be set to null
          price: null,
        })
        .accounts({
          nanoMachine: solNanoMachine.publicKey,
          authority: NANO_MACHINE_AUTHORITY.publicKey,
          paymentMint: MSOL_ADDRESS,
          clock: SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();
    } catch (e) {
      if (e instanceof anchor.AnchorError) {
        expect(e.error.errorCode.code).equals(
          "NoPriceUpdatesAfterMintOrGoLiveDate"
        );
        return;
      }
    }

    throw new Error("should have failed");
  });

  it("should be able to update nano machine goLiveDate when mint has started", async () => {
    const newDate = Math.ceil(Date.now() / 1000);
    await PROGRAM.methods
      .update({
        goLiveDate: new anchor.BN(newDate),
        price: null,
      })
      .accounts({
        nanoMachine: solNanoMachine.publicKey,
        authority: NANO_MACHINE_AUTHORITY.publicKey,
        paymentMint: PROGRAM.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
      })
      .rpc();

    await sleep(5000);

    const { goLiveDate, price, paymentMint } =
      await PROGRAM.account.nanoMachine.fetch(solNanoMachine.publicKey);

    expect(goLiveDate.toNumber()).equals(newDate);
    expect(price.toNumber()).equals(newPrice);
    expect(paymentMint.toBase58()).equals(
      "So11111111111111111111111111111111111111112"
    );
  });

  after(async () => {
    // close nano machine account
    const closeIx = await PROGRAM.methods
      .close()
      .accounts({
        nanoMachine: solNanoMachine.publicKey,
        authority: NANO_MACHINE_AUTHORITY.publicKey,
      })
      .instruction();

    // reset tree delegate
    const setTreeDelegateIx = createSetTreeDelegateInstruction({
      merkleTree: MERKLE_TREE,
      newTreeDelegate: TREE_AUTHORITY,
      treeAuthority: TREE_AUTHORITY,
      treeCreator: NANO_MACHINE_AUTHORITY.publicKey,
    });
    const transaction = new Transaction().add(
      closeIx
    ); /*.add(setTreeDelegateIx)*/
    transaction.feePayer = NANO_MACHINE_AUTHORITY.publicKey;
    const { blockhash } = await CONNECTION.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    await sendAndConfirmTransaction(CONNECTION, transaction, [
      NANO_MACHINE_AUTHORITY,
    ]);
  });
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
