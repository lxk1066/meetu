import { store } from './init'

/**
 * @param uid 当前登录用户的uid
 * @param fromId
 * @param toId
 * @param {Object} obj 写入的数据对象 { from_uid, to_uid, message, time, hasRead }
 */

export async function addMessage (uid, fromId, toId, obj) {
  const db = await store(uid, fromId, toId)
  const objectStore = db.transaction(['message'], 'readwrite').objectStore('message')
  return await new Promise((resolve) => {
    const request = objectStore.add({
      msg_id: `${obj.from_uid}_${obj.time}`,
      from_uid: obj.from_uid,
      to_uid: obj.to_uid,
      message: obj.message,
      time: obj.time,
      hasRead: obj.hasRead
    })
    request.onsuccess = e => {
      resolve(e.type)
    }
  })
}
