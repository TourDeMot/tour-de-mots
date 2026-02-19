import type { Player, SocketData } from "./types";
import { messageGateway } from "./gateways";
import { handleClose } from "./handlers";

// games are players id by game id
const games = new Map<string, Player[]>();

const server = Bun.serve({
  port: 8080,
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      const uuid = crypto.randomUUID();
      if (server.upgrade(req, { data: { uuid: uuid, gameId: undefined } })) {
        return;
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }
    return new Response("WebSocket server running. Connect to /ws");
  },
  websocket: {
    data: {} as SocketData,
    message(ws, message) {
      messageGateway(ws, message, games);
    },
    close(ws) {
      handleClose(ws, games);
    },
    drain(ws) {},
  },
});

console.log(`WebSocket server running at http://localhost:${server.port}`);
