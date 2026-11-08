'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

/** Agenda Acuity (outil de réservation existant), chargé uniquement après action : aucun script tiers avant consentement implicite. */
export function Acuity() {
  const [on, setOn] = useState(false);
  return (
    <div className="acuity" data-on={on || undefined}>
      {on ? (
        <iframe src={SITE.booking} title="Prendre rendez-vous au showroom Robe Elysée" className="acuity__frame" loading="lazy" allow="payment" />
      ) : (
        <div className="acuity__gate">
          <p className="t-h3">
            Choisissez votre <em>créneau</em>
          </p>
          <p className="t-small t-muted">L’agenda en ligne (Acuity Scheduling) s’ouvre ici. Il utilise ses propres cookies ; rien n’est chargé avant votre clic.</p>
          <button type="button" className="btn btn--solid" onClick={() => setOn(true)}>
            Afficher les disponibilités <span className="arrow" />
          </button>
          <a href={SITE.booking} className="link" target="_blank" rel="noopener">
            Ouvrir dans une nouvelle fenêtre
          </a>
        </div>
      )}
    </div>
  );
}
