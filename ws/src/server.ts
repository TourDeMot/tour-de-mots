import type { ServerWebSocket } from "bun";
import type { SocketData } from "@tour-de-mot/shared/types";
import { messageGateway } from "./gateways";
import { handleClose } from "./handlers";
import type { Ctx } from "./context";
import type { GameState } from "./state";

const games = new Map<string, GameState>();
const sockets = new Map<string, ServerWebSocket<SocketData>>();

const ctxFor = (ws: ServerWebSocket<SocketData>): Ctx => ({ ws, games, sockets });

const server = Bun.serve({
  port: 8080,
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      const uuid = crypto.randomUUID();
      if (server.upgrade(req, { data: { uuid, gameId: undefined } })) {
        return;
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }
    return new Response("WebSocket server running. Connect to /ws");
  },
  websocket: {
    data: {} as SocketData,
    open(ws) {
      sockets.set(ws.data.uuid, ws);
      console.log(`+ connexion ${ws.data.uuid.slice(0, 8)} — vivantes : ${sockets.size}`);
    },
    message(ws, message) {
      messageGateway(ctxFor(ws), message);
    },
    close(ws) {
      handleClose(ctxFor(ws));
      sockets.delete(ws.data.uuid);
      console.log(`- déconnexion ${ws.data.uuid.slice(0, 8)} — vivantes : ${sockets.size}`);
    },
    drain(_ws) {},
  },
});

console.log(`WebSocket server running at http://localhost:${server.port}`);
