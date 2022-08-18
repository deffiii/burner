import styled from "@emotion/styled";
import React from "react";
import Text from "@components/Text";
import SizedBox from "@components/SizedBox";
import s1 from "@src/assets/solders/s1.png";
import s2 from "@src/assets/solders/s2.png";
import s3 from "@src/assets/solders/s3.png";
import s4 from "@src/assets/solders/s4.png";
import s5 from "@src/assets/solders/s5.png";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores";
import { TOKENS_BY_SYMBOL } from "@src/tokens";
import InteractButton from "@screens/Game/InteractButton";
import CoalCard from "@screens/Game/CoalCard";
import Spinner from "@components/Spinner";
import Button from "@components/Button";
import { Anchor } from "@components/Anchor";
import { TICKETS_MINT_URL } from "@stores/RootStore";

interface IProps {}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  gap: 20px;
  overflow-y: hidden;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const naziIcons = [s5, s4, s3, s2, s1];

const RecentDraws: React.FC<IProps> = () => {
  const { accountStore, dappStore } = useStores();
  const balance: number | null =
    accountStore.balances[TOKENS_BY_SYMBOL.NAZI.assetId]?.toNumber();
  const length = balance && balance > 5 ? 5 : balance;
  return (
    <Root>
      <Text weight={600} size="big">
        Your nazi {!accountStore.balanceLoading && `(${balance ?? 0})`}
      </Text>
      <SizedBox height={11} />
      <Container>
        {/*loading*/}
        {accountStore.balanceLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <CoalCard key={index}>
              <Spinner />
            </CoalCard>
          ))}
        {/*balance*/}
        {length != null &&
          length > 0 &&
          Array.from({ length })
            .map((_, index) => (
              <CoalCard
                key={index}
                src={naziIcons[index % naziIcons.length]}
                fire={index === length - 1 && dappStore.burnLoading}
              />
            ))
            .reverse()}
        {/*if more 5*/}
        {balance != null && balance > 5 && (
          <CoalCard>
            <Text style={{ textAlign: "center" }}>
              And {balance - 5} more...
            </Text>
          </CoalCard>
        )}
        {/*no coal*/}
        {!accountStore.balanceLoading && balance != null && (
          <CoalCard>
            <Text style={{ textAlign: "center" }}>
              {balance === 0
                ? "You need to buy a $NAZI to play"
                : "Want to buy more NAZI?"}
            </Text>
            <SizedBox height={24} />
            <Anchor href={TICKETS_MINT_URL}>
              <Button size="medium">🎫 Buy $NAZI</Button>
            </Anchor>
          </CoalCard>
        )}
      </Container>
      <SizedBox height={24} />
      <InteractButton />
    </Root>
  );
};
export default observer(RecentDraws);
