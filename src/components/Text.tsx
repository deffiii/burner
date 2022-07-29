import styled from "@emotion/styled";

type TTextType = "primary" | "secondary";
type TTextSize = "small" | "medium" | "large" | "big";
type TTextAlign = "center" | "left" | "right" | "justify";

const Text = styled.div<{
  type?: TTextType;
  weight?: 400 | 500 | 600;
  size?: TTextSize;
  fitContent?: boolean;
  nowrap?: boolean;
  textAlign?: TTextAlign;
}>`
  width: ${({ fitContent }) => (fitContent ? "fit-content" : "100%")};
  font-weight: ${({ weight }) => weight ?? 600};
  white-space: ${({ nowrap }) => (nowrap ? "nowrap" : "unset")};
  text-align: ${({ textAlign }) => textAlign ?? "default"};
  ${({ type }) =>
    (() => {
      switch (type) {
        case "primary":
          return "color: #363870;";
        case "secondary":
          return "color: #7969AE;";
        default:
          return "color: #000;";
      }
    })()}
  ${({ size }) =>
    (() => {
      switch (size) {
        case "large":
          return "font-size: 64px; line-height: 58px;";
        case "big":
          return "font-size: 32px; line-height: 130%;";
        case "medium":
          return "font-size: 24px; line-height: 29px;";
        case "small":
          return "font-size: 12px; line-height: 15px;";
        default:
          // return "font-size: 16px; line-height: 24px;";
          return "font-size: 18px; line-height: 120%;";
      }
    })()}
`;

export default Text;
