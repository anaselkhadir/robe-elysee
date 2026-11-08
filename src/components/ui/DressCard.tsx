import Image from 'next/image';
import Link from 'next/link';
import { createurName, dressImages, primaryCreateur, styleName, type Dress } from '@/lib/data';

type Props = {
  dress: Dress;
  index?: number;
  sizes?: string;
  priority?: boolean;
  headingLevel?: 'h2' | 'h3';
  reveal?: boolean;
  delay?: number;
};

export function DressCard({ dress, index, sizes = '(max-width: 700px) 50vw, 25vw', priority, headingLevel = 'h3', reveal = true, delay = 0 }: Props) {
  const [main, second] = dressImages(dress);
  const H = headingLevel;
  return (
    <article className="dress" data-reveal={reveal ? '' : undefined} data-delay={delay || undefined}>
      <Link href={`/robes/${dress.slug}/`} className="dress__link">
        <div className="dress__media media">
          {main && <Image src={main.src} alt={main.alt} fill sizes={sizes} quality={75} priority={priority} className="dress__img" />}
          {second && <Image src={second.src} alt="" fill sizes={sizes} quality={70} className="dress__img dress__img--alt" aria-hidden="true" />}
          <span className="dress__cta t-micro">Voir la robe</span>
        </div>
        <div className="dress__meta">
          {typeof index === 'number' && <span className="dress__index t-num">{String(index + 1).padStart(2, '0')}</span>}
          <H className="dress__name">{dress.name}</H>
          <p className="dress__info t-micro">
            {createurName(primaryCreateur(dress))}
            {dress.styles[0] ? <> / {styleName(dress.styles[0])}</> : null}
          </p>
        </div>
      </Link>
    </article>
  );
}
