import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import type { Block } from '@/lib/data';
import { RDV } from '@/lib/site';

/** Paragraphe / élément texte : conserve les liens et graisses d'origine (HTML assaini à l'import). */
export function RichText({ block, className }: { block: Extract<Block, { text: string }>; className?: string }) {
  const Tag = (block.type === 'li' ? 'li' : block.type === 'blockquote' ? 'blockquote' : block.type) as 'p';
  if ('html' in block && block.html) {
    // liens internes du contenu WordPress : préfixés du chemin de base (export GitHub Pages)
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    const html = base ? block.html.replace(/href="\/(?!\/)/g, `href="${base}/`) : block.html;
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <Tag className={className}>{block.text}</Tag>;
}

type Props = { blocks: Block[]; sizes?: string; skipImages?: boolean };

/** Rendu générique et fidèle d'une suite de blocs (listes regroupées, images, boutons). */
export function Blocks({ blocks, sizes = '(max-width: 900px) 100vw, 50vw', skipImages = false }: Props) {
  const groups: (Block | Block[])[] = [];
  for (const b of blocks) {
    const last = groups[groups.length - 1];
    if (b.type === 'li') {
      if (Array.isArray(last)) last.push(b);
      else groups.push([b]);
    } else groups.push(b);
  }
  return (
    <>
      {groups.map((g, i) => {
        if (Array.isArray(g)) {
          return (
            <ul key={i}>
              {g.map((li, j) => (
                <RichText key={j} block={li as Extract<Block, { text: string }>} />
              ))}
            </ul>
          );
        }
        switch (g.type) {
          case 'img':
            if (skipImages) return null;
            return (
              <figure key={i} className="media">
                <Image src={g.src} alt={g.alt} width={g.w} height={g.h} sizes={sizes} quality={80} />
              </figure>
            );
          case 'button': {
            const href = g.href || RDV;
            const internal = href.startsWith('/');
            return (
              <p key={i} className="blocks__cta">
                {internal ? (
                  <Link href={href} className="btn">
                    {g.text} <span className="arrow" />
                  </Link>
                ) : (
                  <a href={href} className="btn" target="_blank" rel="noopener">
                    {g.text} <span className="arrow" />
                  </a>
                )}
              </p>
            );
          }
          case 'iframe':
            return null;
          case 'video':
            return g.src ? (
              <figure key={i} className="media">
                <video src={g.src} controls playsInline preload="metadata" />
              </figure>
            ) : null;
          case 'h2':
            return <h2 key={i}>{g.text}</h2>;
          case 'h3':
            return <h3 key={i}>{g.text}</h3>;
          case 'h4':
          case 'h5':
            return <h4 key={i}>{g.text}</h4>;
          default:
            return <Fragment key={i}>{'text' in g ? <RichText block={g} /> : null}</Fragment>;
        }
      })}
    </>
  );
}
