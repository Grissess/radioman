export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await db.insert(schema.people).values(body).returning()
})
