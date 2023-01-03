import { store } from './init'
// 清空某个用户的聊天记录
export async function clearMessages (uid, fromId, toId) {
  const db = await store(uid, fromId, toId)
  const objectStore = db.transaction(['message'], 'readwrite').objectStore('message')
  objectStore.clear()
}
