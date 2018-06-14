
let studyAbilityInterface = require('../../../utils/studyManager/studyAbilityInterface.js')
let courseUploadInfo = {}
let app = getApp()
/**
  * 打开pdf文件
  * pdfUrl pdf地址
  * courseDetaiPage 课程详情page
  * resultData 视频初始化信息
  * coursewareLength 课件长度
  * userId 用户id
  * trainingClassId 培训班id
  * courseId 课程id
  * courseWareId 课件id
  * hasMarker 是否有特征标识
  */
function openPdfFile(pdfUrl, courseDetaiPage, resultData, coursewareLength, userId, trainingClassId, courseId, courseWareId, hasMarker, uploadProgressSynchronizationAction) {
  console.log('pdfUrl:' + pdfUrl)
  if (!pdfUrl || !pdfUrl.length) {
    this.wetoast.toast({
      title: "pdf文件地址错误，无法打开！"
    })
    return
  }
  //兼容测试环境的内网地址，自动转换为默认外网443地址
  let index = pdfUrl.indexOf(':8443/')
  if (index >= 0) {
    pdfUrl = getApp().config.apiHost + pdfUrl.substring(index + ':8443/'.length, pdfUrl.length)
  }
  index = pdfUrl.indexOf(':1457/')
  if (index >= 0) {
    pdfUrl = getApp().config.apiHost + pdfUrl.substring(index + ':1457/'.length, pdfUrl.length)
  }
  console.log(pdfUrl)

  courseUploadInfo.resultData = resultData
  courseUploadInfo.coursewareLength = coursewareLength
  courseUploadInfo.userId = userId
  courseUploadInfo.trainingClassId = trainingClassId
  courseUploadInfo.courseId = courseId
  courseUploadInfo.courseWareId = courseWareId
  courseUploadInfo.hasMarker = hasMarker

  let context = courseDetaiPage
  wx.showLoading({
    title: '加载中...',
  })
  wx.downloadFile({
    url: pdfUrl,
    success: function (res) {
      let filePath = res.tempFilePath
      wx.openDocument({
        filePath: filePath,
        success: function (res) {
          //打开成功之后提交百分百成功进度
          if (!context.data.isTest) {
            submitPdfProgress()
            typeof uploadProgressSynchronizationAction === 'function' && uploadProgressSynchronizationAction()
          }
        },
        fail: function (res) {
          context.wetoast.toast({
            title: "pdf文件打开失败！"
          })
        },
        complete: function (res) {
          wx.hideLoading()
        }
      })
    },
    fail: function (res) {
      context.wetoast.toast({
        title: "pdf文件打开失败！"
      })
    },
    complete: function (res) {
      wx.hideLoading()
    }
  })
}
function submitPdfProgress() {
  if (courseUploadInfo.resultData.core === undefined) {
    return
  }
  studyAbilityInterface.submitProgress(courseUploadInfo.userId, courseUploadInfo.trainingClassId, courseUploadInfo.courseId, courseUploadInfo.coursewareId, courseUploadInfo.resultData.core.primaryKey, courseUploadInfo.coursewareLength, 100, courseUploadInfo.coursewareLength, courseUploadInfo.resultData.core.courseRecordId, courseUploadInfo.resultData.core.coursewareRecordId,
    courseUploadInfo.resultData.core.token, courseUploadInfo.resultData.core.lessonStatus, courseUploadInfo.resultData.core.timingMode, app.getServeContextInfo().trainSourceId, courseUploadInfo.hasMarker).then(response => {
    }, message => {
    })
}
module.exports = {
  openPdfFile: openPdfFile
}