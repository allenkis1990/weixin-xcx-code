let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      userName: '',
      displayPhotoUrl: '',
      isShowBuy: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isShowBuy: app.config.isShowBuy
    });
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
    var user = app.getUserInfo()
    this.setData({
      userInfo: user
    })

    //获取平台用户信息头像为空，将用微信图像代替
    if (this.data.userInfo.displayPhotoUrl == undefined
      || this.data.userInfo.displayPhotoUrl == '') {
      if (app.wxUserInfo != null && app.wxUserInfo != undefined && app.wxUserInfo != "") {
        var url = "userInfo.displayPhotoUrl"
        this.setData({
          [url]: app.wxUserInfo.avatarUrl
        })
      }
    }
    //获取平台用户名为空，将用微信名称代替 
    if (this.data.userInfo.userName == undefined
      || this.data.userInfo.userName == '') {
      if (app.wxUserInfo != null && app.wxUserInfo != undefined && app.wxUserInfo != "") {
        var name = "userInfo.userName"
        this.setData({
          [name]: app.wxUserInfo.nickName
        })
      }
    }
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
    * 点击事件--报名清单
    */
  registrationListClick: function (e) {
    wx.navigateTo({
      url: '/pages/order/orderList/orderList'
    });
  },

  /**
    * 点击事件--个人信息
    */
  personInfoClick: function (e) {
    var context = this;
    wx.navigateTo({
      url: '/pages/mine/personInfo/personInfo'
    });
  },

  /**
    * 点击事件--收货地址
    */
  shippingAddressClick: function (e) {
    wx.navigateTo({
      url: '/pages/mine/shippingAddress/shippingAddress'
    });
  },
  /**
    * 点击事件--常见问题
    */
  commonProblemsClick () {
    wx.navigateTo({
      url: '/pages/mine/commonProblem/commonProblem',
    })
  },
  /**
    * 点击事件--修改密码
    */
  // changePasswordClick: function (e) {
  //   wx.navigateTo({
  //     url: '/pages/mine/changePassword/changePassword'
  //   });
  // }

})