import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await db.delete(schema.people).where(eq(schema.people.id, body.id))
  return true
})
