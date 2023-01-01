/**
 * 删除指定通知
 */
import request from '@/utils/request'

function deleteNotice (token, noticeId) {
  return request({
    method: 'post',
    url: '/api/user/deleteNotice',
    data: { noticeId: noticeId },
    headers: { Authorization: token }
  })
}

export default deleteNotice
