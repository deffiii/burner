import RootStore from "@stores/RootStore";
import { makeAutoObservable } from "mobx";
import { BN } from "@project-serum/anchor";
import { IToken, TOKENS_BY_ASSET_ID, TOKENS_BY_SYMBOL } from "@src/tokens";
// import { SLOT_TIME } from "@stores/AccountStore";
import nodeRequest from "@src/utils/nodeRequest";
import { DAPP_ADDRESS } from "@src/constants";
import dayjs, { Dayjs } from "dayjs";
import { Undefinable } from "tsdef";

export interface IFurnaceState {
  id: string;
  finished?: boolean;
  lastBurn?: number;
  lastStoker?: string;
  lifetime: number;
  rewardAmount: number;
  // rewardAssetId: string;
  lastBurnDate?: Dayjs;
  finishDate?: Dayjs;
  rewardToken?: IToken;
}

export const LIFETIME = 5;
export const REWARD_AMOUNT_UNITS = 500;
export const REWARD_AMOUNT = new BN(REWARD_AMOUNT_UNITS).mul(
  new BN(10).pow(new BN(TOKENS_BY_SYMBOL.USDT.decimals))
);

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
    let lastBurnDate;
    let finishDate;
    let lastBurnBlockId;
    if (lastBurn != null) {
      const req = `/blocks/at/${lastBurn}`;
      const { timestamp, id: blockId } = await nodeRequest(req);
      lastBurnBlockId = blockId;
      lastBurnDate = dayjs(timestamp);
    }
    if (lastBurnDate != null && lifetime != null && lastBurnBlockId) {
      const req = `/blocks/delay/${lastBurnBlockId}/${lifetime}`;
      const { delay } = await nodeRequest(req);
      finishDate = lastBurnDate.add(lifetime * delay, "milliseconds");
    }
    this.setFurnace({
      id,
      finished,
      lastBurn,
      lastStoker,
      lifetime: lifetime as number,
      rewardAmount: rewardAmount as number,
      rewardToken: TOKENS_BY_ASSET_ID[rewardAssetId as string],
      lastBurnDate,
      finishDate,
    });
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
    await this.fetchFurnace();
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
