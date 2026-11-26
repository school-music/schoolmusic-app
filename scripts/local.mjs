import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const backend = root + 'out/backend/';
const source = backend + 'docs/schoolmusic.sql';
const output = backend + 'schoolmusic-mobile-init.sql';
const commit = 'fdbef8756396a368b839f08e669c3055e5fc3377';
const qa = process.argv.includes('--qa');
const args = process.argv.slice(2).filter((arg) => arg !== '--qa');

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd, stdio: 'inherit',
    env: { ...process.env, BUILDX_CONFIG: process.env.BUILDX_CONFIG ?? root + 'out/docker-buildx' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!existsSync(source)) {
  run('git', ['clone', '--no-checkout', 'https://github.com/school-music/schoolmusic-backend.git', backend]);
  run('git', ['checkout', '--detach', commit], backend);
}
const sql = readFileSync(source, 'utf8');
const malformedTuple = "'Goldberg Variations - Aria', 3, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', 'https://archive.org/download/bach-goldberg-variations/Aria.mp3', 'Classical', 235000, 1, '2026-10-14 12:00:00';";
if (sql.split(malformedTuple).length !== 2) throw new Error('Pinned SQL seed tuple did not match');
const fixed = sql.replace(malformedTuple, malformedTuple.slice(0, -1) + ');');
if (!existsSync(output)) writeFileSync(output, fixed, { flag: 'wx' });
if (readFileSync(output, 'utf8') !== fixed) throw new Error('Generated local SQL seed differs from the expected seed');

const files = [
  '-f', root + 'docker/arm64-build.compose.yml',
  '-f', root + 'docker/database-build.compose.yml',
  ...(qa ? ['--project-name', 'schoolmusic-mobile-qa', '-f', root + 'docker/qa.compose.yml'] : []),
];
run(process.execPath, ['scripts/backend.mjs', ...files,
  ...(args.length ? args : ['up', '-d', '--wait', '--wait-timeout', '120'])]);
