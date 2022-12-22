/**
 * 修改邮箱地址
 */
import request from '@/utils/request'

function modifyMailbox (token, verifyCode, newEmail) {
  return request({
    method: 'post',
    url: '/api/user/modifyMailbox',
    data: { verifyCode: verifyCode, newEmail: newEmail },
    headers: { Authorization: token }
  })
}

export default modifyMailbox
