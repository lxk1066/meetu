/**
 * 发布帖子
 */
import request from '@/utils/request'

function publishPost (token, formData) {
  return request({
    method: 'post',
    url: '/api/square/publishPost',
    data: formData,
    headers: { Authorization: token }
  })
}

export default publishPost
