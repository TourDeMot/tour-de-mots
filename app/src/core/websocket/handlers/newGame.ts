import type { Player } from "@ws-poc/shared/types";
import type { GameState } from "../types";

export function handleNewGameOk(state: GameState, data: { gameId: string; players: Player[] }): GameState {
  return { ...state, code: data.gameId, players: data.players };
}
