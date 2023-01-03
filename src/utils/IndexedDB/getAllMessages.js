import { store } from './init'

export async function getAllMessages (uid, fromId, toId) {
  const db = await store(uid, fromId, toId)
  const objectStore = db.transaction(['message'], 'readonly').objectStore('message')
  const objectIndex = objectStore.index('time') // 按照时间的先后顺序排列
  return await new Promise((resolve) => {
    const request = objectIndex.openCursor()
    const results = []
    request.onsuccess = e => {
      const cursor = e.target.result
      if (cursor) {
        results.push(cursor.value)
        cursor.continue()
      } else {
        // 所有的object都在results里面
        resolve(results)
      }
    }
  })
}
