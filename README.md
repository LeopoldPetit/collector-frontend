# collector-frontend

Application web du projet **Collector.shop**, construite avec **React + Vite**. Propose le catalogue public d'articles et l'espace vendeur.

## Rôle dans le projet

- Affiche le **catalogue public** des articles publiés (sans authentification)
- Fournit l'**espace vendeur** : connexion via Keycloak, publication d'un article, suivi du statut après contrôle automatique

## Stack

| Composant | Rôle |
|---|---|
| React + Vite | Interface utilisateur, build rapide |
| Keycloak (OIDC/OAuth2) | Connexion/redirection pour l'espace vendeur |
| [`collector-catalog-api`](https://github.com/LeopoldPetit/collector-catalog-api) | API consommée pour le catalogue et la publication d'articles |

## Pages principales

| Page | Description | Auth |
|---|---|---|
| Catalogue public | Liste des articles avec statut `published` | Public |
| Connexion vendeur | Redirection vers Keycloak (OIDC) | — |
| Espace vendeur | Formulaire de publication d'un article, suivi du statut | Vendeur (JWT) |

## Backlog (US concernées)

- **US1** — Connexion vendeur via Keycloak, redirection frontend
- **US5** — Page catalogue public consommant `GET /articles?status=published`
- Étape 6 — Formulaire de publication d'article dans l'espace vendeur
- **US6** — Pipeline CI/CD (lint, tests, scan de vulnérabilités)

## Démarrage local

Nécessite l'environnement de développement fourni par [`collector-infra`](https://github.com/LeopoldPetit/collector-infra) (Keycloak) et l'API [`collector-catalog-api`](https://github.com/LeopoldPetit/collector-catalog-api) démarrée.

```bash
npm install
npm run dev
```

## Tests

```bash
npm run test
```

## Documentation liée

Voir le repo [`collector-docs`](https://github.com/LeopoldPetit/collector-docs) pour le plan général, l'architecture détaillée et le backlog complet du projet.
