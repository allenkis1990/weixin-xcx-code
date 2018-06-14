// pages/exam/examEntrance/examEntrance.js
const app = getApp()
Page({
 
  beginExam: function (event) {
    
    // 1验证是否可以进入考试
    // 生成答卷
    // wx.setStorage(OBJECT) 异步
    // wx.setStorageSync(KEY, DATA) 同步
    // wx.getStorage(OBJECT) 读取
    // wx.getStorageSync(KEY)
    //0--已进入考试，后再次进入，同时考试时间未结束</br> 1--考试次数已达上限 2--考试次数未达上限
    if (this.data.examInfo.examState == 0) {
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
      // app.getServeContextInfo().examServeDomain
      app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileLogin/login', param, "POST").then(data => {
        console.log(data)
        if (data.head.code === app.constant.network_result_success) {
          if (data.data.result === 'success') {
            this.generateExamPaper()
          } else {
            this.wetoast.toast({ title: '获取是试卷失败' })
            return
          }
        } else {
          this.wetoast.toast({ title: '获取是试卷失败' })
          return
        }
      })
    } else if (this.data.examInfo.examState == 1) {
      this.alertmessage.message({ title: '考试次数已用完，无法考试！' })
      return
    } else if (this.data.examInfo.examState == 2) {

      var param = {
        trainingClassId: this.data.trainingClassId,
        examRoundId: this.data.examRoundId
      }
      wx.showLoading({ title: '正在进入考试...', mask: true })
      // 生成答卷
      app.requestData(app.config.createExamPaper, param, "GET").then(data => {
        wx.hideLoading()
        if (data.head.code !== app.constant.network_result_success) {
          //网络请求失败
          return this.wetoast.toast({ title: data.head.message })
        }
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
              this.generateExamPaper()
            } else {
              this.wetoast.toast({ title: '获取是试卷失败' })
              return
            }
          } else {
            this.wetoast.toast({ title: '获取是试卷失败' })
            return
          }
        })

      }).catch(e => {
        wx.hideLoading()
        console.log(e)
      })

    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    examPassScore: String,
    examInfo: Object,
    trainingClassId: String,
    examRoundId: String,
  },
  requestExamPaperPreview: function () {
    var param = {
      trainingClassId: this.data.trainingClassId,
      examRoundId: this.data.examRoundId
    }
    wx.showLoading({ title: '获取试卷信息...', mask: true })
    app.requestData(app.config.examPaperPreview, param, "GET").then(data => {
      wx.hideLoading()
      //网络请求失败
      if (data.head.code !== app.constant.network_result_success) {
        this.wetoast.toast({ title: data.head.message })
        setTimeout(function () {
          // 放在最后--
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
        return
      }
      this.setData({
        examInfo: data.data
      })
      // if (this.data.examInfo.examState == 0) {
      //   this.data.timeLeft = this.dateformat(parseInt(this.data.examInfo.examRoundDuration) * 60 * 1000)
      //   this.setData({
      //     timeLeft: this.data.timeLeft
      //   })
      // }
    }).catch(e => {
      wx.hideLoading()
      console.log(e)
    })
  },
  dateformat: function (micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000)
    // 小时位
    var hr = Math.floor(second / 3600)
    // 分钟位
    var min = Math.floor((second - hr * 3600) / 60)
    // 秒位
    var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;

    return hr + ":" + min + ":" + sec
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.AlertMessage(this)
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
    console.log(options.trainingClassId + '|' + options.examRoundId)
   
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
    this.requestExamPaperPreview()
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

  },
  generateExamPaper: function () {
    // 
    var param = {
      examRoundId: this.data.examRoundId
    }
    // 获取答卷内容
    // 存入试题到内存
    // 进入考试页面
    // app.config.serveContextInfo.examServeDomain
    // 'https://examv1.59iedu.com:5000/test2/'
    app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileOnlineExam/enterExamRound', param, "POST").then(data => {
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return this.wetoast.toast({ title: data.head.message })
      }
      try {
        wx.setStorageSync(app.constant.examPaper, data.data)
      } catch (e) {
      }
      try {
        wx.setStorageSync(app.constant.currentAnswerExamPaperId,data.data.answerExamPaperId)
      } catch (e) {
      }
      // 0查看卷子  1考试

      var url = '/pages/exam/examContainer/examContainer?examOrCheckResult=1&examPassScore=' + this.data.examPassScore
      wx.navigateTo({
        url: url
      })
    })
  }
})
