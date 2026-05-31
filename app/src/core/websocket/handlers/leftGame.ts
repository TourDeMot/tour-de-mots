import type { LeftGameOkPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";
import { initialGameState } from "../types";

export function handleLeftGameOk(
  _state: Game,
  _payload: LeftGameOkPayload,
): Game {
  // on quitte la partie → retour à l'état d'accueil
  return initialGameState;
}
