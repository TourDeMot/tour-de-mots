import type { GameModeId } from "@tour-de-mot/shared/types";
import type { GameMode } from "./types";
import { ringStoryMode } from "./ringStory";

/**
 * Registre des modes de jeu.
 *
 * Pour ajouter un mode : importe son moteur et ajoute une entrée ici.
 */
const modes: Partial<Record<GameModeId, GameMode<any>>> = {
  RING_STORY: ringStoryMode,
};

export const getMode = (id: GameModeId): GameMode<any> | undefined => modes[id];
