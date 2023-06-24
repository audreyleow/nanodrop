export const getAuthMessage = ({
  publicKey,
  nonce,
  issuedAt,
}: {
  publicKey: string;
  nonce: string;
  issuedAt: string;
}) => `nanodrop.it wants you to sign in with your Solana account:
${publicKey}

Clicking "Sign" or "Approve" only means you have proved this wallet is owned by you.
This request will not trigger any blockchain transactions or generate a fee.

URI: https://nanodrop.it
Version: 1
Chain ID: mainnet
Nonce: ${nonce}
Issued At: ${issuedAt}`;
