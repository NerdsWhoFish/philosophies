import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function renderPage(template, destination, contentPath = new URL('./content.json', import.meta.url)) {
  const content = JSON.parse(await readFile(contentPath, 'utf8'));
  const source = await readFile(template, 'utf8');
  if (!source.includes('{{PHILOSOPHIES}}')) throw new Error('Missing philosophies placeholder');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, source.replace('{{PHILOSOPHIES}}', content.html));
}

export async function compile(markdown) {
  const { Marked } = await import('marked');
  const { default: GithubSlugger } = await import('github-slugger');
  const slugger = new GithubSlugger();
  const headings = [];
  const parser = new Marked({
    walkTokens(token) {
      if (token.type === 'html' || token.type === 'image') throw new Error('HTML and images are not supported');
      if (token.type === 'link' && !token.href.startsWith('#') && !token.href.startsWith('https://')) {
        throw new Error('Links must be HTTPS or local anchors');
      }
    },
    renderer: {
      heading({ depth, text, tokens }) {
        const rendered = this.parser.parseInline(tokens);
        const id = slugger.slug(text);
        if (depth === 2) headings.push({ id, text });
        return `<h${depth} id="${id}">${rendered}</h${depth}>\n`;
      },
    },
  });
  const html = parser.parse(markdown);
  if (headings.length < 1) throw new Error('No philosophy sections found');
  return { schema: 1, sha256: createHash('sha256').update(markdown).digest('hex'), headings, html };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const markdown = await readFile(new URL('./README.md', import.meta.url), 'utf8');
  const json = JSON.stringify(await compile(markdown), null, 2) + '\n';
  const target = new URL('./content.json', import.meta.url);
  if (process.argv.includes('--check')) {
    if (await readFile(target, 'utf8') !== json) throw new Error('Run npm run build and commit content.json');
  } else {
    await writeFile(target, json);
  }
}
