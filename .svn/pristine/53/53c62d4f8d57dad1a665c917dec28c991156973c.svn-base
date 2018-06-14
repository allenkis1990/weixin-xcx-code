// pages/order/orderPay/orderPay.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    isShowMoreTrainingContent: false,
    payOrderInfo: {},
    isPaying: false,
    isOpenMoreContent:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderNo = options.orderNo
    if (orderNo.length) {
      this.setData({
        orderNo: orderNo
      })
      this.loadOrderInfomationData()
    } else {
      wx.showToast({
        title: '订单号不存在，请确认订单后重新进入！',
      })
      wx.navigateBack()
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
  // =====================================加载数据=====================================
  /**
   * 加载订单支付信息
   */
  loadOrderInfomationData() {
    let context = this
    let params = {
      orderNo: this.data.orderNo,
      paymentChannel: 'WECHAT'
    }
    wx.showLoading({
      title: '数据加载中...',
    })
    app.requestData(app.config.orderPayOrderInfo, params, 'GET').then(function (response) {
      wx.hideLoading()
      if (response.head.code == app.constant.network_result_success) {
        context.setData({
          payOrderInfo: response.data
        })
        if (response.data.subOrderList !== undefined && response.data.subOrderList.length) {
          if (response.data.subOrderList.length >= 2) {
            context.setData({
              isShowMoreTrainingContent: true,
            })
          }
        }
      } else {
        wx.showToast({
          title: response.head.message,
          icon: 'none'
        })
      }
    }).catch(function (error) {
      wx.hideLoading()
      wx.showToast({
        title: "数据请求失败!",
        icon: 'none'
      })
    })
  },
  // =====================================触发事件=====================================
  /**
   * 发起支付请求事件
   */
  confirmPayAction() {
    // 取到paysign，发起支付请求
    if (this.data.isPaying) {
      return
    }
    let context = this
    let openId = wx.getStorageSync('openId')
    let params = {
      orderNo: this.data.payOrderInfo.orderNo,
      payTypeId: '-1',
      payAccountId: this.data.payOrderInfo.paymentAccountList[0].payAccountId,
      productName: this.getProductName(),
      payMoney: this.data.payOrderInfo.totalAmount,
      openId: openId
    }
    wx.showLoading({
      title: '支付请求中...',
      mask: true
    })
    this.setData({
      isPaying: true
    })
    app.requestData(app.config.orderWeiXinPay, params, 'POST').then(function (response) {
      wx.hideLoading()
      context.setData({
        isPaying: false
      })
      if (response.head.code == app.constant.network_result_success) {
        console.log('wxPay:' + response.data.url)
        if (response.data.url !== undefined && response.data.url.length) {
          // TODO 转换数据
          debugger
          let jsonObj = JSON.parse(response.data.url)
          context.callUpWeixinPayAction(jsonObj)
        } else {
          wx.showToast({
            title: '微信支付调起失败，请重新尝试！',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: response.head.message,
          icon: 'none'
        })
      }
    }).catch(function (error) {
      debugger
      wx.hideLoading()
      context.setData({
        isPaying: false
      })
      wx.showToast({
        title: "支付请求失败，请重新尝试!",
        icon: 'none'
      })
    })
  },
  /**
   * 调用微信支付事件
   */
  callUpWeixinPayAction(weixinPayInfo) {
    let context = this
    wx.requestPayment({
      'timeStamp': weixinPayInfo.timeStamp,
      'nonceStr': weixinPayInfo.nonceStr,
      'package': weixinPayInfo.package,
      'signType': 'MD5',
      'paySign': weixinPayInfo.paySign,
      'success': function (res) {
        app.refreshMyTraining = true
        wx.redirectTo({
          url: '/pages/order/orderPaySuccess/orderPaySuccess?orderInfo=' + JSON.stringify(context.data.payOrderInfo),
        })
      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败，请重新支付！',
          icon: 'none'
        })
      }
    })
  },
  // =====================================工具事件=====================================
  /**
   * 获取支付商品的名称
   */
  getProductName() {
    var productName = ''
    if (this.data.payOrderInfo.subOrderList.length > 0) {
      for (var i = 0; i < this.data.payOrderInfo.subOrderList.length; i++) {
        if(i==0){
          productName = this.data.payOrderInfo.subOrderList[i].skuName
        }else{
          productName = productName + '|' + this.data.payOrderInfo.subOrderList[i].skuName
        }
        
      }
      return productName
    } else {
      return productName
    }
  },
  changeIsOpenMoreContentAction(){
    this.data.isOpenMoreContent = !this.data.isOpenMoreContent
    this.setData({
      isOpenMoreContent: this.data.isOpenMoreContent
    })
  }
})