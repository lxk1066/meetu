/**
 * 发送`修改密码`的邮件
 */
import request from '@/utils/request'

function sendModifyPasswordEmail (token) {
  return request({
    method: 'post',
    url: '/api/user/updatePasswordEmail',
    headers: { Authorization: token }
  })
}

export default sendModifyPasswordEmail
