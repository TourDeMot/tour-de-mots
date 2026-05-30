import type { Player } from "@tour-de-mot/shared/types";

export type Game = {
  gameId: string;
  players: Player[];
};

export const initialGameState: Game = {
  gameId: "",
  players: [],
};
