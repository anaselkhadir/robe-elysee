import Image from 'next/image';
import Link from 'next/link';
import { Blocks, RichText } from '@/components/ui/Rich';
import { images, paragraphs, splitSections, type Section } from '@/lib/blocks';
import type { Block } from '@/lib/data';
import { RDV } from '@/lib/site';

/**
 * Rend le contenu d'une page (blocs importés de WordPress) en chapitres.
 * Quatre familles de mise en page alternent selon le contenu du chapitre :
 *  - « gallery » : texte + plusieurs images en mosaïque décalée
 *  - « portrait » : texte à gauche, une image portrait à droite (ou inversé)
 *  - « wide »    : titre pleine largeur, image paysage, texte en colonnes
 *  - « text »    : typographique, titre en marge
 * Les titres H2/H3 d'origine sont conservés (référencement).
 */
export function Chapters({ blocks, skipFirstImages = 0, accordions = false }: { blocks: Block[]; skipFirstImages?: number; accordions?: boolean }) {
  const sections = splitSections(blocks, ['h2']);
  let skipped = 0;
  return (
    <div className="chapters">
      {sections.map((s, i) => {
        // retire les images déjà utilisées dans l'en-tête de page
        const imgs = images(s.blocks).filter(() => {
          if (skipped < skipFirstImages) {
            skipped++;
            return false;
          }
          return true;
        });
        const textBlocks = s.blocks.filter((b) => b.type !== 'img' && b.type !== 'button' && b.type !== 'iframe');
        const family = pick(s, imgs.length, i);
        return (
          <section key={i} className={`chapter chapter--${family}${i % 2 ? ' chapter--flip' : ''}`} id={s.heading ? slug(s.heading.text) : undefined}>
            <div className="container chapter__grid">
              {s.heading && (
                <h2 className="chapter__title t-h2 split-lines">
                  {s.heading.text}
                </h2>
              )}
              <div className="chapter__body prose" data-reveal="">
                {accordions ? <Accordions blocks={textBlocks} /> : <Blocks blocks={textBlocks} skipImages />}
              </div>
              {imgs.length > 0 && (
                <div className={`chapter__media chapter__media--${Math.min(imgs.length, 3)}`}>
                  {imgs.slice(0, 3).map((img, k) => (
                    <figure key={img.src} className="media media--zoom" data-reveal="mask" data-delay={k * 0.1} style={{ aspectRatio: `${img.w} / ${img.h}` }}>
                      <Image src={img.src} alt={img.alt || s.heading?.text || ''} width={img.w} height={img.h} sizes="(max-width: 900px) 100vw, 40vw" quality={75} />
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function pick(s: Section, nImgs: number, i: number): 'gallery' | 'portrait' | 'wide' | 'text' {
  if (nImgs >= 2) return 'gallery';
  if (nImgs === 1) return i % 2 ? 'wide' : 'portrait';
  return 'text';
}

const slug = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);

/** Questions (H3 se terminant par « ? ») en accordéons natifs ; le reste en prose. */
function Accordions({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'h3' && 'text' in b && b.text.trim().endsWith('?')) {
      const answer: Block[] = [];
      i++;
      while (i < blocks.length && blocks[i].type !== 'h3' && blocks[i].type !== 'h2') answer.push(blocks[i++]);
      out.push(
        <details key={`q${i}`} className="faq" name="faq">
          <summary className="faq__q">
            <span className="t-h3">{b.text}</span>
            <span className="faq__icon" aria-hidden="true" />
          </summary>
          <div className="faq__a prose">
            <Blocks blocks={answer} skipImages />
          </div>
        </details>,
      );
    } else {
      out.push(<Blocks key={`b${i}`} blocks={[b]} skipImages />);
      i++;
    }
  }
  return <>{out}</>;
}

/** Appels à l'action de fin de contenu, à partir des boutons d'origine. */
export function PageActions({ blocks }: { blocks: Block[] }) {
  const buttons = blocks.filter((b): b is { type: 'button'; text: string; href: string } => b.type === 'button');
  if (!buttons.length) return null;
  const seen = new Set<string>();
  return (
    <div className="page-actions container" data-reveal="">
      {buttons
        .filter((b) => (seen.has(b.href) ? false : (seen.add(b.href), true)))
        .map((b, i) => (
          <Link key={i} href={b.href || RDV} className={i === 0 ? 'btn btn--solid' : 'btn'}>
            {b.text} <span className="arrow" />
          </Link>
        ))}
    </div>
  );
}

export { paragraphs, RichText };
