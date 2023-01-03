import { store } from './init'

export async function putMessageReaded (uid, msgId, fromId, toId, msg, time) {
  const db = await store(uid, fromId, toId)
  const objectStore = db.transaction(['message'], 'readwrite').objectStore('message')
  return await new Promise((resolve) => {
    const request = objectStore.put({
      msg_id: msgId,
      from_uid: fromId,
      to_uid: toId,
      message: msg,
      time: time,
      hasRead: true
    })
    request.onsuccess = e => {
      resolve(e.type)
    }
  })
}
