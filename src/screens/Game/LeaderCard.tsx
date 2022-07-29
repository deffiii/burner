import styled from "@emotion/styled";
import { Column, Row } from "@src/components/Flex";
import React from "react";
import Text from "@components/Text";
import SizedBox from "@components/SizedBox";
import clock from "@src/assets/icons/clock.svg";
import leader from "@src/assets/icons/leader.svg";
import coins from "@src/assets/icons/coins.svg";
import { observer } from "mobx-react-lite";
import { useGameVM } from "@screens/Game/GameVM";
import { TOKENS_BY_ASSET_ID } from "@src/tokens";
import centerEllipsis from "@src/utils/centerEllipsis";
import JewDancing from "@screens/Game/JewDancing";
import CustomCountdown from "@components/CustomCountdown";

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
  const vm = useGameVM();
  if (vm.state == null) return null;
  const rewardTok = TOKENS_BY_ASSET_ID[vm.state.rewardMint.toString()];
  const amount = vm.state.rewardAmount; //* Math.pow(10, -rewardTok.decimals);
  return (
    <Root>
      <Details>
        <Column>
          <Time>
            {vm.state.finishDate && vm.state.lastBurn.toNumber() > 0 ? (
              <CustomCountdown date={vm.state.finishDate?.toDate()} />
            ) : (
              "–"
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
            {vm.state.lastStoker.toString() ===
            "11111111111111111111111111111111"
              ? "–"
              : centerEllipsis(vm.state.lastStoker.toString(), 6)}
          </Address>
          <Row alignItems="center">
            <img src={leader} alt="leader" />
            <SizedBox width={8} />
            <Text weight={600} size="medium">
              Leader&nbsp;
              {vm.isLeader && " (You 🎖)"}
            </Text>
          </Row>
        </Column>
      </Details>
      <Dancing>
        {vm.isTimeOver && vm.isLeader && vm.state.rewardAmount > 0 && (
          <Reward weight={600}>YOU WON</Reward>
        )}
        <Reward weight={600}>
          {amount} {rewardTok.symbol}
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
