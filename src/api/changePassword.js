/**
 * 修改密码
 */
import request from '@/utils/request'

function changePassword (token, password) {
  return request.post('/api/user/changePassword', {
    token, password
  })
}

export default changePassword
