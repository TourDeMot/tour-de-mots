# Tour de mots

Pour lancer le projet, dans les dossiers /app et /ws, faire les étapes suivantes:
- bun install 
- bun run dev 
- enjoy <3

## Détail de l'architecture react:

- **`core/`** = ce qui est initialisé une seule fois et vit toute la durée de l'app (connexion WebSocket)
- **`features/`** = la logique métier découpée par domaine (game, player, etc.)
- **`pages/`** = les composants rendus par le router (une page = une route)
- **`shared/`** = réutilisable n'importe où, sans dépendance métier (composants UI génériques, hooks utilitaires, types communs)
- **`App.tsx`** — Le composant racine React.
- **`index.html`** — Le shell HTML est obligatoire pour la SPA (Single Page Application). C'est le `<div id="root">` + le `<script>` qui charge React.
- **`index.ts`** — C'est le serveur HTTP Bun.
- **`main.tsx`** — Le fichier de bootstrap React(createRoot, StrictMode, render). Ce code ne peut pas vivre dans un composant React. Il doit exister quelque part en dehors de l'arbre React.

## Comment les messages WebSocket sont traités dans React:

Serveur WebSocket
      │
      │ envoie un message JSON
      ▼
useWs (useEffect + socket.onmessage)
      │
      │ parse le JSON → dispatch(message)
      ▼
useReducer
      │
      │ appelle handleMessage(state actuel, message)
      ▼
handleMessage (handlers/index.ts)
      │
      │ trouve le bon handler → retourne le nouvel état
      ▼
React met à jour state
      │
      │ state a changé → re-render
      ▼
App.tsx se ré-affiche avec les nouvelles données
