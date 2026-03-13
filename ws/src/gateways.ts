import { messageRouter } from "./routers";
import type { ClientMessage, Game, SocketData } from "@tour-de-mot/shared/types";
import { MISSING_UUID, BAD_JSON } from "@tour-de-mot/shared/error";
import type { ServerWebSocket } from "bun";
import type { ClientMessage } from "./messages";


export const messageGateway = (
  ws: ServerWebSocket<SocketData>,
  raw: string | Buffer,
  games: Map<string, Game>,
) => {
  if (!ws.data.uuid) {
    return ws.send(JSON.stringify(MISSING_UUID));
  }

  try {
    const message = JSON.parse(raw.toString()) as ClientMessage;
    messageRouter(ws, games, message);
  } catch (_) {
    ws.send(JSON.stringify(BAD_JSON));
  }
};
