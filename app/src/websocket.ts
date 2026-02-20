import type { ServerMessage, Player } from "@ws-poc/shared/types";
import type { Dispatch } from "react";

export class ClientWebSocket {
  private ws: WebSocket;
  setPlayers: Dispatch<Player[]>;

  constructor(url: string, setPlayers: Dispatch<Player[]>) {
    this.ws = new WebSocket(url);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;

    this.setPlayers = setPlayers;
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
          this.setPlayers(message.data.players);
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
