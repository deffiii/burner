import styled from "@emotion/styled";

type TButtonSize = "medium" | "big";

const Button = styled.button<{
  size?: TButtonSize;
  fixed?: boolean;
}>`
  background: #f090b4;
  color: #000 !important;
  border-radius: 32px;
  white-space: nowrap;
  border: none;
  outline: none;
  ${({ size }) =>
    (() => {
      switch (size) {
        case "medium":
          return "padding: 0 20px; height: 36px; font-size: 16px; line-height: 19px;";
        case "big":
          return "padding: 13px 32px; font-weight: 600; font-size: 24px;  line-height: 29px;";
        default:
          return "padding: 13px 32px; height: 56px;";
      }
    })()}
  :hover {
    cursor: pointer;
  }

  :disabled {
    cursor: not-allowed;
  }
`;

export default Button;
