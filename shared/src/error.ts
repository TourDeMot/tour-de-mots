import type { ErrorCode, ServerError } from "./types";

const newServerError = (code: ErrorCode) =>
  ({ event: "ERROR", code }) as ServerError;

export const GAME_NOT_FOUND = newServerError("GAME_NOT_FOUND");
export const ALREADY_IN_A_GAME = newServerError("ALREADY_IN_A_GAME");
export const GAME_EMPTY = newServerError("GAME_EMPTY");
export const UNKNOWN_EVENT = newServerError("UNKNOWN_EVENT");
export const MISSING_GAME_ID = newServerError("MISSING_GAME_ID");
export const MISSING_UUID = newServerError("MISSING_UUID");
export const BAD_JSON = newServerError("BAD_JSON");
