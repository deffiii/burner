import React, { PropsWithChildren, useMemo } from "react";
import { useVM } from "@src/hooks/useVM";
import { makeAutoObservable } from "mobx";
import { RootStore, useStores } from "@stores";

const ctx = React.createContext<MainPageVM | null>(null);

export const MainPageVMProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const rootStore = useStores();
  const store = useMemo(() => new MainPageVM(rootStore), [rootStore]);
  return <ctx.Provider value={store}>{children}</ctx.Provider>;
};

export const useMainPageVM = () => useVM(ctx);

class MainPageVM {
  public rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
}
