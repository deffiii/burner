import RootStore from "@stores/RootStore";
import { makeAutoObservable, when } from "mobx";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import SolanaWeb3Manager from "@stores/SolanaWeb3Manager";
import { PublicKey } from "@solana/web3.js";
import { TOKENS_BY_SYMBOL } from "@src/tokens";
import { BN } from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";

export interface ISerializedAccountStore {}

export enum SLOT_TIME {
  "devnet" = 380,
  "mainnet-beta" = 646,
  "testnet" = 380,
}

class AccountStore {
  readonly rootStore: RootStore;
  solanaWeb3Manager: SolanaWeb3Manager;

  constructor(rootStore: RootStore, initState?: ISerializedAccountStore) {
    this.rootStore = rootStore;
    this.solanaWeb3Manager = new SolanaWeb3Manager(WalletAdapterNetwork.Devnet);
    makeAutoObservable(this);

    this.connectPhantom(); //.finally(() => this.setLoading(false));

    when(
      () =>
        this.connection != null &&
        this.provider != null &&
        this.address != null,
      () => this.fetchNaziBalance().finally(() => this.setBalanceLoading(false))
    );

    setInterval(() => {
      this.fetchNaziBalance().finally(() => this.setBalanceLoading(false));
    }, 30 * 1000);
  }

  balances: Record<string, BN> = {};
  setBalances = (v: Record<string, BN>) => (this.balances = v);

  get loading() {
    return this.solanaWeb3Manager.connecting;
  }

  balanceLoading: boolean = true;
  setBalanceLoading = (v: boolean) => (this.balanceLoading = v);

  get provider() {
    return this.solanaWeb3Manager.provider;
  }

  get connection() {
    return this.solanaWeb3Manager.connection;
  }

  get address() {
    return this.solanaWeb3Manager.state.publicKey;
  }

  get network() {
    return this.solanaWeb3Manager.network;
  }

  fetchNaziBalance = async () => {
    const connection = this.rootStore.accountStore.solanaWeb3Manager.connection;
    const provider = this.rootStore.accountStore.solanaWeb3Manager.provider;
    const user = this.rootStore.accountStore.solanaWeb3Manager.state.publicKey;
    if (connection == null || provider == null || user == null) {
      throw new Error("Please reconnect your wallet");
    }
    const naziMint = new PublicKey(TOKENS_BY_SYMBOL.NAZI.assetId);
    const address = await getAssociatedTokenAddress(naziMint, user);
    const balance = await connection
      .getTokenAccountBalance(address)
      .catch(() => null);
    this.setBalances({
      [naziMint.toString()]: new BN(balance?.value.amount ?? 0),
    });
  };

  connectPhantom = async () => {
    const { solanaWeb3Manager } = this;
    const wallet = solanaWeb3Manager.wallets.find(
      ({ name }) => name === "Phantom"
    );
    if (wallet == null) return;
    solanaWeb3Manager.setName(wallet.name);
    await new Promise((r) => setTimeout(r, 500));
    await solanaWeb3Manager.connect();
    // if (this.solanaWeb3Manager.state.ready) {
    //   await solanaWeb3Manager.connect();
    // } else {
    //   solanaWeb3Manager.state.wallet?.url != null
    //     ? window.open(solanaWeb3Manager.state.wallet?.url, "_blank")
    //     : toast.info("You need to install Phantom");
    // }
  };

  serialize = (): ISerializedAccountStore => ({});
}

export default AccountStore;
