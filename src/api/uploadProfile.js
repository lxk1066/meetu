/**
 * 上传头像
 */
import request from '@/utils/request'

function uploadProfile (fileData, token) {
  return request({
    method: 'post',
    url: '/api/user/upload',
    data: fileData,
    headers: { Authorization: token }
  })
}

export default uploadProfile
