import { atom } from "recoil";

export const playlistState = atom({
  key: "playlistState",
  default: null,
});

export const playlistSongs = atom({
  key: "playlistSongs",
  default: [],
});

export const playlistIdState = atom({
  key: "playlistIdState",
  default: "37i9dQZF1DWYcDQ1hSjOpY",
});
