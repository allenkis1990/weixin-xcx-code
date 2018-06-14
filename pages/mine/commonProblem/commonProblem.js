// pages/mine/commonProblem/commonProblem.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   *email: ""
   */
  data: {
    page: {
      pageNo: 1,
      pageSize: 100,
      messageStyle: 2
    },
    messageList: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProblemList()
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
    var temp = 0
    if (app.getUserInfo().sex == 2) {
      temp = 1
    }
    let userfoString = JSON.stringify(app.getUserInfo())
    let newUserInfo = JSON.parse(userfoString)

    this.setData({
      userInfo: newUserInfo,
      index: temp
    })
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
  filterContent (arr) {
    return arr.map((item) => {
      item.content = item.content.replace(/(&ldquo;|&rdquo;|&nbsp;)/g, '')
      return item
    })
  },
  /**
    * 获取消息列表
    */
  getProblemList() {
    var context = this
    app.requestData(app.config.getMessagePage, this.data.page, "GET").then(data => {
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      }
      let list = this.filterContent(data.data.noticeList)
      context.setData({
        messageList: list
      })
    }).catch(e => {
      console.log(e)
    })
  },
  listItemClick (event) {
    let { noticeId } = event.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/mine/commonProblem/commonProblemDetail/commonProblemDetail?noticeId=' + noticeId,
    })
  }
})