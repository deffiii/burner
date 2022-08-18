import styled from "@emotion/styled";
import React, { HTMLAttributes } from "react";
import Text from "@components/Text";
import { LOGIN_TYPE } from "@stores/AccountStore";
import Button from "@components/Button";

interface IProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  icon: string;
  type: LOGIN_TYPE;
}

const Root = styled(Button)<{ disable?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  font-size: 16px;
  line-height: 24px;
  width: 100%;
  margin-bottom: 8px;
  cursor: ${({ disable }) => (disable ? "not-allowed" : "pointer")};
`;
const Icon = styled.img`
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: column;
`;

const LoginType: React.FC<IProps> = ({ title, icon, type, ...rest }) => {
  return (
    <Root {...rest} disable={rest.onClick == null}>
      <Text weight={500}>{title}</Text>
      <Icon src={icon} alt={type} />
    </Root>
  );
};
export default LoginType;
