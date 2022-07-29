import React from "react";
import { useGameVM } from "@screens/Game/GameVM";
import { useStores } from "@stores";
import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { TOKENS_BY_SYMBOL } from "@src/tokens";
import { toast } from "react-toastify";

const Button = styled.button`
  border: none;
  background: #000000;
  border-radius: 16px;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  padding: 32px;

  cursor: pointer;
  letter-spacing: -0.03em;

  color: #ffffff;
`;

const InteractButton = () => {
  const vm = useGameVM();
  const { accountStore } = useStores();

  const balance: number | null =
    accountStore.balances[TOKENS_BY_SYMBOL.NAZI.assetId]?.toNumber();
  const burn = () => {
    vm.setBurnLoading(true);
    vm.burn()
      .catch((e) => toast.error(e.message ?? e.toString()))
      .finally(() => vm.setBurnLoading(false));
  };
  const claim = () => {
    vm.setClaimLoading(true);
    vm.claim()
      .catch((e) => toast.error(e.message ?? e.toString()))
      .finally(() => vm.setClaimLoading(false));
  };

  if (vm.state == null || vm.state.rewardAmount <= 0 || balance === 0)
    return null;
  if (vm.loading || accountStore.loading || accountStore.balanceLoading) {
    return <Button disabled>Loading...</Button>;
  }
  if (vm.isTimeOver && vm.isLeader) {
    return (
      <Button disabled={vm.loading} onClick={claim}>
        💰 Claim reward
      </Button>
    );
  } else {
    return (
      <Button disabled={vm.loading} onClick={burn}>
        🔥 Burn
      </Button>
    );
  }
};

export default observer(InteractButton);
