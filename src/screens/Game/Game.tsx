import styled from "@emotion/styled";
import React from "react";
import LeaderCard from "@screens/Game/LeaderCard";
import SizedBox from "@components/SizedBox";
import RecentDraws from "@screens/Game/RecentDraws";
import Footer from "@screens/MainPage/Footer";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores";
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

const Game: React.FC<IProps> = observer(() => {
  const { accountStore, dappStore } = useStores();
  const { furnace } = dappStore;
  const [squareRef, { height }] = useElementSize();
  const { width } = useWindowSize();
  // if (dappStore.furnace == null) return <Navigate to={ROUTES.ROOT} />;
  return (
    <Root ref={squareRef}>
      {accountStore.balanceLoading ? (
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
          {dappStore.isTimeOver &&
            dappStore.isLeader &&
            furnace?.rewardAmount != null &&
            !furnace.finished && (
              <Confetti width={width} height={height + 80 + 56} />
            )}
        </>
      )}
    </Root>
  );
});
// const Game = () => {
//   return (
//     <GameVMProvider>
//       <GameImpl />
//     </GameVMProvider>
//   );
// };
export default Game;
