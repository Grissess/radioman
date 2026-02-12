import { like, and, eq, sql, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return {
    rows: await db.select({
        identifier: schema.radios.identifier,
        at: schema.comments.at,
        commenter: sql`${schema.people.dispName} || ', ' || ${schema.people.realName}`,
        comment: schema.comments.comment,
    })
        .from(schema.comments)
        .innerJoin(schema.movement, eq(schema.movement.id, schema.comments.moveId))
        .innerJoin(schema.radios, eq(schema.radios.id, schema.movement.radio))
        .innerJoin(schema.people, eq(schema.people.id, schema.comments.commenter))
        .where(and(...Object.keys(query).map(f => like(sql(f), query[f]))))
        .orderBy(desc(schema.comments.at)),
  }
})