import Link from 'next/link';

export type Crumb = { name: string; href?: string | null };

export function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  return (
    <nav aria-label="Fil d’Ariane" className={`crumbs t-micro${light ? ' crumbs--light' : ''}`}>
      <ol>
        {items.map((c, i) => (
          <li key={i}>
            {c.href && i < items.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
