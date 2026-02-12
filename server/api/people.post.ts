export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await db.update(schema.people)
    .set(body)
    .where({id: body.id})
  return true
})
