import type {
  GameModeId,
  GamePhase,
  Player,
  PromptPayload,
  Story,
} from "@tour-de-mot/shared/types";

/** Vue côté client de l'état d'une partie (ce que l'UI a besoin de connaître). */
export type Game = {
  gameId: string;
  players: Player[];
  phase: GamePhase;
  mode: GameModeId | null;
  /** Le tour courant du joueur (sa phrase à compléter), ou null hors-jeu. */
  prompt: PromptPayload | null;
  /** Résultat final révélé à la fin de la partie. */
  stories: Story[];
};

export const initialGameState: Game = {
  gameId: "",
  players: [],
  phase: "LOBBY",
  mode: null,
  prompt: null,
  stories: [],
};
