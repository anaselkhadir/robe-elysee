import type { Block, Img, TextBlock } from './data';

export type Section = { heading: TextBlock | null; blocks: Block[] };

const TEXT_TYPES = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'li', 'blockquote'];
export const isText = (b: Block): b is TextBlock => TEXT_TYPES.includes(b.type);

/** Découpe une page en sections à chaque titre du niveau demandé (H2 par défaut). */
export function splitSections(blocks: Block[], levels = ['h2']): Section[] {
  const out: Section[] = [{ heading: null, blocks: [] }];
  for (const b of blocks) {
    if (b.type === 'h1') continue;
    if (isText(b) && levels.includes(b.type)) out.push({ heading: b, blocks: [] });
    else out[out.length - 1].blocks.push(b);
  }
  return out.filter((s) => s.heading || s.blocks.length);
}

export const findSection = (blocks: Block[], startsWith: string) =>
  splitSections(blocks, ['h2']).find((s) => s.heading?.text.startsWith(startsWith));

export const images = (blocks: Block[]) => blocks.filter((b): b is { type: 'img' } & Img => b.type === 'img');

export const paragraphs = (blocks: Block[]) => blocks.filter((b): b is TextBlock => b.type === 'p' && isText(b) && b.text.trim().length > 1);

/** Question/réponse : chaque H3 suivi de son contenu jusqu'au prochain titre. */
export function qaPairs(blocks: Block[]) {
  const out: { q: string; a: Block[] }[] = [];
  for (const b of blocks) {
    if (b.type === 'h3' && isText(b)) out.push({ q: b.text, a: [] });
    else if (out.length && b.type !== 'h2') out[out.length - 1].a.push(b);
  }
  return out;
}
