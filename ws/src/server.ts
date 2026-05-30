import type { SocketData, Game } from "@tour-de-mot/shared/types";
import { messageGateway } from "./gateways";
import { handleClose } from "./handlers";

const games = new Map<string, Game>();

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
    open(ws) {
      console.log("client connected");
    },
    message(ws, message) {
      messageGateway(ws, message, games);
    },
    close(ws) {
      handleClose(ws, games);
    },
    drain(ws) {},
  },
});

console.log(`WebSocket server running a http://localhost:${server.port}`);
