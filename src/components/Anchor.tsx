import React, { AnchorHTMLAttributes } from "react";
import styled from "@emotion/styled";

const Root = styled.a`
  text-decoration: none;
  outline: none;
  color: inherit;
`;

export const Anchor: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  ...rest
}) => (
  <Root rel="noreferrer noopener" target="_blank" {...rest}>
    {children}
  </Root>
);
