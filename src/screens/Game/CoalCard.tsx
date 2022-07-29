import React, { HTMLAttributes } from "react";
import fireImage from "@assets/fire.gif";
import empty from "@src/assets/solders/empty.png";
import styled from "@emotion/styled";
import { Column } from "@components/Flex";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  fire?: boolean;
}

const Card = styled.img`
  width: 200px;
  height: auto;
`;
const CardContainer = styled.div`
  position: relative;
`;

const Fire = styled.img`
  height: calc(100% + 42px);
  width: calc(100% + 64px);
  position: absolute;
  bottom: -42px;
  right: -32px;
  left: -32px;
  z-index: 10;
`;

const CoalCard: React.FC<IProps> = ({ src, fire, children, ...rest }) => {
  return (
    <CardContainer {...rest}>
      <Card src={src ?? empty} />
      {fire && <Fire src={fireImage} alt="fire" />}
      {children && (
        <Column
          mainAxisSize="stretch"
          crossAxisSize="max"
          style={{
            position: "absolute",
            inset: "0",
            height: "100%",
            padding: 12,
            boxSizing: "border-box",
          }}
          alignItems="center"
          justifyContent="center"
        >
          {children}
        </Column>
      )}
    </CardContainer>
  );
};
export default CoalCard;
