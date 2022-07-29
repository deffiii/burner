import React, { PropsWithChildren, useMemo } from "react";
import { useVM } from "@src/hooks/useVM";
import { makeAutoObservable, when } from "mobx";
import { RootStore, useStores } from "@stores";
import { PublicKey } from "@solana/web3.js";
import { DAPP, IDL } from "@src/types";
import { Program } from "@project-serum/anchor";
import { IFurnace, IRawState, REWARD_AMOUNT } from "@stores/DappStore";

const ctx = React.createContext<MainPageVM | null>(null);

export const MainPageVMProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const rootStore = useStores();
  const store = useMemo(() => new MainPageVM(rootStore), [rootStore]);
  return <ctx.Provider value={store}>{children}</ctx.Provider>;
};

export const useMainPageVM = () => useVM(ctx);

class MainPageVM {
  public rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    setInterval(this.fetchFurnace, 30 * 1000);
    when(
      () =>
        rootStore.accountStore.connection != null &&
        rootStore.accountStore.provider != null &&
        rootStore.accountStore.address != null,
      this.fetchFurnace
    );
  }

  furnaces: Array<IFurnace> = [];
  private setFurnaces = (furnaces: IFurnace[]) => (this.furnaces = furnaces);

  fetchFurnace = async () => {
    const programID = new PublicKey(DAPP);
    const provider = this.rootStore.accountStore.provider;
    if (provider == null) return;
    const program = new Program(IDL, programID, provider);
    const rawFurnaces = await program.account.furnace.all().catch((e) => {
      console.error(e);
      // toast.error(e.message ?? e.toString());
      return [];
    });
    const furnaces = await Promise.all(
      rawFurnaces.map(async ({ publicKey, account }) => {
        const state = await this.rootStore.dappStore.getFurnaceState(
          publicKey,
          account as IRawState
        );
        return { publicKey, account: state } as IFurnace;
      })
    );
    const sorted = furnaces
      .filter((f) => f.account.rewardAmount === REWARD_AMOUNT.toNumber())
      .sort(({ account: accA }, { account: accB }) => {
        if (accA.finishDate == null && accB.finishDate == null) return 0;
        if (accA.finishDate != null && accB.finishDate == null) return 1;
        if (accA.finishDate == null && accB.finishDate != null) return -1;
        return accA.finishDate!.unix() > accB.finishDate!.unix() ? -1 : 1;
      });
    this.setFurnaces(sorted);
    // const furnace = furnaces[0];
    // const state = await this.getFurnaceState(furnace?.publicKey);
    // if (state != null) this.setState(state);
  };
}
