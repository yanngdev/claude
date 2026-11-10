#!/usr/bin/env node
// Copies the shared agent rules, skills and the Claude Code format/lint hook into a target repository.
// The copies are committed in the target, so every agent and every session (local or cloud) sees
// them without installing anything.
//
//   node scripts/sync.mjs <target-dir>            copy what <target>/.claude/rules/shared.json lists
//                                                 (rules, skills, the hook, the base oxlint / oxfmt configs)
//   node scripts/sync.mjs <target-dir> --check    exit 1 if the copies differ from this repository
//   node scripts/sync.mjs <target-dir> --init     first install: copy the templates too (never overwrites)
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RULES_DIR = join(ROOT, 'rules');
const SKILLS_DIR = join(ROOT, 'skills');
const CONFIGS_DIR = join(ROOT, 'configs');
/** Shared tool configs, extended by the target's .oxlintrc.json and oxfmt.config.ts. */
const TARGET_CONFIGS_DIR = '.config';
const TEMPLATES_DIR = join(ROOT, 'templates');
const SHARED_DIR = '.claude/rules/shared';
const MANIFEST = `${SHARED_DIR}.json`;
const TARGET_SKILLS_DIR = '.claude/skills';
/** Copied skills are prefixed, so they never collide with the repository's own skills. */
const SKILL_PREFIX = 'shared-';
const HOOK = '.claude/hooks/format-and-lint.mjs';
const DEFAULT_MANIFEST = {
  rules: ['general', 'typescript', 'react', 'tailwind-shadcn', 'testing'],
  skills: ['add-shadcn-component', 'update-dependencies', 'setup-rtk'],
  hook: true,
  configs: true,
  allowJustifiedDisable: false,
};
/** Template files copied by --init when the target does not have them yet. */
const INIT_FILES = [
  ['CLAUDE.md', 'CLAUDE.md'],
  ['AGENTS.md', 'AGENTS.md'],
  ['.claude/settings.json', '.claude/settings.json'],
  ['.oxlintrc.json', '.oxlintrc.json'],
  ['oxfmt.config.ts', 'oxfmt.config.ts'],
  ['configs/tsconfig.base.json', 'tsconfig.base.json'],
];

const [targetArg, ...flags] = process.argv.slice(2);
if (!targetArg) {
  console.error('Usage: node scripts/sync.mjs <target-dir> [--check | --init]');
  process.exit(1);
}
const target = resolve(targetArg);
const isCheck = flags.includes('--check');
const isInit = flags.includes('--init');

function sourceVersion() {
  try {
    return execFileSync('git', ['-C', ROOT, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function readManifest() {
  const file = join(target, MANIFEST);
  if (!existsSync(file)) {
    return DEFAULT_MANIFEST;
  }

  return { ...DEFAULT_MANIFEST, ...JSON.parse(readFileSync(file, 'utf8')) };
}

/** The rule as written in the target: an HTML comment (stripped by Claude Code) marks its origin. */
function renderRule(name, version) {
  const content = readFileSync(join(RULES_DIR, `${name}.md`), 'utf8');
  const banner = `<!-- Generated from yanngdev/claude@${version} (rules/${name}.md): do not edit here. -->\n`;
  // Frontmatter must stay first, so the banner goes right after it.
  const frontmatter = content.match(/^---\n[\s\S]*?\n---\n/);
  if (!frontmatter) {
    return banner + content;
  }

  return frontmatter[0] + banner + content.slice(frontmatter[0].length);
}

function checkNames(kind, names, available) {
  const unknown = names.filter((name) => !available.includes(name));
  if (unknown.length > 0) {
    throw new Error(`Unknown ${kind}: ${unknown.join(', ')}. Available: ${available.join(', ')}`);
  }
}

function expectedFiles(manifest, version) {
  checkNames('rules', manifest.rules, readdirSync(RULES_DIR).map((file) => file.replace(/\.md$/, '')));
  checkNames('skills', manifest.skills, readdirSync(SKILLS_DIR));
  const files = new Map(manifest.rules.map((name) => [`${SHARED_DIR}/${name}.md`, renderRule(name, version)]));
  for (const name of manifest.skills) {
    files.set(
      `${TARGET_SKILLS_DIR}/${SKILL_PREFIX}${name}/SKILL.md`,
      readFileSync(join(SKILLS_DIR, name, 'SKILL.md'), 'utf8'),
    );
  }
  if (manifest.configs) {
    for (const name of readdirSync(CONFIGS_DIR)) {
      // The $schema path is relative to the copy, one folder below node_modules.
      files.set(`${TARGET_CONFIGS_DIR}/${name}`, readFileSync(join(CONFIGS_DIR, name), 'utf8'));
    }
  }
  if (manifest.hook) {
    files.set(HOOK, readFileSync(join(TEMPLATES_DIR, HOOK), 'utf8'));
  }

  return files;
}

// The banner carries the version, so compare without it.
const withoutBanner = (text) => text.replace(/^<!-- Generated from .*-->\n/m, '');

function check(files) {
  const stale = [...files].filter(([path, content]) => {
    const file = join(target, path);

    return !existsSync(file) || withoutBanner(readFileSync(file, 'utf8')) !== withoutBanner(content);
  });
  for (const [path] of stale) {
    console.error(`✗ ${path} differs from yanngdev/claude`);
  }

  return stale.length === 0;
}

function write(files, manifest) {
  rmSync(join(target, SHARED_DIR), { recursive: true, force: true });
  const skillsDir = join(target, TARGET_SKILLS_DIR);
  for (const name of existsSync(skillsDir) ? readdirSync(skillsDir) : []) {
    if (name.startsWith(SKILL_PREFIX)) {
      rmSync(join(skillsDir, name), { recursive: true, force: true });
    }
  }
  for (const [path, content] of files) {
    mkdirSync(dirname(join(target, path)), { recursive: true });
    writeFileSync(join(target, path), content);
    console.log(`✓ ${path}`);
  }
  // The manifest belongs to the target once it exists (and its formatter may reformat it).
  if (!existsSync(join(target, MANIFEST))) {
    writeFileSync(join(target, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

function init() {
  for (const [from, to] of INIT_FILES) {
    if (existsSync(join(target, to))) {
      console.log(`- ${to} exists, kept`);
      continue;
    }
    // A repository with its own TypeScript setup only needs the flags of the template (see the rules).
    if (to === 'tsconfig.base.json' && existsSync(join(target, 'tsconfig.json'))) {
      continue;
    }
    mkdirSync(dirname(join(target, to)), { recursive: true });
    copyFileSync(join(TEMPLATES_DIR, from), join(target, to));
    console.log(`✓ ${to} (template: fill it in)`);
  }
}

const manifest = readManifest();
const files = expectedFiles(manifest, sourceVersion());
if (isCheck) {
  process.exit(check(files) ? 0 : 1);
}
if (isInit) {
  init();
}
write(files, manifest);
