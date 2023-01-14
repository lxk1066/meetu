/**
 * 获取指定ID的帖子数据
 * @param {String | Number} postId 帖子ID
 */
import request from '@/utils/request'

function getPostList (postId) {
  return request({
    method: 'get',
    url: `/api/square/getPost/${postId}`
  })
}

export default getPostList
