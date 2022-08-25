import styled from "@emotion/styled";
import React from "react";
import Text from "@components/Text";
import SizedBox from "@components/SizedBox";
import { Column } from "@components/Flex";
import { Anchor } from "@components/Anchor";

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
      text: "Each ticket is your chance to win. To buy it, connect your wallet. You can buy ticket for 5 USDT. The date and time of start are written on the main page.",
    },
    {
      title: "Keep track of time",
      text: "The timer will start at the appointed time. It will count down the time starting from 20 minutes. To reset the timer, burn the ticket.",
    },
    {
      title: "Burn the ticket",
      text: "When participants burn the ticket, timer resets back to 20 minutes. The participant on whose turn the time runs out wins the lottery.\n",
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
          Now the prize fund is formed by the Naziburner team. We block the
          deposit in the smart contract and set the date for the launch of the
          lottery. After that, the contract works completely decentralized.
          Later we will add a feature so that any user can create their own
          lottery with their own prize pool and start date. Follow the news in
          &nbsp;
          <Anchor
            style={{ color: "#000", textDecoration: "underline" }}
            href="https://t.me/NAZIBURNER"
          >
            our Telegram community
          </Anchor>
          .
        </Text>
      </Column>
      <SizedBox height={48} />
      <Column alignItems="center" crossAxisSize={"max"}>
        <Text size="big" weight={600} fitContent>
          Important
        </Text>
        <SizedBox height={16} />
        <Text
          type="secondary"
          size="medium"
          weight={400}
          textAlign="center"
          style={{ maxWidth: 858 }}
        >
          Naziburner is a decentralized lottery based on the Waves blockchain.
          The countdown time is measured in blocks. Each block is closed on
          average in 60 seconds, but there may be a small calculation error.
          Additionally, you’ll need to confirm the transaction and pay the gas
          fee in WAVES. This may take some time. Also, you need to have some
          Waves on your wallet balance to pay gas fees. Remember this when
          choosing a moment to burn your ticket.
        </Text>
      </Column>
    </Root>
  );
};
export default Rules;
