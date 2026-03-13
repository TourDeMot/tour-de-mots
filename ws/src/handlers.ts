import type {
  Game,
  JoinGameMessage,
  NewGameMessage,
  ServerMessage,
  SocketData,
} from "@tour-de-mot/shared/types";
import { ALREADY_IN_A_GAME, MISSING_GAME_ID } from "@tour-de-mot/shared/error";
import type { ServerWebSocket } from "bun";
import { createGame, joinGame, leaveGame } from "./games";
import type { Payload } from "./messages";

export const handleNewGame = (
  ws: ServerWebSocket<SocketData>,
  games: Map<string, Game>,
  payload: Payload<"NEW_GAME">,
) => {
  if (ws.data.gameId) {
    return ws.send(JSON.stringify(ALREADY_IN_A_GAME));
  }

  const result = createGame(games, {
    uuid: ws.data.uuid,
    pseudo: payload.pseudo,
  });

  if (!result.ok) {
    return ws.send(JSON.stringify(result.error));
  }

  const gameId = result.value.gameId;

  ws.data.gameId = gameId;
  ws.subscribe(gameId);
  return ws.send(
    JSON.stringify({
      event: "NEW_GAME_OK",
      data: { gameId, players: result.value.players },
    } as ServerMessage),
  );
};

export const handleJoinGame = (
  ws: ServerWebSocket<SocketData>,
  games: Map<string, Game>,
  payload: Payload<"JOIN_GAME">,
) => {
  if (!payload.gameId) {
    return ws.send(JSON.stringify(MISSING_GAME_ID));
  }

  if (ws.data.gameId) {
    return ws.send(JSON.stringify(ALREADY_IN_A_GAME));
  }

  const result = joinGame(games, payload.gameId, {
    uuid: ws.data.uuid,
    pseudo: payload.pseudo,
  });
  if (!result.ok) {
    return ws.send(JSON.stringify(result.error));
  }

  ws.data.gameId = payload.gameId;
  ws.subscribe(payload.gameId);

  const responsePayload = JSON.stringify({
    event: "JOIN_GAME_OK",
    data: { players: result.value },
  } as ServerMessage);

  ws.publish(payload.gameId, responsePayload);

  // publish does not send to the current client so we need to send the message to it too
  return ws.send(responsePayload);
};

export const handleClose = (
  ws: ServerWebSocket<SocketData>,
  games: Map<string, Game>,
) => {
  const { uuid, gameId } = ws.data;
  if (!gameId) return;

  const result = leaveGame(games, gameId, uuid);
  if (!result.ok) return;

  ws.unsubscribe(gameId);

  if (result.value.length !== 0) {
    ws.publish(
      gameId,
      JSON.stringify({
        event: "PLAYER_LEAVED",
        data: { players: result.value },
      } as ServerMessage),
    );
  }
};
