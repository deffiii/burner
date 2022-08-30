import RootStore from "@stores/RootStore";
import { makeAutoObservable } from "mobx";
import { IToken, TOKENS_BY_ASSET_ID, TOKENS_BY_SYMBOL } from "@src/tokens";
import nodeRequest from "@src/utils/nodeRequest";
import { DAPP_ADDRESS, NAZI_MINT_ADDRESS } from "@src/constants";
import dayjs, { Dayjs } from "dayjs";
import { Undefinable } from "tsdef";
import { toast } from "react-toastify";
import BN from "@src/utils/BN";

export interface IFurnaceState {
  id: string;
  finished?: boolean;
  lastBurn?: number;
  lastStoker?: string;
  lifetime: number;
  rewardAmount: number;
  // rewardAssetId: string;
  finishDate?: Dayjs;
  rewardToken?: IToken;
}

const getValueByKey = <T>(
  data: Array<{ key: string; value: string | number | boolean }>,
  key: string
): Undefinable<T> => data.find((v) => key === v.key)?.value as Undefinable<T>;

class DappStore {
  readonly rootStore: RootStore;

  furnace?: IFurnaceState;
  setFurnace = (f: IFurnaceState) => (this.furnace = f);

  claimLoading: boolean = false;
  setClaimLoading = (v: boolean) => (this.claimLoading = v);

  burnLoading: boolean = false;
  setBurnLoading = (v: boolean) => (this.burnLoading = v);

  buyModalOpened: boolean = false;
  setBuyModalOpened = (v: boolean) => (this.buyModalOpened = v);

  get loading() {
    return this.claimLoading || this.burnLoading;
  }

  sameBlock: boolean = false;
  setSameBlock = (v: boolean) => (this.sameBlock = v);

  checkIfSameBlock = async () => {
    const { furnace } = this;
    if (furnace?.lastBurn == null) {
      this.setSameBlock(false);
      return;
    }
    const { height } = await nodeRequest("/blocks/height");
    this.setSameBlock(height === furnace.lastBurn);
  };

  fetchFurnace = async () => {
    const lastIdReq = `/addresses/data/${DAPP_ADDRESS}/global_furnacesAmount`;
    const { value: id } = await nodeRequest(lastIdReq);
    if (id == null) return;
    const dataReq = `/addresses/data/${DAPP_ADDRESS}?matches=furnace_${id}_(.*)`;
    const data: any[] = await nodeRequest(dataReq);
    if (data.length === 0) return;

    const finished = getValueByKey<boolean>(data, `furnace_${id}_finished`);
    const lastBurn = getValueByKey<number>(data, `furnace_${id}_lastBurn`);
    const lastStoker = getValueByKey<string>(data, `furnace_${id}_lastStoker`);
    const lifetime = getValueByKey<number>(data, `furnace_${id}_lifetime`);
    const rewardAmount = getValueByKey(data, `furnace_${id}_rewardAmount`);
    const rewardAssetId = getValueByKey(data, `furnace_${id}_rewardAssetId`);
    const lastBlock = await nodeRequest("/blocks/last");
    const { delay } = await nodeRequest(`/blocks/delay/${lastBlock.id}/1500`);
    const blocksBeforeEnd =
      lastBurn != null ? lastBurn + lifetime! - lastBlock.height : null;
    // console.log(blocksBeforeEnd);
    const finishDate =
      blocksBeforeEnd != null
        ? dayjs(lastBlock.timestamp).add(
            blocksBeforeEnd * delay,
            "milliseconds"
          )
        : undefined;

    const furnace = {
      id,
      finished,
      lastBurn,
      lastStoker,
      lifetime: lifetime as number,
      rewardAmount: rewardAmount as number,
      rewardToken: TOKENS_BY_ASSET_ID[rewardAssetId as string],
      finishDate,
    };
    this.setFurnace(furnace);
  };

  get isLeader() {
    return (
      this.furnace != null &&
      this.rootStore.accountStore.address &&
      this.furnace.lastStoker === this.rootStore.accountStore.address
    );
  }

  get isTimeOver() {
    return (
      !this.loading &&
      this.furnace != null &&
      this.furnace.finishDate != null &&
      this.furnace.lastBurn != null &&
      this.furnace.finishDate.isBefore(dayjs())
    );
  }

  burn = async () => {
    if (this.furnace == null) return;
    await this.rootStore.accountStore.invoke({
      dApp: DAPP_ADDRESS,
      payment: [{ assetId: TOKENS_BY_SYMBOL.NAZI.assetId, amount: "1" }],
      call: {
        function: "burn",
        args: [{ type: "string", value: this.furnace.id.toString() }],
      },
    });
    await Promise.all([
      this.fetchFurnace(),
      this.rootStore.accountStore.fetchNaziBalance(),
    ]);
  };

  claim = async () => {
    if (this.furnace == null) return;
    await this.rootStore.accountStore.invoke({
      dApp: DAPP_ADDRESS,
      payment: [],
      call: {
        function: "claim",
        args: [{ type: "string", value: this.furnace.id.toString() }],
      },
    });
    await this.fetchFurnace();
  };

  mintNazi = async (amount = 1) => {
    const txId = await this.rootStore.accountStore.invoke({
      dApp: NAZI_MINT_ADDRESS,
      payment: [
        {
          assetId: TOKENS_BY_SYMBOL.USDT.assetId,
          amount: new BN(5000000).times(amount).toString(),
        },
      ],
      call: {
        function: "mintNazi",
        args: [{ type: "integer", value: amount.toString() }],
      },
    });
    await this.rootStore.accountStore.fetchNaziBalance();
    toast.success(txId);
  };

  sync = () => Promise.all([this.checkIfSameBlock(), this.fetchFurnace()]);

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.sync();
    setInterval(this.sync, 10 * 1000);
    // when(() => rootStore.accountStore.provider != null, this.fetchFurnace);
  }
}

export default DappStore;
