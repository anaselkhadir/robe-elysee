import type { ReactNode } from 'react';
import { Chapters, PageActions } from './Chapters';
import { PageHero } from './PageHero';
import { Cta } from '@/components/ui/Cta';
import { JsonLd } from '@/components/ui/JsonLd';
import { images } from '@/lib/blocks';
import type { Page } from '@/lib/data';
import { graph, webPage } from '@/lib/seo';

type Props = {
  page: Page;
  title: ReactNode;
  lead?: ReactNode;
  heroImageIndex?: number | null;
  variant?: 'split' | 'full' | 'text';
  accordions?: boolean;
  extraGraph?: Record<string, unknown>[];
  before?: ReactNode;
  after?: ReactNode;
  cta?: boolean;
  kicker?: string;
};

/** Gabarit des pages éditoriales : contenu WordPress fidèle, mis en chapitres, en-tête et conversion. */
export function EditorialPage({ page, title, lead, heroImageIndex = 0, variant = 'split', accordions, extraGraph = [], before, after, cta = true, kicker }: Props) {
  const imgs = images(page.blocks);
  const hero = heroImageIndex === null ? null : imgs[heroImageIndex] ?? null;
  const firstP = page.blocks.find((b) => b.type === 'p' && 'text' in b && b.text.length > 40 && page.blocks.indexOf(b) < 6);
  const crumbs = page.breadcrumb ?? [{ name: 'Accueil', href: '/' }, { name: page.h1 ?? page.title }];
  return (
    <>
      <JsonLd data={graph(webPage({ path: page.path, name: page.title, description: page.description, crumbs, published: page.datePublished, modified: page.dateModified, image: hero?.src }), extraGraph)} />
      <PageHero title={title} lead={lead ?? (firstP && 'text' in firstP ? <p className="t-lead">{firstP.text}</p> : undefined)} crumbs={crumbs} image={hero} variant={variant} kicker={kicker} />
      {before}
      <Chapters blocks={page.blocks.filter((b) => !(lead === undefined && b === firstP))} skipFirstImages={hero ? imgs.indexOf(hero) + 1 : 0} accordions={accordions} />
      <PageActions blocks={page.blocks} />
      {after}
      {cta && <Cta />}
    </>
  );
}
