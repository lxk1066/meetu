/**
 * 根据用户id生成IndexedDB的objectStore(相当于数据表)并将其返回，
 * 其中每一个数据库都存储了当前用户与另一位用户的聊天记录，
 * 当要操作聊天记录时发现没有对应的DB时就会触发升级并创建DB和objectStore
 * @param uid    当前登录账号的uid
 * @param fromId 聊天记录的其中一个用户的id，与toId不存在先后顺序
 * @param toId   聊天记录的其中一个用户的id，与fromId不存在先后顺序
 * @returns {Promise}
 */
export const store = (uid, fromId, toId) => {
  // 数据库名：`meetu_${当前登录账号id}_${fromId}_${toId}`
  const dbName = parseInt(fromId) < parseInt(toId)
    ? `meetu_${uid}_${fromId}_${toId}`
    : `meetu_${uid}_${toId}_${fromId}`
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1)
    request.onupgradeneeded = function (e) {
      console.log('数据库升级成功')
      const db = e.target.result
      if (!db.objectStoreNames.contains('message')) {
        const objectStore = db.createObjectStore('message', { keyPath: 'msg_id' })
        objectStore.createIndex('from_uid', 'from_uid', { unique: false })
        objectStore.createIndex('to_uid', 'to_uid', { unique: false })
        objectStore.createIndex('time', 'time', { unique: true })
      }
    }
    request.onerror = function (e) {
      console.log('打开数据库失败')
      reject(e.target)
    }
    request.onsuccess = function (e) {
      console.log('打开数据库成功')
      resolve(e.target.result)
    }
  })
}
