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
import Init from "@screens/Init";
import { ToastContainer } from "react-toastify";

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
  return (
    <Root>
      <Header />
      <SizedBox height={48} />
      <Body>
        <Routes>
          <Route path={ROUTES.ROOT} element={<MainPage />} />
          <Route path={ROUTES.GAME} element={<Game />} />
          <Route path={ROUTES.INIT} element={<Init />} />
          <Route path="*" element={<Navigate to={ROUTES.ROOT} />} />
        </Routes>
      </Body>
      <ToastContainer />
    </Root>
  );
};

export default observer(App);
