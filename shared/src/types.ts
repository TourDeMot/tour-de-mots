// ===========================================================================
//  Domaine partagé
// ===========================================================================

export type Player = {
  uuid: string;
  pseudo: string;
};

/** Données attachées à chaque connexion WebSocket côté serveur. */
export type SocketData = {
  uuid: string;
  gameId: string | undefined;
};

/** Phase de vie d'une partie. */
export type GamePhase = "LOBBY" | "PLAYING" | "FINISHED";

/**
 * Identifiant d'un mode de jeu.
 *
 * Pour ajouter un mode :
 *   1. ajoute son id ici (ex: "RING_STORY" | "MAD_LIBS"),
 *   2. déclare ses events dans les maps plus bas si besoin,
 *   3. écris son moteur dans `ws/src/modes/` et enregistre-le dans
 *      `ws/src/modes/index.ts`.
 */
export type GameModeId = "RING_STORY";

/** Brique de base de tous les modes : un texte associé à son auteur. */
export type Contribution = {
  authorUuid: string;
  authorPseudo: string;
  text: string;
};

/** Une « histoire » assemblée : une suite ordonnée de contributions. */
export type Story = {
  contributions: Contribution[];
};

// ===========================================================================
//  Codes d'erreur
// ===========================================================================

export type ErrorCode =
  | "UNKNOWN_EVENT"
  | "BAD_JSON"
  | "MISSING_UUID"
  | "MISSING_GAME_ID"
  | "GAME_NOT_FOUND"
  | "ALREADY_IN_A_GAME"
  | "GAME_EMPTY"
  | "NOT_IN_GAME"
  | "GAME_ALREADY_STARTED"
  | "GAME_NOT_STARTED"
  | "UNKNOWN_MODE"
  | "NOT_ENOUGH_PLAYERS"
  | "ALREADY_SUBMITTED"
  | "EMPTY_SENTENCE";

// ===========================================================================
//  Payloads — Client → Serveur (les actions)
// ===========================================================================

export type NewGamePayload = { pseudo: string };
export type JoinGamePayload = { pseudo: string; gameId: string };
export type StartGamePayload = { mode: GameModeId };
export type SubmitSentencePayload = { text: string };
/** Quitter sa partie (lobby, en cours, ou terminée). Aucune donnée nécessaire. */
export type LeaveGamePayload = Record<string, never>;

/** Table des messages que le client envoie au serveur. */
export type ClientEventPayloadMap = {
  NEW_GAME: NewGamePayload;
  JOIN_GAME: JoinGamePayload;
  START_GAME: StartGamePayload;
  SUBMIT_SENTENCE: SubmitSentencePayload;
  LEAVE_GAME: LeaveGamePayload;
};

// ===========================================================================
//  Payloads — Serveur → Client (les retours)
// ===========================================================================

export type NewGameOkPayload = { gameId: string; players: Player[] };
export type JoinGameOkPayload = { gameId: string; players: Player[] };
export type PlayerLeavedPayload = { players: Player[] };
export type GameStartedPayload = { mode: GameModeId };

/**
 * Ce que voit un joueur quand c'est son tour : la phrase à compléter.
 * `previous` vaut `null` au tout premier tour (rien à compléter, on démarre).
 */
export type PromptPayload = {
  round: number;
  totalRounds: number;
  previous: string | null;
};

export type GameFinishedPayload = { stories: Story[] };
export type ErrorPayload = { code: ErrorCode };
/** Confirme au joueur qu'il a bien quitté → son client revient à l'accueil. */
export type LeftGameOkPayload = Record<string, never>;

/** Table des messages que le serveur envoie au client. */
export type ServerEventPayloadMap = {
  NEW_GAME_OK: NewGameOkPayload;
  JOIN_GAME_OK: JoinGameOkPayload;
  PLAYER_LEAVED: PlayerLeavedPayload;
  GAME_STARTED: GameStartedPayload;
  PROMPT: PromptPayload;
  GAME_FINISHED: GameFinishedPayload;
  LEFT_GAME_OK: LeftGameOkPayload;
  ERROR: ErrorPayload;
};

// ===========================================================================
//  Machinerie générique de messages
//  (rien à toucher ici pour ajouter un mode)
// ===========================================================================

export type ClientEvent = keyof ClientEventPayloadMap;
export type ServerEvent = keyof ServerEventPayloadMap;

/** Un message = un event discriminant + son payload typé. */
export type Message<M, E extends keyof M> = {
  event: E;
  payload: M[E];
};

/** Union de tous les messages client (ou un message précis si E est fixé). */
export type ClientMessage<E extends ClientEvent = ClientEvent> = {
  [K in ClientEvent]: Message<ClientEventPayloadMap, K>;
}[E];

/** Union de tous les messages serveur (ou un message précis si E est fixé). */
export type ServerMessage<E extends ServerEvent = ServerEvent> = {
  [K in ServerEvent]: Message<ServerEventPayloadMap, K>;
}[E];

export type ClientPayload<E extends ClientEvent> = ClientEventPayloadMap[E];
export type ServerPayload<E extends ServerEvent> = ServerEventPayloadMap[E];
