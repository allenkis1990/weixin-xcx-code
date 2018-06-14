// pages/exam/examhistory/examhistroy.js
const app = getApp()
Page({
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
            "viewLastOne": false,
            "answerExamPaperId": e.currentTarget.dataset.data.answerExamPaperId,
            "historyAnswerExamPaperId": e.currentTarget.dataset.data.answerHistoryId
          }
          wx.showLoading({ title: '获取试卷信息...', mask: true })
          app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileOnlineExam/viewExamPaper', param, "POST").then(data => {
            wx.hideLoading()
            if (data.head.code !== app.constant.network_result_success) {
              //网络请求失败
              return this.wetoast.toast({ title: data.head.message })
            }
            try {
              wx.setStorageSync(app.constant.examPaper, data.data)
            } catch (e) {
            }
            // 0查看卷子  1考试
            // 跳转到试题解析
            var url = '/pages/exam/examContainer/examContainer?examOrCheckResult=0&examPassScore=' + this.data.examPassScore
            wx.navigateTo({
              url: url
            })
          })   
        } else {
          this.wetoast.toast({ title: '获取试题解析失败' })
          return
        }
      } else {
        this.wetoast.toast({ title: '获取试题解析失败' })
        return
      }
    })

     
  },
  requireHistoryList: function () {
    var param = {
      trainingClassId: this.data.trainingClassId,
      examRoundId: this.data.examRoundId
    }
    wx.showLoading({ title: '获取历史考试记录......', mask: true })
    app.requestData(app.config.examHistoryList, param, "GET").then(data => {
      wx.hideLoading()
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return this.wetoast.toast({ title: data.head.message })
      }
      this.setData({ 
        examHistoryList: data.data.answerHistoryList
      })
    }).catch(e => {
      wx.hideLoading()
      console.log(e)
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    examPassScore: String,
    examHistoryList: [
    ],
    paper: Object,
    trainingClassId: String,
    examRoundId: String
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.WeToast(this)
    this.setData({
      examPassScore: options.examPassScore
    })
    this.setData({
      trainingClassId: options.trainingClassId
    })
    this.setData({
      examRoundId: options.examRoundId
    })
    this.requireHistoryList()
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
  
})

// {
  //   "head": {
  //     "code": 200,
  //     "message": ""
  //   },
  //   "data": {
  //     "completeTime": "2017-12-15 09:01:03",
  //     "enterTime": "2016-03-04 15:33:58",
  //     "examTimeLength": 0,
  //     "examRoundId": "3d47c7b8-1fbb-43d0-9b9a-709b8aea372d",
  //     "examPaperId": "c46114d1-2fbf-421c-8904-1a7b8a5bfb9e",
  //     "answerExamPaperId": "9b6d1274-379b-498f-8297-6fcdbee21337",
  //     "name": "考完了看看解析啦",
  //     "passScore": 60,
  //     "questionItemDtos": [
  //       {
  //         "answerQuestionDtos": [
  //           {
  //             "answered": true,
  //             "answersResult": [true],
  //             "answersResultState": 2,
  //             "answersScore": 0,
  //             "configurationItems": [
  //             ],
  //             "subQuestionBase": [],
  //             "correctAnswer": [false],
  //             "description": "不，今天我是金城武",
  //             "fillNum": 3,
  //             "fillAnswerType": 2,
  //             "questionId": "e66392f0-57d7-4d30-bdd6-6e3ad805e239",
  //             "questionType": 1,
  //             "score": 5,
  //             "topic": "今天我是梁朝伟？"
  //           },
  //           {
  //             "answered": true,
  //             "answersResult": [true],
  //             "answersResultState": 1,
  //             "answersScore": 0,
  //             "configurationItems": [
  //             ],
  //             "subQuestionBase": [],
  //             "correctAnswer": [true],
  //             "description": "",
  //             "fillNum": 3,
  //             "fillAnswerType": 2,
  //             "questionId": "e66392f0-57d7-4d30-bdd6-6e3ad805e239",
  //             "questionType": 1,
  //             "score": 5,
  //             "topic": "美女做我对象如何？"
  //           }, {
  //             "answered": true,
  //             "answersResult": [false],
  //             "answersResultState": 2,
  //             "answersScore": 0,
  //             "configurationItems": [
  //             ],
  //             "subQuestionBase": [],
  //             "correctAnswer": [true],
  //             "description": "",
  //             "fillNum": 3,
  //             "fillAnswerType": 2,
  //             "questionId": "e66392f0-57d7-4d30-bdd6-6e3ad805e239",
  //             "questionType": 1,
  //             "score": 5,
  //             "topic": "㘀死啦点解啊！！！！"
  //           },
  //           {
  //             "answered": true,
  //             "answersResult": [false],
  //             "answersResultState": 1,
  //             "answersScore": 0,
  //             "configurationItems": [
  //             ],
  //             "subQuestionBase": [],
  //             "correctAnswer": [false],
  //             "description": "如果我说爱我没有如果",
  //             "fillNum": 3,
  //             "fillAnswerType": 2,
  //             "questionId": "e66392f0-57d7-4d30-bdd6-6e3ad805e240",
  //             "questionType": 1,
  //             "score": 5,
  //             "topic": "如果只有一张船票你会跟我走吗？"
  //           }
  //         ],
  //         "count": 4,
  //         "itemId": "6691e140-c4b8-47d0-8737-8fdc8c225676",
  //         "name": "我是啊判断题",
  //         "score": 20,
  //         "type": 1
  //       },
  //       {
  //         "answerQuestionDtos": [
  //           {
  //             "answered": true,
  //             "answersResult": ["1"],
  //             "answersResultState": 1,
  //             "answersScore": 0,
  //             "configurationItems": [
  //               {
  //                 "content": "金城武",
  //                 "optionId": "1"
  //               }, {
  //                 "content": "吴彦祖",
  //                 "optionId": "2"
  //               }, {
  //                 "content": "梁朝伟",
  //                 "optionId": "3"
  //               }, {
  //                 "content": "彭于晏",
  //                 "optionId": "4"
  //               }
  //             ],
  //             "subQuestionBase": [],
  //             "correctAnswer": ["1"],
  //             "description": "今天我是金城武",
  //             "fillNum": 3,
  //             "fillAnswerType": 2,
  //             "questionId": "e66392f0-57d7-4d30-bdd6-6e3ad805e239",
  //             "questionType": 2,
  //             "score": 20,
  //             "topic": "谁长的和我一样"
  //           },
  //           {
  //             "answered": true,
  //             "answersResult": ["1"],
  //             "answersResultState": 2,
  //             "answersScore": 0,
  //             "configurationItems": [{
  //               "content": "周润发",
  //               "optionId": "1"
  //             }, {
  //               "content": "刘德华",
  //               "optionId": "2"
  //             }, {
  //               "content": "黎明",
  //               "optionId": "3"
  //             }, {
  //               "content": "郭富城",
  //               "optionId": "4"
  //             }
  //             ],
  //             "subQuestionBase": [],
  //             "correctAnswer": ["2"],
  //             "description": "金城武",
  //             "fillNum": 3,
  //             "fillAnswerType": 2,
  //             "questionId": "e66392f0-57d7-4d30-bdd6-6e3ad805e240",
  //             "questionType": 2,
  //             "score": 20,
  //             "topic": "如果我是谁"
  //           }
  //         ],
  //         "count": 2,
  //         "itemId": "6691e140-c4b8-47d0-8737-8fdc8c225676",
  //         "name": "我是单选题啊",
  //         "score": 40,
  //         "type": 2
  //       }, {
  //         "answerQuestionDtos": [
  //           {
  //             "answered": true,
  //             "answersResult": ["1", "3", "4"],
  //             "answersResultState": 1,
  //             "answersScore": 0,
  //             "configurationItems": [
  //               {
  //                 "content": "靠东",
  //                 "optionId": "1"
  //               }, {
  //                 "content": "靠西",
  //                 "optionId": "2"
  //               }, {
  //                 "content": "靠南",
  //                 "optionId": "3"
  //               }, {
  //                 "content": "靠北",
  //                 "optionId": "4"
  //               }, {
  //                 "content": "靠中",
  //                 "optionId": "5"
  //               }
  //             ],
  //             "subQuestionBase": [],
  //             "correctAnswer": ["3", "1", "4"],
  //             "description": "今天我是金城武",
  //             "fillNum": 3,
  //             "fillAnswerType": 2,
  //             "questionId": "e66392f0-57d7-4d30-bdd6-6e3ad805e239",
  //             "questionType": 3,
  //             "score": 10,
  //             "topic": "阿西吧阿西吧阿西吧阿西吧"
  //           },
  //           {
  //             "answered": true,
  //             "answersResult": ["2", "4"],
  //             "answersResultState": 2,
  //             "answersScore": 0,
  //             "configurationItems": [{
  //               "content": "广州",
  //               "optionId": "1"
  //             }, {
  //               "content": "北京",
  //               "optionId": "2"
  //             }, {
  //               "content": "上海",
  //               "optionId": "3"
  //             }, {
  //               "content": "福州",
  //               "optionId": "4"
  //             }, {
  //               "content": "深圳",
  //               "optionId": "5"
  //             }
  //             ],
  //             "subQuestionBase": [],
  //             "correctAnswer": ["3", "5"],
  //             "description": "金城武",
  //             "fillNum": 3,
  //             "fillAnswerType": 2,
  //             "questionId": "e66392f0-57d7-4d30-bdd6-6e3ad805e240",
  //             "questionType": 3,
  //             "score": 100,
  //             "topic": "别问我是谁请与我相恋"
  //           }
  //         ],
  //         "count": 2,
  //         "itemId": "6691e140-c4b8-47d0-8737-8fdc8c225676",
  //         "name": "我是超多的多选题",
  //         "score": 40,
  //         "type": 3
  //       }
  //     ],
  //     "score": 60,
  //     "started": true,
  //     "surplusTime": 10786006,
  //     "totalScore": 100
  //   }
  // }