import { makeAutoObservable } from "mobx";
import AccountStore, { ISerializedAccountStore } from "@stores/AccountStore";
import DappStore from "@stores/DappStore";

export interface ISerializedRootStore {
  accountStore?: ISerializedAccountStore;
}

export enum ROUTES {
  ROOT = "/",
  GAME = "/game",
  INIT = "/INIT",
}

export const TICKETS_MINT_URL = "https://solana-faucet-chi.vercel.app/";

export default class RootStore {
  public accountStore: AccountStore;
  public dappStore: DappStore;

  constructor(initState?: ISerializedRootStore) {
    this.accountStore = new AccountStore(this, initState?.accountStore);
    this.dappStore = new DappStore(this);
    makeAutoObservable(this);
  }

  serialize = (): ISerializedRootStore => ({
    accountStore: this.accountStore.serialize(),
  });
}
