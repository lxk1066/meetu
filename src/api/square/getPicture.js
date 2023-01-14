/**
 * 获取帖子图片
 */
import request from '@/utils/request'

function getPicture (picName) {
  return request.defaults.baseURL + '/api/square/getPicture/' + picName
}

export default getPicture
