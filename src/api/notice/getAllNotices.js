/**
 * 获取当前用户的所有通知
 */
import request from '@/utils/request'

function getAllNotices (token) {
  return request({
    method: 'post',
    url: '/api/user/getAllNotices',
    headers: { Authorization: token }
  })
}

export default getAllNotices
