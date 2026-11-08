import Image from 'next/image';
import { Acuity } from '@/components/page/Acuity';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { getPage } from '@/lib/data';
import { graph, pageMeta, webPage } from '@/lib/seo';
import { SITE } from '@/lib/site';

const page = getPage('/prise-de-rendez-vous/');
// audit P3 : la page n'avait pas de meta description
export const metadata = pageMeta(page, { description: 'Réservez votre rendez-vous privé au showroom Robe Elysée, 22 rue Croix Baragnon à Toulouse. Essayage de robes de mariée exclusivement sur rendez-vous, du mardi au samedi.' });

export default function Rdv() {
  const lead = page.blocks.find((b) => b.type === 'p');
  const crumbs = page.breadcrumb ?? [{ name: 'Accueil', href: '/' }, { name: 'Prise de rendez-vous' }];
  return (
    <>
      <JsonLd data={graph(webPage({ path: page.path, name: page.title, crumbs, published: page.datePublished, modified: page.dateModified }))} />
      <section className="rdv">
        <div className="container rdv__grid">
          <div className="rdv__copy">
            <Breadcrumbs items={crumbs} />
            <h1 className="t-display split-lines">
              Prise de <em>rendez-vous</em>
            </h1>
            <p className="t-lead" data-reveal="">
              {lead && 'text' in lead ? lead.text : ''}
            </p>
            <ul className="rdv__steps" data-reveal="">
              <li>
                <span className="t-num">01</span>
                <p>Choisissez un créneau : nous privatisons l’appartement pour vous et vos proches.</p>
              </li>
              <li>
                <span className="t-num">02</span>
                <p>Idéalement six à douze mois avant le mariage, pour laisser le temps de la confection.</p>
              </li>
              <li>
                <span className="t-num">03</span>
                <p>Le jour venu : café, thé ou infusion, puis les essayages. Pensez à vos chaussures pour l’essayage final.</p>
              </li>
            </ul>
            <dl className="rdv__info t-small" data-reveal="">
              <div>
                <dt className="t-micro t-muted">Adresse</dt>
                <dd>
                  {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}
                </dd>
              </div>
              <div>
                <dt className="t-micro t-muted">Téléphone</dt>
                <dd>
                  <a href={SITE.phoneHref}>{SITE.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="t-micro t-muted">Horaires</dt>
                <dd>
                  {SITE.hours.map((h) => (
                    <span key={h.day} className="rdv__hour">
                      {h.day} {h.open} - {h.close}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
          <div className="rdv__panel">
            <figure className="rdv__media media" data-reveal="mask">
              <Image src="/wp-content/uploads/2025/11/faq.jpg" alt="Robe de mariée en dentelle et manches longues, essayage au showroom Robe Elysée" fill sizes="(max-width: 900px) 100vw, 50vw" quality={75} />
            </figure>
            <Acuity />
          </div>
        </div>
      </section>
    </>
  );
}
