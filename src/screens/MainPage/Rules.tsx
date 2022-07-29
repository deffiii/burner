import styled from "@emotion/styled";
import React from "react";
import Text from "@components/Text";
import SizedBox from "@components/SizedBox";
import { Column } from "@components/Flex";

interface IProps {}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #000000;
  border-radius: 16px;
  @media (min-width: 880px) {
    width: 100%;
  }
  padding: 32px;
  position: relative;
`;
const Cards = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 880px) {
    flex-direction: row;
  }
  gap: 21px;
`;

const Num = styled.div`
  bottom: 16px;
  right: 24px;
  position: absolute;
  font-style: normal;
  font-weight: 100;
  font-size: 64px;
  line-height: 77px;
  text-align: center;
  letter-spacing: -0.03em;

  color: #7969ae;
`;
const Rules: React.FC<IProps> = () => {
  const rules = [
    {
      title: "Buy Tickets",
      text: "Each ticket is your chance to win. To buy it, connect your Phantom wallet. You can buy tickets for USDT and SOL. The date and time of start are written on the main page.",
    },
    {
      title: "Keep track of time",
      text: "The timer will start at the appointed time. It will count down the time starting from 20 minutes. To reset the timer, burn the ticket.",
    },
    {
      title: "Burn the ticket",
      text: "When participants burn the ticket, timer resets back to 20 minutes. The participant on whose turn the time runs out wins the lottery.",
    },
  ];
  return (
    <Root>
      <Text size="big" weight={600}>
        How to play
      </Text>
      <SizedBox height={24} />
      <Cards>
        {rules.map(({ title, text }, index) => (
          <Card key={index}>
            <Text fitContent weight={600} size="medium">
              {title}
            </Text>
            <SizedBox height={24} />
            <Text fitContent type="secondary" style={{ maxWidth: 287 }}>
              {text}
            </Text>
            <Num>{index + 1}</Num>
          </Card>
        ))}
      </Cards>
      <SizedBox height={48} />
      <Column alignItems="center" crossAxisSize={"max"}>
        <Text size="big" weight={600} fitContent>
          Prize Funds
        </Text>
        <SizedBox height={16} />
        <Text
          type="secondary"
          size="medium"
          weight={400}
          textAlign="center"
          style={{ maxWidth: 858 }}
        >
          Any participant can create a lottery. To do this, he can make a
          deposit with the required amount and lock the prize fund in smart
          contract. After that, he sets the date and time for the start of the
          lottery. When the deposit is received in the smart contract, the
          lottery appears on the main page. In progress.
        </Text>
      </Column>
    </Root>
  );
};
export default Rules;
