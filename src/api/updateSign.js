/**
 * 修改个性签名
 */
import request from '@/utils/request'

function updateSign (sign, token) {
  return request({
    method: 'post',
    url: '/api/user/updateSign',
    data: { sign: sign },
    headers: { Authorization: token }
  })
}

export default updateSign
