import type { ErrorCode } from "@tour-de-mot/shared/types";
import type { GameState } from "../types";

export function handleError(state: GameState, code: ErrorCode): GameState {
  return { ...state};
}
