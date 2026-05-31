import type { GameFinishedPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handleGameFinished(
  state: Game,
  payload: GameFinishedPayload,
): Game {
  return { ...state, phase: "FINISHED", prompt: null, stories: payload.stories };
}
