import { qaPairs } from './blocks';
import type { Page } from './data';
import { SITE } from './site';

/** FAQPage JSON-LD construit à partir des H3 « question » et de leurs réponses d'origine. */
export function faqGraph(page: Page) {
  const pairs = qaPairs(page.blocks).filter((p) => p.q.trim().endsWith('?') && p.a.some((b) => 'text' in b));
  if (!pairs.length) return [];
  return [
    {
      '@type': 'FAQPage',
      '@id': `${SITE.url}${page.path}#faq`,
      mainEntity: pairs.map((p) => ({
        '@type': 'Question',
        name: p.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: p.a
            .map((b) => ('text' in b && b.type !== 'button' ? b.text : ''))
            .filter(Boolean)
            .join(' '),
        },
      })),
    },
  ];
}
