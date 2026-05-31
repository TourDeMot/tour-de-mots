import { messageRouter } from "./routers";
import type { ClientMessage } from "@tour-de-mot/shared/types";
import { MISSING_UUID, BAD_JSON } from "@tour-de-mot/shared/error";
import type { Ctx } from "./context";
import { send } from "./context";

export const messageGateway = (ctx: Ctx, raw: string | Buffer) => {
  if (!ctx.ws.data.uuid) return send(ctx.ws, MISSING_UUID);

  try {
    const message = JSON.parse(raw.toString()) as ClientMessage;
    messageRouter(ctx, message);
  } catch (_) {
    send(ctx.ws, BAD_JSON);
  }
};
