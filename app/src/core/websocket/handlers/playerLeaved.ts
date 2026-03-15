import type { PlayerLeavedPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handlePlayerLeaved(state: Game, data: PlayerLeavedPayload): Game {
  return { ...state, players: data.players };
}
