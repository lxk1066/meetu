/**
 * 同意好友请求
 */
import request from '@/utils/request'

function agreeFriendRequest (token, noticeId) {
  return request({
    method: 'post',
    url: '/api/user/agreeFriendRequest',
    data: { noticeId: noticeId },
    headers: { Authorization: token }
  })
}

export default agreeFriendRequest
