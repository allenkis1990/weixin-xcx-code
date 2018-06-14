// pages/account/entry.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
   * 登录流程结果回调
   * state: 0 成功；1帐号或密码不对；-1 网络请求异常
   */
  loginResultCallback(state,message){
    switch(state){
      case 0:{
        console.log('TODO 登录成功')
        var param = {
        }
        const app = getApp()
        app.requestData(app.config.getUserInfo, param, "GET").then(data => {
          console.log(data)
          // if (data.head.code !== this.constant.network_result_success) {
          //   //网络请求失败
          //   return
          // }
          
        }).catch(e => {
          console.log(e)
        })
        break;
      }
      case 1: {
        console.log('TODO 帐号信息有误')
        break;
      }
      case -1: {
        console.log('TODO 网络请求异常')
        break;
      }
    }
  },
  /**
   * 登录页
   */
  login(){
    // wx.redirectTo({
    //   url: '../login/login',
    // })    
    let loginResultCallback = this.loginResultCallback
    require('../../../utils/casLogin.js').loginWithWX(loginResultCallback)
  }
})