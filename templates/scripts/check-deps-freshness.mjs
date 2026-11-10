// Checks the dependency policy: every direct dependency must be on its latest
// version, and that version must have been published during the current year
// (proven libraries that are still maintained). Run with `npm run deps:fresh`.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const year = Number(process.env.DEPS_MIN_YEAR ?? new Date().getFullYear());
const names = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });

const problems = [];
for (const name of names) {
  const info = JSON.parse(
    execFileSync('npm', ['view', name, 'version', 'time', '--json'], { encoding: 'utf8' }),
  );
  const installed = JSON.parse(
    readFileSync(join(root, 'node_modules', name, 'package.json'), 'utf8'),
  ).version;
  const published = new Date(info.time[installed]);
  const status = [];
  if (installed !== info.version) status.push(`outdated (latest ${info.version})`);
  if (published.getFullYear() < year)
    status.push(`last published ${info.time[installed].slice(0, 10)}`);
  console.log(`${status.length ? '✗' : '✓'} ${name}@${installed} ${status.join(', ')}`);
  if (status.length) problems.push(name);
}

if (problems.length) {
  console.error(`\n${problems.length} dependency(ies) break the policy: ${problems.join(', ')}`);
  process.exit(1);
}
