import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await db.update(schema.radios)
    .set(body)
    .where(eq(schema.radios.id, body.id))
  return true
})
