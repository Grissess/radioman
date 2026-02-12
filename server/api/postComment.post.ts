import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    let check = db.select().from(schema.people).where(eq(schema.people.id, body.commenter)).limit(1)
    if(check.length < 1) throw createError({status: 404, message: 'Commenter ID not found'})
    check = db.select().from(schema.movement).where(eq(schema.movement.id, body.moveId)).limit(1)
    if(check.length < 1) throw createError({status: 404, message: 'Movement ID not found'})

    if(!body.at) body.at = new Date()
    if(typeof body.at === 'number') body.at = new Date(body.at)
        
    await db.insert(schema.comments).values(body)
    return true
})