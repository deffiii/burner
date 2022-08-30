import React, { FC } from "react";
import { Column } from "@components/Flex";
import styled from "@emotion/styled";
import Header from "@components/Header";
import { observer } from "mobx-react-lite";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "@stores/RootStore";
import MainPage from "@screens/MainPage";
import Game from "@screens/Game";
import SizedBox from "@components/SizedBox";
import { ToastContainer } from "react-toastify";
import BuyTickets from "@screens/BuyTickets";
import { useStores } from "@stores";

const Root = styled(Column)`
  width: 100%;
  align-items: center;
  background: #cdbffa;
  min-height: 100vh;
  position: relative;
`;

const Body = styled(Column)`
  width: 100%;
  max-width: calc(1440px - 144px);
  margin: 0 72px;
  align-items: center;
`;

const App: FC = () => {
  const { dappStore } = useStores();
  return (
    <Root>
      <Header />
      <SizedBox height={48} />
      <Body>
        <Routes>
          <Route path={ROUTES.ROOT} element={<MainPage />} />
          <Route path={ROUTES.GAME} element={<Game />} />
          <Route path="*" element={<Navigate to={ROUTES.ROOT} />} />
        </Routes>
      </Body>
      <BuyTickets
        visible={dappStore.buyModalOpened}
        onClose={() => dappStore.setBuyModalOpened(false)}
      />
      <ToastContainer />
    </Root>
  );
};

export default observer(App);
