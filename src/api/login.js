/**
 * 用户登录
 */
import request from '@/utils/request'

function login (username, password) {
  return request.post('/api/user/login', {
    username: username,
    password: password
  })
}

export default login
