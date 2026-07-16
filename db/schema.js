import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

 

export const messages = sqliteTable('messages', {

  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull(),

  message: text('message').notNull(),

  thumbs: integer('thumbs').notNull().default(0),

  cry: integer('cry').notNull().default(0),

  laugh: integer('laugh').notNull().default(0),

  heart: integer('heart').notNull().default(0),

  createdAt: integer('created_at').notNull()

});

 

export const registrations = sqliteTable('registrations', {

  name: text('name').primaryKey(),

  url: text('url').notNull()

});