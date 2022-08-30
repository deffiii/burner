import styled from "@emotion/styled";
import React from "react";
import Text from "@components/Text";
import Button from "@components/Button";
import { Column } from "@src/components/Flex";
import SizedBox from "@components/SizedBox";
import jew from "@src/assets/jew1.png";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@stores/RootStore";
import { useStores } from "@stores";
import BN from "@src/utils/BN";

interface IProps {}

const Root = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  background: #f3f3f3;
  border: 1px solid #000000;
  border-radius: 16px;
  width: 100%;
  padding: 40px 53px;
  min-height: 448px;
  overflow: hidden;

  @media (min-width: 880px) {
    flex-direction: row;
    padding: 64px 60px;
    align-items: flex-start;
  }
  position: relative;
`;
const Jew = styled.img`
  position: absolute;
  bottom: -2px;

  height: 251px;
  width: auto;
  @media (min-width: 880px) {
    bottom: -2px;
    min-height: 416px;
    right: 50px;
  }
`;
const Title = styled(Text)`
  font-weight: 600;
  font-size: 32px;
  line-height: 90.02%;
  @media (min-width: 880px) {
    font-size: 64px;
    line-height: 58px;
  }
`;
const Block = styled(Column)`
  justify-content: space-between;
  align-items: center;
  @media (min-width: 880px) {
    align-items: flex-start;
    justify-content: flex-start;
  }
`;

//todo
const HappyJew: React.FC<IProps> = () => {
  const { dappStore } = useStores();
  const { furnace } = dappStore;
  const navigate = useNavigate();
  return (
    <Root>
      <Block>
        {furnace && furnace.rewardToken ? (
          <Title weight={600}>
            500 USDT Prize.
            {/*{BN.formatUnits(*/}
            {/*  furnace.rewardAmount,*/}
            {/*  furnace.rewardToken.decimals*/}
            {/*).toFormat(0)}{" "}*/}
            {/*{furnace.rewardToken.symbol} Prize.*/}
          </Title>
        ) : (
          <Title weight={600}>Loading....</Title>
        )}
        <SizedBox height={24} />
        <Button size="big" onClick={() => dappStore.setBuyModalOpened(true)}>
          Buy $NAZI
        </Button>
        {/*{furnace != null && (*/}
        {/*  <Button size="big" onClick={() => navigate(ROUTES.GAME)}>*/}
        {/*    🔥 Play now*/}
        {/*  </Button>*/}
        {/*)}*/}
      </Block>
      <Jew src={jew} alt="jew" />
    </Root>
  );
};
export default observer(HappyJew);
