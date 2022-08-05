import RootStore from "@stores/RootStore";
import { makeAutoObservable } from "mobx";
import { BN, Program, web3 } from "@project-serum/anchor";
import { DAPP, IDL } from "@src/types";
import { PublicKey } from "@solana/web3.js";
import { Dayjs } from "dayjs";
import { getDateBySlot } from "@src/utils/getDateBySlot";
import { TOKENS_BY_SYMBOL } from "@src/tokens";
import { SLOT_TIME } from "@stores/AccountStore";
import { getAssociatedTokenAddress } from "@solana/spl-token";

export interface IRawState {
  bump: number;
  coalMint: PublicKey;
  lastBurn: BN;
  lastStoker: PublicKey;
  lifetime: BN;
  rewardMint: PublicKey;
  rewardVaultBump: number;
}

export interface IState extends IRawState {
  rewardAmount: number;
  lastBurnDate: Dayjs | null;
  finishDate: Dayjs | null;
  interval: number;
}

export interface IFurnace {
  account: IState;
  publicKey: PublicKey;
}

export const LIFETIME = 5;
export const REWARD_AMOUNT_UNITS = 500;
export const REWARD_AMOUNT = new BN(REWARD_AMOUNT_UNITS).mul(
  new BN(10).pow(new BN(TOKENS_BY_SYMBOL.USDT.decimals))
);

class DappStore {
  readonly rootStore: RootStore;

  getFurnaceState = async (furnace?: PublicKey, defaultState?: IRawState) => {
    const programID = new PublicKey(DAPP);
    const provider = this.rootStore.accountStore.provider;
    const connection = this.rootStore.accountStore.solanaWeb3Manager.connection;
    if (provider == null || furnace == null) return null;

    const program = new Program(IDL, programID, provider);
    const state =
      defaultState == null
        ? await program.account.furnace.fetch(furnace)
        : defaultState;
    const [rewardVault] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("reward_vault"), furnace.toBuffer()],
      program.programId
    );
    const rewardAmount = await connection.getTokenAccountBalance(rewardVault);

    const { lifetime, lastBurn } = state;
    const lastBurnDate = await getDateBySlot(connection, lastBurn).catch(
      () => null
    );

    const finishDate = await getDateBySlot(
      connection,
      lastBurn.add(lifetime)
    ).catch(() =>
      lastBurnDate?.add(
        SLOT_TIME[this.rootStore.accountStore.network] * lifetime.toNumber(),
        "milliseconds"
      )
    );

    return {
      ...state,
      rewardAmount: rewardAmount.value.uiAmount ?? 0,
      lastBurnDate: lastBurnDate ?? null,
      finishDate: finishDate ?? null,
      interval: finishDate?.diff(lastBurnDate, "milliseconds") ?? 0,
    };
  };

  createFurnace = async () => {
    const programID = new PublicKey(DAPP);
    const provider = this.rootStore.accountStore.provider;
    const accountPublicKey =
      this.rootStore.accountStore.solanaWeb3Manager.state.wallet?.publicKey;
    if (provider == null || accountPublicKey == null) return;

    const program = new Program(IDL, programID, provider);
    const furnace = web3.Keypair.generate();
    // console.log({ furnace });
    console.log(furnace.publicKey.toString());
    const [rewardVault] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("reward_vault"), furnace.publicKey.toBuffer()],
      program.programId
    );

    const [furnaceAuthority] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("furnace"), furnace.publicKey.toBuffer()],
      program.programId
    );

    const rewardFrom = await getAssociatedTokenAddress(
      new PublicKey(TOKENS_BY_SYMBOL.USDT.assetId),
      accountPublicKey,
      true
    );

    // const rewardAmount = new BN(500).mul(
    //   new BN(10).pow(new BN(TOKENS_BY_SYMBOL.USDT.decimals))
    // );

    const lifetime = new BN(
      (LIFETIME * 60 * 1000) / SLOT_TIME[this.rootStore.accountStore.network]
    );

    await program.methods
      .createFurnace(REWARD_AMOUNT, lifetime)
      .accounts({
        furnace: furnace.publicKey, // ✅ - это адрес печки, сохраняем его на бекенде
        furnaceAuthority, // это адрес, на котором лежит authority печи
        coalMint: new PublicKey(TOKENS_BY_SYMBOL.NAZI.assetId), // токен, который сжигаем
        rewardMint: new PublicKey(TOKENS_BY_SYMBOL.USDT.assetId), // токен, в котором награда,
        rewardVault, // это адрес на котором харанятся токены награды
        rewardFrom, //адрес акаунта на котором лежат токены у создателя печи.
      })
      .signers([furnace])
      .rpc();
    await new Promise((r) => setTimeout(r, 1));
    return furnace.publicKey.toString();
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    // setInterval(this.fetchFurnace, 30 * 1000);
    // when(() => rootStore.accountStore.provider != null, this.fetchFurnace);
  }
}

export default DappStore;
