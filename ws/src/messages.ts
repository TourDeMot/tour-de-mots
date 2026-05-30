interface ClientEventPayload {
  NEW_GAME: {
    pseudo: string
  }
  JOIN_GAME: {
    pseudo: string
    gameId: string
  }
};

export type Event = keyof ClientEventPayload;
export type Payload<E extends Event> = ClientEventPayload[E]

export type ClientMessage<E extends Event = Event> = {
  event: E
  payload: Payload<E>
};
