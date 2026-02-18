import { messageHandler, closeHandler } from "@/handlers";
import type { SocketData } from "@/types";

// games are players id by game id
const games = new Map<string, Set<string>>();

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
    message(ws, message) {
      messageHandler(ws, String(message), games);
    },
    close(ws, code, message) {
      closeHandler(ws, games);
    },
    drain(ws) {},
  },
});

console.log(`WebSocket server running at http://localhost:${server.port}`);
