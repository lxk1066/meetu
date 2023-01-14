/**
 * 获取指定区间的帖子列表
 * @param {String} order 帖子的排列方式，可选值：time | hot
 * @param {String | Number} offset 从列表的某个位置后开始截取
 * @param {String | Number} limit 截取多个条数据
 */
import request from '@/utils/request'

function getPostList (order, offset, limit) {
  return request({
    method: 'get',
    url: `/api/square/getPostList?order=${order}&offset=${offset}&limit=${limit}`
  })
}

export default getPostList
