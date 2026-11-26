import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('out/backend/docs/schoolmusic.sql', root), 'utf8');
const target = process.argv.includes('--qa') ? 'schoolmusic-mobile-qa-db-1' : 'schoolmusic-db';
const tableCheck = "SELECT TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'song_vote_counts';";

function sql(input) {
  const result = spawnSync('docker', [
    'exec', '-i', target, 'sh', '-c',
    'MYSQL_PWD="$MARIADB_ROOT_PASSWORD" exec mysql --batch --skip-column-names --user=root "$MARIADB_DATABASE"',
  ], { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  return result.stdout.trim();
}

const state = sql(tableCheck);
if (state === 'VIEW') {
  console.log('SchoolMusic database view already exists.');
  process.exit(0);
}
if (state !== 'BASE TABLE') throw new Error('Expected the upstream song_vote_counts placeholder table.');
const existingIndexes = sql("SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'songs' AND INDEX_NAME = 'PRIMARY';");
if (existingIndexes !== '0') throw new Error('Unexpected schema state. Select a fresh local database volume.');
const header = source.slice(0, source.indexOf('CREATE TABLE `artists`'));
const tail = source.slice(source.indexOf('CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `song_vote_counts`'));
if (!header || !tail.startsWith('CREATE ALGORITHM=')) throw new Error('Pinned SQL structure differs from expected schema.');
sql(header + '\nDROP TABLE `song_vote_counts`;\n' + tail);
if (sql(tableCheck) !== 'VIEW') throw new Error('Could not verify SchoolMusic vote-count view.');
console.log('SchoolMusic database view, indexes, and constraints are ready.');
