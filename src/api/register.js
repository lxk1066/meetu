/**
 * 用户注册
 */
import request from '@/utils/request'

function register (username, password, email, emailVerifyCode) {
  return request.post('/api/user/reg', {
    username: username,
    password: password,
    email: email,
    emailVerifyCode: emailVerifyCode
  })
}

export default register
