import Image from 'next/image';
import Link from 'next/link';
import { LEGAL, NAV, NAV_SECONDARY, RDV, SITE } from '@/lib/site';
import { CREATEURS, STYLES } from '@/lib/data';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__invite">
          <p className="t-h2 footer__statement split-lines">
            Votre robe vous attend <em>rue Croix Baragnon.</em>
          </p>
          <Link href={RDV} className="btn">
            Réserver un rendez-vous privé <span className="arrow" />
          </Link>
        </div>
        <div className="footer__logo">
          <Image src="/brand/logo.png" alt="Robe Elysée, wedding dress" width={261} height={211} />
        </div>
      </div>

      <div className="container footer__grid">
        <div className="footer__col">
          <p className="t-micro footer__title">Le showroom</p>
          <address className="t-small">
            {SITE.address.street}
            <br />
            {SITE.address.postalCode} {SITE.address.city}
            <br />
            <a href={SITE.phoneHref}>{SITE.phone}</a>
          </address>
          <a href={SITE.mapsUrl} className="link" target="_blank" rel="noopener">
            Itinéraire
          </a>
        </div>
        <div className="footer__col">
          <p className="t-micro footer__title">Sur rendez-vous</p>
          <dl className="footer__hours t-small">
            {SITE.hours.map((h) => (
              <div key={h.day}>
                <dt>{h.day}</dt>
                <dd>
                  {h.open} - {h.close}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <nav className="footer__col" aria-label="Pages">
          <p className="t-micro footer__title">La maison</p>
          <ul className="t-small">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            {NAV_SECONDARY.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="footer__col" aria-label="Robes par style">
          <p className="t-micro footer__title">Par style</p>
          <ul className="t-small">
            {STYLES.map((s) => (
              <li key={s.slug}>
                <Link href={`/style/${s.slug}/`}>Robe de mariée {s.name.toLowerCase()}</Link>
              </li>
            ))}
            <li>
              <Link href="/robe-de-mariee-a-paris/">Robe de mariée à Paris</Link>
            </li>
            <li>
              <Link href="/robe-de-mariee-a-nice/">Robe de mariée à Nice</Link>
            </li>
          </ul>
        </nav>
        <nav className="footer__col" aria-label="Créateurs">
          <p className="t-micro footer__title">Créateurs</p>
          <ul className="t-small">
            {CREATEURS.filter((c) => c.slug !== 'justin-alexander-group').map((c) => (
              <li key={c.slug}>
                <Link href={`/createur/${c.slug}/`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container">
        <p className="footer__local t-small">
          Boutique de robes de mariée à Toulouse, près de la cathédrale Saint-Étienne, pour les futures mariées de Haute-Garonne : {SITE.nearby.join(', ')}.
        </p>
      </div>

      <div className="footer__mark" aria-hidden="true">
        <span>Robe Elysée</span>
      </div>

      <div className="container footer__bottom t-micro">
        <p>© {new Date().getFullYear()} Robe Elysée, Toulouse</p>
        <ul>
          {LEGAL.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <ul>
          <li>
            <a href={SITE.social.instagram} target="_blank" rel="noopener">Instagram</a>
          </li>
          <li>
            <a href={SITE.social.facebook} target="_blank" rel="noopener">Facebook</a>
          </li>
          <li>
            <a href={SITE.social.pinterest} target="_blank" rel="noopener">Pinterest</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
