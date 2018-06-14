
//课程播放初始化
const courseInitializeVideoPlayInfo = `/api/LearningMarker/Initing`;
//课程进度提交
const coursePlayProcessUpload = `/api/LearningMarker/Timing`;

/**
 * 课程学习计时服务
 */
let app = getApp()
let config = app.config
let readyToPlayInfo = {}
/**
  * 初始化课件播放接口
  * classId 培训班id
  * courseId 课程id
  * courseWareId 课件id
  * multiMediaId 课件媒体id
  * playType 课件类型
  * originalAbilityId 播放源id
  * marker 特征标识数组
  */
function studyInit(classId, courseId, coursewareId, multiMediaId, playType, originalAbilityId, marker) {
  return new Promise(function (resolve, reject) {
    if (config === undefined || app.serveContextInfo === undefined) {
      // 通知执行失败
      reject('未获取服务器初始化')
    }
    if (classId === undefined) {
      //通知执行失败
      reject('classId未定义')
    }

    if (originalAbilityId === undefined || originalAbilityId === '') {
      originalAbilityId = '-1'
    }
    console.log(app.userInfo)
    var paramModel = {}
    var contextModel = {
      plmId: app.serveContextInfo.platformId,
      pvmId: app.serveContextInfo.platformVersionId,
      prmId: app.serveContextInfo.projectId,
      subPrmId: app.serveContextInfo.subProjectId,
      unitId: '-1',
      orgId: app.serveContextInfo.organizationId
    }
    // objectType\objectId\markers
    if (classId === undefined || classId === '') {
      contextModel.objectType = '-1'
      contextModel.objectId = '-1'
    } else {
      contextModel.objectType = '1'
      contextModel.objectId = classId
    }
    if (marker && marker.length > 0) {
      contextModel.markers = marker
    }
    paramModel.context = contextModel
    paramModel.usrId = app.userInfo.userId
    paramModel.courseId = courseId
    paramModel.courseWareId = coursewareId
    paramModel.multimediaId = multiMediaId
    paramModel.type = playType
    paramModel.originalAbilityId = originalAbilityId
    var url = app.serveContextInfo.studyServeDomain + courseInitializeVideoPlayInfo
    if (marker && marker.length > 0) {
      app.requestData(url, paramModel, 'POST').then(data => {
        resolve(data)
        readyToPlayInfo = data.data
      })
    } else {
      app.requestData(url, paramModel, 'GET').then(data => {
        resolve(data)
      })
    }
  })
}
/**
  * 提交课件进度接口
  * useId 用户id
  * classId 培训班id
  * courseId 课程id
  * courseWareId 课件id
  * pramaryKey 可通过课程初始化后获取
  * studyCurrentScale 当前课件播放时间
  * studySchedule 当前课件进度
  * studyLastScale 当前课件播放的最后时间
  * courseRecordId 可通过课程初始化后获取
  * coursewareRecordId 可通过课程初始化后获取
  * token 可通过课程初始化后获取
  * lessonStatus 可通过课程初始化后获取
  * timingModel 可通过课程初始化后获取
  * originalAbilityId 课件播放源id
  * hasMarker 是否有特征标识
  */ 
function submitProgress(userId, classId, courseId, coursewareId, pramaryKey, studyCurrentScale, studySchedule, studyLastScale, courseRecordId, coursewareRecordId,
  token, lessonStatus, timingModel, originalAbilityId, hasMarker) {
  return new Promise(function (resolve, reject) {
    let url = app.serveContextInfo.studyServeDomain + coursePlayProcessUpload
    if (classId == undefined || classId == null) {
      classId = ''
    }
    let paramModel = {}
    let coreModel = {
      primaryKey: pramaryKey,
      courseRecordId: courseRecordId,
      coursewareRecordId: coursewareRecordId,
      studyCurrentScale: studyCurrentScale,
      studyLastScale: studyLastScale,
      studySchedule: studySchedule,
      lessonStatus: lessonStatus,
      token: token,
      timingMode: timingModel
    }
    paramModel.core = coreModel
    let extendModel = {}
    extendModel.userId = userId;
    extendModel.originalAbilityId = originalAbilityId;
    paramModel.extend = extendModel
    if (hasMarker) {
      app.requestData(url, paramModel, 'POST').then(data => {
        resolve(data)
      })
    } else {
      app.requestData(url, paramModel, 'GET').then(data => {
        resolve(data)
      })
    }
  })
}
module.exports = {
  studyInit: studyInit,
  submitProgress: submitProgress
}

