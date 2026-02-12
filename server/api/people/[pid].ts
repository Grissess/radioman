import { eq, max } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const rows = await db.select().from(schema.people)
        .where(eq(schema.people.id, getRouterParam(event, 'pid')))
        .limit(1)
    if(rows.length < 1) return undefined
    const person = rows[0]
    const holds = await db.select({
        id: schema.radios.id,
        identifier: schema.radios.identifier,
        mostRecent: max(schema.movement.at),
    })
        .from(schema.movement)
        .innerJoin(schema.radios, eq(schema.movement.radio, schema.radios.id))
        .groupBy(schema.radios.id)
        .having(eq(schema.movement.possessor, person.id))
    person.holds = holds
    return person
})