import { db } from './init'

/**
 * @param {Object} obj 写入的数据对象 { from_uid, to_uid, message, time, hasRead }
 */

export function addMessage (obj) {
  db.messages.add({
    msg_id: `${obj.from_uid}_${obj.time}`,
    from_uid: obj.from_uid,
    to_uid: obj.to_uid,
    message: obj.message,
    time: obj.time,
    hasRead: obj.hasRead
  })
}
