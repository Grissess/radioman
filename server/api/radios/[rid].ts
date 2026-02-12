
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const rows = await db.select().from(schema.radios)
        .where(eq(schema.radios.id, getRouterParam(event, 'rid')))
        .limit(1)
    if(rows.length < 1) return undefined
    const radio = rows[0]
    const holderInfo = await db.select().from(schema.movement)
        .where(eq(schema.movement.radio, radio.id))
        .orderBy(desc(schema.movement.at))
        .limit(1)
    radio.holder = holderInfo.length > 0 ? {pid: holderInfo[0].possessor} : undefined
    if(radio.holder) {
        radio.holder.moveId = holderInfo[0].id
        const personInfo = await db.select().from(schema.people)
            .where(eq(schema.people.id, radio.holder.pid))
            .limit(1)
        if(personInfo.length > 0) Object.assign(radio.holder, personInfo[0])
    }
    if(holderInfo[0]) {
        const comments = await db.select(
             {
                at: schema.comments.at,
                commenter: schema.comments.commenter,
                comment: schema.comments.comment,
                dispName: schema.people.dispName,
                realName: schema.people.realName,
             }
        )
            .from(schema.comments)
            .leftJoin(schema.people, eq(schema.people.id, schema.comments.commenter))
            .where(eq(schema.comments.moveId, holderInfo[0].id))
            .orderBy(desc(schema.comments.at))
        comments.forEach((comment: {at: Date | number}) => comment.at = comment.at.getTime());
        radio.moveComments = comments
    }
    return radio
})