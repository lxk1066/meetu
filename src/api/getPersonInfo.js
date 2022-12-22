/**
 * 获取用户个人信息
 */
import request from '@/utils/request'

function getPersonInfo (uid) {
  return request({
    method: 'get',
    url: `/api/user/getPersonInfo/${uid}`
  })
}

export default getPersonInfo
