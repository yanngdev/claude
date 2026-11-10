# claude

Base commune des instructions pour les agents de code (Claude Code d’abord, mais lisible par
Codex, Cursor, Copilot…) de tous mes dépôts : règles de style par langage et par techno,
modèles de `CLAUDE.md` / `AGENTS.md`, réglages et hook Claude Code, configs oxlint / oxfmt /
tsconfig.

Les règles sont tirées de ce que mes dépôts (`arcade`, `atlas`, `pantry-pal`, `space`,
`wgcompris`) avaient en commun. Elles sont en anglais (comme le code) ; seul ce README est en
français.

## Contenu

| Chemin                            | Rôle                                                                 |
| --------------------------------- | -------------------------------------------------------------------- |
| `rules/general.md`                | Portée, langue, commentaires, nommage, vérifications, git            |
| `rules/typescript.md`             | Compilateur, données externes, fonctions, modules (`*.ts`, `*.tsx`)  |
| `rules/react.md`                  | Fichiers, API React, ordre dans un composant, accessibilité (`*.tsx`) |
| `rules/tailwind-shadcn.md`        | Tailwind v4 et shadcn/ui                                             |
| `rules/testing.md`                | Vitest, Testing Library, Playwright                                  |
| `rules/mobile-pwa.md`             | Mobile d’abord, hors ligne, mise à jour par popup                    |
| `rules/react-three-fiber.md`      | Scènes R3F / three.js                                                |
| `rules/cloudflare.md`             | Déploiement Cloudflare par intégration Git                           |
| `templates/`                      | `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, hook, configs     |
| `templates/scripts/`              | `check-deps-freshness.mjs` (dépendances à jour et publiées cette année) |
| `scripts/sync.mjs`                | Copie les règles dans un dépôt, ou vérifie qu’elles sont à jour      |

Chaque règle porte un frontmatter `paths:` : Claude Code ne la charge que lorsqu’il travaille
sur des fichiers correspondants (`react.md` pour les `*.tsx`…). `general.md` n’en a pas et se
charge toujours.

## Utiliser ces règles dans un dépôt

Les règles sont **copiées et commitées** dans chaque dépôt, dans `.claude/rules/shared/`.
Claude Code charge automatiquement tout `.claude/rules/**/*.md`, sans import ni plugin, en local
comme dans les sessions cloud (qui ne chargent pas les plugins déclarés par le dépôt).

Premier branchement d’un dépôt (crée aussi les modèles absents, sans rien écraser) :

```sh
git clone https://github.com/yanngdev/claude ../claude   # une fois
node ../claude/scripts/sync.mjs . --init
```

Puis choisir les règles du dépôt dans `.claude/rules/shared.json` :

```json
{ "rules": ["general", "typescript", "react", "tailwind-shadcn", "testing", "mobile-pwa"], "hook": true }
```

Mettre à jour après un changement ici :

```sh
git -C ../claude pull && node ../claude/scripts/sync.mjs .
```

Vérifier qu’un dépôt n’a pas dérivé (exit 1 si une copie a été modifiée à la main) :

```sh
node ../claude/scripts/sync.mjs . --check
```

Dans le dépôt, `AGENTS.md` garde ce qui lui est propre (produit, commandes, arborescence,
règles spécifiques) et l’emporte sur les règles communes ; `CLAUDE.md` importe `@AGENTS.md`.

## Choix faits là où mes dépôts divergeaient

- **React par namespace** (`React.useState`) : `arcade`, `atlas`, `wgcompris` le font ;
  `space` et `pantry-pal` utilisent des imports nommés et seront à migrer (ou à surcharger dans
  leur `AGENTS.md`).
- **Exports nommés uniquement** : `space` a des `export default` pour `React.lazy`, la règle
  donne la forme `.then((module) => ({ default: module.X }))`.
- **Guillemets simples, 120 colonnes** dans le modèle oxfmt (majorité) ; `atlas` (doubles,
  100) et `space` (100) gardent leur config, c’est le formateur qui fait foi.
- **Arborescence** : pas imposée par les règles communes (`features/<f>/ui|lib` dans `space`
  et `pantry-pal`, `components/` + `lib/` + `hooks/` dans `arcade` et `wgcompris`) ; chaque
  `AGENTS.md` décrit la sienne.
