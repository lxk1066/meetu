/**
 * 根据MUID搜索用户
 */
import request from '@/utils/request'

function searchMUID (muid, token) {
  return request({
    method: 'post',
    url: '/api/user/searchMUID',
    data: { muid: muid },
    headers: { Authorization: token }
  })
}

export default searchMUID
