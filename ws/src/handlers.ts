import type {
  Games,
  JoinGameMessage,
  NewGameMessage,
  Player,
  ServerMessage,
  SocketData,
} from "./types";
import { leaveGame, newErrorMessage } from "./utils";
import type { ServerWebSocket } from "bun";

// source: Gemini 3 fast
const generateGameId = (length: number = 6) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
};

export const handleNewGame = (
  ws: ServerWebSocket<SocketData>,
  message: NewGameMessage,
  games: Games,
) => {
  const gameId = generateGameId();
  ws.data.gameId = gameId;

  games.set(gameId, new Set([{ uuid: ws.data.uuid, pseudo: message.pseudo }]));
  ws.subscribe(gameId);

  ws.send(
    JSON.stringify({
      event: "NEW_GAME_OK",
      data: { gameId },
    } as ServerMessage),
  );
};

export const handleJoinGame = (
  ws: ServerWebSocket<SocketData>,
  message: JoinGameMessage,
  games: Games,
) => {
  if (!message.gameId) {
    return ws.send(JSON.stringify(newErrorMessage("MISSING_GAME_ID")));
  }
  ws.data.gameId = message.gameId;

  const game = games.get(message.gameId);
  if (!game) {
    ws.send(JSON.stringify(newErrorMessage("GAME_NOT_FOUND")));
    return;
  }
  game.add({ uuid: ws.data.uuid, pseudo: message.pseudo });
  ws.subscribe(message.gameId);

  const responsePayload = JSON.stringify({
    event: "JOIN_GAME_OK",
    data: { players: Array.from(game) },
  } as ServerMessage);
  ws.publish(message.gameId, responsePayload);
  // publish does not send to the current client so we need to send the message to it too
  ws.send(responsePayload);
};

export const handleClose = (ws: ServerWebSocket<SocketData>, games: Games) => {
  const { uuid, gameId } = ws.data;
  if (!gameId) return;

  const game = games.get(gameId);
  if (!game) return;

  leaveGame(game, uuid);

  if (game.size === 0) {
    games.delete(gameId);
  } else {
    ws.publish(
      gameId,
      JSON.stringify({
        event: "PLAYER_LEAVED",
        data: { players: Array.from(game) },
      } as ServerMessage),
    );
  }
};
