// Claude Code PostToolUse hook: formats (oxfmt) and lints (oxlint) the file
// that was just written or edited. Lint errors are sent back to Claude
// (exit code 2) so that it fixes them right away.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const input = JSON.parse(await new Response(process.stdin).text());
const file = input.tool_input?.file_path;
if (!file || !existsSync(file) || !/\.(m?[jt]sx?|json|css|md)$/.test(file)) process.exit(0);
if (/node_modules|\/dist\//.test(file)) process.exit(0);

const run = (command, args) =>
  execFileSync('npx', [command, ...args], { encoding: 'utf8', stdio: 'pipe' });

try {
  run('oxfmt', ['--no-error-on-unmatched-pattern', file]);
} catch {
  // Unsupported or ignored file: nothing to format.
}

if (/\.m?[jt]sx?$/.test(file)) {
  try {
    run('oxlint', ['--deny-warnings', file]);
  } catch (error) {
    process.stderr.write(`oxlint reported problems in ${file}:\n${error.stdout ?? error.message}`);
    process.exit(2);
  }
}
