import type { Player } from "@tour-de-mot/shared/types";
import type { GameState } from "../types";

export function handlePlayerLeaved(state: GameState, data: { players: Player[] }): GameState {
  return { ...state, players: data.players };
}
