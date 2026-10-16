import { eq, isNull } from 'drizzle-orm';
import { database } from '../../db/index.js';
import { responses } from '../../db/schema.js';
export async function syncSheet() {
  const endpoint = Netlify.env.get('GOOGLE_SHEETS_WEBHOOK_URL');
  const token = Netlify.env.get('GOOGLE_SHEETS_WEBHOOK_TOKEN');
  if (!endpoint || !token) return;
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.hostname !== 'script.google.com') return;
  const db = database();
  const pending = await db.select().from(responses).where(isNull(responses.syncedAt)).limit(5);
  for (const row of pending) {
    try {
      const result = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id: row.id, guest1: row.guest1, guest2: row.guest2,
          confirmed: row.confirmed, createdAt: row.createdAt.toISOString() }), signal: AbortSignal.timeout(4000) });
      if (!result.ok || (await result.json()).ok !== true) return;
      await db.update(responses).set({ syncedAt: new Date() }).where(eq(responses.id, row.id));
    } catch { return; }
  }
}
