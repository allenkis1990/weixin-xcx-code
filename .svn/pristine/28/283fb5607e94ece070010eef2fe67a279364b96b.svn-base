var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hasExam: {
      type: Boolean,
      value: 0
    },
    trainingClassId: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lineMealTicketInfo: {},
    mealTicketList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadData: function () {
      this.requestMealTicket()
      this.requestUseMealTicketList()
    },
    /**
     * 网络请求--获取线下培训班餐劵信息
     */
    requestMealTicket: function () {
      var params = {
        trainingClassId: this.properties.trainingClassId
      }
      wx.showLoading({
        title: '加载中......',
      })
      app.requestData(app.config.lineMealTicketInfo, params).then(data => {
        wx.hideLoading()
        if (data.head.code !== app.constant.network_result_success) {
          return wx.showToast({
            title: data.head.message,
            icon: "none"
          })
        }
        this.setData({
          lineMealTicketInfo: data.data
        })
      }).catch(e => {
        console.log(e)
        wx.hideLoading()
      })
    },
    /**
     * 网络请求--获取线下培训班使用餐劵列表
     */
    requestUseMealTicketList: function () {
      var params = {
        trainingClassId: this.properties.trainingClassId
      }
      wx.showLoading({
        title: '加载中......',
      })
      app.requestData(app.config.lineUseMealTicketList, params).then(data => {
        wx.hideLoading()
        if (data.head.code !== app.constant.network_result_success) {
          return wx.showToast({
            title: data.head.message,
            icon: "none"
          })
        }
        this.setData({
          mealTicketList: data.data.mealTicketList
        })
      }).catch(e => {
        console.log(e)
        wx.hideLoading()
      })
    },
    /**
     * 点击事件--扫一扫
     */
    scanClick: function () {
      this.triggerEvent('enterScanEvent', 2)
      require('../../scanModule/scanUtil.js').scan()
    }
  }
})
