import { PublicKey } from "@solana/web3.js";

export default function centerEllipsis(str: string | PublicKey, symbols = 26) {
  str = typeof str === "string" ? str : str.toString();
  if (str.length <= symbols) return str;
  return `${str.slice(0, symbols / 2)}...${str.slice(-symbols / 2)}`;
}
