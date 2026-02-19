import { messageRouter } from "./routers";
import type { ClientMessage, Games, SocketData } from "./types";
import { newErrorMessage } from "./utils";
import type { ServerWebSocket } from "bun";

export const messageGateway = (
  ws: ServerWebSocket<SocketData>,
  raw: string | Buffer,
  games: Games,
) => {
  if (!ws.data.uuid) {
    return ws.send(JSON.stringify(newErrorMessage("MISSING_UUID")));
  }

  try {
    const message = JSON.parse(raw.toString()) as ClientMessage;
    messageRouter(ws, message, games);
  } catch (_) {
    ws.send(JSON.stringify(newErrorMessage("BAD_JSON")));
  }
};
