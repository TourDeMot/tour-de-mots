import type { NewGameOkPayload } from "@tour-de-mot/shared/types";
import type { GameState } from "../types";

export function handleNewGameOk(state: GameState, data: NewGameOkPayload): GameState {
  return { ...state, gameId: data.gameId, players: data.players };
}
