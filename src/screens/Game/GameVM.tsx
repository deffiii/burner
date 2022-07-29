import React, { PropsWithChildren, useMemo } from "react";
import { useVM } from "@src/hooks/useVM";
import { makeAutoObservable, when } from "mobx";
import { RootStore, useStores } from "@stores";
import { PublicKey } from "@solana/web3.js";
import { DAPP, IDL } from "@src/types";
import { Program, web3 } from "@project-serum/anchor";
import { toast } from "react-toastify";
import { IRawState, IState } from "@stores/DappStore";
import { TOKENS_BY_SYMBOL } from "@src/tokens";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import dayjs from "dayjs";

const ctx = React.createContext<GameVM | null>(null);

export const GameVMProvider: React.FC<
  PropsWithChildren<{ furnaceAddress: string }>
> = ({ children, furnaceAddress }) => {
  const rootStore = useStores();
  const store = useMemo(
    () => new GameVM(rootStore, furnaceAddress),
    [furnaceAddress, rootStore]
  );
  return <ctx.Provider value={store}>{children}</ctx.Provider>;
};

export const useGameVM = () => useVM(ctx);

class GameVM {
  public rootStore: RootStore;
  public readonly furnaceAddress;

  claimLoading: boolean = false;
  setClaimLoading = (v: boolean) => (this.claimLoading = v);

  burnLoading: boolean = false;
  setBurnLoading = (v: boolean) => (this.burnLoading = v);

  get loading() {
    return this.claimLoading || this.burnLoading;
  }

  get isLeader() {
    return (
      this.state &&
      this.rootStore.accountStore.address &&
      this.state?.lastStoker.toString() ===
        this.rootStore.accountStore.address?.toString()
    );
  }

  get isTimeOver() {
    return (
      !this.loading &&
      this.state?.finishDate != null &&
      this.state.lastBurn.toNumber() > 0 &&
      this.state.finishDate.isBefore(dayjs())
    );
  }

  state: IState | null = null;
  private setState = (state: IState | null) => (this.state = state);

  constructor(rootStore: RootStore, furnaceAddress: string) {
    this.rootStore = rootStore;
    this.furnaceAddress = furnaceAddress;
    makeAutoObservable(this);
    setInterval(this.fetchFurnace, 5 * 1000);
    when(() => rootStore.accountStore.provider != null, this.fetchFurnace);
  }

  fetch = () =>
    Promise.all([
      this.fetchFurnace(),
      this.rootStore.accountStore.fetchNaziBalance(),
    ]);

  fetchFurnace = async () => {
    const programID = new PublicKey(DAPP);
    const provider = this.rootStore.accountStore.provider;
    if (provider == null) return;
    const program = new Program(IDL, programID, provider);
    const rawState: IRawState | null = await program.account.furnace
      .fetch(new PublicKey(this.furnaceAddress))
      .catch((e) => {
        console.error(e);
        toast.error(e.message ?? e.toString());
        return null;
      });
    if (rawState != null) {
      const state = await this.rootStore.dappStore.getFurnaceState(
        new PublicKey(this.furnaceAddress),
        rawState
      );
      this.setState(state);
    }
  };

  burn = async () => {
    const programID = new PublicKey(DAPP);
    const provider = this.rootStore.accountStore.provider;
    const accountPublicKey = this.rootStore.accountStore.address;
    if (provider == null || accountPublicKey == null) return;
    const program = new Program(IDL, programID, provider);
    const coalMint = new PublicKey(TOKENS_BY_SYMBOL.NAZI.assetId);
    const stokerCoalFrom = await getAssociatedTokenAddress(
      coalMint,
      accountPublicKey,
      true
    );
    // const { address: stokerCoalFrom } = await getOrCreateATA(
    //   provider,
    //   coalMint,
    //   accountPublicKey
    // );

    await program.methods
      .burn()
      .accounts({
        furnace: new PublicKey(this.furnaceAddress), //Вставить PublicKey из createFurnace
        coalMint, //адрес токена
        stoker: accountPublicKey, //кто сжигает
        stokerCoalFrom, //кто отдает фашиста на сжигаение
        clock: web3.SYSVAR_CLOCK_PUBKEY,
      })
      .signers([])
      .rpc();
    new Promise((r) => setInterval(r, 2000));
    await this.fetch();
    // const furnaceAccount = await program.account.furnace.fetch(furnace.publicKey);
    // console.log(furnaceAccount);
    //
    // expect(
    //   furnaceAccount.lastStoker.equals(stoker.owner.publicKey)
    // ).toBeTruthy();
  };

  claim = async () => {
    const furnace = new PublicKey(this.furnaceAddress);
    const programID = new PublicKey(DAPP);
    const provider = this.rootStore.accountStore.provider;
    const accountPublicKey = this.rootStore.accountStore.address;
    if (provider == null || accountPublicKey == null) return;
    const program = new Program(IDL, programID, provider);
    const rewardMint = new PublicKey(TOKENS_BY_SYMBOL.USDT.assetId);

    const [rewardVault] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("reward_vault"), furnace.toBuffer()],
      program.programId
    );

    const [furnaceAuthority] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("furnace"), furnace.toBuffer()],
      program.programId
    );

    const stokerRewardAta = await getAssociatedTokenAddress(
      rewardMint,
      accountPublicKey,
      true
    );
    // const { address: stokerRewardAta } = await getOrCreateATA(
    //   provider,
    //   rewardMint,
    //   accountPublicKey
    // );
    const furnaceAccount = await program.account.furnace.fetch(furnace);
    await program.methods
      .claim()
      .accounts({
        furnace, //Вставить PublicKey из createFurnace
        furnaceAuthority: furnaceAuthority,
        rewardMint: new PublicKey(TOKENS_BY_SYMBOL.USDT.assetId),
        rewardVault,
        stoker: furnaceAccount.lastStoker,
        stokerRewardAta,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
      })
      .rpc();
    new Promise((r) => setInterval(r, 1000));
    await this.fetch();
    // const furnaceAccount = await program.account.furnace.fetch(furnace.publicKey);
    // console.log(furnaceAccount);
    //
    // expect(
    //   furnaceAccount.lastStoker.equals(stoker.owner.publicKey)
    // ).toBeTruthy();
  };
}
