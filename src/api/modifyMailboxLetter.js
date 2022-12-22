/**
 * 发送`修改邮箱`的验证码邮件
 */
import request from '@/utils/request'

function sendModifyMailboxLetter (token) {
  return request({
    method: 'post',
    url: '/api/user/ModifyMailboxLetter',
    headers: { Authorization: token }
  })
}

export default sendModifyMailboxLetter
