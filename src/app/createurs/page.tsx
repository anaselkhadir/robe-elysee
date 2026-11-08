import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/page/PageHero';
import { Cta } from '@/components/ui/Cta';
import { JsonLd } from '@/components/ui/JsonLd';
import { CREATEURS, dressImages, dressesByCreateur } from '@/lib/data';
import { graph, meta, webPage } from '@/lib/seo';
import { CREATEUR_COPY } from '@/lib/taxonomies';

const PATH = '/createurs/';
const TITLE = 'Créateurs de robes de mariée à Toulouse | Robe Elysée';
const DESC = 'Luce Sposa, Justin Alexander, Lillian West, Aire Barcelona, Aire Royale, Alberto Palatchi, Rosa Clará Group : les maisons européennes de la collection Robe Elysée, à essayer sur rendez-vous à Toulouse.';
export const metadata = meta({ path: PATH, title: TITLE, description: DESC });

export default function Createurs() {
  const maisons = CREATEURS.filter((c) => c.slug !== 'justin-alexander-group');
  const crumbs = [{ name: 'Accueil', href: '/' }, { name: 'Créateurs' }];
  return (
    <>
      <JsonLd data={graph(webPage({ path: PATH, name: TITLE, description: DESC, crumbs, type: 'CollectionPage' }))} />
      <PageHero
        variant="text"
        crumbs={crumbs}
        title={
          <>
            Des maisons <em>européennes,</em> choisies une à une
          </>
        }
        lead={<p className="t-lead">Chaque robe de la collection est imaginée et confectionnée en Europe. Nous parcourons les salons internationaux pour sélectionner, chez chaque maison, les modèles qui comptent.</p>}
      />
      <ol className="maisons-list container">
        {maisons.map((m, i) => {
          const list = dressesByCreateur(m.slug);
          const imgs = list.slice(0, 3).map((d) => dressImages(d)[0]);
          const copy = CREATEUR_COPY[m.slug];
          return (
            <li key={m.slug} className={`maison-row${i % 2 ? ' maison-row--flip' : ''}`}>
              <div className="maison-row__copy">
                <span className="t-num maison-row__num">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="t-display split-lines">
                  <Link href={`/createur/${m.slug}/`}>{m.name}</Link>
                </h2>
                {copy && (
                  <p className="maison-row__lead" data-reveal="">
                    {copy.lead}
                  </p>
                )}
                <Link href={`/createur/${m.slug}/`} className="link" data-reveal="">
                  {list.length} {list.length > 1 ? 'robes' : 'robe'} à découvrir
                </Link>
              </div>
              <ul className="maison-row__imgs">
                {imgs.map((img, k) => (
                  <li key={img.src} className="media media--zoom" data-reveal="mask" data-delay={k * 0.1}>
                    <Link href={`/robes/${list[k].slug}/`} aria-label={`Robe ${list[k].name}`}>
                      <Image src={img.src} alt={img.alt} fill sizes="(max-width: 900px) 45vw, 22vw" quality={75} />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
      <Cta />
    </>
  );
}
