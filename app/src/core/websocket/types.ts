import type { Player, ErrorCode } from "@tour-de-mot/shared/types";

export type GameState = {
  gameId: string;
  players: Player[];
};

export const initialGameState: GameState = {
  gameId: "",
  players: [],
};
