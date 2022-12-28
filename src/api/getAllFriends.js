/**
 * 获取当前用户的好友列表
 */
import request from '@/utils/request'

function getAllFriends (token) {
  return request({
    method: 'post',
    url: '/api/user/getAllFriends',
    headers: { Authorization: token }
  })
}

export default getAllFriends
