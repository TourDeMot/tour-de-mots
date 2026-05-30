export type SocketData = {
  uuid: string;
  gameId: string | undefined;
};

export type Player = {
  uuid: string;
  pseudo: string;
};

// Generic type
type Message<E extends MessageEvent, D extends MessagePayload> = { event: E; payload: D };
export type MessageEvent = ClientEvent |  ServerEvent | ErrorCode;
export type MessagePayload = NewGamePayload | JoinGamePayload | NewGameOkPayload | JoinGameOkPayload | PlayerLeavedPayload | ServerErrorPayload;
export type ClientMessage = NewGameMessage | JoinGameMessage;
export type ServerMessage = NewGameOkMessage | JoinGameOkMessage | PlayerLeavedMessage | ServerErrorMessage;

// Event
export type ClientEvent = "NEW_GAME" | "JOIN_GAME";
export type ServerEvent = "ERROR" | "NEW_GAME_OK" | "JOIN_GAME_OK" | "PLAYER_LEAVED";
export type ErrorCode =
  | "UNKNOWN_EVENT"
  | "BAD_JSON"
  | "MISSING_UUID"
  | "MISSING_GAME_ID"
  | "GAME_NOT_FOUND"
  | "ALREADY_IN_A_GAME"
  | "GAME_EMPTY";

  export type ServerError = { event: "ERROR"; code: ErrorCode };

// Payload
  export type NewGamePayload = { pseudo: string };
  export type JoinGamePayload = { pseudo: string; gameId: string };
  export type NewGameOkPayload = { gameId: string; players: Player[] };
  export type JoinGameOkPayload = { players: Player[] };
  export type PlayerLeavedPayload = { players: Player[] };
  export type ServerErrorPayload = {code: ErrorCode}

// Client Messages
  export type NewGameMessage = Message<"NEW_GAME", NewGamePayload>;
  export type JoinGameMessage = Message<"JOIN_GAME", JoinGamePayload>;

  // Server Messages
  export type NewGameOkMessage = Message<"NEW_GAME_OK", NewGameOkPayload>;
  export type JoinGameOkMessage = Message<"JOIN_GAME_OK", JoinGameOkPayload>;
  export type PlayerLeavedMessage = Message<"PLAYER_LEAVED", PlayerLeavedPayload>;
  export type ServerErrorMessage = Message<"ERROR", ServerErrorPayload>;

export type ServerEventPayloadMap = {
  "NEW_GAME_OK":   NewGameOkPayload;
  "JOIN_GAME_OK":  JoinGameOkPayload;
  "PLAYER_LEAVED": PlayerLeavedPayload;
};


export type Game = {
  players: Player[];
};
