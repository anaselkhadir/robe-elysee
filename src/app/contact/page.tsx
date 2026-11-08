import Image from 'next/image';
import Link from 'next/link';
import { ContactForm } from '@/components/page/ContactForm';
import { Chapters } from '@/components/page/Chapters';
import { PageHero } from '@/components/page/PageHero';
import { JsonLd } from '@/components/ui/JsonLd';
import { images, splitSections } from '@/lib/blocks';
import { getPage } from '@/lib/data';
import { graph, pageMeta, webPage } from '@/lib/seo';
import { RDV, SITE } from '@/lib/site';

const page = getPage('/contact/');
export const metadata = pageMeta(page);

export default function Contact() {
  const imgs = images(page.blocks);
  const sections = splitSections(page.blocks, ['h2']);
  const local = sections.find((s) => s.heading?.text.startsWith('Boutique de robes'));
  const lead = page.blocks.find((b) => b.type === 'p' && 'text' in b && b.text.startsWith('Vous rêvez'));
  const crumbs = page.breadcrumb ?? [{ name: 'Accueil', href: '/' }, { name: 'Contact' }];
  const map = page.blocks.find((b) => b.type === 'iframe');
  return (
    <>
      <JsonLd data={graph(webPage({ path: page.path, name: page.title, description: page.description, crumbs, type: 'ContactPage', published: page.datePublished, modified: page.dateModified, image: imgs[0]?.src }))} />
      <PageHero
        variant="split"
        crumbs={crumbs}
        title={
          <>
            Boutique de mariage <em>à Toulouse</em>
          </>
        }
        lead={<p className="t-lead">{lead && 'text' in lead ? lead.text : ''}</p>}
        image={imgs[1] ?? imgs[0]}
        imageAlt="Couple de jeunes mariés à la sortie de la mairie, robe Robe Elysée"
      />

      <section className="contact section-sm" aria-labelledby="contact-title">
        <div className="container contact__grid">
          <div className="contact__info">
            <h2 id="contact-title" className="t-h2 split-lines">
              Contacter <em>la boutique</em>
            </h2>
            <p data-reveal="">Notre équipe est à votre écoute pour répondre à vos questions, vous conseiller et vous accompagner dans vos essayages.</p>
            <dl className="contact__facts" data-reveal="">
              <div>
                <dt className="t-micro t-muted">Showroom</dt>
                <dd>
                  <a href={SITE.mapsUrl} target="_blank" rel="noopener">
                    {SITE.address.street}
                    <br />
                    {SITE.address.postalCode} {SITE.address.city}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="t-micro t-muted">Téléphone</dt>
                <dd>
                  <a href={SITE.phoneHref}>{SITE.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="t-micro t-muted">Horaires, sur rendez-vous</dt>
                <dd>
                  {SITE.hours.map((h) => (
                    <span key={h.day} className="contact__hour">
                      <span>{h.day}</span>
                      <span>
                        {h.open} - {h.close}
                      </span>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="contact__rdv" data-reveal="">
              <h3 className="t-h3">Exclusivement sur rendez-vous</h3>
              <p className="t-small">Les essayages dans notre showroom privatif se font uniquement sur rendez-vous afin de vous offrir un moment privilégié et personnalisé. Il est important de prendre rendez-vous 6 à 12 mois avant votre mariage.</p>
              <Link href={RDV} className="btn">
                Réserver un rendez-vous privé <span className="arrow" />
              </Link>
            </div>
          </div>
          <div className="contact__form" data-reveal="" data-delay="0.1">
            <h2 className="t-h3">
              Une question ? <em>Écrivez-nous.</em>
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="contact-map" aria-label="Plan d’accès">
        <div className="container contact-map__grid">
          <figure className="contact-map__photo media" data-reveal="mask">
            {imgs[0] && <Image src={imgs[0].src} alt="Mariée et marié devant la mairie, robe de mariée Robe Elysée" fill sizes="(max-width: 900px) 100vw, 40vw" quality={75} />}
          </figure>
          <div className="contact-map__frame" data-reveal="">
            {map && 'src' in map && <iframe src={map.src} title="Plan d’accès au showroom Robe Elysée, 22 rue Croix Baragnon, Toulouse" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
          </div>
        </div>
      </section>

      {local && <Chapters blocks={[local.heading!, ...local.blocks.filter((b) => b.type !== 'img')]} />}
    </>
  );
}
