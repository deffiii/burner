import styled from "@emotion/styled";
import React from "react";
import Text from "@src/components/Text";
import centerEllipsis from "@src/utils/centerEllipsis";

interface IProps {
  address?: string;
}

const Root = styled.div`
  position: absolute;
  bottom: 0;

  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;

  margin: -32px;
  padding: 32px 16px;

  & > * {
    margin-bottom: 8px;
  }

  @media (min-width: 880px) {
    align-items: center;
    flex-direction: row;
    padding: 41px 72px;
  }

  background: #000000;
`;

const Footer: React.FC<IProps> = ({ address }) => {
  return (
    <Root>
      <Text fitContent size="small" type="secondary">
        Naziburner Lottery &nbsp; {address ? centerEllipsis(address, 6) : ""}
      </Text>
      <Text fitContent size="small" type="secondary">
        © All Rights Reserved
      </Text>
    </Root>
  );
};
export default Footer;
