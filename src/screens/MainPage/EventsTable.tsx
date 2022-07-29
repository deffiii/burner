import styled from "@emotion/styled";
import centerEllipsis from "@src/utils/centerEllipsis";
import { observer } from "mobx-react-lite";
import { Column } from "@src/components/Flex";
import Text from "@components/Text";
import SizedBox from "@components/SizedBox";
import React from "react";
import { TOKENS_BY_ASSET_ID } from "@src/tokens";
import { ROUTES } from "@stores/RootStore";
import { useNavigate } from "react-router-dom";
import { useMainPageVM } from "@screens/MainPage/MainPageVM";

const Table = styled.table`
  width: 100%;
  & {
    border: 1px solid #000;
    border-radius: 13px;
    border-spacing: 0;
  }
  & td,
  & th {
    text-align: left;
    border-bottom: 1px solid #000;
    padding: 10px;
  }
  & tr:last-child > td {
    border-bottom: none;
  }
`;

const EventsTable = () => {
  const vm = useMainPageVM();
  const navigate = useNavigate();
  if (vm.furnaces.length === 0) return null;
  return (
    <Column alignItems="center" crossAxisSize="max">
      <Text style={{ textAlign: "center" }} size="big" weight={600}>
        Fomos
      </Text>
      <SizedBox height={24} />
      <Table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Reward</th>
            <th>Finish at</th>
          </tr>
        </thead>
        <tbody>
          {vm.furnaces.map((f, i) => (
            <tr
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(ROUTES.GAME.replace(":id", f.publicKey.toString()))
              }
            >
              <td>{centerEllipsis(f.publicKey, 6)}</td>
              <td>
                {f.account.rewardAmount}&nbsp;
                {TOKENS_BY_ASSET_ID[f.account.rewardMint.toString()].symbol}
              </td>
              <td>
                {f.account.finishDate && f.account.lastBurn.toNumber() > 0
                  ? f.account.finishDate.format("MMMM D, YYYY HH:mm:ss")
                  : "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Column>
  );
};

export default observer(EventsTable);
