import Link from 'next/link';
import { RDV, SITE } from '@/lib/site';

/** Bloc de conversion de fin de page : rendez-vous privé, adresse, horaires. */
export function Cta({ title = <>Réservez votre <em>rendez-vous privé.</em></>, text = 'Un créneau rien que pour vous, dans notre appartement du centre de Toulouse. Les essayages se font exclusivement sur rendez-vous.' }: { title?: React.ReactNode; text?: string }) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container cta__grid">
        <div className="cta__copy">
          <h2 id="cta-title" className="t-display split-lines">
            {title}
          </h2>
          <p className="cta__text" data-reveal="">
            {text}
          </p>
          <div className="cta__actions" data-reveal="" data-delay="0.1">
            <Link href={RDV} className="btn btn--solid">
              Réserver un rendez-vous privé <span className="arrow" />
            </Link>
            <a href={SITE.phoneHref} className="link">
              {SITE.phone}
            </a>
          </div>
        </div>
        <dl className="cta__hours t-small" data-reveal="" data-delay="0.15">
          {SITE.hours.map((h) => (
            <div key={h.day}>
              <dt>{h.day}</dt>
              <dd>
                {h.open} - {h.close}
              </dd>
            </div>
          ))}
          <div>
            <dt>Adresse</dt>
            <dd>
              {SITE.address.street}, {SITE.address.city}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
