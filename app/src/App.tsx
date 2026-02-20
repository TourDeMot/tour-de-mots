import type { ClientMessage, Player } from "@ws-poc/shared/types";
import "./index.css";
import { ClientWebSocket } from "./websocket";
import { useState } from "react";

export function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const clientWS = new ClientWebSocket("http://localhost:8080/ws", setPlayers);

  const [pseudo, setPseudo] = useState();
  function handlePseudoChange(e: any) {
    setPseudo(e.target.value.trim())
  }

  function onCreateGame() {
    if (pseudo) {
      clientWS.send(JSON.stringify({ event: "NEW_GAME", pseudo } as ClientMessage));
    }
  }

  const [code, setCode] = useState("");
  function handleCodeChange(e: any) {
    setCode(e.target.value);
  }
  function onJoinGame() {
    if (pseudo) {
      clientWS.send(JSON.stringify({ event: "JOIN_GAME", pseudo, gameId: code } as ClientMessage));
    }
  }

  return (
    <div>
      <h1>WS POC</h1>
      <input type="text" placeholder="Enter your pseudo" value={pseudo} onChange={handlePseudoChange}/>
      <button onClick={onCreateGame}>Create game</button>
      <br />
      <input type="text" placeholder="Enter the game code to join" value={code} onChange={handleCodeChange}/>
      <button onClick={onJoinGame}>Join Game</button>
      <ul>
        {players.map(player => (
          <li key={player.uuid}>{player.pseudo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
