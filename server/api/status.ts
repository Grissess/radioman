import { eq, max, sql } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    return {
        rows: await db.select({
            identifier: schema.radios.identifier,
            at: max(schema.movement.at),
            status: sql`CASE
                WHEN ${schema.movement.kind} IS NULL
                THEN 'Unused.'
                WHEN ${schema.movement.possessor} IS NULL
                THEN 'Available.'
                ELSE 'In use by ' || ${schema.people.dispName} || ', ' || ${schema.people.realName}
            END`,
            class: sql`CASE
                WHEN ${schema.movement.kind} IS NULL
                THEN 'unused'
                WHEN ${schema.movement.possessor} IS NULL
                THEN 'available'
                ELSE 'out'
            END`,
        })
            .from(schema.movement)
            .rightJoin(schema.radios, eq(schema.radios.id, schema.movement.radio))
            .leftJoin(schema.people, eq(schema.people.id, schema.movement.possessor))
            .groupBy(schema.radios.id),
    }
})