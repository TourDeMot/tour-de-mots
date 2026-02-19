import type { ClientMessage } from "@ws-poc/shared";
import "./index.css";
import { clientWS } from "./websocket";

export function App() {
  function onCreateGame() {
    clientWS.send(JSON.stringify({ event: "NEW_GAME", pseudo: "Player1" } as ClientMessage));
  }

  return (
    <div>
      <h1>WS POC</h1>
      <button onClick={onCreateGame}>Create game</button>
    </div>
  );
}

export default App;
