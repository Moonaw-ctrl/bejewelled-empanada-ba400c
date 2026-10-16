import type { Context } from '@netlify/functions';
import { database } from '../../db/index.js';
import { responses } from '../../db/schema.js';
import { syncSheet } from '../lib/sync-sheet.js';
export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return new Response('Forbidden', { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 4096) return new Response('Too large', { status: 413 });
    const input = JSON.parse(raw);
    if (input.website) return Response.json({ ok: true });
    const validName = (value: unknown) => typeof value === 'string' && value.trim().length <= 120 && !/[\u0000-\u001f]/.test(value);
    if (!validName(input.guest1) || !input.guest1.trim() || !validName(input.guest2) || input.confirmed !== true ||
      typeof input.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id)) {
      return Response.json({ ok: false }, { status: 400 });
    }
    await database().insert(responses).values({ id: input.id, guest1: input.guest1.trim(), guest2: input.guest2.trim(), confirmed: true }).onConflictDoNothing();
    context.waitUntil(syncSheet());
    return Response.json({ ok: true });
  } catch { return Response.json({ ok: false }, { status: 503 }); }
};
export const config = { path: '/api/attendance' };
