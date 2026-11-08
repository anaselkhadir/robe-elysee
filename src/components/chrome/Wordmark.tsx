import Image from 'next/image';

/** Monogramme (quatre cœurs, identité existante) + nom en Bodoni. */
export function Wordmark({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className={`wordmark${compact ? ' wordmark--compact' : ''}${light ? ' wordmark--light' : ''}`}>
      <Image src="/brand/mark.png" alt="" width={124} height={124} className="wordmark__mark" priority />
      <span className="wordmark__text">
        <span className="wordmark__name">Robe Elysée</span>
        <span className="wordmark__city">Toulouse</span>
      </span>
    </span>
  );
}
