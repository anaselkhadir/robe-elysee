import type { ReactNode } from 'react';

/** Tête de section : titre (révélé ligne à ligne) + texte d'introduction, empilés. */
export function SectionHead({ title, id, lead, kicker, as: Tag = 'h2', className = '', size = 'h2' }: { title: ReactNode; id?: string; lead?: ReactNode; kicker?: string; as?: 'h1' | 'h2' | 'p'; className?: string; size?: 'h2' | 'display' }) {
  return (
    <div className={`shead ${className}`}>
      {kicker && <p className="kicker t-micro">{kicker}</p>}
      <Tag id={id} className={`split-lines ${size === 'display' ? 't-display' : 't-h2'}`}>
        {title}
      </Tag>
      {lead && (
        <div className="shead__lead" data-reveal="">
          {lead}
        </div>
      )}
    </div>
  );
}
