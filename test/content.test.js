import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { compile } from '../build.js';

const dom = new JSDOM('<main></main>', { url: 'https://example.com/philosophies/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
const { renderContent, refreshPhilosophies } = await import('../browser.js');
const baseline = JSON.parse(await readFile(new URL('../content.json', import.meta.url), 'utf8'));

test('published philosophies include all accepted sections and resolve every internal link', async () => {
  const markdown = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const content = await compile(markdown);
  assert.deepEqual(content, baseline);
  const page = new JSDOM(content.html).window.document;
  assert.equal(page.querySelectorAll('h2').length, 4);
  assert.equal(page.querySelectorAll('h3').length, 5);
  assert.ok(page.getElementById('1-dont-be-greedy-dont-be-evil'));
  for (const link of page.querySelectorAll('a[href^="#"]')) assert.ok(page.getElementById(link.hash.slice(1)), link.hash);
  assert.doesNotMatch(content.html, /Additional principles to discuss|Review sequence/);
});

test('compiler refuses executable markup and unsafe links', async () => {
  for (const input of ['# Title\n\n## Section\n\n<script>alert(1)</script>', '# Title\n\n## Section\n\n[bad](javascript:alert(1))']) {
    await assert.rejects(compile(input));
  }
});

test('runtime strips executable and tracking markup from remote content', () => {
  const element = document.createElement('article');
  renderContent(element, { ...baseline, html: '<h1>Title</h1><h2>Section</h2><script>alert(1)</script><img src="https://tracker.example"><a href="javascript:alert(1)" onclick="alert(1)">Bad</a><p>Safe</p>' });
  assert.equal(element.querySelector('script,img,[onclick],[href]'), null);
  assert.match(element.textContent, /Safe/);
});

test('refresh applies updated content and failures preserve the full static document', async () => {
  const element = document.createElement('article');
  renderContent(element, baseline);
  let failures = 0;
  await refreshPhilosophies(element, { fetcher: async () => { throw new Error('offline'); }, onError: () => failures++ });
  assert.equal(failures, 1);
  assert.match(element.textContent, /Every line\. Every word\./);
  const changed = { ...baseline, sha256: 'f'.repeat(64), html: '<h1>Title</h1><h2>Updated principle</h2>' };
  await refreshPhilosophies(element, { fetcher: async () => new Response(JSON.stringify(changed)) });
  assert.match(element.textContent, /Updated principle/);
  await refreshPhilosophies(element, { fetcher: async () => new Response('{broken') });
  assert.match(element.textContent, /Updated principle/);
});
