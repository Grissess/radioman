export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await db.insert(schema.radios).values(body).returning()
})
