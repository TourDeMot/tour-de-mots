import "./index.css";
import type { ClientMessage, Player, ServerMessage } from "@ws-poc/shared/types";
import { useState, useCallback } from "react";
import { useWs } from "./websocket";

export function App() {
  const handler = useCallback((message: ServerMessage) => {
    console.log("message received");
    try {
      switch (message.event) {
        case "NEW_GAME_OK":
          setCode(message.data.gameId);
          setPlayers(message.data.players);
          break;
        case "JOIN_GAME_OK":
          setPlayers(message.data.players);
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
  }, []);

  const { isReady, send } = useWs("ws://localhost:8080/ws", handler);
  const [players, setPlayers] = useState<Player[]>([]);
  const [pseudo, setPseudo] = useState("");
  const [code, setCode] = useState("");

  function onCreateGame() {
    if (isReady && pseudo) {
      send(JSON.stringify({ event: "NEW_GAME", pseudo } as ClientMessage));
    }
  }

  function onJoinGame() {
    if (isReady && pseudo) {
      send(JSON.stringify({ event: "JOIN_GAME", pseudo, gameId: code } as ClientMessage));
    }
  }

  return (
    <div>
      <h1>WS POC</h1>
      <input type="text" placeholder="Enter your pseudo" value={pseudo} onChange={e => setPseudo(e.target.value)}/>
      <button onClick={onCreateGame}>Create game</button>
      <br />
      <input type="text" placeholder="Enter the game code to join" value={code} onChange={e => setCode(e.target.value)}/>
      <button onClick={onJoinGame}>Join Game</button>
      {code && <p>{code}</p>}
      <ul>
        {players.map(player => (
          <li key={player.uuid}>{player.pseudo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
