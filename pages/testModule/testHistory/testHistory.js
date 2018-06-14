const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    practiceInfo: {
      learningMethodId: "85a26504-6518-4dae-837a-5ce263516efe",                      //true|String|学习方案id
      courseId: "20160614003",                                                      //string|课程id
      practiseExamId: "6789134249874364",                                           //string|练习卷id
      passScore: 60,                                                                 //double|练习卷合格分数
      resultState: 0,                                                                //int|练习卷考核结果  0 未测验   1  合格  2  不合格
      alreadyTestCount: 2,                                                          //int|已测验次数
      remainderTestCount: 3,                                                        //int|剩测验次数|-1为不限次数
      highScore: 99,                                                                //double|最高分|如果还未测验，值为-1
      testRecordList: [                                                             //object|测验记录对象
        {
          practiseAnswerExamPaperId: "9b6d1274-379b-498f-8297-6fcdbee21337",    //string|用户练习卷答卷ID
          historyAnswerInfoId: "2da8c535-b9dd-45f8-984f-63e4f68500eb",          //string|用户练习卷答卷作答记录ID
          submitPaperTime: "2017/12/12   16:00:23",                             //string|交卷时间|yyyy/MM/dd HH:mm:ss
          score: 91,                                                            //double|得分
          hasShowRecord: true                                                   //Boolean|是否可查看记录|true 可查看记录； false 不可查看记录
        }
      ]
    },
    practiceList: [                                                             //object|测验记录对象
      {
        practiseAnswerExamPaperId: "9b6d1274-379b-498f-8297-6fcdbee21337",    //string|用户练习卷答卷ID
        historyAnswerInfoId: "2da8c535-b9dd-45f8-984f-63e4f68500eb",          //string|用户练习卷答卷作答记录ID
        submitPaperTime: "2017/12/12   16:00:23",                             //string|交卷时间|yyyy/MM/dd HH:mm:ss
        score: 91,                                                            //double|得分
        hasShowRecord: true                                                   //Boolean|是否可查看记录|true 可查看记录； false 不可查看记录
      }
    ],
    paper: Object,
    trainingClassId: String,
    courseId: String,
    type: -1,        //-1默认（课程） 1 培训班
    courseName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      trainingClassId: options.trainingClassId,
      type: options.type
    })
    this.requireHistoryList()
  },
  /**
   * 进入练习之前检查用户考试条件是否完备
   */
  checkEnterExam: function (e) {
    if (!e.currentTarget.dataset.data.hasShowRecord) {
      wx.showToast({
        title: '该历史记录不可查看！',
      })
    }

    var _this = this
    var param = {
      courseId: this.data.courseId,
      objectType: this.data.type,
      objectValue: this.data.type === 1 ? this.data.trainingClassId : this.data.courseId
    }
    app.requestData(app.getServeContextInfo().examServeDomain + app.config.checkEnterExam, param, "POST").then(data => {
      if (data.head.code === app.constant.network_result_success) {
        _this.checkHistoryPaper(e)
      } else {
        return wx.showToast({
          title: '该测验历史记录没有具备进入条件',
          icon: 'none'
        })
      }
    })
  },
  checkHistoryPaper: function (e) {
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

    app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileLogin/login', param, "POST").then(data => {
      if (data.head.code === app.constant.network_result_success) {
        if (data.data.result === 'success') {
          var param = {
            practiseExamId: e.currentTarget.dataset.data.historyAnswerInfoId,
            examObjectDtos: [{
              objectId: 1,
              type: this.data.courseId
            }]
          }
          wx.showLoading({ title: '获取试卷信息...', mask: true })
          app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileOnlineExam/viewExamPaper', param, "POST").then(data => {
            wx.hideLoading()
            if (data.head.code !== app.constant.network_result_success) {
              //网络请求失败
              return wx.showToast({
                title: data.head.message,
                icon: "none"
              })
            }
            try {
              wx.setStorageSync(app.constant.p_Paper, data.data)
            } catch (e) {
            }
            // 0查看卷子  1考试
            // 跳转到试题解析
            var url = '/pages/coursepractice/practiceContainer/practiceContainer?examOrCheckResult=0&examPassScore=' + this.data.coursePracticeInfo.passScore + "&courseName=" + this.data.courseName
            wx.navigateTo({
              url: url
            })
          })
        } else {
          return wx.showToast({
            title: '获取试题解析失败',
            icon: "none"
          })
        }
      } else {
        return wx.showToast({
          title: '获取试题解析失败',
          icon: "none"
        })
      }
    })
  },
  /**
   * 网络请求---课后练习历史记录
   */
  requireHistoryList: function () {
    var objectValue = ''
    if (this.data.type == 1) {
      objectValue = this.data.trainingClassId
    }
    var param = {
      courseId: this.data.courseId,
      objectType: this.data.type,
      objectValue: objectValue
    }
    wx.showLoading({ title: '获取历史考试记录......', mask: true })
    app.requestData(app.config.practicePaperPreview, param, "GET").then(data => {
      wx.hideLoading()
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return wx.showToast({
          title: data.head.message,
          icon: "none"
        })
      }
      this.setData({
        practiceInfo: data.data,
        practiceList: data.data.testRecordList
      })
    }).catch(e => {
      wx.hideLoading()
      console.log(e)
    })
  }
})