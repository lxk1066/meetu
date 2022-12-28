/**
 * 通过muid获取用户个人信息
 */
import request from '@/utils/request'

function getMuidUserInfo (muid) {
  return request({
    method: 'get',
    url: `/api/user/getMuidUserInfo/${muid}`
  })
}

export default getMuidUserInfo
