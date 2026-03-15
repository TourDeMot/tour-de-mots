import type { JoinGameOkPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handleJoinGameOk(state: Game, data: JoinGameOkPayload): Game {
  return { ...state, players: data.players };
}
