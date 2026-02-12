import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await db.update(schema.people)
    .set(body)
    .where(eq(schema.people.id, body.id))
  return true
})
