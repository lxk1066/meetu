/**
 * 修改MUID
 */
import request from '@/utils/request'

function modifyUserMUID (token, newMUID) {
  return request({
    method: 'post',
    url: '/api/user/updateMUID',
    data: { newMUID },
    headers: { Authorization: token }
  })
}

export default modifyUserMUID
