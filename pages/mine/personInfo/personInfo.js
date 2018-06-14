// pages/mine/personInfo/personInfo.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   *email: ""
   */
  data: {
    userInfo: {
      identityCardNo: "",
      userName: "",
      phoneNumber: "",
      unitName: "",
      sex: ""
    },
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
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

  /**
    * 获取当前登录的用户信息
    */
  getUserInfo() {
    var context = this
    //尝试读取用户信息
    app.requestData(app.config.getUserInfo, {}, "GET").then(data => {
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      }
      app.userInfo = data.data.userInfo;

      context.setData({
        userInfo: data.data.userInfo
      })
    }).catch(e => {
      console.log(e)
    })
  }
})