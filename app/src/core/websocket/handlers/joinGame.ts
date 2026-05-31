import type { JoinGameOkPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handleJoinGameOk(state: Game, payload: JoinGameOkPayload): Game {
  return { ...state, gameId: payload.gameId, players: payload.players };
}
