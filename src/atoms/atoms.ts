import { atom } from "recoil";

const roomState = atom({
  key: "roomState",
  default: null,
});

const filtersState = atom({
  key: "filtersState",
  default: null,
});

export { roomState, filtersState };
