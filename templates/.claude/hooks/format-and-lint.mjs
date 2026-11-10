// Claude Code PostToolUse hook: formats (oxfmt) and lints (oxlint) the file that was just written
// or edited, and rejects comments that silence a check. Problems are sent back to Claude
// (exit code 2) so that it fixes them right away.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Comments that silence a check: the shared rules ask to restructure the code instead. */
const SILENCERS = /(eslint|oxlint)-disable|@ts-(ignore|expect-error|nocheck)/;
/** A silencer followed by `-- reason`, accepted when the repository allows justified ones. */
const JUSTIFIED = /(eslint|oxlint)-disable\S*\s+[\w/@-]+(,\s*[\w/@-]+)*\s+--\s+\S/;
const MANIFEST = join(process.env.CLAUDE_PROJECT_DIR ?? '.', '.claude/rules/shared.json');
const allowsJustified =
  existsSync(MANIFEST) && JSON.parse(readFileSync(MANIFEST, 'utf8')).allowJustifiedDisable === true;

const input = JSON.parse(await new Response(process.stdin).text());
const file = input.tool_input?.file_path;
if (!file || !existsSync(file) || !/\.(m?[jt]sx?|json|css|md)$/.test(file)) {
  process.exit(0);
}
if (/node_modules|\/dist\//.test(file)) {
  process.exit(0);
}

const run = (command, args) => execFileSync('npx', [command, ...args], { encoding: 'utf8', stdio: 'pipe' });

try {
  run('oxfmt', ['--no-error-on-unmatched-pattern', file]);
} catch {
  // Unsupported or ignored file: nothing to format.
}

if (!/\.m?[jt]sx?$/.test(file)) {
  process.exit(0);
}

const silenced = readFileSync(file, 'utf8')
  .split('\n')
  .map((line, index) => ({ line, number: index + 1 }))
  .filter(({ line }) => SILENCERS.test(line) && !(allowsJustified && JUSTIFIED.test(line)));
if (silenced.length > 0) {
  const lines = silenced.map(({ line, number }) => `  ${number}: ${line.trim()}`).join('\n');
  process.stderr.write(`${file} silences a check; restructure the code instead:\n${lines}\n`);
  process.exit(2);
}

try {
  run('oxlint', ['--deny-warnings', file]);
} catch (error) {
  process.stderr.write(`oxlint reported problems in ${file}:\n${error.stdout ?? error.message}`);
  process.exit(2);
}
