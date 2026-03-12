import type { PlayerLeavedPayload } from "@tour-de-mot/shared/types";
import type { GameState } from "../types";

export function handlePlayerLeaved(state: GameState, data: PlayerLeavedPayload): GameState {
  return { ...state, players: data.players };
}
