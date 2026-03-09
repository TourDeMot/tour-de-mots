import type { ServerMessage } from "@ws-poc/shared/types";
import { useEffect, useRef, useState } from "react";

export function useWs(url: string, dispatch: (message: ServerMessage) => void) {
  const [isReady, setIsReady] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    let socket: WebSocket;

    const connect = () => {
      socket = new WebSocket(url);
      ws.current = socket;

      socket.onopen = () => setIsReady(true);
      socket.onclose = () => {
        setIsReady(false);
        setTimeout(connect, 1000);
      };
      socket.onerror = console.error;
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as ServerMessage;
          dispatch(message);
        } catch (e) {
          console.error(e);
        }
      };
    };

    connect();
    return () => socket.close();
  }, [url, dispatch]);

  const send = (data: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    }
  };

  return { isReady, send };
}
