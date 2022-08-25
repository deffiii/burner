import styled from "@emotion/styled";
import React, { useState } from "react";
import { Row } from "@components/Flex";
import SizedBox from "@components/SizedBox";
import * as identityImg from "identity-img";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores";
import Tooltip from "@components/Tooltip";
import WalletActionsTooltip from "@components/Wallet/WalletActionsTooltip";
import Button from "@components/Button";

interface IProps {}

const Root = styled(Row)`
  align-items: center;
  height: fit-content;
  justify-content: space-between;
  color: #ffffff;
  @media (min-width: 768px) {
    justify-content: flex-end;
  }

  .balances {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

const AddressContainer = styled(Button)<{ expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  .avatar {
    transition: 0.4s;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .menu-arrow {
    transition: 0.4s;
    transform: ${({ expanded }) =>
      expanded ? "rotate(-90deg)" : "rotate(0deg)"};
  }
`;

const LoggedInAccountInfo: React.FC<IProps> = () => {
  const { accountStore } = useStores();
  const { address } = accountStore;
  const avatar = address && identityImg.create(address, { size: 24 * 3 });
  const [accountOpened, setAccountOpened] = useState<boolean>(false);
  return (
    <Root>
      <SizedBox width={24} />
      <Tooltip
        config={{
          placement: "bottom-end",
          trigger: "click",
          onVisibleChange: setAccountOpened,
        }}
        content={<WalletActionsTooltip />}
      >
        <AddressContainer expanded={accountOpened} size="medium">
          <img className="avatar" src={avatar!} alt="avatar" />
          <span>...{address?.slice(-3)}</span>
        </AddressContainer>
      </Tooltip>
    </Root>
  );
};
export default observer(LoggedInAccountInfo);
