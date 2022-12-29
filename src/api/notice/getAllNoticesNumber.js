/**
 * 获取当前用户的所有通知数量
 */
import request from '@/utils/request'

function getAllNoticesNumber (token) {
  return request({
    method: 'post',
    url: '/api/user/getAllNoticesNumber',
    headers: { Authorization: token }
  })
}

export default getAllNoticesNumber
