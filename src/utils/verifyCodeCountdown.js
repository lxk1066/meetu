/**
 *   点击发送验证码的倒计时效果
 * @param {String} text
 * @param {Number} seconds
 * @param  ref
 * @param cb callback
 * @constructor
 */

function Countdown (text, seconds, ref, cb) {
  let secondsRemaining = seconds
  const timer = setInterval(() => {
    ref.value = `(${secondsRemaining}) 秒`
    --secondsRemaining
    if (secondsRemaining === 0) {
      clearInterval(timer)
      ref.value = text
      cb && cb()
    }
  }, 1000)
}
export default Countdown
