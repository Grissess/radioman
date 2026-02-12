import { like, and, eq, sql, desc } from 'drizzle-orm'
import { alias } from 'drizzle-orm/sqlite-core'

const auditors = alias(schema.people, 'auditors')
const possessors = alias(schema.people, 'possessors')

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return {
    rows: await db.select({
        identifier: schema.radios.identifier,
        at: schema.movement.at,
        kind: schema.movement.kind,
        auditor: sql`${auditors.dispName} || ', ' || ${auditors.realName}`,
        possessor: sql`${possessors.dispName} || ', ' || ${possessors.realName}`,
    })
        .from(schema.movement)
        .innerJoin(schema.radios, eq(schema.radios.id, schema.movement.radio))
        .innerJoin(auditors, eq(auditors.id, schema.movement.auditor))
        .leftJoin(possessors, eq(possessors.id, schema.movement.possessor))
        .where(and(...Object.keys(query).map(f => like(sql(f), query[f]))))
        .orderBy(desc(schema.movement.at)),
  }
})
