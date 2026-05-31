import type { GameModeId, Player, ServerMessage } from "@tour-de-mot/shared/types";
import type { Result } from "@tour-de-mot/shared/result";

/** Un message destiné à UN joueur précis (ciblé par son uuid). */
export type Outbound = {
  to: string;
  message: ServerMessage;
};

/** Résultat d'une soumission : nouvel état + messages à envoyer + fin de partie. */
export type SubmitOutcome<State> = {
  state: State;
  outbound: Outbound[];
  finished: boolean;
};

/**
 * Contrat commun à tous les modes de jeu.
 *
 * Les méthodes sont PURES (pas d'effet de bord, pas d'envoi réseau) : elles
 * reçoivent un état et renvoient un nouvel état + la liste des messages à
 * envoyer. C'est le handler qui réalise l'envoi. Ça rend chaque mode
 * facilement testable en isolation.
 *
 * Pour créer un mode : implémente cette interface dans un fichier dédié
 * (ex: `ringStory.ts`) puis enregistre-le dans `index.ts`.
 */
export interface GameMode<State> {
  /** Identifiant du mode (doit correspondre à un GameModeId). */
  readonly id: GameModeId;

  /** Nombre minimum de joueurs requis pour démarrer. */
  readonly minPlayers: number;

  /** Crée l'état initial du mode au démarrage de la partie. */
  init(players: Player[]): State;

  /** Messages envoyés à chaque joueur au démarrage (ex: le 1er prompt). */
  onStart(state: State): Outbound[];

  /** Applique la soumission d'un joueur ; renvoie le nouvel état ou une erreur. */
  submit(
    state: State,
    player: Player,
    text: string,
  ): Result<SubmitOutcome<State>, ServerMessage<"ERROR">>;
}
