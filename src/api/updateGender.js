/**
 * 修改性别
 */
import request from '@/utils/request'

function updateGender (gender, token) {
  return request({
    method: 'post',
    url: '/api/user/updateGender',
    data: { gender: gender },
    headers: { Authorization: token }
  })
}

export default updateGender
