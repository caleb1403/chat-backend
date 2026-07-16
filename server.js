import express from 'express';

import cors from 'cors';

import { db } from './db/db.js';

import { messages, registrations } from './db/schema.js';

import { eq, sql, desc } from 'drizzle-orm';

 

const app = express();

app.use(cors());          // allow any origin

app.use(express.json());

// 1. POST a new message

app.post('/api/messages', async (req, res) => {

  const { name, message } = req.body;

  if (!name || !message) return res.status(400).json({ error: 'name and message are required' });

  const [created] = await db.insert(messages)

    .values({ name, message, createdAt: Date.now() })

    .returning();

  res.status(201).json(created);

});

// 2. GET the last 50 messages (oldest-first)

app.get('/api/messages', async (req, res) => {

  const rows = await db.select()

    .from(messages)

    .orderBy(desc(messages.createdAt))

    .limit(50);

  res.json(rows.reverse());

});

// 3. POST a reaction to a message

const REACTIONS = ['thumbs', 'cry', 'laugh', 'heart'];

app.post('/api/messages/:id/react', async (req, res) => {

  const column = REACTIONS[req.body.reactIndex];

  if (!column) return res.status(400).json({ error: 'reactIndex must be 0-3' });

  const id = Number(req.params.id);

  const [updated] = await db.update(messages)

    .set({ [column]: sql`${messages[column]} + 1` })

    .where(eq(messages.id, id))

    .returning();

  res.json(updated);

});

// 4. POST register (create or update by name), and GET the list

app.post('/api/register', async (req, res) => {

  const { name, url } = req.body;

  if (!name || !url) return res.status(400).json({ error: 'name and url are required' });

  await db.insert(registrations)

    .values({ name, url })

    .onConflictDoUpdate({ target: registrations.name, set: { url } });

  res.status(201).json({ name, url });

});

 

app.get('/api/register', async (req, res) => {

  res.json(await db.select().from(registrations));

});

 

app.listen(3000, () => console.log('Chat API on http://localhost:3000'));