import type { GameModeId } from "@tour-de-mot/shared/types";
import type { GameMode } from "./types";

/**
 * Registre des modes de jeu.
 *
 * Pour ajouter un mode : importe son moteur et ajoute une entrée ici.
 *   import { ringStoryMode } from "./ringStory";
 *   const modes = { RING_STORY: ringStoryMode };
 *
 * (Vide pour l'instant : le moteur RING_STORY arrive à l'étape suivante.)
 */
const modes: Partial<Record<GameModeId, GameMode<any>>> = {};

export const getMode = (id: GameModeId): GameMode<any> | undefined => modes[id];
