import type { PromptPayload } from "@tour-de-mot/shared/types";
import type { Game } from "../types";

export function handlePrompt(state: Game, payload: PromptPayload): Game {
  return { ...state, prompt: payload };
}
