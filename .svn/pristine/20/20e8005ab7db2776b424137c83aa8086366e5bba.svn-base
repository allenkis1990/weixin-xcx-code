let courseDetailPage = null
let uplaodTimer = null
let courseUploadInfo = {}
let timerCallBackAction = null
let studyAbilityInterface = require('./studyAbilityInterface.js')
let app = getApp()
// 开启定时器事件
function startServerWithInterval(interval) {
  let timeInterval = interval == 0 || interval == undefined ? 30000 : interval
  if (uplaodTimer) {
    clearTimeout(uplaodTimer)
  }
  uplaodTimer = setTimeout(() => {
    // 定时器回调事件
    typeof timerCallBackAction === 'function' && timerCallBackAction()
    submitVideoProgress()
    startServerWithInterval(timeInterval)
  }, timeInterval)
}
function stopServer() {
  if (uplaodTimer) {
    clearTimeout(uplaodTimer)
  }
  timerCallBackAction = null
}
/**
  * 初始化定时器事件
  * resultData 视频初始化信息
  * interval 定时器间隔
  * courseWareType 课件类型
  * coursewareLength 课件长度
  * userId 用户id
  * trainingClassId 培训班id
  * courseId 课程id
  * courseWareId 课件id
  * hasMarker 是否有特征标识
  * timerCallBackAct 定时器回调事件，定时器调用时同步调用的事件，类型为function
  */
function onPlayTimeServerInit(resultData, interval, courseWareType, coursewareLength, userId, trainingClassId, courseId, courseWareId, hasMarker,timerCallBackAct) {
  courseUploadInfo.resultData = resultData
  courseUploadInfo.coursewareLength = coursewareLength
  courseUploadInfo.userId = userId
  courseUploadInfo.trainingClassId = trainingClassId
  courseUploadInfo.courseId = courseId
  courseUploadInfo.courseWareId = courseWareId
  courseUploadInfo.hasMarker = hasMarker
  courseUploadInfo.courseWareType = courseWareType
  timerCallBackAction = timerCallBackAct

  // 开启定时器服务
  // 只有当课件为video时会开启该定时器
  if (courseWareType == 1) {
    return
  }
  startServerWithInterval(interval)
}
function submitVideoProgress() {
  
  if (courseUploadInfo.resultData == undefined || courseUploadInfo.resultData.core === undefined) {
    return
  }
  if (courseUploadInfo.courseWareType == 1) {
    return
  }
  // 提交课程进度，resultData为初始化播放的信息
  let currentTime = wx.getStorageSync('lastTime') ? parseInt(wx.getStorageSync('lastTime')) : 0
  let maxTime = wx.getStorageSync('maxTime') ? parseInt(wx.getStorageSync('maxTime')) : 0
  let studySchedule = 0
  if (maxTime <= (courseUploadInfo.coursewareLength - 20)) {
    studySchedule = parseInt((maxTime / courseUploadInfo.coursewareLength) * 100)
  } else {
    studySchedule = 100
  }
  studyAbilityInterface.submitProgress(courseUploadInfo.userId, courseUploadInfo.trainingClassId, courseUploadInfo.courseId, courseUploadInfo.coursewareId, courseUploadInfo.resultData.core.primaryKey, currentTime, studySchedule, maxTime, courseUploadInfo.resultData.core.courseRecordId, courseUploadInfo.resultData.core.coursewareRecordId,
    courseUploadInfo.resultData.core.token, courseUploadInfo.resultData.core.lessonStatus, courseUploadInfo.resultData.core.timingMode, app.getServeContextInfo().trainSourceId, courseUploadInfo.hasMarker).then(response => {

    }, message => {

    })
}
module.exports = {
  onPlayTimeServerInit: onPlayTimeServerInit,
  stopServer: stopServer,
  startServerWithInterval: startServerWithInterval,
  submitVideoProgress: submitVideoProgress
}