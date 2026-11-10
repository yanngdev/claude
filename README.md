# claude

Base commune des instructions pour les agents de code (Claude Code d’abord, mais lisible par
Codex, Cursor, Copilot…) de tous mes dépôts : règles de style par langage et par techno, skills
partagés, modèles de `CLAUDE.md` / `AGENTS.md`, réglages et hook Claude Code, configs oxlint /
oxfmt / tsconfig.

Les règles sont tirées de ce que mes dépôts (`arcade`, `atlas`, `pantry-pal`, `space`,
`wgcompris`) avaient en commun. Elles sont en anglais (comme le code) ; seul ce README est en
français.

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
| `templates/`                           | `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, hook, configs       |
| `templates/scripts/`                   | `check-deps-freshness.mjs` (dépendances à jour et publiées cette année) |
| `scripts/sync.mjs`                     | Copie règles, skills et hook dans un dépôt, ou vérifie qu’ils sont à jour |

### Trois niveaux, du plus souple au plus strict

1. **Règles** (`rules/`) : texte que l’agent lit. Chacune porte un frontmatter `paths:` et n’est
   chargée que pour les fichiers concernés (`react.md` pour les `*.tsx`…), pour garder le contexte
   court. Les règles déjà vérifiées par un outil sont marquées _(lint)_ et tiennent en une ligne.
2. **Skills** (`skills/`) : procédures en plusieurs étapes, chargées seulement quand la tâche
   correspond à leur `description`.
3. **Harness** (`templates/.claude/`) : ce que Claude Code impose quoi qu’il arrive. Le hook formate
   et lint chaque fichier modifié, et refuse les commentaires qui font taire une vérification
   (`oxlint-disable`, `@ts-ignore`…). Les configs oxlint / tsconfig font de même en CI.

Une règle qu’un outil peut vérifier va dans la config ou le hook plutôt que dans le texte.

## Utiliser ces règles dans un dépôt

Règles, skills et hook sont **copiés et commités** dans chaque dépôt (`.claude/rules/shared/`,
`.claude/skills/shared-*`, `.claude/hooks/`). Claude Code les charge sans import ni plugin, en local
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
  "skills": ["add-shadcn-component", "update-dependencies"],
  "hook": true,
  "allowJustifiedDisable": false
}
```

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

## Faire vivre les règles

- Quand un agent refait la même erreur, ajouter une ligne : ici si elle vaut partout, sinon dans
  l’`AGENTS.md` du dépôt.
- Quand une règle devient vérifiable par un outil, déplacer la vérification dans la config ou le
  hook et réduire la règle à une ligne _(lint)_.
- Donner la raison et un exemple plutôt que des majuscules : les modèles actuels suivent les
  consignes à la lettre, et l’insistance les pousse à en faire trop.

## Choix faits là où mes dépôts divergeaient

- **React par namespace** (`React.useState`) : `arcade`, `atlas`, `wgcompris` le font ; `space` et
  `pantry-pal` utilisent des imports nommés et seront à migrer (ou à surcharger dans leur
  `AGENTS.md`).
- **Exports nommés uniquement** : `space` a des `export default` pour `React.lazy`, la règle donne
  la forme `.then((module) => ({ default: module.X }))`.
- **Désactivation de règle** : interdite dans `arcade`, `atlas`, `wgcompris` ; acceptée avec une
  raison dans `space` (`allowJustifiedDisable`).
- **Guillemets simples, 120 colonnes** dans le modèle oxfmt (majorité) ; `atlas` (doubles, 100) et
  `space` (100) gardent leur config, c’est le formateur qui fait foi.
- **Arborescence** : pas imposée par les règles communes (`features/<f>/ui|lib` dans `space` et
  `pantry-pal`, `components/` + `lib/` + `hooks/` dans `arcade` et `wgcompris`) ; chaque
  `AGENTS.md` décrit la sienne.
