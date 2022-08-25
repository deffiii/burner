import styled from "@emotion/styled";
import { Column, Row } from "@src/components/Flex";
import Text from "@src/components/Text";
import React from "react";
import Button from "@components/Button";
import SizedBox from "@components/SizedBox";
import n1 from "@src/assets/n1.png";
import n2 from "@src/assets/n2.png";
import n3 from "@src/assets/n3.png";
import n4 from "@src/assets/n4.png";
import n5 from "@src/assets/n5.png";
import useWindowSize from "@src/hooks/useWindowSize";
import useElementSize from "@src/hooks/useElementSize";
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
const CardsContainer = styled(Row)`
  position: relative;
  min-height: 154px;
  align-items: center;
  @media (min-width: 880px) {
    padding: 70px 0;
  }
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;
const Img = styled.img`
  position: absolute;
  width: 145px;
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
const NaziCards: React.FC<IProps> = () => {
  const { dappStore } = useStores();
  const { width: windowWidth } = useWindowSize();
  const [squareRef, { width }] = useElementSize();
  const cards = [
    { src: n1, smallTop: 1.5, top: 43, left: 1 },
    { src: n2, smallTop: 1.5, top: 20, left: 0.7 },
    { src: n3, smallTop: 1.5, top: 50, left: 1 },
    { src: n4, smallTop: 1.5, top: 20, left: 0.95 },
    { src: n5, smallTop: 1.5, top: 50, left: 0.95 },
  ];

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
        <Row>
          <CardsContainer ref={squareRef}>
            {windowWidth && windowWidth >= 880
              ? cards.map((v, index) => (
                  <Img
                    key={index}
                    src={v.src}
                    style={{
                      zIndex: 2,
                      left: `${(width / 5) * index * 0.95}px`,
                      top: `${v.top}px`,
                    }}
                  />
                ))
              : cards.map((v, index) => (
                  <Img
                    key={index}
                    src={v.src}
                    style={{
                      zIndex: 2,
                      left: `${(width / 5) * index}px`,
                      height: 115,
                      width: "auto",
                    }}
                  />
                ))}
          </CardsContainer>
        </Row>
      </Block>
      <Layout style={{ background: "transparent", width: 400 }}>
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
