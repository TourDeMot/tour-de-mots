import type { ErrorCode, Player, ServerMessage } from "./types";

export const newErrorMessage = (code: ErrorCode) =>
  ({ event: "ERROR", code }) as ServerMessage;

export const leaveGame = (game: Set<Player>, uuid: string) => {
  game.forEach((player) => {
    if (player.uuid === uuid) {
      game.delete(player);
    }
  });
};
