import type { ClientPayload } from "@tour-de-mot/shared/types";
import {
  ALREADY_IN_A_GAME,
  GAME_ALREADY_STARTED,
  GAME_NOT_STARTED,
  MISSING_GAME_ID,
  NOT_ENOUGH_PLAYERS,
  NOT_IN_GAME,
  UNKNOWN_MODE,
} from "@tour-de-mot/shared/error";
import { createGame, joinGame, leaveGame } from "./games";
import { getMode } from "./modes";
import type { Ctx } from "./context";
import { broadcast, send, sendTo } from "./context";
import type { GameState } from "./state";

export const handleNewGame = (ctx: Ctx, payload: ClientPayload<"NEW_GAME">) => {
  const { ws, games } = ctx;
  if (ws.data.gameId) return send(ws, ALREADY_IN_A_GAME);

  const result = createGame(games, {
    uuid: ws.data.uuid,
    pseudo: payload.pseudo,
  });
  if (!result.ok) return send(ws, result.error);

  const { gameId, players } = result.value;
  ws.data.gameId = gameId;
  ws.subscribe(gameId);
  send(ws, { event: "NEW_GAME_OK", payload: { gameId, players } });
};

export const handleJoinGame = (
  ctx: Ctx,
  payload: ClientPayload<"JOIN_GAME">,
) => {
  const { ws, games } = ctx;
  if (!payload.gameId) return send(ws, MISSING_GAME_ID);
  if (ws.data.gameId) return send(ws, ALREADY_IN_A_GAME);

  const result = joinGame(games, payload.gameId, {
    uuid: ws.data.uuid,
    pseudo: payload.pseudo,
  });
  if (!result.ok) return send(ws, result.error);

  ws.data.gameId = payload.gameId;
  ws.subscribe(payload.gameId);

  // les autres joueurs (publish) + soi-même (publish n'inclut pas l'émetteur)
  const message = {
    event: "JOIN_GAME_OK",
    payload: { gameId: payload.gameId, players: result.value },
  } as const;
  broadcast(ws, payload.gameId, message);
  send(ws, message);
};

export const handleStartGame = (
  ctx: Ctx,
  payload: ClientPayload<"START_GAME">,
) => {
  const { ws, games } = ctx;
  const gameId = ws.data.gameId;
  if (!gameId) return send(ws, NOT_IN_GAME);

  const game = games.get(gameId);
  if (!game) return send(ws, NOT_IN_GAME);
  if (game.phase !== "LOBBY") return send(ws, GAME_ALREADY_STARTED);

  const mode = getMode(payload.mode);
  if (!mode) return send(ws, UNKNOWN_MODE);
  if (game.players.length < mode.minPlayers) {
    return send(ws, NOT_ENOUGH_PLAYERS);
  }

  const modeState = mode.init(game.players);
  const updated: GameState = {
    ...game,
    phase: "PLAYING",
    mode: mode.id,
    modeState,
  };
  games.set(gameId, updated);

  // tout le monde apprend que la partie démarre
  broadcast(ws, gameId, { event: "GAME_STARTED", payload: { mode: mode.id } });
  send(ws, { event: "GAME_STARTED", payload: { mode: mode.id } });

  // puis chaque joueur reçoit son premier prompt (personnalisé)
  for (const out of mode.onStart(modeState)) sendTo(ctx, out.to, out.message);
};

export const handleSubmitSentence = (
  ctx: Ctx,
  payload: ClientPayload<"SUBMIT_SENTENCE">,
) => {
  const { ws, games } = ctx;
  const gameId = ws.data.gameId;
  if (!gameId) return send(ws, NOT_IN_GAME);

  const game = games.get(gameId);
  if (!game) return send(ws, NOT_IN_GAME);
  if (game.phase !== "PLAYING" || !game.mode) return send(ws, GAME_NOT_STARTED);

  const mode = getMode(game.mode);
  if (!mode) return send(ws, UNKNOWN_MODE);

  const player = game.players.find((p) => p.uuid === ws.data.uuid);
  if (!player) return send(ws, NOT_IN_GAME);

  const result = mode.submit(game.modeState, player, payload.text);
  if (!result.ok) return send(ws, result.error);

  const { state, outbound, finished } = result.value;
  games.set(gameId, {
    ...game,
    modeState: state,
    phase: finished ? "FINISHED" : "PLAYING",
  });

  for (const out of outbound) sendTo(ctx, out.to, out.message);
};

/**
 * Logique commune de départ d'un joueur (déconnexion OU bouton « quitter »).
 *
 * - si la partie est EN COURS, on prévient le mode (qui peut l'arrêter) ;
 * - puis on retire le joueur et on informe les autres de la nouvelle liste.
 */
const applyLeave = (ctx: Ctx, gameId: string, uuid: string) => {
  const { ws, games } = ctx;
  const game = games.get(gameId);
  if (!game) return;

  // partie en cours → laisser le mode décider (Ring Story arrête et révèle)
  if (game.phase === "PLAYING" && game.mode) {
    const mode = getMode(game.mode);
    if (mode) {
      const outcome = mode.onLeave(game.modeState, uuid);
      games.set(gameId, {
        ...game,
        modeState: outcome.state,
        phase: outcome.finished ? "FINISHED" : "PLAYING",
      });
      for (const out of outcome.outbound) sendTo(ctx, out.to, out.message);
    }
  }

  // retirer le joueur de la partie (supprime la partie si elle devient vide)
  const result = leaveGame(games, gameId, uuid);
  if (!result.ok) return;

  // prévenir les joueurs restants de la nouvelle liste (utile en lobby)
  if (result.value.length !== 0) {
    broadcast(ws, gameId, {
      event: "PLAYER_LEAVED",
      payload: { players: result.value },
    });
  }
};

/** Départ volontaire : le socket reste ouvert, le client revient à l'accueil. */
export const handleLeaveGame = (
  ctx: Ctx,
  _payload: ClientPayload<"LEAVE_GAME">,
) => {
  const { ws } = ctx;
  const gameId = ws.data.gameId;
  if (!gameId) return send(ws, NOT_IN_GAME);

  applyLeave(ctx, gameId, ws.data.uuid);

  ws.unsubscribe(gameId);
  ws.data.gameId = undefined;
  send(ws, { event: "LEFT_GAME_OK", payload: {} });
};

/** Déconnexion brutale (fermeture de l'onglet, coupure réseau). */
export const handleClose = (ctx: Ctx) => {
  const { ws } = ctx;
  const gameId = ws.data.gameId;
  if (!gameId) return;

  applyLeave(ctx, gameId, ws.data.uuid);
  ws.unsubscribe(gameId);
};
