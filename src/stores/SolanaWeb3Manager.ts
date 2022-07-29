import {
  BaseSignerWalletAdapter,
  SendTransactionOptions,
  WalletAdapterNetwork,
  WalletName,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletReadyState,
} from "@solana/wallet-adapter-base";
import {
  CoinbaseWalletAdapter,
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  clusterApiUrl,
  Connection,
  ConnectionConfig,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { autorun, makeAutoObservable } from "mobx";
import {
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter,
} from "@solana-mobile/wallet-adapter-mobile";
import { AnchorProvider, Wallet } from "@project-serum/anchor";

type TState = {
  wallet: BaseSignerWalletAdapter | null;
  ready: boolean;
  publicKey: PublicKey | null;
  connected: boolean;
};
// {
// wallet: BaseSignerWalletAdapter | null;
// adapter: ReturnType<Wallet["adapter"]> | null;
// } & Pick<WalletAdapter, "ready" | "publicKey" | "connected">;

type TSignFuncReturnType<T> = ((v: T) => Promise<T>) | undefined;

export class WalletError extends Error {
  public error: any;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(message?: string, error?: any) {
    super(message);
    this.error = error;
  }
}

export class WalletNotSelectedError extends WalletError {
  name = "WalletNotSelectedError";
}

const initialState: TState = {
  wallet: null,
  ready: false,
  publicKey: null,
  connected: false,
};

export default class SolanaWeb3Manager {
  network: WalletAdapterNetwork;
  endpoint: string;
  config: ConnectionConfig = { commitment: "confirmed" };
  // -------------
  connection: Connection;
  name: WalletName | null = null;
  state: TState = initialState;
  connecting = false;
  disconnecting = false;

  setName = (name: WalletName | null): WalletName | null => (this.name = name);
  setState = (state: TState): TState => (this.state = state);
  setConnecting = (v: boolean): boolean => (this.connecting = v);
  setDisconnecting = (v: boolean): boolean => (this.disconnecting = v);

  constructor(network: WalletAdapterNetwork) {
    this.network = network;
    this.endpoint = clusterApiUrl(this.network);
    this.connection = new Connection(this.endpoint, this.config);
    makeAutoObservable(this);

    // When the selected wallet changes, initialize the state
    autorun(() => {
      const { name, walletsByName } = this;
      const wallet = (name && walletsByName[name]) || null;
      if (wallet != null) {
        const { publicKey, connected, readyState } = wallet;
        const ready =
          readyState === WalletReadyState.Installed ||
          readyState === WalletReadyState.Loadable;
        this.setState({ wallet, connected, publicKey, ready });
      } else {
        this.setState(initialState);
      }
    });

    // Setup and teardown event listeners when the adapter changes
    autorun(() => {
      const { wallet } = this.state;
      if (wallet) {
        wallet.addListener("readyStateChange", this.onReady);
        wallet.addListener("connect", this.onConnect);
        wallet.addListener("disconnect", this.onDisconnect);
        wallet.addListener("error", this.onError);
      }
    });

    // If autoConnect is enabled, try to connect when the adapter changes and is ready
    autorun(() => {
      const { setConnecting, setName } = this;
      const { wallet, ready, connected } = this.state;
      if (wallet && ready && !this.connecting && !connected) {
        (async function () {
          setConnecting(true);
          try {
            await wallet.connect();
          } catch (error: any) {
            // Clear the selected wallet
            setName(null);
            // Don't throw error, but onError will still be called
          } finally {
            setConnecting(false);
          }
        })();
      }
    });
  }

  get provider() {
    const wallet = this.walletsByName[this.name ?? ("" as any)];
    if (wallet == null) return null;
    return new AnchorProvider(
      this.connection,
      wallet as unknown as Wallet,
      this.config
    );
  }

  get address(): string | null {
    return this.state.publicKey?.toBase58() ?? null;
  }

  get wallets() {
    const { network } = this;
    return [
      new SolanaMobileWalletAdapter({
        appIdentity: { name: "Solana Wallet Adapter App" },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
      }),
      new CoinbaseWalletAdapter(),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ];
  }

  // Map of wallet names to wallets
  get walletsByName(): Record<WalletName, BaseSignerWalletAdapter> {
    return this.wallets.reduce((walletsByName, wallet) => {
      walletsByName[wallet.name] = wallet;
      return walletsByName;
    }, {} as { [name in WalletName]: BaseSignerWalletAdapter });
  }

  // Select a wallet by name
  select = async (newName: WalletName | null): Promise<void> => {
    if (this.name === newName) return;
    if (this.state.wallet) await this.state.wallet.disconnect();
    this.setName(newName);
  };

  // Handle the adapter's ready event
  onReady = (): TState => this.setState({ ...this.state, ready: true });

  // Handle the adapter's connect event
  onConnect = (): void => {
    if (!this.state.wallet) return;

    const { connected, publicKey, readyState } = this.state.wallet;
    const ready =
      readyState === WalletReadyState.Installed ||
      readyState === WalletReadyState.Loadable;
    this.setState({
      ...this.state,
      connected,
      publicKey,
      ready,
    });
  };

  // Handle the adapter's disconnect event
  onDisconnect = (): WalletName | null => this.setName(null);

  onError = (error: WalletError): void => console.error(error);

  // Connect the adapter to the wallet
  connect = async (): Promise<void> => {
    if (this.connecting || this.disconnecting || this.state.connected) return;

    if (!this.state.wallet) {
      const error = new WalletNotSelectedError();
      this.onError(error);
      throw error;
    }

    if (!this.state.ready) {
      this.setName(null);

      if (typeof window !== "undefined") {
        window.open(this.state.wallet.url, "_blank");
      }

      const error = new WalletNotReadyError();
      this.onError(error);
      throw error;
    }

    this.setConnecting(true);
    try {
      await this.state.wallet.connect();
    } catch (error: any) {
      this.setName(null);
      throw error;
    } finally {
      this.setConnecting(false);
    }
  };

  // Disconnect the adapter from the wallet
  disconnect = async (): Promise<WalletName | null | undefined> => {
    if (this.disconnecting) return;
    if (!this.state.wallet) return this.setName(null);

    this.setDisconnecting(true);
    try {
      await this.state.wallet.disconnect();
    } finally {
      this.setName(null);
      this.setDisconnecting(false);
    }
  };

  // Send a transaction using the provided connection
  sendTransaction = async (
    transaction: Transaction,
    connection: Connection,
    options?: SendTransactionOptions
  ): Promise<string> => {
    if (!this.state.wallet) {
      const error = new WalletNotSelectedError();
      this.onError(error);
      throw error;
    }
    if (!this.state.connected) {
      const error = new WalletNotConnectedError();
      this.onError(error);
      throw error;
    }

    return await this.state.wallet.sendTransaction(
      transaction,
      connection,
      options
    );
  };

  // Sign a transaction if the wallet supports it
  signTransaction = (): TSignFuncReturnType<Transaction> =>
    this.state.wallet && "signTransaction" in this.state.wallet
      ? async (transaction: Transaction): Promise<Transaction> => {
          if (!this.state.connected) {
            const error = new WalletNotConnectedError();
            this.onError(error);
            throw error;
          }

          return await (this.state.wallet as any).signTransaction(transaction);
        }
      : undefined;

  // Sign multiple transactions if the wallet supports it
  signAllTransactions = (): TSignFuncReturnType<Transaction[]> =>
    this.state.wallet && "signAllTransactions" in this.state.wallet
      ? async (transactions: Transaction[]): Promise<Transaction[]> => {
          if (!this.state.connected) {
            const error = new WalletNotConnectedError();
            this.onError(error);
            throw error;
          }

          return await (this.state.wallet as any).signAllTransactions(
            transactions
          );
        }
      : undefined;

  // Sign an arbitrary message if the wallet supports it
  signMessage = (): TSignFuncReturnType<Uint8Array> =>
    this.state.wallet && "signMessage" in this.state.wallet
      ? async (message: Uint8Array): Promise<Uint8Array> => {
          if (!this.state.connected) {
            const error = new WalletNotConnectedError();
            this.onError(error);
            throw error;
          }

          return await (this.state.wallet as any).signMessage(message);
        }
      : undefined;

  // setDefaultChainId = (chainId: CHAIN_ID): void => {};
  //
  // reset = (): void => {};
  //
  // activate = async (connector: AbstractConnector): Promise<void> => {};
  //
  // deactivate = (): void => {};
}
