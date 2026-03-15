import type { NewGameOkPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handleNewGameOk(state: Game, data: NewGameOkPayload): Game {
  return { ...state, gameId: data.gameId, players: data.players };
}
