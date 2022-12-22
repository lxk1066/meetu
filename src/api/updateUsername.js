/**
 * 修改用户名
 */
import request from '@/utils/request'

function updateUsername (username, token) {
  return request({
    method: 'post',
    url: '/api/user/updateUsername',
    data: { username: username },
    headers: { Authorization: token }
  })
}

export default updateUsername
