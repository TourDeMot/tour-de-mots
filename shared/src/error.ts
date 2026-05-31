import type { ErrorCode, ServerMessage } from "./types";

const error = (code: ErrorCode): ServerMessage<"ERROR"> => ({
  event: "ERROR",
  payload: { code },
});

export const UNKNOWN_EVENT = error("UNKNOWN_EVENT");
export const BAD_JSON = error("BAD_JSON");
export const MISSING_UUID = error("MISSING_UUID");
export const MISSING_GAME_ID = error("MISSING_GAME_ID");
export const GAME_NOT_FOUND = error("GAME_NOT_FOUND");
export const ALREADY_IN_A_GAME = error("ALREADY_IN_A_GAME");
export const GAME_EMPTY = error("GAME_EMPTY");
export const NOT_IN_GAME = error("NOT_IN_GAME");
export const GAME_ALREADY_STARTED = error("GAME_ALREADY_STARTED");
export const GAME_NOT_STARTED = error("GAME_NOT_STARTED");
export const UNKNOWN_MODE = error("UNKNOWN_MODE");
export const NOT_ENOUGH_PLAYERS = error("NOT_ENOUGH_PLAYERS");
export const ALREADY_SUBMITTED = error("ALREADY_SUBMITTED");
export const EMPTY_SENTENCE = error("EMPTY_SENTENCE");
