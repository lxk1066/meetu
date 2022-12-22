import { db } from './init'

export async function getLastMessage (fromId, toId) {
  return await db.messages
    .orderBy('time').filter(msg => {
      return (msg.from_uid === fromId && msg.to_uid === toId) || (msg.from_uid === toId && msg.to_uid === fromId)
    })
    .reverse()
    .limit(1)
    .toArray()
}
