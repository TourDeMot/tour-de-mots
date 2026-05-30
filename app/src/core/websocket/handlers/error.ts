import type { ErrorCode } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handleError(state: Game, code: ErrorCode): Game {
  return { ...state};
}
