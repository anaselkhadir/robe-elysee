import { EditorialPage } from '@/components/page/EditorialPage';
import { getPage } from '@/lib/data';
import { faqGraph } from '@/lib/faq';
import { pageMeta } from '@/lib/seo';

const page = getPage('/informations/tarifs/');
export const metadata = pageMeta(page);

export default function Tarifs() {
  return (
    <EditorialPage
      page={page}
      variant="text"
      heroImageIndex={null}
      title={
        <>
          Combien coûte <em>une robe de mariée ?</em>
        </>
      }
      accordions
      extraGraph={faqGraph(page)}
    />
  );
}
