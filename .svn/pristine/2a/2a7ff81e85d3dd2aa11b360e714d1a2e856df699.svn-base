// pages/order/orderRefundLog/orderRefundLog.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    refundLogData: {},
    // | 1:退款申请审核中，2:退款审核通过，3:退款申请被拒绝，4:退款处理中，5:退款成功，6:退款失败，7:取消退款；
    refundLogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderNo !== undefined && options.orderNo.length) {
      this.setData({
        orderNo: options.orderNo
      })
      this.loadRefundLogData()
    } else {
      wx.showToast({
        title: '数据错误！',
        icon: 'none'
      })
    }
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

  },
  /**
   * 加载退款记录
   */
  loadRefundLogData() {
    wx.showLoading({
      title: '数据加载中...',
    })
    let context = this
    let params = {
      subOrderNo: this.data.orderNo
    }
    app.requestData(app.config.orderRefundLog, params, 'GET').then(function (response) {
      wx.hideLoading()
      if (response.head.code == app.constant.network_result_success) {
        context.data.refundLogList = context.refundLogSort(response.data.refundLogList)
        context.setData({
          refundLogData: response.data,
          refundLogList: context.data.refundLogList
        })
      } else {
        wx.showToast({
          title: response.head.message,
          icon: 'none'
        })
      }
    }).catch(function (error) {
      wx.showToast({
        title: "数据请求失败!",
        icon: 'none'
      })
    })

  },
  refundLogSort: function (array) {
    // 冒泡排序
    var len = array.length
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (array[j].status > array[j + 1].status) {
          var temp = array[j]
          array[j] = array[j + 1]
          array[j + 1] = temp
        }
      }
    }
    return array
  }
})