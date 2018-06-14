// pages/account/forgotPW.js
const app = getApp()
let config = require('../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identityCardNo: '',
    userName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   * 读取页面输入值
   */
  inputStringOclick: function (e) {
    switch (e.currentTarget.dataset.inputKey) {
      case 'inputAccount':
        this.setData({
          identityCardNo: e.detail.value
        })
        break
      case 'inputName':
        this.setData({
          userName: e.detail.value
        })
        break
    }
  },

  /**
   * 找回密码
   */
  forgotClick() {
    if (app.utils.empty(this.data.identityCardNo)) {
      return wx.showToast({
        title: '身份证号不可为空',
        icon: 'none'
      })
    }

    if (app.utils.empty(this.data.userName)) {
      return wx.showToast({
        title: '姓名不可为空',
        icon: 'none'
      })
    }

    if (!app.utils.verIdentification(this.data.identityCardNo)) {
      return wx.showToast({
        title: '请输入18位身份证号！',
        icon: 'none'
      })
    }
    this.requestInfoLegal();
  },

  /**
   * 网络请求--账号信息合法性
   */
  requestInfoLegal() {
    var that = this
    let params = {
      identityCardNo: that.data.identityCardNo,
      userName: that.data.userName
    }
    wx.showLoading({ title: '加载中......', mask: true })
    app.requestData(app.config.findPassword, params, 'POST').then(data => {
      wx.hideLoading()
      if (data.head.code == app.constant.network_result_success) {
        if (data.data.status){
          wx.redirectTo({
            //跳转设置密码页面
            url: '/pages/account/forgotPW/forgetPasswordSuccess/forgetPasswordSuccess'
          });
        }else{
          wx.showToast({
            title: data.data.message,
            icon: 'none'
          });
        }
      } else {
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        });
      }
    }).catch(e => {
      wx.hideLoading()
      console.log(e)
    })
  }

})