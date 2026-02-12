import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await db.delete(schema.radios).where(eq(schema.radios.id, body.id))
  return true
})
