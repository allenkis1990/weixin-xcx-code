function getCourseTypeByType(playType) {
  switch (playType) {
    case -1: {
      return "未知"
    }
    case 1: {
      return "pdf"
    }
    case 2: {
      return "single"
    }
    case 3: {
      return "three"
    }
    default:
      return ""
  }
}
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
/*
　*　重新排序资源文件
　*/
function resetResList(resList) {
  // 移除resLevel>1的资源文件
  for (let index = resList.length-1;index>=0;index--) {
    let resObject = resList[index]
    if (resObject && parseInt(resObject.resLevel) > 0) {
      resList.removeByIndex(index)
    }
  }
  // 重新进行排序
  resList.sort((a,b)=>{
    if(parseInt(a.resLevel)<parseInt(b.resLevel)){
      return true
    }
    return false
  })
  return resList
}

/*
　 *　方法:Array.removeObject(dx)
　 *　功能:删除数组元素.
　 *　参数:dx删除的元素.
　 *　返回:在原数组上修改数组.
　 */
　Array.prototype.removeObject = function (object) {
  let removeIndex = null
  for (let index in this) {
    let removeObject = this[index]
    if (removeObject == object) {
      removeIndex = index
    }
  }
  if (isNaN(removeIndex) || removeIndex > this.length) { return false; }
  this.splice(removeIndex, 1);
　}
/*
  *　方法:Array.removeByIndex(dx)
  *　功能:删除数组元素.
  *　参数:dx删除元素的下标.
  *　返回:在原数组上修改数组.
  */
Array.prototype.removeByIndex = function (dx) {
  if (isNaN(dx) || dx > this.length) { return false; }
  this.splice(dx, 1);
}

module.exports = {
  getCourseTypeByType: getCourseTypeByType,
  changeTimeStyle: changeTimeStyle,
  resetResList: resetResList
}