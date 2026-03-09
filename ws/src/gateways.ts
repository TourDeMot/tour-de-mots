import { messageRouter } from "./routers";
import type { ClientMessage, Game, SocketData } from "../../shared/src/types";
import { MISSING_UUID, BAD_JSON } from "../../shared/src/error";
import type { ServerWebSocket } from "bun";

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
    messageRouter(ws, message, games);
  } catch (_) {
    ws.send(JSON.stringify(BAD_JSON));
  }
};
