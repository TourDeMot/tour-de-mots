import type { GameModeId, GamePhase, Player } from "@tour-de-mot/shared/types";

/**
 * État interne d'une partie côté serveur.
 *
 * Ce type ne circule JAMAIS tel quel sur le réseau : il contient l'état
 * complet du mode (`modeState`), dont une partie est secrète pour les joueurs
 * (ex: les phrases des autres avant la révélation). Seuls des messages dérivés
 * (PROMPT, GAME_FINISHED…) sont envoyés au client.
 */
export type GameState = {
  players: Player[];
  phase: GamePhase;
  mode: GameModeId | null;
  /** État interne du mode actif, typé par chaque moteur de mode. */
  modeState: unknown;
};

export const newGameState = (host: Player): GameState => ({
  players: [host],
  phase: "LOBBY",
  mode: null,
  modeState: null,
});
