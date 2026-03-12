import type { JoinGameOkPayload } from "@tour-de-mot/shared/types";
import type { GameState } from "../types";

export function handleJoinGameOk(state: GameState, data: JoinGameOkPayload): GameState {
  return { ...state, players: data.players };
}
