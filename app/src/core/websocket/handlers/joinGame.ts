import type { Player } from "@ws-poc/shared/types";
import type { GameState } from "../types";

export function handleJoinGameOk(state: GameState, data: { players: Player[] }): GameState {
  return { ...state, players: data.players };
}
