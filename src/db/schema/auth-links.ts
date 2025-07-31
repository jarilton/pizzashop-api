import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const authLinks = pgTable('auth_links', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  code: text('code').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
