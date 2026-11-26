import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { operations, schemas } from './openapi-overlay.mjs';

const root = new URL('../', import.meta.url);
const snapshot = new URL('api/openapi.json', root);
const output = new URL('out/openapi.mobile.json', root);
const pull = process.argv.includes('--pull');

if (pull) {
  const baseUrl = process.env.SCHOOLMUSIC_SCHEMA_URL ?? 'http://127.0.0.1:8080';
  const response = await fetch(new URL('/openapi/v1.json', baseUrl));
  if (!response.ok) throw new Error('OpenAPI download failed with ' + response.status);
  const fresh = await response.json();
  delete fresh.servers;
  if (!fresh.openapi || !fresh.paths) throw new Error('Invalid OpenAPI document');
  await mkdir(new URL('api/', root), { recursive: true });
  await writeFile(snapshot, JSON.stringify(fresh, null, 2) + '\n');
}

const document = JSON.parse(await readFile(snapshot, 'utf8'));
const paths = {};
for (const [signature, [operationId, schema, status = '200']] of Object.entries(operations)) {
  const [method, route] = signature.split(' ');
  const entry = Object.keys(document.paths).find((candidate) => candidate.toLowerCase() === route);
  const operation = document.paths[entry]?.[method];
  if (!operation) throw new Error('Backend operation missing: ' + signature);
  const responses = { ...operation.responses };
  if (schema) {
    for (const [code, response] of Object.entries(responses)) {
      if (code.startsWith('2') && !response.content) delete responses[code];
    }
    for (const code of status.split(',')) {
      responses[code] = { description: 'Success', content: { 'application/json': { schema } } };
    }
  } else if (status !== '200' && !responses[status]) {
    responses[status] = { description: 'Success' };
  }
  paths[entry] ??= {};
  paths[entry][method] = { ...operation, operationId, responses };
}
document.paths = paths;
document.components ??= {};
document.components.schemas = { ...document.components.schemas, ...schemas };
await mkdir(new URL('out/', root), { recursive: true });
await writeFile(output, JSON.stringify(document, null, 2) + '\n');
