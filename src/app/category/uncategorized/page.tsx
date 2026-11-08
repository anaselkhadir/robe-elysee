import { ArchiveList } from '@/components/page/ArchiveList';
import { POSTS } from '@/lib/data';
import { meta } from '@/lib/seo';

// Archive WordPress conservée (URL indexée) ; contenu mince -> noindex, follow (audit P12, recommandation).
export const metadata = meta({ path: '/category/uncategorized/', title: 'Archives des articles - Robes Élysée', description: 'Tous les articles du journal Robe Elysée.', robots: 'noindex, follow' });

export default function Category() {
  return <ArchiveList path="/category/uncategorized/" title={<>Tous les <em>articles</em></>} name="Archives" posts={POSTS} />;
}
