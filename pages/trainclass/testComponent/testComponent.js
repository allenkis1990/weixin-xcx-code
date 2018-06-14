var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    trainDetail: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    trainingClassId: '',
    examObjects: [{
      objectId: "",
      type: ""
    }],
    testParamObject: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
      * 点击事件--进入练习
      */
    practiceClick() {
      if (this.properties.trainingTransactionState == '1') {
        return this.testCallBack(7)
      } else if (this.properties.trainingTransactionState == '2') {
        return this.testCallBack(8)
      } else {
        this.requireTestParams()
      }
    },
    /**
     * 点击事件--进入练习记录
     */
    practiceHistoryClick() {
      this.requireHistoryTestQuestions(this.data.testParamObject)
    },

    /**
     * 界面跳转---进入测验
     */
    enterPractice() {
      // 0查看卷子  1考试
      app.constant.classDetailSceneType = 3
      var url = '/pages/testModule/testContainer/testContainer?examOrCheckResult=1' + "&trainingClassId=" + this.properties.trainDetail.trainingClassId + "&testParamObject=" + JSON.stringify(this.data.testParamObject)
      wx.navigateTo({
        url: url
      })
      this.triggerEvent('enterPracticeEvent')
    },
    /**
     * 界面跳转---进入测验历史
     */
    enterHistoryPractice() {
      var url = '/pages/testModule/testContainer/testContainer?examOrCheckResult=0' + "&trainingClassId=" + this.properties.trainDetail.trainingClassId + "&testParamObject=" + JSON.stringify(this.data.testParamObject)
      wx.navigateTo({
        url: url
      })
      this.triggerEvent('enterHistoryPracticeEvent')
    },
    /**
     * 回调详情弹窗
     */
    testCallBack(index) {
      this.triggerEvent('testCallBack', { index: index })
    },
    /**
     * 网络请求---获取练习抽题参数
     */
    requireTestParams: function () {
      var params = {
        trainingClassId: this.properties.trainDetail.trainingClassId,
        maxQuestionNum: 500
      }
      app.requestData(app.config.testQuestionParam, params, "GET").then(data => {
        if (data.head.code !== app.constant.network_result_success) {
          //网络请求失败
          return wx.showToast({
            title: data.head.message,
            icon: 'none'
          });
        }
        this.setData({
          testParamObject: data.data
        })
        this.examLogin()
      }).catch(e => {
        console.log(e)
      })
    },
    /**
     *网络请求---获取练习试题列表
     */
    requireTestQuestions: function (params) {
      app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileQuestionAnswer/fetchQuestionInRandom', params, "POST").then(data => {
        if (data.head.code !== app.constant.network_result_success) {
          return wx.showToast({
            title: data.head.message,
            icon: 'none'
          });
        }
        //练习题列表数据存储storage
        wx.setStorageSync(app.constant.testPaper, data.data.questionIdList)
        this.enterPractice()
      })
    },
    /**
    * 网络请求---获取历史练习试题列表
    */
    requireHistoryTestQuestions: function () {
      var params = {
        trainingClassId: this.properties.trainDetail.trainingClassId
      }
      app.requestData(app.config.testHistoryQuestions, params, "GET").then(data => {
        if (data.head.code !== app.constant.network_result_success) {
          //网络请求失败
          return wx.showToast({
            title: data.head.message,
            icon: 'none'
          });
        }
        if (data.data.questionIdList.length == undefined || data.data.questionIdList.length == null || data.data.questionIdList.length <= 0) {
          return wx.showToast({
            title: '暂无历史练习题！',
            icon: 'none'
          });
        }
        wx.setStorageSync(app.constant.testPaper, data.data.questionIdList)
        this.enterHistoryPractice()
      })
    },
    /**
     * 考试服务登录
     */
    examLogin() {
      wx.showLoading({ title: '加载中......', mask: true })
      app.questionsRequestUtil.examLogin().then(data => {
        wx.hideLoading()
        if (data.success) {
          return this.requireTestQuestions(this.data.testParamObject)
        }
        wx.showToast({
          title: "获取试题失败",
          icon: 'none'
        });
      }).catch(e => {
        wx.hideLoading()
        console.log(e)
      })
    }
  }
})
