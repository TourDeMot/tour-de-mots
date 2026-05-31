import type {
  ClientEvent,
  ClientMessage,
  ClientPayload,
} from "@tour-de-mot/shared/types";
import { UNKNOWN_EVENT } from "@tour-de-mot/shared/error";
import type { Ctx } from "./context";
import { send } from "./context";
import {
  handleJoinGame,
  handleLeaveGame,
  handleNewGame,
  handleStartGame,
  handleSubmitSentence,
} from "./handlers";

type Handler<E extends ClientEvent> = (
  ctx: Ctx,
  payload: ClientPayload<E>,
) => void;

const handlers: { [E in ClientEvent]: Handler<E> } = {
  NEW_GAME: handleNewGame,
  JOIN_GAME: handleJoinGame,
  START_GAME: handleStartGame,
  SUBMIT_SENTENCE: handleSubmitSentence,
  LEAVE_GAME: handleLeaveGame,
};

export const messageRouter = (ctx: Ctx, message: ClientMessage) => {
  const handler = handlers[message.event];
  if (!handler) return send(ctx.ws, UNKNOWN_EVENT);
  // event et payload proviennent du même message → corrélés à l'exécution
  (handler as (ctx: Ctx, payload: unknown) => void)(ctx, message.payload);
};
