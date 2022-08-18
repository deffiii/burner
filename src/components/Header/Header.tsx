import styled from "@emotion/styled";
import React, { useState } from "react";
import Banner from "./Banner";
import { Column, Row } from "@components/Flex";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import logo from "@assets/icons/logo.svg";
import { useStores } from "@stores";
import centerEllipsis from "@src/utils/centerEllipsis";
import Button from "@components/Button";
import { LOGIN_TYPE } from "@stores/AccountStore";

interface IProps {}

const Root = styled(Column)`
  width: 100%;
  background: #fff;
  align-items: center;
  z-index: 102;
  box-shadow: 0 8px 56px rgba(54, 56, 112, 0.16);

  //todo check
  a {
    text-decoration: none;
  }

  .wallet-adapter-button {
    height: 40px;
    white-space: nowrap;
    background: rgb(189, 151, 228);
  }
`;

const TopMenu = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 0 16px;
  max-width: 1440px;
  z-index: 102;
  @media (min-width: 880px) {
    height: 80px;
  }
  box-sizing: border-box;
  background: #ffffff;

  .logo {
    height: 30px;
    @media (min-width: 880px) {
      height: 36px;
    }
  }

  .icon {
    cursor: pointer;
  }
`;

//todo add signer login
const Header: React.FC<IProps> = () => {
  const { accountStore } = useStores();
  const [bannerClosed, setBannerClosed] = useState(false);

  return (
    <Root>
      <Banner closed={bannerClosed} setClosed={setBannerClosed} />

      <TopMenu>
        <Row alignItems="center" crossAxisSize="max">
          <a href="/">
            <img className="logo" src={logo} alt="logo" />
          </a>
        </Row>
        {accountStore.address != null ? (
          <Button
            size="medium"
            onClick={accountStore.logout}
            style={{ fontWeight: "600" }}
          >
            {centerEllipsis(accountStore.address, 8)}
          </Button>
        ) : (
          <Button
            size="medium"
            onClick={() => accountStore.login(LOGIN_TYPE.KEEPER)}
          >
            Connect wallet
          </Button>
        )}
      </TopMenu>
    </Root>
  );
};
export default observer(Header);
