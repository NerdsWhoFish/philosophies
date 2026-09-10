import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname } from 'node:path';

const repo = 'NerdsWhoFish/philosophies';

export async function fetchCanonical(fetcher = fetch) {
  async function request(url, limit) {
    const response = await fetcher(url, { signal: AbortSignal.timeout(15000), redirect: 'error' });
    if (!response.ok) throw new Error(`Canonical source returned HTTP ${response.status}`);
    const text = await response.text();
    if (text.length > limit) throw new Error('Canonical response too large');
    return text;
  }
  const head = JSON.parse(await request(`https://api.github.com/repos/${repo}/git/ref/heads/main`, 10000));
  const revision = head.object?.sha;
  if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Invalid canonical revision');
  const base = `https://raw.githubusercontent.com/${repo}/${revision}`;
  const [markdown, json] = await Promise.all([request(`${base}/README.md`, 100000), request(`${base}/content.json`, 250000)]);
  const content = JSON.parse(json);
  if (content.schema !== 1 || content.sha256 !== createHash('sha256').update(markdown).digest('hex')) throw new Error('Canonical document and rendering differ');
  return { revision, markdown, content, json };
}

export function duskNote({ revision, markdown }) {
  return `---\ndusk: v1alpha1\nnote: reference\npinned: true\nstatus: open\n---\n\n# Philosophies for every session\n\nJoey applies these adopted Nerds Who Fish philosophies across his professional and personal work. Read the complete document before acting, even when dusk_context only names this pinned note. Apply them alongside the repository's instructions and surface conflicts rather than silently ignoring either.\n\nCanonical source: https://github.com/${repo}/blob/${revision}/README.md\n\nThis is a generated mirror. Edit the canonical repository through human-reviewed pull requests; the catalog's scheduled synchronization updates this note.\n\n${markdown}`;
}

export async function syncCanonical(destination, kind = 'site', fetcher = fetch) {
  if (!['site', 'dusk'].includes(kind)) throw new Error('Unknown publication target');
  const source = await fetchCanonical(fetcher);
  const next = kind === 'dusk' ? duskNote(source) : source.json;
  let previous;
  try { previous = await readFile(destination, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (previous === next) return false;
  await mkdir(dirname(destination), { recursive: true });
  const temporary = `${destination}.${process.pid}.tmp`;
  await writeFile(temporary, next);
  await rename(temporary, destination);
  return true;
}
