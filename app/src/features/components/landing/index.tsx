import type { ClientMessage } from "@tour-de-mot/shared/types";
import { useEffect, useReducer, useState } from "react";
import { useWs } from "@/core/websocket/useWs";
import { handleMessage } from "@/core/websocket/handlers";
import { initialGameState } from "@/core/websocket/types";

export default function LandingComponent() {
  const [game, dispatch] = useReducer(handleMessage, initialGameState);
  const { isReady, send } = useWs("ws://localhost:8080/ws", dispatch);
  const [pseudo, setPseudo] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [sentence, setSentence] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // un nouveau prompt arrive → on réactive la saisie
  useEffect(() => {
    setHasSubmitted(false);
    setSentence("");
  }, [game.prompt]);

  const emit = (message: ClientMessage) => send(JSON.stringify(message));

  function onCreateGame() {
    if (isReady && pseudo) emit({ event: "NEW_GAME", payload: { pseudo } });
  }
  function onJoinGame() {
    if (isReady && pseudo && joinCode)
      emit({ event: "JOIN_GAME", payload: { pseudo, gameId: joinCode } });
  }
  function onStartGame() {
    emit({ event: "START_GAME", payload: { mode: "RING_STORY" } });
  }
  function onSubmitSentence() {
    if (sentence.trim()) {
      emit({ event: "SUBMIT_SENTENCE", payload: { text: sentence } });
      setHasSubmitted(true);
    }
  }

  // Pas encore dans une partie → écran d'accueil
  if (!game.gameId) {
    return (
      <div>
        <h1>Tour de Mots</h1>
        <input
          type="text"
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <button onClick={onCreateGame}>Créer une partie</button>
        <br />
        <input
          type="text"
          placeholder="Code pour rejoindre"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button onClick={onJoinGame}>Rejoindre</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Tour de Mots</h1>
      <p>
        Partie : <strong>{game.gameId}</strong>
      </p>
      <ul>
        {game.players.map((player) => (
          <li key={player.uuid}>{player.pseudo}</li>
        ))}
      </ul>

      {game.phase === "LOBBY" && (
        <button onClick={onStartGame} disabled={game.players.length < 2}>
          Démarrer (Ring Story)
        </button>
      )}

      {game.phase === "PLAYING" && game.prompt && (
        <div>
          <p>
            Tour {game.prompt.round + 1} / {game.prompt.totalRounds}
          </p>
          {game.prompt.previous ? (
            <blockquote>Complète : « {game.prompt.previous} »</blockquote>
          ) : (
            <p>Commence l'histoire !</p>
          )}
          {hasSubmitted ? (
            <p>En attente des autres joueurs…</p>
          ) : (
            <div>
              <textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
              />
              <br />
              <button onClick={onSubmitSentence}>Envoyer</button>
            </div>
          )}
        </div>
      )}

      {game.phase === "FINISHED" && (
        <div>
          <h2>Les histoires</h2>
          {game.stories.map((story, i) => (
            <div key={i}>
              <h3>Histoire {i + 1}</h3>
              {story.contributions.map((c, j) => (
                <p key={j}>
                  <strong>{c.authorPseudo} :</strong> {c.text}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
