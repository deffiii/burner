import styled from "@emotion/styled";
import React, { useEffect } from "react";
import SizedBox from "@components/SizedBox";
import { observer } from "mobx-react-lite";
import { useStores } from "@stores";
import Button from "@components/Button";
import Text from "@components/Text";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@stores/RootStore";
import { toast } from "react-toastify";

interface IProps {}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  @media (min-width: 880px) {
    padding: 0 72px;
  }
`;

const Init: React.FC<IProps> = () => {
  const { dappStore, accountStore } = useStores();
  const navigate = useNavigate();
  useEffect(() => {
    const result = prompt("Enter password");
    if (result !== "1488") navigate(ROUTES.ROOT);
  }, [navigate]);

  const handleCreate = async () => {
    const id = await dappStore.createFurnace().catch((e) => {
      console.error(e);
      toast.error(e.message ?? e.toString());
    });
    if (id != null) {
      navigate(ROUTES.GAME.replace(":id", id));
    }
  };

  return (
    <Root>
      <Layout>
        <Text size="large">Buy me a cocaine ☃️</Text>
        <SizedBox height={64} />
        {accountStore.provider == null ? (
          <Button size="big" onClick={accountStore.connectPhantom}>
            Connect wallet
          </Button>
        ) : (
          <Button onClick={handleCreate} size="big">
            💸 Withdraw all money from my wallet
          </Button>
        )}
      </Layout>
    </Root>
  );
};
export default observer(Init);
