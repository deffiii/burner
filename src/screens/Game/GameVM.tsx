import React, { PropsWithChildren, useMemo } from "react";
import { useVM } from "@src/hooks/useVM";
import { makeAutoObservable } from "mobx";
import { RootStore, useStores } from "@stores";

const ctx = React.createContext<GameVM | null>(null);

export const GameVMProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const rootStore = useStores();
  const store = useMemo(() => new GameVM(rootStore), [rootStore]);
  return <ctx.Provider value={store}>{children}</ctx.Provider>;
};

export const useGameVM = () => useVM(ctx);

class GameVM {
  public rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
}
