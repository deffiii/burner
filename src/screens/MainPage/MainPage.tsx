import styled from "@emotion/styled";
import React from "react";
import HappyJew from "@screens/MainPage/HappyJew";
import SizedBox from "@components/SizedBox";
import NaziCards from "@screens/MainPage/NaziCards";
import Rules from "./Rules";
import Footer from "@screens/MainPage/Footer";

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
    <Root>
      <Layout>
        <HappyJew />
        <SizedBox height={48} />
        <NaziCards />
        <SizedBox height={48} />
        <Rules />
        <SizedBox height={144} />
      </Layout>
      <Footer />
    </Root>
  );
};
export default MainPage;
