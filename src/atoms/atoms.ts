import { atom } from "recoil";

const roomState = atom({
  key: "roomState",
  default: null,
});

const filtersState = atom({
  key: "filtersState",
  default: null,
});

const roomFiltersState = atom({
  key: "roomFiltersState",
  default: null,
});
export { roomState, filtersState, roomFiltersState };
