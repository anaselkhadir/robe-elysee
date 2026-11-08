import { EditorialPage } from '@/components/page/EditorialPage';
import { getPage } from '@/lib/data';
import { pageMeta } from '@/lib/seo';

const page = getPage('/informations/');
export const metadata = pageMeta(page);

export default function Informations() {
  return (
    <EditorialPage
      page={page}
      heroImageIndex={1}
      title={
        <>
          Essayage de robe de mariée <em>à Toulouse</em>
        </>
      }
    />
  );
}
