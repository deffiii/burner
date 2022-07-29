import { AnchorProvider, Spl, web3 } from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const getOrCreateATA = async (
  provider: AnchorProvider,
  mint: web3.PublicKey,
  owner: web3.PublicKey
) => {
  const splToken = Spl.token(provider);
  const address = await getAssociatedTokenAddress(
    mint,
    owner,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  try {
    const account = await splToken.account.token.fetch(address);

    return { address, account };
  } catch (err) {
    const ix = createAssociatedTokenAccountInstruction(
      provider.wallet.publicKey,
      address,
      owner,
      mint,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = new web3.Transaction().add(ix);
    await provider.sendAndConfirm(tx);

    const account = await splToken.account.token.fetch(address);

    return { address, account };
  }
};
