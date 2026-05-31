import type { ErrorPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handleError(state: Game, payload: ErrorPayload): Game {
  console.error("server error:", payload.code);
  return state;
}
