import DOMPurify from 'dompurify';

export const contentURL = 'https://raw.githubusercontent.com/NerdsWhoFish/philosophies/refs/heads/main/content.json';

export function renderContent(element, content) {
  if (content.schema !== 1 || !/^[a-f0-9]{64}$/.test(content.sha256) || typeof content.html !== 'string' || content.html.length > 200000) {
    throw new Error('Invalid philosophies document');
  }
  const safe = DOMPurify.sanitize(content.html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'code', 'pre', 'blockquote', 'hr', 'br'],
    ALLOWED_ATTR: ['id', 'href'],
    ALLOWED_URI_REGEXP: /^(?:https:\/\/|#)/,
  });
  const template = document.createElement('template');
  template.innerHTML = safe;
  if (!template.content.querySelector('h1') || !template.content.querySelector('h2')) throw new Error('Incomplete philosophies document');
  element.replaceChildren(template.content);
  element.dataset.revision = content.sha256;
}

export async function refreshPhilosophies(element, { fetcher = fetch, onError = () => {} } = {}) {
  if (!element) return;
  try {
    const response = await fetcher(contentURL, { credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Philosophies refresh failed');
    const text = await response.text();
    if (text.length > 250000) throw new Error('Philosophies response too large');
    const content = JSON.parse(text);
    if (content.sha256 !== element.dataset.revision) renderContent(element, content);
  } catch {
    onError();
  }
}
