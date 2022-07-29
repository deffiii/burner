import styled from "@emotion/styled";
import React from "react";
import HappyJew from "@screens/MainPage/HappyJew";
import SizedBox from "@components/SizedBox";
import NaziCards from "@screens/MainPage/NaziCards";
import Rules from "./Rules";
import Footer from "@screens/MainPage/Footer";
import EventsTable from "@screens/MainPage/EventsTable";
import { MainPageVMProvider } from "@screens/MainPage/MainPageVM";

interface IProps {}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  @media (min-width: 880px) {
    padding: 0 72px;
  }
`;

const MainPage: React.FC<IProps> = () => {
  return (
    <MainPageVMProvider>
      <Root>
        <Layout>
          <HappyJew />
          <SizedBox height={48} />
          <NaziCards />
          <SizedBox height={48} />
          <Rules />
          <SizedBox height={48} />
          <EventsTable />
          <SizedBox height={144} />
        </Layout>
        <Footer />
      </Root>
    </MainPageVMProvider>
  );
};
export default MainPage;
