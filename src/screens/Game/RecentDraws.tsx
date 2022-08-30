import styled from "@emotion/styled";
import React from "react";
import Text from "@components/Text";
import SizedBox from "@components/SizedBox";
import s1 from "@src/assets/solders/s1.png";
import s2 from "@src/assets/solders/s2.png";
import s3 from "@src/assets/solders/s3.png";
import s4 from "@src/assets/solders/s4.png";
import s5 from "@src/assets/solders/s5.png";
import s6 from "@src/assets/solders/s6.png";
import s7 from "@src/assets/solders/s7.png";
import s8 from "@src/assets/solders/s8.png";
import s9 from "@src/assets/solders/s9.png";
import s10 from "@src/assets/solders/s10.png";
import s11 from "@src/assets/solders/s11.png";
import s12 from "@src/assets/solders/s12.png";
import s13 from "@src/assets/solders/s13.png";
import s14 from "@src/assets/solders/s14.png";
import s15 from "@src/assets/solders/s15.png";
import s16 from "@src/assets/solders/s16.png";
import s17 from "@src/assets/solders/s17.png";
import s18 from "@src/assets/solders/s18.png";
import s19 from "@src/assets/solders/s19.png";
import s20 from "@src/assets/solders/s20.png";

import { observer } from "mobx-react-lite";
import { useStores } from "@stores";
import { TOKENS_BY_SYMBOL } from "@src/tokens";
import InteractButton from "@screens/Game/InteractButton";
import CoalCard from "@screens/Game/CoalCard";
import Spinner from "@components/Spinner";
import Button from "@components/Button";

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

const naziIcons = [
  s20,
  s19,
  s18,
  s17,
  s16,
  s15,
  s14,
  s13,
  s12,
  s11,
  s10,
  s9,
  s8,
  s7,
  s5,
  s4,
  s3,
  s2,
  s6,
  s1,
];

const RecentDraws: React.FC<IProps> = () => {
  const { accountStore, dappStore } = useStores();
  const balance: number | null =
    accountStore.balances[TOKENS_BY_SYMBOL.NAZI.assetId]?.toNumber();
  const length = balance && balance > 20 ? 20 : balance;
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
        {/*if more 20*/}
        {balance != null && balance > 20 && (
          <CoalCard>
            <Text style={{ textAlign: "center" }}>
              And {balance - 20} more...
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
            <Button
              size="medium"
              onClick={() => dappStore.setBuyModalOpened(true)}
            >
              🎫 Buy $NAZI
            </Button>
          </CoalCard>
        )}
      </Container>
      <SizedBox height={24} />
      <InteractButton />
    </Root>
  );
};
export default observer(RecentDraws);
