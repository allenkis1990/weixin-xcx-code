const app = getApp()
let config = require('../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowLoginFailUI: false,
    //TODO 跳转类表页
    objectUrl: '/pages/trainclass/trainingClassList/trainingClassList',
    canIUse: true,
    enterFlag:1  //1.代表请求code，2.代表请求Unicode
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.authorizationDialog = this.selectComponent("#authorizationDialog")
    var comtext = this
    //获取登录的cookie ,app.config.apiHost当前开发域名就是登录cookie的key
    var cookie = require('../../../utils/requestUtil.js').getCookie(app.config.apiHost)
    if (cookie === undefined || cookie === '') {
      comtext.getStorageUnionIdAndOpenId()
    } else {
      //尝试读取用户信息
      app.requestData(app.config.getUserInfo, {}, "GET").then(data => {
        if (data.head.code === app.constant.network_result_success) {
          app.userInfo = data.data.userInfo
          wx.reLaunch({
            url: comtext.data.objectUrl,
          })
        } else {
          comtext.getStorageUnionIdAndOpenId()
        }
      }).catch(e => {
        console.log(e)
        comtext.getStorageUnionIdAndOpenId()
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
   * 获取本地UnionIdAndOpenId数据
   */
  //如果有找到缓存的unionId和openId赋值，并且去绑定微信，如果已经绑定过了直接登陆，没绑定过跳去login页面绑定登录
  /**如果没找到缓存的unionId和openId 调用wx.login API去拿code然后用code去调wx.getUserInfo去拿encryptedData, iv
   * 用code,encryptedData,iv去发请求去拿unionId和openId拿到后缓存起来 并且去绑定微信 如果已经绑定过了直接登陆 没绑定过去login页面绑定登录
   */
  getStorageUnionIdAndOpenId() {
    var context = this
    app.utils.getStorageUnionIdAndOpenId().then(data => {
      if (data.success) {
        app.config.casConfig.unionId = data.unionId
        app.config.casConfig.openId = data.openId
        context.requestHasBindWX(data.unionId, data.openId)
      } else {
        context.requestCode()
      }
    }).catch(e => {
      context.requestCode()
      console.log(e)
    })
  },

  /**
   * 网络请求 判断账号是否绑定微信
   */
  requestHasBindWX(unionId, openId) {
    var that = this
    wx.showLoading({ title: '加载中......', mask: true })
    let param = {
      unionId: unionId,
      openId: openId,
      type: 1
    }
    app.requestData(app.config.haveBingWX, param, "POST").then(data => {
      wx.hideLoading()
      if (data.head.code != app.constant.network_result_success) {
        that.setData({ isShowLoginFailUI: true })
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      } else {
        // 微信是否绑定
        if (data.data.haveBind) {
            that.login(data.data.userId)
        } else {
          wx.redirectTo({
            //跳转登录页
            url: '/pages/account/login/login'
          });
        }
      }
    }).catch(e => {
      that.setData({ isShowLoginFailUI: true })
      wx.hideLoading()
    })
  },

  /**
   * 网路请求  微信获取code
   */
  requestCode() {
    var context = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          app.config.casConfig.code = res.code
          
          wx.getUserInfo({
            success: function (res) {
              context.setData({
                canIUse: false
              })
              context.requestUnionIdAndOpenId(app.config.casConfig.code, res.encryptedData, res.iv)
            },
            fail: function (res) {
              if (context.data.canIUse && context.data.enterFlag != 2) {
                context.setData({
                  enterFlag: 1
                })

                context.authorizationDialog.show();
              } else {
                context.wxGetUserInfo();
              }
            }
          })


        } else {
          console.log('登录失败！' + res.errMsg)
          context.loginResultCallback(-1, '微信授权失败。授权后才可使用！')
        } // end res.code
      }, //end login success
      fail: res => {
        console.log('登录失败！' + res.errMsg)
        context.loginResultCallback(-1, '微信登录失败')
      }
    })
  },

  /**
  * 请求获取微信的用户信息
  */
  wxGetUserInfo() {
    var context = this
    wx.getUserInfo({
      success: function (res) {
        context.setData({
          canIUse: false
        })
        context.requestUnionIdAndOpenId(app.config.casConfig.code, res.encryptedData, res.iv)
      },
      fail: function (res) {
        context.setData({ isShowLoginFailUI: true })
      }
    })
  },

  /**
  * 回调函数--允许
  */
  allow() {
    var comtext = this;
    comtext.authorizationDialog.hide();
    comtext.setData({ isShowLoginFailUI: false })        
    if (comtext.data.enterFlag == 1) {
      comtext.wxGetUserInfo();
    } else {
      comtext.getStorageUnionIdAndOpenId()
    }
  },

  /**
    * 回调函数--拒绝
    */
  refuse() {
    this.setData({
      canIUse: true
    })
    this.setData({ isShowLoginFailUI: true })
    this.authorizationDialog.hide();
  },

  /**
   * 网络请求 获取unionid和openid
   * @param code 
   * @param encryptedData  包括敏感数据在内的完整用户信息的加密数据
   * @param iv 加密算法的初始向量
   */
  requestUnionIdAndOpenId(code, encryptedData, iv) {
    var that = this
    var params = {
      code: code,
      encryptedData: encryptedData,
      iv: iv,
      type: 1
    }
    wx.showLoading({ title: '加载中......', mask: true })
    app.requestData(app.config.wxInfoUrl, params, "POST").then(data => {
      wx.hideLoading()
      if (data.head.code == app.constant.network_result_success) {
        //保存本地
        that.saveStorageUnionIdAndeOpenId(data.data.unionId, data.data.openId)
        //赋值全局
        app.config.casConfig.unionId = data.data.unionId
        app.config.casConfig.openId = data.data.openId
        app.config.casConfig.accessToken = data.data.accessToken
          //判断账号绑定情况
        that.requestHasBindWX(data.data.unionId, data.data.openId)
      } else {
          that.setData({ isShowLoginFailUI: true })
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      }
    }).catch(e => {
      this.setData({ isShowLoginFailUI: true })
      wx.hideLoading()
      console.log(e)
    })
  },

  /**
   * 保存到本地缓存
   */
  saveStorageUnionIdAndeOpenId(unionId, openId) {
    wx.setStorage({
      key: 'unionId',
      data: unionId,
    })
    wx.setStorage({
      key: 'openId',
      data: openId,
    })
  },

  /**
   * 登录
   */
  login(userId) {
    let loginResultCallback = this.loginResultCallback
    wx.showLoading({ title: '登录中......', mask: true })
    require('../../../utils/casLogin.js').loginWithWX(loginResultCallback,userId)
  },

  /**
   * 点击事件--重新登录
   */
  LoginClick() {
    var comtext = this
    // 判断获取用户信息权限  没有进行授权
    if (!comtext.data.canIUse) {
        //TODO 进入账号登录页  
        comtext.setData({ isShowLoginFailUI: false })
        comtext.getStorageUnionIdAndOpenId()
      }else{
        comtext.setData({
          enterFlag: 2
        });
        comtext.authorizationDialog.show();
      }
  },

  /**
   * 登录流程结果回调
   * state: 0 成功；1帐号或密码不对；-1 网络请求异常
   */
  loginResultCallback(state, message) {
    var comtext = this
    switch (state) {
      case 0: {
        console.log('TODO 登录成功')
        var param = {
        }
        const app = getApp()
        app.getServeContextInfo()
        app.requestData(app.config.getUserInfo, param, "GET").then(data => {
          wx.hideLoading()
          if (data.head.code != app.constant.network_result_success) {
            return wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
            comtext.setData({ isShowLoginFailUI: true })
          } else {
            app.userInfo = data.data.userInfo
            wx.reLaunch({
              url: comtext.data.objectUrl,
            })
          }
        }).catch(e => {
          comtext.setData({ isShowLoginFailUI: true })
          wx.hideLoading()
          console.log(e)
        })
        break;
      }
      case 1: {
        comtext.setData({ isShowLoginFailUI: true })
        wx.hideLoading()
        console.log('TODO 帐号信息有误')
        break;
      }
      case -1: {
        comtext.setData({ isShowLoginFailUI: true })
        wx.hideLoading()
        console.log('TODO 网络请求异常')
        break;
      }
    }
  }
})