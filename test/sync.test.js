import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { fetchCanonical, syncCanonical, duskNote } from '../sync.js';

const markdown = '# Philosophies\n\n## Commitment\n';
const revision = 'a'.repeat(40);
const content = { schema: 1, sha256: createHash('sha256').update(markdown).digest('hex'), html: '<h1>Philosophies</h1><h2>Commitment</h2>' };
const fetcher = async (url) => {
  if (url.endsWith('/git/ref/heads/main')) return Response.json({ object: { sha: revision } });
  assert.ok(url.includes(`/${revision}/`), 'all documents must use the same immutable commit');
  return url.endsWith('/README.md') ? new Response(markdown) : Response.json(content);
};

test('synchronization pins one source revision and preserves prior data on failure', async () => {
  const destination = join(await mkdtemp(join(tmpdir(), 'nwf-sync-')), 'content.json');
  assert.equal(await syncCanonical(destination, 'site', fetcher), true);
  assert.equal(await syncCanonical(destination, 'site', fetcher), false);
  const old = await readFile(destination, 'utf8');
  await assert.rejects(syncCanonical(destination, 'site', async () => new Response('', { status: 503 })));
  assert.equal(await readFile(destination, 'utf8'), old);
});

test('synchronization rejects mismatched source and rendering', async () => {
  await assert.rejects(fetchCanonical(async (url) => url.endsWith('/README.md') ? new Response('tampered') : fetcher(url)), /differ/);
});

test('Dusk mirror is globally pinned, complete, and identifies its source revision', async () => {
  const note = duskNote(await fetchCanonical(fetcher));
  assert.match(note, /pinned: true/);
  assert.doesNotMatch(note, /^refs:/m);
  assert.ok(note.includes(`/blob/${revision}/README.md`));
  assert.ok(note.endsWith(markdown));
});
