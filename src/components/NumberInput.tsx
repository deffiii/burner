import styled from "@emotion/styled";
import React from "react";

interface IProps {
  value: number;
  setValue: (active: number) => void;
}

const Root = styled.div`
  display: flex;
  font-size: 14px;
  &:read-only {
  }
`;

const MinusBtn = styled.button`
  cursor: pointer;
  width: 60px;
  height: 64px;
  box-shadow: none;
  outline: none;
  border: 2px solid #000000;
  background: #ffff;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  border-radius: 16px 0 0 16px;
`;
const PlusBtn = styled(MinusBtn)`
  border-radius: 0 16px 16px 0;
`;
const Input = styled.input`
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  box-sizing: border-box;
  width: 90px;
  height: 64px;
  border-left: none;
  border-right: none;
  border-top: 2px solid #000000;
  border-bottom: 2px solid #000000;
  outline: none;
  text-align: center;
  cursor: default;
`;

const NumberInput: React.FC<IProps> = ({ value, setValue }) => {
  const handleIncrement = () => setValue(value + 1);
  const handleDecrement = () => value > 1 && setValue(value - 1);
  const handleOnChange = (e: any) =>
    !isNaN(+e.target.value) && setValue(+e.target.value);
  return (
    <Root>
      <MinusBtn onClick={handleDecrement}>-</MinusBtn>
      <Input readOnly={true} value={value} onChange={handleOnChange} />
      <PlusBtn onClick={handleIncrement}>+</PlusBtn>
    </Root>
  );
};
export default NumberInput;
