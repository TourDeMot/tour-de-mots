import type { GameStartedPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handleGameStarted(
  state: Game,
  payload: GameStartedPayload,
): Game {
  return { ...state, phase: "PLAYING", mode: payload.mode, prompt: null, stories: [] };
}
