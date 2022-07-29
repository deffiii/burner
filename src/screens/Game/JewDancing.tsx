import j2 from "@assets/jew2.png";
import j3 from "@assets/jew3.png";
import React, { HTMLAttributes, useEffect, useState } from "react";
import useWindowSize from "@src/hooks/useWindowSize";
import styled from "@emotion/styled";

const Jew = styled.img<{ pos?: boolean }>`
  position: absolute;
  right: -5px;
  transform: ${({ pos }) => (pos ? "scaleX(-1)" : "scaleX(1)")};
  bottom: -2px;
  @media (min-width: 880px) {
    top: 20px;
  }
`;

const JewDancing: React.FC<HTMLAttributes<HTMLImageElement>> = (props) => {
  const { width } = useWindowSize();
  const [v, setV] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setV(!v);
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <Jew src={width && width >= 880 ? j2 : j3} alt="jew" pos={v} {...props} />
  );
};

export default JewDancing;
