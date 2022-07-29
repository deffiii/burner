import dayjs from "dayjs";
import { Connection } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

export const getDateBySlot = async (
  connection: Connection,
  slot?: number | BN
) => {
  slot = slot ?? (await connection.getSlot());
  const timestamp = await connection.getBlockTime(
    typeof slot === "number" ? slot : slot.toNumber()
  );
  return timestamp != null ? dayjs(timestamp * 1000) : null;
};
