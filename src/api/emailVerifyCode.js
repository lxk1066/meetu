/**
 * 发送邮件验证码
 */
import request from '@/utils/request'

function sendEmailVerifyCode (email) {
  return request.post('/api/user/email', {
    email: email
  })
}

export default sendEmailVerifyCode
