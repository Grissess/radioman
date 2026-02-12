import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    let check = await db.select().from(schema.people).where(eq(schema.people.id, body.auditor)).limit(1)
    if(check.length < 1) throw createError({status: 404, message: 'Auditor ID not found'})
    if(body.possessor) {
        check = await db.select().from(schema.people).where(eq(schema.people.id, body.possessor)).limit(1)
        if(check.length < 1) throw createError({status: 404, message: 'Possessor ID not found'})
    } else {
        body.possessor = null
    }
    check = await db.select().from(schema.radios).where(eq(schema.radios.id, body.radio)).limit(1)
    if(check.length < 1) throw createError({status: 404, message: 'Radio ID not found'})
    
    if(!body.at) body.at = new Date()
    if(typeof body.at === 'number') body.at = new Date(body.at)
    let note = null
    if(body.note) {
        note = body.note
        body.note = undefined
    }
    
    const move = await db.insert(schema.movement).values(body).returning({id: schema.movement.id})
    if(move[0]?.id && note) {
        await db.insert(schema.comments).values({
            at: new Date(),
            moveId: move[0].id,
            commenter: body.auditor,
            comment: note,
        })
    }
    
    return true
})