import type { Contribution, Player, Story } from "@tour-de-mot/shared/types";
import { Err, Ok } from "@tour-de-mot/shared/result";
import {
  ALREADY_SUBMITTED,
  EMPTY_SENTENCE,
  NOT_IN_GAME,
} from "@tour-de-mot/shared/error";
import type { GameMode, Outbound } from "./types";

/**
 * Mode « cadavre exquis » / téléphone écrit.
 *
 * Il y a N histoires (une par joueur) qui tournent dans l'anneau. À chaque
 * tour, chaque joueur reçoit UNE histoire, voit seulement sa dernière phrase,
 * et en ajoute une. Après N tours, chaque histoire a reçu une phrase de chaque
 * joueur, et on révèle tout.
 */
export type RingStoryState = {
  order: string[]; // uuids des joueurs, dans l'ordre de l'anneau
  players: Record<string, Player>; // uuid -> joueur, pour attribuer les phrases
  round: number; // tour courant (0-indexé)
  totalRounds: number; // = nombre de joueurs
  stories: Contribution[][]; // stories[s][r] = la phrase du tour r de l'histoire s
  submitted: string[]; // uuids ayant déjà soumis au tour courant
};

/**
 * Quelle histoire le joueur en position `p` détient-il au tour `round` ?
 *
 * Les histoires tournent d'un cran à chaque tour. Le `+ n) % n` gère les
 * nombres négatifs (le modulo de JS peut être négatif).
 */
const storyHeldBy = (p: number, round: number, n: number): number =>
  ((p - round) % n + n) % n;

/** Construit le message PROMPT (phrase à compléter) pour un joueur donné. */
const promptFor = (state: RingStoryState, uuid: string): Outbound => {
  const p = state.order.indexOf(uuid);
  const s = storyHeldBy(p, state.round, state.order.length);
  // au 1er tour il n'y a rien à compléter ; sinon on montre la phrase précédente
  const story = state.stories[s] ?? [];
  const previous = state.round === 0 ? null : (story[state.round - 1] ?? null);
  return {
    to: uuid,
    message: {
      event: "PROMPT",
      payload: {
        round: state.round,
        totalRounds: state.totalRounds,
        previous: previous ? previous.text : null,
      },
    },
  };
};

/** Construit le message GAME_FINISHED (toutes les histoires) pour tout le monde. */
const finishedMessages = (state: RingStoryState): Outbound[] => {
  const stories: Story[] = state.stories.map((contributions) => ({
    contributions,
  }));
  return state.order.map((uuid) => ({
    to: uuid,
    message: { event: "GAME_FINISHED", payload: { stories } },
  }));
};

export const ringStoryMode: GameMode<RingStoryState> = {
  id: "RING_STORY",
  minPlayers: 2,

  init(players) {
    const order = players.map((p) => p.uuid);
    const byUuid: Record<string, Player> = {};
    for (const p of players) byUuid[p.uuid] = p;

    return {
      order,
      players: byUuid,
      round: 0,
      totalRounds: order.length,
      stories: order.map(() => []), // une histoire vide par joueur
      submitted: [],
    };
  },

  onStart(state) {
    // au démarrage, chacun reçoit son premier prompt (histoire vierge à démarrer)
    return state.order.map((uuid) => promptFor(state, uuid));
  },

  submit(state, player, text) {
    const p = state.order.indexOf(player.uuid);
    if (p === -1) return Err(NOT_IN_GAME);

    const trimmed = text.trim();
    if (!trimmed) return Err(EMPTY_SENTENCE);

    if (state.submitted.includes(player.uuid)) return Err(ALREADY_SUBMITTED);

    const n = state.order.length;
    const s = storyHeldBy(p, state.round, n);

    // ajout immuable : on ne modifie que l'histoire `s` du joueur
    const contribution: Contribution = {
      authorUuid: player.uuid,
      authorPseudo: player.pseudo,
      text: trimmed,
    };
    const stories = state.stories.map((story, i) =>
      i === s ? [...story, contribution] : story,
    );
    const submitted = [...state.submitted, player.uuid];

    // tout le monde n'a pas encore soumis → on attend, aucun message à envoyer
    if (submitted.length < n) {
      return Ok({
        state: { ...state, stories, submitted },
        outbound: [],
        finished: false,
      });
    }

    // tour complet → on passe au suivant et on vide les soumissions
    const round = state.round + 1;
    const next: RingStoryState = { ...state, stories, submitted: [], round };

    // dernier tour atteint → fin de partie, on révèle tout
    if (round >= state.totalRounds) {
      return Ok({ state: next, outbound: finishedMessages(next), finished: true });
    }

    // sinon → nouveau prompt personnalisé pour chaque joueur
    const outbound = next.order.map((uuid) => promptFor(next, uuid));
    return Ok({ state: next, outbound, finished: false });
  },
};
