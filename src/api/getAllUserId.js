/**
 * 获取所有用户的uid
 */
import request from '@/utils/request'

function getAllUserId (token) {
  return request({
    method: 'post',
    url: '/api/user/getAllUserId',
    headers: { Authorization: token }
  })
}

export default getAllUserId
