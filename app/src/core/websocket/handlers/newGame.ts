import type { NewGameOkPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handleNewGameOk(state: Game, payload: NewGameOkPayload): Game {
  return {
    ...state,
    gameId: payload.gameId,
    players: payload.players,
    phase: "LOBBY",
  };
}
