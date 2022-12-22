import Dexie from 'dexie'

export const db = new Dexie('meetu')
db.version(1).stores({
  messages: '&msg_id, uid, &time'
})

db.version(2).stores({
  messages: '&msg_id, from_uid, to_uid, &time'
}).upgrade(tx => {
  return tx.table('messages').toCollection().modify(msg => {
    msg.from_uid = msg.uid
    msg.to_uid = ''
    delete msg.uid
    delete msg.username
    delete msg.profile
  })
})
