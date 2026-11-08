import { NextResponse } from 'next/server';

/**
 * Réception du formulaire de contact.
 * Relais e-mail à brancher (Resend, Brevo, SMTP de l'hébergeur…) via CONTACT_WEBHOOK_URL :
 * tant qu'il n'est pas configuré, le message est journalisé côté serveur et la réponse reste positive
 * pour ne pas bloquer la visiteuse (voir docs/AUDIT-SEO.md §6).
 */
export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (data.website) return NextResponse.json({ ok: true }); // piège à robots
  const { name, email, phone, date, message } = data;
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '') || !message || message.length < 10) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }
  const payload = { name, email, phone, date, message, receivedAt: new Date().toISOString(), source: 'robedemarieetoulouse.fr' };
  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) return NextResponse.json({ ok: false, error: 'relay' }, { status: 502 });
  } else {
    console.info('[contact] message reçu (aucun relais configuré)', payload);
  }
  return NextResponse.json({ ok: true });
}
