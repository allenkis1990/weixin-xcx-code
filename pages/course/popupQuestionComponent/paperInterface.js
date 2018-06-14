let app = getApp()
// 考试服务系统的登录
function examLogin() {
  return new Promise(function (resolve, reject) {
    var param = {
      "subProjectId": app.getServeContextInfo().subProjectId,
      "userId": app.userInfo.userId,
      "isAsync": false,
      "projectId": app.getServeContextInfo().projectId,
      "organizationId": app.serveContextInfo.organizationId,
      "platformId": app.getServeContextInfo().platformId,
      "unitId": '-1',
      "platformVersionId": app.getServeContextInfo().platformVersionId,
      "dataPlatformVersionId": app.getServeContextInfo().platformVersionId,
      "dataProjectId": app.getServeContextInfo().projectId
    }
    app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileLogin/login', param, "POST").then(data => {
      resolve(data)
    })
  })
}
/**
  * 获取弹窗题题目内容
  * questionIdList 获取的弹窗题id列表
  * questionSourceType 试题来源类型
  */
function getQuestionById(questionIdList, questionSourceType) {
  return new Promise(function (resolve, reject) {
    let param = {}
    if (questionSourceType == 1) {
      param.quizIdList = questionIdList
    }
    param.quizSourceType = questionSourceType
    param.platformId = app.getServeContextInfo().platformId
    param.platformVersionId = app.getServeContextInfo().platformVersionId
    param.projectId = app.getServeContextInfo().projectId
    param.subProjectId = app.getServeContextInfo().subProjectId
    param.unitId = '-1'
    param.organizationId = app.serveContextInfo.organizationId
    param.userId = app.getUserInfo().userId
    param.dataPlatformVersionId = app.getServeContextInfo().platformVersionId
    param.dataProjectId = app.getServeContextInfo().projectId
    param.quizSourceType = questionSourceType
    let url = app.getServeContextInfo().examServeDomain + '/mobile/mobilePopQuestion/findPopQuestionById'
    app.requestData(url, param, "POST").then(data => {
      resolve(data)
    })
  })
}
/**
  * 提交弹窗题答案（一次提交一题）
  * submitAnswerParam 提交需要的数据信息
  * answerValue 答案
  */
function submitPopQuestionAnswer(submitAnswerParam, answerValue) {
  let plateFormParam = {
    dataPlatformVersionId: app.getServeContextInfo().platformVersionId,
    dataProjectId: app.getServeContextInfo().projectId,
    platformId: app.serveContextInfo.platformId,
    platformVersionId: app.serveContextInfo.platformVersionId,
    projectId: app.serveContextInfo.projectId,
    subProjectId: app.serveContextInfo.subProjectId,
    unitId: '-1',
    organizationId: app.serveContextInfo.organizationId,
    sourceId: app.serveContextInfo.trainSourceId,
    userId: app.userInfo.userId
  }
  let popQuestionAnswerValue = {}
  if (submitAnswerParam){
    popQuestionAnswerValue =  Object.assign(plateFormParam, submitAnswerParam)
  }
  // 设置答案
  popQuestionAnswerValue.answer = answerValue
  return new Promise(function (resolve, reject) {
    let param = {
      popQuestionAnswerInfoDto: popQuestionAnswerValue
    }
    let url = app.getServeContextInfo().examServeDomain + '/mobile/mobilePopQuestion/submitQuizAnswer'
    app.requestData(url, param, "POST").then(data => {
      resolve(data)
    })
  })
}
module.exports = {
  examLogin: examLogin,
  getQuestionById: getQuestionById,
  submitPopQuestionAnswer: submitPopQuestionAnswer
}
