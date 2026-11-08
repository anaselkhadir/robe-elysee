import Image from 'next/image';
import { EditorialPage } from '@/components/page/EditorialPage';
import { getPage } from '@/lib/data';
import { pageMeta } from '@/lib/seo';
import { SITE } from '@/lib/site';

const page = getPage('/showroom-robe-de-mariee-toulouse/');
export const metadata = pageMeta(page);

export default function Showroom() {
  return (
    <EditorialPage
      page={page}
      kicker={`${SITE.address.street}, ${SITE.address.city}`}
      heroImageIndex={1}
      variant="full"
      title={
        <>
          Magasin de robe de mariée <em>à Toulouse</em>
        </>
      }
      before={
        <section className="showroom-strip" aria-label="Le showroom en images">
          <div className="container showroom-strip__grid">
            <figure className="media media--zoom" data-reveal="mask">
              <Image src="/wp-content/uploads/2025/11/showroom-robe-1.jpg" alt="Robe de mariée fluide en mousseline, essayage dans le showroom Robe Elysée" width={600} height={900} sizes="(max-width: 900px) 50vw, 30vw" quality={80} />
            </figure>
            <div className="showroom-strip__facts" data-reveal="">
              <dl>
                <div>
                  <dt className="t-micro t-muted">Lieu</dt>
                  <dd>Un appartement privatif au cœur de Toulouse, près de la cathédrale Saint-Étienne.</dd>
                </div>
                <div>
                  <dt className="t-micro t-muted">Accueil</dt>
                  <dd>Exclusivement sur rendez-vous : une mariée, ses proches, nos conseillères.</dd>
                </div>
                <div>
                  <dt className="t-micro t-muted">Rendez-vous VIP</dt>
                  <dd>Champagne et macarons, dans une ambiance élégante.</dd>
                </div>
              </dl>
            </div>
            <figure className="media media--zoom" data-reveal="mask" data-delay="0.1">
              <Image src="/wp-content/uploads/2025/11/showroom-robe-2.jpg" alt="Robe de mariée en satin aux épaules dénudées devant un miroir doré" width={600} height={900} sizes="(max-width: 900px) 50vw, 30vw" quality={80} />
            </figure>
          </div>
        </section>
      }
    />
  );
}
