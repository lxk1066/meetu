/**
 * 拒绝好友请求
 */
import request from '@/utils/request'

function disagreeFriendRequest (token, noticeId) {
  return request({
    method: 'post',
    url: '/api/user/disagreeFriendRequest',
    data: { noticeId: noticeId },
    headers: { Authorization: token }
  })
}

export default disagreeFriendRequest
