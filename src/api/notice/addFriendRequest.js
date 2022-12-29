/**
 * 发送好友申请
 */
import request from '@/utils/request'

function addFriendRequest (token, muid, message) {
  return request({
    method: 'post',
    url: '/api/user/addFriendRequest',
    data: { muid, message },
    headers: { Authorization: token }
  })
}

export default addFriendRequest
