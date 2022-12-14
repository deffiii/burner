import { ISerializedRootStore } from "@stores/RootStore";

export const loadState = (): ISerializedRootStore | undefined => {
  try {
    const state = JSON.parse(localStorage.getItem("burner-store") as string);
    return state || undefined;
  } catch (error) {
    // console.dir(error);
    return undefined;
  }
};
export const saveState = (state: ISerializedRootStore): void => {
  localStorage.setItem("burner-store", JSON.stringify(state));
};
