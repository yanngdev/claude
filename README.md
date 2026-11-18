# claude

Base commune des instructions pour les agents de code.

## Contenu

| Chemin                                 | Rôle                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `rules/general.md`                     | Portée, langue, commentaires, nommage, vérifications, git (toujours chargé) |
| `rules/typescript.md`                  | Compilateur, données externes, fonctions, modules                      |
| `rules/react.md`                       | Fichiers, API React, ordre dans un composant, accessibilité            |
| `rules/tailwind-shadcn.md`             | Tailwind v4 et shadcn/ui                                               |
| `rules/testing.md`                     | Vitest, Testing Library, Playwright                                    |
| `rules/mobile-pwa.md`                  | Mobile d’abord, hors ligne, mise à jour par popup                      |
| `rules/react-three-fiber.md`           | Scènes R3F / three.js                                                  |
| `rules/cloudflare.md`                  | Déploiement Cloudflare par intégration Git                             |
| `skills/add-shadcn-component/`         | Procédure : ajouter et découper un composant shadcn                    |
| `skills/update-dependencies/`          | Procédure : mettre à jour les dépendances et réparer                   |
| `skills/setup-rtk/`                    | Procédure : installer rtk et son hook, en local ou dans un environnement cloud |
| `configs/oxlint.base.json`             | Config oxlint commune, étendue par le `.oxlintrc.json` de chaque dépôt |
| `configs/oxfmt.base.json`              | Config oxfmt commune, importée par l’`oxfmt.config.ts` de chaque dépôt |
| `templates/`                           | `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, hook, `.oxlintrc.json`, `oxfmt.config.ts`, `tsconfig.base.json` |
| `templates/scripts/`                   | `check-deps-freshness.mjs` (dépendances à jour et publiées cette année) |
| `scripts/sync.mjs`                     | Copie règles, skills et hook dans un dépôt, ou vérifie qu’ils sont à jour |

### Trois niveaux, du plus souple au plus strict

1. **Règles** (`rules/`) : texte que l’agent lit. Chacune porte un frontmatter `paths:` et n’est
   chargée que pour les fichiers concernés (`react.md` pour les `*.tsx`…), pour garder le contexte
   court. Les règles déjà vérifiées par un outil sont marquées _(lint)_ et tiennent en une ligne.
2. **Skills** (`skills/`) : procédures en plusieurs étapes, chargées seulement quand la tâche
   correspond à leur `description`.
3. **Harness** (`templates/.claude/`) : ce que Claude Code impose quoi qu’il arrive. Le hook formate
   (oxfmt) et lint (oxlint) chaque fichier modifié, et refuse les commentaires qui font taire une vérification
   (`oxlint-disable`, `@ts-ignore`…). Les configs oxlint / tsconfig font de même en CI.

Une règle qu’un outil peut vérifier va dans la config ou le hook plutôt que dans le texte.

### Économie de tokens

- **TypeScript standard** : `rules/typescript.md` (section « Plain TypeScript ») demande le TypeScript
  que les modèles maîtrisent le mieux, avec le moins de code et d’annotations possible : inférence plutôt
  qu’annotations, pas de types alambiqués, la plateforme plutôt que des helpers maison. Avec la règle
  « plus petite solution qui marche » de `rules/general.md`, c’est le levier principal.
- **oxfmt gère la mise en forme** : le hook le lance après chaque modification, et `rules/general.md`
  dit à l’agent de ne ni reformater ni relire pour ajuster la mise en page tant que `format:check` ou le
  hook ne remonte pas d’erreur.
- **rtk** compresse la sortie des commandes (voir plus bas).

## Utiliser ces règles dans un dépôt

Règles, skills, hook et configs de base sont **copiés et commités** dans chaque dépôt
(`.claude/rules/shared/`, `.claude/skills/shared-*`, `.claude/hooks/`, `.config/`). Claude Code les charge sans import ni plugin, en local
comme dans les sessions cloud, qui ne chargent pas les plugins déclarés par un dépôt.

Premier branchement d’un dépôt (crée aussi les modèles absents, sans rien écraser) :

```sh
git clone https://github.com/yanngdev/claude ../claude   # une fois
node ../claude/scripts/sync.mjs . --init
```

Puis choisir ce que le dépôt reçoit dans `.claude/rules/shared.json` (les clés absentes prennent la
valeur par défaut) :

```json
{
  "rules": ["general", "typescript", "react", "tailwind-shadcn", "testing", "mobile-pwa"],
  "skills": ["add-shadcn-component", "update-dependencies", "setup-rtk"],
  "hook": true,
  "configs": true,
  "allowJustifiedDisable": false
}
```

## Configs oxlint et oxfmt

Tous les dépôts partagent la même base, copiée dans `.config/` :

- `.oxlintrc.json` du dépôt : `"extends": ["./.config/oxlint.base.json"]`, puis seulement les
  règles propres au projet (par exemple `react/immutability` coupée pour React Three Fiber),
  chacune avec un commentaire qui dit pourquoi. Le script `lint` est `oxlint --deny-warnings`.
- `oxfmt.config.ts` du dépôt : importe `./.config/oxfmt.base.json` et ne change que ce qui diffère
  (fichiers ignorés, feuille de style Tailwind, alias internes pour le tri des imports).

La base ignore déjà les copies (`.config/`, `.claude/rules/shared/`…), sinon le formateur les
modifierait et `--check` échouerait.

`allowJustifiedDisable: true` laisse passer dans le hook une désactivation justifiée
(`// oxlint-disable-next-line <règle> -- <raison>`), pour les dépôts qui l’acceptent (`space`).

Mettre à jour après un changement ici :

```sh
git -C ../claude pull && node ../claude/scripts/sync.mjs .
```

Vérifier qu’un dépôt n’a pas dérivé (exit 1 si une copie a été modifiée à la main) :

```sh
node ../claude/scripts/sync.mjs . --check
```

Dans le dépôt, `AGENTS.md` garde ce qui lui est propre (produit, commandes, arborescence, règles
spécifiques avec un exemple réel) et l’emporte sur les règles communes ; `CLAUDE.md` importe
`@AGENTS.md`. Les deux restent bien sous 200 lignes.

Pour les sessions cloud, l’installation des dépendances (`npm ci`) va dans le script de
configuration de l’environnement, pas dans les instructions.

## rtk (sortie des commandes compressée)

[rtk](https://github.com/rtk-ai/rtk) réduit la sortie des commandes shell (tests, git, builds) avant que
l’agent la lise. Son hook Claude Code s’enregistre dans `~/.claude/settings.json` : il s’installe une
fois par machine ou par environnement cloud, pas dans chaque dépôt. La marche à suivre est dans le skill
[`setup-rtk`](skills/setup-rtk/SKILL.md) :

- **en local** : `brew install rtk` (ou le script d’installation officiel), puis `rtk init -g` ;
- **en cloud** : les lignes du skill vont dans le script de configuration de l’environnement, qui
  l’installe avant chaque nouvelle session. Demander à Claude « installe rtk dans cet environnement »
  suffit : il propose la modification à valider.

`rules/general.md` dit à l’agent comment s’en servir (rien à taper, `rtk bypass` pour la sortie complète).

## Faire vivre les règles

- Quand un agent refait la même erreur, ajouter une ligne : ici si elle vaut partout, sinon dans
  l’`AGENTS.md` du dépôt.
- Quand une règle devient vérifiable par un outil, déplacer la vérification dans la config ou le
  hook et réduire la règle à une ligne _(lint)_.
- Donner la raison et un exemple plutôt que des majuscules : les modèles actuels suivent les
  consignes à la lettre, et l’insistance les pousse à en faire trop.
