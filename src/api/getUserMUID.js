/**
 * 获取用户的MUID
 */
import request from '@/utils/request'

function getUserMUID (uid) {
  return request({
    method: 'get',
    url: `/api/user/getUserMUID/${uid}`
  })
}

export default getUserMUID
