import { syncSheet } from '../lib/sync-sheet.js';
export default async () => { await syncSheet(); };
export const config = { schedule: '*/5 * * * *' };
