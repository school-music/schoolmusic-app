import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const qa = process.argv.includes('--qa');
const route = qa ? ['--qa'] : [];
const args = process.argv.slice(2).filter((arg) => arg !== '--qa');

function run(executable, options, input) {
  const result = spawnSync(executable, options, { input, stdio: [input ? 'pipe' : 'inherit', 'inherit', 'inherit'] });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(process.execPath, ['scripts/local.mjs', ...route, ...(args.length ? args : ['up', '-d', '--wait', '--wait-timeout', '120'])]);
run(process.execPath, ['scripts/complete-db.mjs', ...route]);
run('docker', [
  'exec', '-i', qa ? 'schoolmusic-mobile-qa-db-1' : 'schoolmusic-db', 'sh', '-c',
  'MYSQL_PWD="$MARIADB_ROOT_PASSWORD" exec mysql --user=root "$MARIADB_DATABASE"',
], readFileSync(new URL('../docker/spotify-playback.sql', import.meta.url)));
