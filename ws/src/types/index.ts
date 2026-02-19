export type Games = Map<string, Set<string>>;

export type SocketData = {
  uuid: string;
  gameId: string | undefined;
};

type Event = "NEW_GAME" | "JOIN_GAME";

export type Message = {
  type: Event;
  gameId: string | undefined;
};

export type ErrorResponse = {
  error: string;
};

export type NewGameResponse = {
  gameId: string;
};

export type JoinOrLeaveGameResponse = {
  players: string[];
};
