// pages/exam/examEntrance/examEntrance.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    trainingClassId:'trainingClassId',
    examObjects: [{
      objectId: "", 
      type: "" 
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync(app.constant.testPaper, [
      {
        questionId: "e66392f0-57d7-4d30-bdd6-6e3ad805e231",
        questionType: 1
      },
      {
        questionId: "e66392f0-57d7-4d30-bdd6-6e3ad805e232",
        questionType: 2
      },
      {
        questionId: "e66392f0-57d7-4d30-bdd6-6e3ad805e233",
        questionType: 2
      },
      {
        questionId: "e66392f0-57d7-4d30-bdd6-6e3ad805e234",
        questionType: 3
      },
      {
        questionId: "e66392f0-57d7-4d30-bdd6-6e3ad805e235",
        questionType: 3
      },
      {
        questionId: "e66392f0-57d7-4d30-bdd6-6e3ad805e236",
        questionType: 2
      },
      {
        questionId: "e66392f0-57d7-4d30-bdd6-6e3ad805e237",
        questionType: 2
      }
    ])
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  /**
   * 获取练习抽题参数
   */
  requireTestParams: function () {
    var params = {
      trainingClassId: '',
      maxQuestionNum: 500
    }
    app.requestData(app.getServeContextInfo().examServeDomain + app.config.testQuestionParam, param, "POST").then(data => {
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        });
      }
      })
  },
  /**
   * 获取试题列表
   */
  requireTestQuestions:function(params){
    app.requestData(app.getServeContextInfo().examServeDomain + app.config.testQuestionParam, params,"POST").then(data=>{
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        });
      }
      wx.setStorageSync(app.constant.testPaper, data.data.questionIdList)
    })
  },
  /**
   * 进入测验
   */
  beginExam: function (event) {
    var _this = this
    var param = {
      "subProjectId": app.getServeContextInfo().subProjectId,
      "userId": app.userInfo.userId,
      "isAsync": false,
      "projectId": app.getServeContextInfo().projectId,
      "organizationId": "-1",
      "platformId": app.getServeContextInfo().platformId,
      "unitId": app.getServeContextInfo().unitId,
      "platformVersionId": app.getServeContextInfo().platformVersionId
    }
    // 登陆考试能力服务
    // https://examv1.59iedu.com/test2
    // app.config.serveContextInfo.examServeDomain
    app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileLogin/login', param, "POST").then(data => {
      console.log(data)
      if (data.head.code === app.constant.network_result_success) {
        if (data.data.result === 'success') {
          _this.requireTestParams()
        } else {
          return wx.showToast({
            title: "获取是试题失败",
            icon: 'none'
          });
        }
      } else {
        return wx.showToast({
          title: "获取是试题失败",
          icon: 'none'
        });
      }
    })
  },
  /**
   * 进入练习
   */
  testEnter:function(){
    // 0查看卷子  1考试
    var url = '/pages/testModule/testContainer/testContainer?examOrCheckResult=1' + "&trainingClassId=" + this.data.trainingClassId + "&examObjects=" +JSON.stringify(this.data.examObjects)
    wx.navigateTo({
      url: url
    })
  }
})
