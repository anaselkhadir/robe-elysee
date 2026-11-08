'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type State = 'idle' | 'sending' | 'error';

/** Formulaire de contact : validation à la perte de focus, erreurs sous le champ, envoi vers /api/contact. */
export function ContactForm() {
  const router = useRouter();
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (f: FormData) => {
    const e: Record<string, string> = {};
    if (!String(f.get('name') ?? '').trim()) e.name = 'Indiquez votre nom pour que nous puissions vous répondre.';
    const email = String(f.get('email') ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Cette adresse e-mail semble incomplète (ex. prenom@exemple.fr).';
    if (String(f.get('message') ?? '').trim().length < 10) e.message = 'Quelques mots suffisent : votre projet, la date envisagée, votre question.';
    if (f.get('website')) e.website = 'spam';
    return e;
  };

  const onBlur = (ev: React.FocusEvent<HTMLFormElement>) => {
    const form = ev.currentTarget;
    const field = (ev.target as unknown as HTMLInputElement).name;
    if (!field) return;
    const e = validate(new FormData(form));
    setErrors((prev) => ({ ...prev, [field]: e[field] ?? '' }));
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const f = new FormData(form);
    const e = validate(f);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`);
      first?.focus();
      return;
    }
    setState('sending');
    setServerError(null);
    try {
      const res = await fetch('/api/contact/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(f)) });
      if (!res.ok) throw new Error(String(res.status));
      router.push('/contact/merci/');
    } catch {
      setState('error');
      setServerError('Le message n’a pas pu être envoyé. Réessayez dans un instant ou appelez-nous au 06 56 66 60 08.');
    }
  };

  const field = (name: string, label: string, type = 'text', extra: Record<string, unknown> = {}) => (
    <div className="field" data-invalid={errors[name] ? '' : undefined}>
      <label htmlFor={`c-${name}`} className="t-micro">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea id={`c-${name}`} name={name} rows={5} aria-describedby={errors[name] ? `e-${name}` : undefined} aria-invalid={Boolean(errors[name])} {...extra} />
      ) : (
        <input id={`c-${name}`} name={name} type={type} aria-describedby={errors[name] ? `e-${name}` : undefined} aria-invalid={Boolean(errors[name])} {...extra} />
      )}
      {errors[name] && (
        <p id={`e-${name}`} className="field__error t-small" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form className="cform" onSubmit={onSubmit} onBlur={onBlur} noValidate>
      <div className="cform__row">
        {field('name', 'Nom et prénom', 'text', { autoComplete: 'name', required: true })}
        {field('email', 'Adresse e-mail', 'email', { autoComplete: 'email', inputMode: 'email', required: true })}
      </div>
      <div className="cform__row">
        {field('phone', 'Téléphone (facultatif)', 'tel', { autoComplete: 'tel', inputMode: 'tel' })}
        {field('date', 'Date du mariage (facultatif)', 'text', { placeholder: 'Juin 2027', autoComplete: 'off' })}
      </div>
      {field('message', 'Votre message', 'textarea', { required: true })}
      {/* piège à robots : invisible, doit rester vide */}
      <div className="cform__hp" aria-hidden="true">
        <label htmlFor="c-website">Site web</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="t-small t-muted">Vos informations servent uniquement à vous répondre. Voir la politique de confidentialité.</p>
      {serverError && (
        <p className="cform__server t-small" role="alert">
          {serverError}
        </p>
      )}
      <button type="submit" className="btn btn--solid" disabled={state === 'sending'} aria-busy={state === 'sending'}>
        {state === 'sending' ? 'Envoi en cours' : 'Envoyer le message'} <span className="arrow" />
      </button>
    </form>
  );
}
