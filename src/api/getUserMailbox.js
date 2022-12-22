/**
 * 获取用户的邮箱地址
 */
import request from '@/utils/request'

function getUserMailbox (token) {
  return request({
    method: 'post',
    url: '/api/user/getMailbox',
    headers: { Authorization: token }
  })
}

export default getUserMailbox
