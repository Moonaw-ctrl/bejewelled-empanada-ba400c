import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
export const responses = pgTable('wedding_responses', {
  id: uuid().primaryKey(),
  guest1: text('guest_1').notNull(),
  guest2: text('guest_2').notNull().default(''),
  confirmed: boolean().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  syncedAt: timestamp('synced_at', { withTimezone: true }),
});
