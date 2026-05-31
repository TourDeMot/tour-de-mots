import type { ServerWebSocket } from "bun";
import type { ServerMessage, SocketData } from "@tour-de-mot/shared/types";
import type { GameState } from "./state";

/**
 * Contexte passé à tous les handlers.
 *
 * `sockets` est le registre uuid → connexion : il est indispensable pour
 * envoyer un message PERSONNALISÉ à un joueur précis (ex: sa phrase secrète),
 * ce que `ws.publish` ne permet pas (publish = même message pour tous).
 */
export type Ctx = {
  ws: ServerWebSocket<SocketData>;
  games: Map<string, GameState>;
  sockets: Map<string, ServerWebSocket<SocketData>>;
};

/** Envoie un message au socket courant. */
export const send = (ws: ServerWebSocket<SocketData>, message: ServerMessage) =>
  ws.send(JSON.stringify(message));

/** Envoie un message à un joueur précis (par uuid). */
export const sendTo = (ctx: Ctx, uuid: string, message: ServerMessage) =>
  ctx.sockets.get(uuid)?.send(JSON.stringify(message));

/**
 * Diffuse un message à tous les abonnés d'une partie SAUF l'émetteur.
 * (Bun n'envoie pas le `publish` au socket courant.)
 */
export const broadcast = (
  ws: ServerWebSocket<SocketData>,
  gameId: string,
  message: ServerMessage,
) => ws.publish(gameId, JSON.stringify(message));
