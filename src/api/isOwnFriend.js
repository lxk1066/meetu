/**
 * 查询某个MUID是否为当前用户的好友
 */
import request from '@/utils/request'

function isOwnFriend (token, muid) {
  return request({
    method: 'post',
    url: '/api/user/isOwnFriend',
    data: { muid: muid },
    headers: { Authorization: token }
  })
}

export default isOwnFriend
