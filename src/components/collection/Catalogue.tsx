'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DressCard } from '@/components/ui/DressCard';
import type { Dress, Term } from '@/lib/data';

type Props = {
  dresses: Dress[];
  styles: Term[];
  createurs: Term[];
  /** Filtre imposé par la page (archive style / créateur) : les puces deviennent de simples liens. */
  fixed?: { kind: 'style' | 'createur'; slug: string };
};

/**
 * Catalogue filtrable. Les puces sont de vrais liens vers /style/… et /createur/… (indexables, fonctionnels sans JS).
 * Sur /robes/, le clic filtre la grille en place et met l'URL à jour (?style=…&createur=…) sans recharger.
 */
export function Catalogue({ dresses, styles, createurs, fixed }: Props) {
  const router = useRouter();
  const [style, setStyle] = useState<string | null>(fixed?.kind === 'style' ? fixed.slug : null);
  const [createur, setCreateur] = useState<string | null>(fixed?.kind === 'createur' ? fixed.slug : null);
  const [ready, setReady] = useState(Boolean(fixed));

  // Filtres initiaux depuis l'URL (?style=…&createur=…), lus côté client : pas de Suspense, hydratation en un seul passage.
  useEffect(() => {
    if (fixed) return;
    const q = new URLSearchParams(location.search);
    setStyle(q.get('style'));
    setCreateur(q.get('createur'));
    setReady(true);
  }, [fixed]);

  useEffect(() => {
    if (fixed || !ready) return;
    const q = new URLSearchParams();
    if (style) q.set('style', style);
    if (createur) q.set('createur', createur);
    const qs = q.toString();
    const url = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/robes/${qs ? `?${qs}` : ''}`;
    if (location.pathname + location.search !== url) history.replaceState(null, '', url);
  }, [style, createur, fixed, ready]);

  const list = useMemo(
    () => dresses.filter((d) => (!style || d.styles.includes(style)) && (!createur || d.createurs.includes(createur))),
    [dresses, style, createur],
  );

  const visibleCreateurs = createurs.filter((c) => c.slug !== 'justin-alexander-group');

  const chip = (kind: 'style' | 'createur', t: Term | null) => {
    const active = kind === 'style' ? style === (t?.slug ?? null) : createur === (t?.slug ?? null);
    const href = t ? `/${kind}/${t.slug}/` : '/robes/';
    const onClick = (e: React.MouseEvent) => {
      if (fixed) {
        // Depuis une archive : « Toutes » ramène au catalogue, les autres puces naviguent (liens).
        if (!t) {
          e.preventDefault();
          router.push('/robes/');
        }
        return;
      }
      e.preventDefault();
      if (kind === 'style') setStyle(active ? null : (t?.slug ?? null));
      else setCreateur(active ? null : (t?.slug ?? null));
    };
    return (
      <li key={t?.slug ?? 'all'}>
        <Link href={href} className="chip" aria-pressed={active} onClick={onClick}>
          {t ? t.name : kind === 'style' ? 'Tous les styles' : 'Toutes les maisons'}
          {t && <span className="chip__n t-num">{dresses.filter((d) => (kind === 'style' ? d.styles : d.createurs).includes(t.slug)).length}</span>}
        </Link>
      </li>
    );
  };

  return (
    <div className="catalogue">
      <div className="catalogue__bar container">
        <div className="catalogue__group">
          <p className="t-micro t-muted">Style</p>
          <ul className="chips">
            {chip('style', null)}
            {styles.map((s) => chip('style', s))}
          </ul>
        </div>
        <div className="catalogue__group">
          <p className="t-micro t-muted">Maison</p>
          <ul className="chips">
            {chip('createur', null)}
            {visibleCreateurs.map((c) => chip('createur', c))}
          </ul>
        </div>
        <p className="catalogue__count t-small t-muted" aria-live="polite">
          {list.length} {list.length > 1 ? 'robes' : 'robe'}
        </p>
      </div>

      {list.length ? (
        <ul className="catalogue__grid container">
          {list.map((d, i) => (
            <li key={d.slug} className={`catalogue__cell catalogue__cell--${i % 5}`}>
              <DressCard dress={d} index={i} headingLevel="h2" priority={i < 4} delay={(i % 3) * 0.07} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="catalogue__empty container">
          <p className="t-h3">Aucune robe ne réunit ces deux critères pour le moment.</p>
          <p className="t-muted">La collection compte plus de cent modèles au showroom ; le site n’en présente qu’une partie. Élargissez la sélection ou prenez rendez-vous.</p>
          <button type="button" className="link" onClick={() => (setStyle(null), setCreateur(null))}>
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
