import styled from "@emotion/styled";
import React, { useState } from "react";
import Banner from "./Banner";
import { Column, Row } from "@components/Flex";
import SizedBox from "@components/SizedBox";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import { Anchor } from "@components/Anchor";
import logo from "@assets/icons/logo.svg";
import Button from "@components/Button";
import { useStores } from "@stores";
import centerEllipsis from "@src/utils/centerEllipsis";

interface IProps {}

require("@solana/wallet-adapter-react-ui/styles.css");

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

const MenuItem = styled(Anchor)<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${({ selected }) => (selected ? "#363870" : "#8082c5")};
  box-sizing: border-box;
  border-bottom: 4px solid
    ${({ selected }) => (selected ? "#7075e9" : "transparent")};
  height: 100%;
  margin: 0 12px;

  &:hover {
    border-bottom: 4px solid #c6c9f4;
    color: #7075e9;
  }
`;

const isRoutesEquals = (a: string, b: string) =>
  a.replaceAll("/", "") === b.replaceAll("/", "");

const Header: React.FC<IProps> = () => {
  const { accountStore } = useStores();
  const [bannerClosed, setBannerClosed] = useState(false);
  const location = useLocation();

  const menuItems: Array<{ name: string; link: string }> = [];

  return (
    <Root>
      <Banner closed={bannerClosed} setClosed={setBannerClosed} />

      <TopMenu>
        <Row alignItems="center" crossAxisSize="max">
          <a href="/">
            <img className="logo" src={logo} alt="logo" />
          </a>
          <div>
            <SizedBox width={54} />
            {menuItems.map(({ name, link }) => (
              <MenuItem
                key={name}
                selected={isRoutesEquals(link, location.pathname)}
                href={link}
                target={link !== "https://puzzlemarket.org/" ? "_self" : ""}
              >
                {name}
              </MenuItem>
            ))}
          </div>
        </Row>
        {accountStore.solanaWeb3Manager.state.connected &&
        accountStore.solanaWeb3Manager.state.wallet?.publicKey ? (
          <Button
            size="medium"
            onClick={accountStore.solanaWeb3Manager.disconnect}
            style={{ fontWeight: "600" }}
          >
            {centerEllipsis(
              accountStore.solanaWeb3Manager.state.wallet.publicKey.toString(),
              8
            )}
          </Button>
        ) : (
          <Button size="medium" onClick={accountStore.connectPhantom}>
            Connect wallet
          </Button>
        )}
      </TopMenu>
    </Root>
  );
};
export default observer(Header);
