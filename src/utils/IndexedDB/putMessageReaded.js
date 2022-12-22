import { db } from './init'

export function putMessageReaded (msgId, fromId, toId, msg, time) {
  db.messages.put({
    msg_id: msgId,
    from_uid: fromId,
    to_uid: toId,
    message: msg,
    time: time,
    hasRead: true
  })
}
