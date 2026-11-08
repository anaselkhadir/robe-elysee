import Image from 'next/image';
import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import type { Img } from '@/lib/data';

type Props = {
  title: ReactNode;
  h1Text?: string;
  lead?: ReactNode;
  crumbs: Crumb[];
  image?: Img | null;
  imageAlt?: string;
  aside?: ReactNode;
  variant?: 'split' | 'full' | 'text';
  kicker?: string;
};

/**
 * En-tête de page intérieure. Trois compositions pour éviter la répétition :
 * split (texte + image portrait), full (image pleine largeur sous le titre), text (typographique).
 */
export function PageHero({ title, h1Text, lead, crumbs, image, imageAlt, aside, variant = 'split', kicker }: Props) {
  return (
    <header className={`phero phero--${variant}`}>
      <div className="container phero__grid">
        <div className="phero__top">
          <Breadcrumbs items={crumbs} />
          {kicker && <p className="t-micro t-muted">{kicker}</p>}
        </div>
        <div className="phero__copy">
          <h1 className="phero__title t-display split-lines">
            {title}
            {h1Text && <span className="sr-only"> {h1Text}</span>}
          </h1>
          {lead && (
            <div className="phero__lead" data-reveal="">
              {lead}
            </div>
          )}
          {aside && (
            <div className="phero__aside" data-reveal="" data-delay="0.1">
              {aside}
            </div>
          )}
        </div>
        {image && variant !== 'text' && (
          <figure className="phero__media media" data-reveal="mask">
            <Image src={image.src} alt={imageAlt ?? image.alt} width={image.w} height={image.h} priority sizes={variant === 'full' ? '100vw' : '(max-width: 900px) 100vw, 44vw'} quality={80} />
          </figure>
        )}
      </div>
    </header>
  );
}
