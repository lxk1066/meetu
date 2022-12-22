/**
 * 验证jwt_token是否正确
 */
import request from '@/utils/request'

function verifyToken (token) {
  return request({
    method: 'get',
    url: '/api/user/verifyToken',
    headers: { Authorization: token }
  })
}

export default verifyToken
