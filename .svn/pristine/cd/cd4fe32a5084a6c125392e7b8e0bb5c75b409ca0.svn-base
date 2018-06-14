
function examLogin() {
  var app = getApp()
  var result = { success: false }
  return new Promise((resolve, reject) => {
    var param = {
      "subProjectId": app.getServeContextInfo().subProjectId,
      "userId": app.userInfo.userId,
      "isAsync": false,
      "projectId": app.getServeContextInfo().projectId,
      "organizationId": "-1",
      "platformId": app.getServeContextInfo().platformId,
      "unitId": app.getServeContextInfo().unitId,
      "platformVersionId": app.getServeContextInfo().platformVersionId,
      "dataPlatformVersionId": app.getServeContextInfo().dataPlatformVersionId,
      "dataProjectId": app.getServeContextInfo().dataProjectId
    }
    // 登陆考试能力服务
    app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileLogin/login', param, "POST").then(data => {
      if (data.head.code === app.constant.network_result_success) {
        if (data.data.result === 'success') {
          result.success=true
          return  resolve(result)
        }
      }
      return  resolve(result)
    })
  })
}

module.exports = {
  examLogin: examLogin
}