import { like, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return {
    rows: await db.select().from(schema.people)
      .where(and(...Object.keys(query).map(f => like(schema.people[f], query[f])))),
  }
})
