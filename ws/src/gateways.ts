import { messageRouter } from "./routers";
import type { Game, SocketData } from "@ws-poc/shared/types";
import { MISSING_UUID, BAD_JSON } from "@ws-poc/shared/error";
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
