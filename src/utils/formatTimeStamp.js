/***
 * 将时间戳转换成 xx-xx-xx xx:xx:xx 格式的字符串
 * @param {Number} timeStamp 时间戳
 * @param {String} mode 可选值："full" || "auto"
 * @returns {string}
 */

function formatTimeStamp (timeStamp, mode) {
  if (!mode) mode = 'full'
  timeStamp = parseInt(timeStamp)
  const time = new Date(timeStamp)
  const year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let hour = time.getHours()
  let minute = time.getMinutes()

  month = month < 10 ? '0' + month : month
  date = date < 10 ? '0' + date : date
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute

  if (mode === 'full') {
    return `${year}-${month}-${date} ${hour}:${minute}`
  } else if (mode === 'auto') {
    const nowStamp = +new Date(new Date().toLocaleDateString()).getTime()
    if (timeStamp >= nowStamp) {
      return `${hour}:${minute}`
    } else if ((nowStamp - timeStamp) <= 86400000) {
      return `昨天 ${hour}:${minute}`
    } else {
      return !parseInt(hour) && !parseInt(minute)
        ? `${year}/${month}/${date}`
        : `${year}/${month}/${date} ${hour}:${minute}`
    }
  } else {
    return `${year}/${month}/${date} ${hour}:${minute}`
  }
}

export default formatTimeStamp
