import type { PlayerLeavedPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handlePlayerLeaved(
  state: Game,
  payload: PlayerLeavedPayload,
): Game {
  return { ...state, players: payload.players };
}
