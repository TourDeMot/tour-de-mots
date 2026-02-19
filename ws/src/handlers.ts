import type {
  Games,
  JoinGameMessage,
  NewGameMessage,
  Player,
  ServerMessage,
  SocketData,
} from "./types";
import { removePlayer, newErrorMessage, addPlayer } from "./utils";
import type { ServerWebSocket } from "bun";

// source: Gemini 3 fast + Claude Sonnet 4.5
const generateGameId = (games: Games, length: number = 6): string => {
  let gameId: string;
  do {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    gameId = Array.from(bytes)
      .map((b) => chars[b % chars.length])
      .join("");
  } while (games.has(gameId));
  return gameId;
};

export const handleNewGame = (
  ws: ServerWebSocket<SocketData>,
  message: NewGameMessage,
  games: Games,
) => {
  const gameId = generateGameId(games);
  ws.data.gameId = gameId;

  games.set(
    gameId,
    addPlayer([], { uuid: ws.data.uuid, pseudo: message.pseudo }),
  );
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

  games.set(
    message.gameId,
    addPlayer(game, {
      uuid: ws.data.uuid,
      pseudo: message.pseudo,
    }),
  );

  ws.subscribe(message.gameId);

  const responsePayload = JSON.stringify({
    event: "JOIN_GAME_OK",
    data: { players: game },
  } as ServerMessage);
  ws.publish(message.gameId, responsePayload);
  // publish does not send to the current client so we need to send the message to it too
  ws.send(responsePayload);
};

export const handleClose = (ws: ServerWebSocket<SocketData>, games: Games) => {
  const { uuid, gameId } = ws.data;
  if (!gameId) return;

  let game = games.get(gameId);
  if (!game) return;

  if (game.length === 0) {
    games.delete(gameId);
  } else {
    games.set(gameId, removePlayer(game, uuid));
    ws.publish(
      gameId,
      JSON.stringify({
        event: "PLAYER_LEAVED",
        data: { players: game },
      } as ServerMessage),
    );
  }
};
