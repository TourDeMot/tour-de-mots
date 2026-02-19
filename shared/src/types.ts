export type Games = Map<string, Player[]>;

export type Player = {
  uuid: string;
  pseudo: string;
};

export type SocketData = {
  uuid: string;
  gameId: string | undefined;
};

export type ClientEvent = "NEW_GAME" | "JOIN_GAME";
export type ServerEvent = "ERROR" | "NEW_GAME_OK" | "JOIN_GAME_OK";
export type ErrorCode =
  | "UNKNOWN_EVENT"
  | "BAD_JSON"
  | "MISSING_UUID"
  | "MISSING_GAME_ID"
  | "GAME_NOT_FOUND"
  | "ALREADY_IN_A_GAME";

export type NewGameMessage = { event: "NEW_GAME"; pseudo: string };
export type JoinGameMessage = {
  event: "JOIN_GAME";
  pseudo: string;
  gameId: string;
};

export type ClientMessage = NewGameMessage | JoinGameMessage;

export type ServerMessage =
  | { event: "ERROR"; code: ErrorCode }
  | { event: "NEW_GAME_OK"; data: { gameId: string } }
  | { event: "JOIN_GAME_OK"; data: { players: Player[] } }
  | { event: "PLAYER_LEAVED"; data: { players: Player[] } };
