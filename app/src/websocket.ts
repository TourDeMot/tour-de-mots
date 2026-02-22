import type { ServerMessage } from "@ws-poc/shared/types"
import { useEffect, useRef, useState } from "react"

export const useWs = (url: string, handler: (s: ServerMessage) => void) => {
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
          handler(message);
        } catch (e) {
          console.error(e);
        }
      };
    };

    connect();
    return () => socket.close();
  }, [url, handler]);

  const send = (data: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    }
  };

  return { isReady, send };
};
