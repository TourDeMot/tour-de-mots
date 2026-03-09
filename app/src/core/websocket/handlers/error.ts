import type { ErrorCode } from "@ws-poc/shared/types";
import type { GameState } from "../types";

export function handleError(state: GameState, code: ErrorCode): GameState {
  return { ...state, error: code };
}
