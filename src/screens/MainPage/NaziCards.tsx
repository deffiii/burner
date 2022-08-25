import styled from "@emotion/styled";
import { Column, Row } from "@src/components/Flex";
import Text from "@src/components/Text";
import React from "react";
import Button from "@components/Button";
import SizedBox from "@components/SizedBox";
import naziTeam from "@src/assets/naziGroup.png";
import useWindowSize from "@src/hooks/useWindowSize";
import { observer } from "mobx-react-lite";
import clock from "@src/assets/icons/clock.svg";
import CustomCountdown from "@components/CustomCountdown";
import dayjs from "dayjs";
import { useStores } from "@stores";

interface IProps {}

const Layout = styled.div`
  padding: 24px 32px;
  box-sizing: border-box;
  @media (min-width: 880px) {
    padding: 40px 64px;
  }
`;
const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #000000;
  border-radius: 16px;
  width: 100%;
  @media (min-width: 880px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
`;

const Title = styled(Text)`
  font-weight: 600;
  font-size: 24px;
  line-height: 130%;
  white-space: pre-wrap;
  text-align: center;
  @media (min-width: 880px) {
    font-weight: 600;
    font-size: 32px;
    line-height: 130%;
    white-space: nowrap;
    text-align: start;
  }
`;
const Subtitle = styled(Text)`
  text-align: center;
  font-weight: 600;
  font-size: 32px;
  line-height: 90.02%;
  @media (min-width: 880px) {
    font-weight: 600;
    font-size: 44px;
    line-height: 58px;
    text-align: start;
  }
`;
const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (min-width: 880px) {
    //flex-direction: column;
  }
`;

const NaziTeamImg = styled.img`
  max-width: calc(100vw - 32px);
  @media (min-width: 880px) {
    max-width: 450px;
  }
  @media (min-width: 980px) {
    max-width: 530px;
  }
  @media (min-width: 1170px) {
    max-width: 730px;
  }
`;

const NaziCards: React.FC<IProps> = () => {
  const { dappStore } = useStores();
  const { width: windowWidth } = useWindowSize();

  const nextLotteryDate = (dayjs() as any)
    .tz("Europe/Moscow")
    .set("hours", 12)
    .set("minutes", 0)
    .set("seconds", 0)
    .set("milliseconds", 0)
    .weekday(dayjs().day() > 3 ? 10 : 3)
    .toDate();
  return (
    <Root>
      <Block>
        <Layout>
          <Column crossAxisSize="max" mainAxisSize="stretch">
            <Title weight={600}>{`Buy $NAZI for 5 USDT`}</Title>
            <SizedBox height={6} />
          </Column>
        </Layout>
        <NaziTeamImg src={naziTeam} />
      </Block>
      <Layout
        style={{
          background: "transparent",
          width: windowWidth && windowWidth >= 880 ? 400 : "auto",
        }}
      >
        <Column alignItems="center" crossAxisSize="max">
          <SizedBox height={8} />
          <Subtitle style={{ zIndex: 1 }}>
            <CustomCountdown date={nextLotteryDate} />
          </Subtitle>
          <SizedBox height={10} />
          <Row alignItems="center">
            <img src={clock} alt="clock" />
            <SizedBox width={8} />
            <Text size="medium">Untill the draw</Text>
          </Row>
          <SizedBox height={24} />
          <Button
            style={{ width: "100%" }}
            size="big"
            onClick={dappStore.mintNazi}
          >
            Buy $NAZI
          </Button>
        </Column>
      </Layout>
    </Root>
  );
};
export default observer(NaziCards);
