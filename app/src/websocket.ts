import type { ServerMessage } from "@ws-poc/shared";

class ClientWebSocket {
  private ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
  }

  private onOpen = () => {
    console.log("connected");
  };

  private onMessage = (e: MessageEvent<any>) => {
    console.log("message received");

    try {
      const message = JSON.parse(e.data) as ServerMessage;
      switch (message.event) {
        case "NEW_GAME_OK":
          console.log(message.data.gameId);
          break;
        case "JOIN_GAME_OK":
          break;
        case "PLAYER_LEAVED":
          break;
        case "ERROR":
          console.log(message.code);
          break;
        default:
          throw new Error("Unknown server event");
      }
    } catch (error) {
      console.error(error);
    }
  };

  private onError = () => {
    console.error("an error occured");
  };

  private onClose = () => {
    console.log("connection closed");
  };

  send = (data: string) => {
    this.ws.send(data);
  };
}

export const clientWS = new ClientWebSocket("http://localhost:8080/ws");
