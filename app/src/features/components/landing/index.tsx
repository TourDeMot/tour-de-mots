import type { ClientMessage } from "@tour-de-mot/shared/types";
import { useReducer, useState } from "react";
import { useWs } from "@/core/websocket/useWs";
import { handleMessage } from "@/core/websocket/handlers";
import { initialGameState } from "@/core/websocket/types";

export default function LandingComponent() {

  const [game, dispatch] = useReducer(handleMessage, initialGameState);
  const { isReady, send } = useWs("ws://localhost:8080/ws", dispatch);
  const [pseudo, setPseudo] = useState("");
  const [joinCode, setJoinCode] = useState("");

  function onCreateGame() {
    if (isReady && pseudo) {
      send(JSON.stringify({ event: "NEW_GAME", pseudo } as ClientMessage));
    }
  }

  function onJoinGame() {
    if (isReady && pseudo && joinCode) {
      send(JSON.stringify({ event: "JOIN_GAME", pseudo, gameId: joinCode } as ClientMessage));
    }
  }
  return (
    <div>
      <h1>WS POC</h1>
      <input type="text" placeholder="Pseudo" value={pseudo} onChange={e => setPseudo(e.target.value)}/>
      <button onClick={onCreateGame}>Create game</button>
      <br />
      <input type="text" placeholder="Code pour Rejoindre" value={joinCode} onChange={e => setJoinCode(e.target.value)}/>
      <button onClick={onJoinGame}>Join Game</button>
      {game.gameId && <p>{game.gameId}</p>}
      <ul>
        {game.players.map(player => (
          <li key={player.uuid}>{player.pseudo}</li>
        ))}
          </ul>
    </div>
  );
}
