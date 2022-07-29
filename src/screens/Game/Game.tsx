import styled from "@emotion/styled";
import React from "react";
import LeaderCard from "@screens/Game/LeaderCard";
import SizedBox from "@components/SizedBox";
import RecentDraws from "@screens/Game/RecentDraws";
import Footer from "@screens/MainPage/Footer";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@stores/RootStore";
import { GameVMProvider, useGameVM } from "@screens/Game/GameVM";
import Confetti from "react-confetti";
import useElementSize from "@src/hooks/useElementSize";
import JewDancing from "@screens/Game/JewDancing";
import { Row } from "@src/components/Flex";
import useWindowSize from "@src/hooks/useWindowSize";

interface IProps {}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  box-sizing: border-box;

  padding: 0 16px;
  @media (min-width: 880px) {
    padding: 0 72px;
  }
`;

const GameImpl: React.FC<IProps> = observer(() => {
  const { accountStore } = useStores();
  const vm = useGameVM();
  const [squareRef, { height }] = useElementSize();
  const { width } = useWindowSize();
  if (accountStore.provider == null) return null; //<Navigate to={ROUTES.ROOT} />;
  return (
    <Root ref={squareRef}>
      {accountStore.loading || accountStore.balanceLoading ? (
        <Row
          mainAxisSize="stretch"
          crossAxisSize="max"
          alignItems="center"
          justifyContent="center"
        >
          <JewDancing style={{ position: "unset" }} />
        </Row>
      ) : (
        <>
          <LeaderCard />
          <SizedBox height={40} />
          <RecentDraws />
          <SizedBox height={120} />
          <Footer />
          {vm.isTimeOver &&
            vm.isLeader &&
            vm.state?.rewardAmount != null &&
            vm.state.rewardAmount > 0 && (
              <Confetti width={width} height={height + 80 + 56} />
            )}
        </>
      )}
    </Root>
  );
});
const Game = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (params.id == null) {
    navigate(ROUTES.ROOT);
    return null;
  }
  return (
    <GameVMProvider furnaceAddress={params.id}>
      <GameImpl />
    </GameVMProvider>
  );
};
export default Game;
