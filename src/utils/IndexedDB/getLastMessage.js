import { store } from './init'

export async function getLastMessage (uid, fromId, toId) {
  const db = await store(uid, fromId, toId)
  const objectStore = db.transaction(['message'], 'readonly').objectStore('message')
  const objectIndex = objectStore.index('time')
  return await new Promise((resolve) => {
    const request = objectIndex.openCursor()
    const results = []
    request.onsuccess = e => {
      const cursor = e.target.result
      if (cursor) {
        results.push(cursor.value)
        cursor.continue()
      } else {
        // 使用index索引查询默认会按照索引升序排序，取出数组中最后一项便是时间最新的记录
        resolve([results[results.length - 1]])
      }
    }
  })
}
