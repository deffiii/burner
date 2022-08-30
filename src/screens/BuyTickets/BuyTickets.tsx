import React, { useState } from "react";
import Dialog from "@components/Dialog";
import { IDialogPropTypes } from "rc-dialog/lib/IDialogPropTypes";
import buyTokensBg from "@assets/buyTockensBg.svg";
import styled from "@emotion/styled";
import Text from "@components/Text";
import { Column } from "@src/components/Flex";
import SizedBox from "@components/SizedBox";
import NumberInput from "@components/NumberInput";
import Button from "@components/Button";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores";

interface IProps extends IDialogPropTypes {}

const Root = styled(Column)`
  width: 100%;
  height: 100%;
  align-items: center;
`;

const bodyStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  background: `url(${buyTokensBg})`,
  zIndex: 1,
};

const BuyTickets: React.FC<IProps> = ({ ...rest }) => {
  const [amount, setAmount] = useState(1);
  const { dappStore } = useStores();
  return (
    <Dialog
      style={{ width: 418 }}
      {...rest}
      bodyStyle={bodyStyle}
      closeIcon={<div />}
    >
      <Root crossAxisSize="max" alignItems="center" style={{ zIndex: 2 }}>
        <Text size="big" fitContent>
          Buy $NAZI Tickets
        </Text>
        <SizedBox height={18} />
        <NumberInput value={amount} setValue={setAmount} />
        <SizedBox height={24} />
        <Button
          style={{ width: 210 }}
          size="big"
          onClick={() => dappStore.mintNazi(amount)}
        >
          Buy
        </Button>
      </Root>
    </Dialog>
  );
};
export default observer(BuyTickets);
