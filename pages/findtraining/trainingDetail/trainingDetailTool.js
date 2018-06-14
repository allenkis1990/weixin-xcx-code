// 将s转为分、秒的格式
function changeTimeStyle(totalSeconds) {
  if (totalSeconds == 0) {
    return ''
  }
  let hour = Math.floor(totalSeconds / 3600)
  let min = Math.floor((totalSeconds % 3600) / 60)
  let seconds = Math.floor((totalSeconds % 3600) % 60)
  let timeString = ''
  if (hour > 0) {
    timeString = fix(hour, 2) + ':' + fix(min, 2) + ':' + fix(seconds, 2)
  } else {
    timeString = fix(min, 2) + ':' + fix(seconds, 2)
  }
  return timeString
}
// 保留两位数操作，不足用0补齐
function fix(num, length) {
  return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}
module.exports = {
  changeTimeStyle: changeTimeStyle,
  fix: fix
}