// pages/mine/commonProblem/commonProblemDetail/commonProblemDetail.js
let app = getApp();
let WxParse = require('../../../../component/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessageDetail(options.noticeId)
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
  filterContent(item) {
    item.content = item.content.replace(/(&ldquo;|&rdquo;|&nbsp;)/g, '')
    return item
  },
  getMessageDetail (id) {
    let params = {
      noticeId: id
    }
    app.requestData(app.config.getMessageDetail, params, "GET").then((data) => {
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      }
      WxParse.wxParse('noticeContent', 'html', data.data.content, this);
      this.setData({
        messageDetail: data.data
      })
    }).catch(e => {
      console.log(e)
    })
  }
})