import { ConcurrentMerkleTreeAccount } from "@solana/spl-account-compression";
import { Connection, PublicKey } from "@solana/web3.js";

export async function getTreeInfo(connection: Connection, tree: PublicKey) {
  const treeAccount = await ConcurrentMerkleTreeAccount.fromAccountAddress(
    connection,
    tree
  );

  console.log(
    treeAccount.getCanopyDepth().toString(),
    treeAccount.getMaxDepth().toString(),
    treeAccount.getMaxBufferSize().toString()
  );
}
