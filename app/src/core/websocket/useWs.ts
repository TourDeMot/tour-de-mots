import type { ServerMessage } from "@tour-de-mot/shared/types";
import { useEffect, useRef, useState } from "react";

export function useWs(url: string, dispatch: (message: ServerMessage) => void) {
  const [isReady, setIsReady] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // vrai tant que ce hook est monté ; repasse à false au démontage
    let active = true;
    let socket: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      socket = new WebSocket(url);
      ws.current = socket;

      socket.onopen = () => setIsReady(true);
      socket.onclose = () => {
        setIsReady(false);
        // on ne reconnecte QUE si la coupure est subie (serveur),
        // pas si c'est nous qui fermons volontairement (démontage)
        if (active) reconnectTimer = setTimeout(connect, 1000);
      };
      socket.onerror = console.error;
      socket.onmessage = (event) => {
        try {
          dispatch(JSON.parse(event.data) as ServerMessage);
        } catch (e) {
          console.error(e);
        }
      };
    };

    connect();

    // fermeture volontaire : on coupe la reconnexion et on détache le onclose
    return () => {
      active = false;
      clearTimeout(reconnectTimer);
      socket.onclose = null;
      socket.close();
    };
  }, [url, dispatch]);

  const send = (data: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    }
  };

  return { isReady, send };
}
