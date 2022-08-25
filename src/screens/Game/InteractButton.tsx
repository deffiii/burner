import React from "react";
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
  const { accountStore, dappStore } = useStores();
  const furnace = dappStore.furnace;
  const burn = () => {
    dappStore.setBurnLoading(true);
    dappStore
      .burn()
      .catch((e) => toast.error(e.message ?? e.toString()))
      .finally(() => dappStore.setBurnLoading(false));
  };
  const claim = () => {
    dappStore.setClaimLoading(true);
    dappStore
      .claim()
      .catch((e) => toast.error(e.message ?? e.toString()))
      .finally(() => dappStore.setClaimLoading(false));
  };
  if (furnace == null || furnace.finished) return null;
  if (dappStore.loading || accountStore.balanceLoading) {
    return <Button disabled>Loading...</Button>;
  }
  if (dappStore.isTimeOver && dappStore.isLeader) {
    return (
      <Button disabled={dappStore.loading} onClick={claim}>
        💰 Claim reward
      </Button>
    );
  } else if (dappStore.sameBlock) {
    return <Button disabled>⏳ You should wait for next block</Button>;
  } else {
    return !dappStore.isTimeOver ? (
      <Button disabled={dappStore.loading} onClick={burn}>
        {furnace.lastBurn == null ? "🔥 Burn first" : "🔥 Burn"}
      </Button>
    ) : null;
  }
};

export default observer(InteractButton);
