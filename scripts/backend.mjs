import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const checkout = fileURLToPath(new URL('../out/backend/', import.meta.url));
const override = fileURLToPath(new URL('../docker/mobile.compose.yml', import.meta.url));
const commit = 'fdbef8756396a368b839f08e669c3055e5fc3377';
const envFile = checkout + '.env';

function run(command, args, cwd = root, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  return result.stdout?.trim();
}

if (!existsSync(checkout + '.git')) {
  mkdirSync(root + 'out', { recursive: true });
  run('git', ['init', checkout]);
  run('git', ['remote', 'add', 'origin', 'https://github.com/school-music/schoolmusic-backend.git'], checkout);
}
if (spawnSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: checkout }).status !== 0) {
  run('git', ['fetch', '--depth=1', 'origin', commit], checkout);
  run('git', ['checkout', '--detach', commit], checkout);
}
if (run('git', ['rev-parse', 'HEAD'], checkout, true) !== commit) {
  throw new Error('out/backend is not checked out at the pinned SchoolMusic commit');
}
if (!existsSync(envFile)) {
  const secretKeys = ['DB_ROOT_PASSWORD', 'DB_PASSWORD', 'REDIS_PASSWORD', 'JWT_KEY'];
  const config = secretKeys.map((key) => key + '=' + randomBytes(32).toString('hex'));
  writeFileSync(envFile, config.concat('DB_USER=schoolmusic', '').join('\n'), { flag: 'wx', mode: 0o600 });
}

const args = process.argv.slice(2);
run('docker', ['compose', '--project-name', 'schoolmusic-mobile', '--env-file', envFile,
  '-f', checkout + 'docker-compose.yml', '-f', override, ...(args.length ? args : ['up', '-d', '--wait', '--wait-timeout', '120'])], checkout);
