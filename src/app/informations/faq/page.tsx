import { EditorialPage } from '@/components/page/EditorialPage';
import { getPage } from '@/lib/data';
import { faqGraph } from '@/lib/faq';
import { pageMeta } from '@/lib/seo';

const page = getPage('/informations/faq/');
export const metadata = pageMeta(page);

export default function FaqPage() {
  return (
    <EditorialPage
      page={page}
      title={
        <>
          Comment choisir <em>sa robe de mariée ?</em>
        </>
      }
      kicker="Questions fréquentes"
      accordions
      extraGraph={faqGraph(page)}
    />
  );
}
