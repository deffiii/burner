import styled from "@emotion/styled";
import { Column, Row } from "@src/components/Flex";
import React from "react";
import Text from "@components/Text";
import SizedBox from "@components/SizedBox";
import clock from "@src/assets/icons/clock.svg";
import leader from "@src/assets/icons/leader.svg";
import coins from "@src/assets/icons/coins.svg";
import { observer } from "mobx-react-lite";
import centerEllipsis from "@src/utils/centerEllipsis";
import JewDancing from "@screens/Game/JewDancing";
import CustomCountdown from "@components/CustomCountdown";
import { useStores } from "@stores";
import BN from "@src/utils/BN";

interface IProps {}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #000000;
  border-radius: 16px;
  box-sizing: border-box;
  width: 100%;
  @media (min-width: 880px) {
    flex-direction: row;
  }
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  border-bottom: 1px solid #000000;
  box-sizing: border-box;
  @media (min-width: 880px) {
    justify-content: flex-start;
    align-items: flex-start;
    //padding: 32px 60px;
    border-bottom: none;
    border-right: 1px solid #000000;
    min-width: fit-content;
    flex: 1;
  }
`;
const Dancing = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  //padding: 10px 40px;
  padding: 32px;
  position: relative;
  min-height: 150px;
  @media (min-width: 880px) {
    //padding: 53px;
    justify-content: flex-start;
    min-height: 350px;
    flex: 2;
  }
`;

const Time = styled(Text)`
  font-size: 32px;
  line-height: 90.02%;
  text-align: center;
  @media (min-width: 880px) {
    text-align: left;
    font-size: 64px;
    line-height: 77px;
    letter-spacing: -0.06em;
  }
`;
const Address = styled(Text)`
  font-size: 32px;
  line-height: 90.02%;
  text-align: center;
  @media (min-width: 880px) {
    text-align: left;
    font-size: 64px;
    line-height: 77px;
    letter-spacing: -0.06em;
  }
`;
const Reward = styled(Address)`
  text-align: left;
`;

const LeaderCard: React.FC<IProps> = () => {
  const { dappStore } = useStores();
  const { furnace } = dappStore;
  const rewardTok = dappStore.furnace?.rewardToken;
  const amount = BN.formatUnits(
    furnace?.rewardAmount ?? 0,
    furnace?.rewardToken?.decimals
  ).toFormat(0);
  return (
    <Root>
      <Details>
        <Column>
          <Time>
            {furnace?.finishDate && furnace.lastBurn != null ? (
              <CustomCountdown date={furnace.finishDate.toDate()} />
            ) : (
              "Not started"
            )}
          </Time>
          <SizedBox height={8} />
          <Row alignItems="center">
            <img src={clock} alt="clock" />
            <SizedBox width={8} />
            <Text weight={600} size="medium">
              Time left
            </Text>
          </Row>
        </Column>
        <SizedBox height={34} />
        <Column>
          <Address weight={600}>
            {furnace?.lastStoker == null
              ? "–"
              : centerEllipsis(furnace.lastStoker.toString(), 6)}
          </Address>
          <Row alignItems="center">
            <img src={leader} alt="leader" />
            <SizedBox width={8} />
            <Text weight={600} size="medium">
              Leader&nbsp;
              {dappStore.isLeader && " (You 🎖)"}
            </Text>
          </Row>
        </Column>
      </Details>
      <Dancing>
        {dappStore.isTimeOver && dappStore.isLeader && (
          <Reward weight={600}>YOU WON</Reward>
        )}
        <Reward weight={600}>
          {amount} {rewardTok?.symbol}
        </Reward>
        <Row alignItems="center">
          <img src={coins} alt="leader" />
          <SizedBox width={8} />
          <Text weight={600} size="medium">
            Prize
          </Text>
        </Row>
        <JewDancing />
      </Dancing>
    </Root>
  );
};

export default observer(LeaderCard);
