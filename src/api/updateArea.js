/**
 * 修改地区
 */
import request from '@/utils/request'

function updateArea (area, token) {
  return request({
    method: 'post',
    url: '/api/user/updateArea',
    data: { area: area },
    headers: { Authorization: token }
  })
}

export default updateArea
