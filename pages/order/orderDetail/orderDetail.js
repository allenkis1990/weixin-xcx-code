// pages/order/orderDetail/orderDetail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    orderDetailInfo: {},
    cetDeliverFirstInfo: {},
    requestInvoiceUrlSuccess: false,
    invoicePdfUrl: '',
    totalPriceString: '0.00',
    winWidth: 0,
    winHeight: 0,
    scrollHeight: 750,
    isShowCompleteButton: false,
    enterType: '',
    isOpenMoreContent: false,
    isShowMoreTrainingContent: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight * (750 / res.windowWidth),
          scrollHeight: res.windowHeight
        });
      }
    });
    if (options.orderNo !== undefined && options.orderNo.length) {
      this.setData({
        orderNo: options.orderNo
      })
      this.requestOrderDetailInfo()
    }
    // 获取控件
    this.alert = this.selectComponent("#alert")
  },

  onShow: function () {
    if (this.data.enterType == 'COMPLETE_ORDERINFO') {
      this.requestOrderDetailInfo()
      this.setData({
        enterType: ''
      })
    }
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
   * 请求订单详情
   */
  requestOrderDetailInfo() {
    let context = this
    let params = {
      orderNo: this.data.orderNo
    }
    wx.showLoading({
      title: '数据加载中...',
    })
    //debugger
    app.requestData(app.config.orderDetailInfo, params, 'GET').then(function (response) {
      console.log(response);
      wx.hideLoading()
      if (response.head.code == app.constant.network_result_success) {
        context.data.totalPriceString = toDecimal2(response.data.totalAmount)
        context.setData({
          orderDetailInfo: response.data,
          totalPriceString: context.data.totalPriceString
        })
        if (response.data.cerDeliverInfo !== undefined &&  response.data.cerDeliverInfo !== null &&  response.data.cerDeliverInfo.length) {
          context.setData({
            cetDeliverFirstInfo: response.data.cerDeliverInfo[0]
          })
        }
        // 设置是否显示更多
        if (response.data.subOrderList != undefined && response.data.subOrderList.length > 1) {
          context.setData({
            isShowMoreTrainingContent: true
          })
        } else {
          context.setData({
            isShowMoreTrainingContent: false
          })
        }
        let scrollHeightValue = context.data.winHeight
        if (!response.data.deleiverInfoComplete) {//deleiverInfoComplete
          scrollHeightValue = scrollHeightValue - 100
          context.setData({
            scrollHeight: scrollHeightValue,
            isShowCompleteButton: true
          })
        } else {
          context.setData({
            scrollHeight: scrollHeightValue,
            isShowCompleteButton: false
          })
        }
      } else {
        wx.showToast({
          title: response.head.message,
          icon: 'none'
        })
      }
    }).catch(function (error) {
      console.log(error);
      wx.hideLoading()
      wx.showToast({
        title: "数据请求失败!",
        icon: 'none'
      })
    })
  },
  /**
   * 复制至剪切板操作
   */
  copyContentToClipboardAction(event) {
    let content = event.currentTarget.dataset.content
    if (content == undefined || content.length == 0) {
      wx.showToast({
        title: '内容为空，无法复制！',
      })
      return
    }
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.showToast({
          title: '复制成功！',
        })
      }
    })
  },
  /**
   * 查看电子发票操作
   */
  goToSeeEletronInvoiceAction() {
    let newInvoicePdfUrl = this.data.orderDetailInfo.orderInvoice.pdfPath
    if (newInvoicePdfUrl !== undefined) {
      if (newInvoicePdfUrl.length) {
        if (newInvoicePdfUrl.indexOf('https') > -1) {
          wx.navigateTo({
            url: '/pages/webview/webView?url=' + newInvoicePdfUrl + '&title=' + '发票预览',
          })
        } else {
          newInvoicePdfUrl = 'https://' + newInvoicePdfUrl
          wx.navigateTo({
            url: '/pages/webview/webView?url=' + newInvoicePdfUrl + '&title=' + '发票预览',
          })
        }
      }
    } else {
      wx.showToast({
        title: '发票地址不正确，无法查看',
        icon: 'none'
      })
    }
  },
  /**
   * 取消订单操作
   */
  cancelOrderAction() {
    let context = this
    // TODO调用取消订单接口
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          context.realCancelOrder()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 确认取消订单执行事件
   */
  realCancelOrder() {
    let context = this
    let params = {
      orderNo: context.data.orderDetailInfo.orderNo
    }
    app.requestData(app.config.orderCancle, params, 'GET').then(function (response) {
      if (response.head.code == app.constant.network_result_success) {
        wx.showToast({
          title: '订单取消成功！',
          icon: 'none'
        })
        context.requestOrderDetailInfo()
      } else {
        context.alert.show(response.head.message)
      }
    }).catch(function (error) {
      wx.showToast({
        title: "数据请求失败!",
        icon: 'none'
      })
    })
  },
  /**
   * 立即支付操作
   */
  payOrderAction() {
    var params={
      orderNo:this.data.orderDetailInfo.orderNo,
      paymentChannel:'WECHAT'
    };
    wx.showLoading({
      title: '数据加载中...'
    });
    var that=this;
    app.requestData(app.config.orderPayOrderInfo, params, 'GET').then(function(response){
      wx.hideLoading();
      if(response.head.code == app.constant.network_result_success){
        if(response.data.paymentAccountList.length>0){
          wx.navigateTo({
            url: '/pages/order/orderPay/orderPay?orderNo=' + that.data.orderNo,
          });
        }else{
          that.alert.show('订单的支付方式不是【微信支付】，请前往PC端支付或者取消订单，重新下单!')
          //that.triggerEvent("tipCanNotPayEvenet");
        }
      }else{
        wx.showToast({
          title: response.head.message,
          icon: 'none'
        })
      }
    }).catch(function(e) {
      wx.hideLoading()
      wx.showToast({
        title: "数据请求失败!",
        icon: 'none'
      })
    });




  },
  /**
   * 查看更多订单状态
   */
  goToSeeModeOrderStatusAction() {
    let logListString = JSON.stringify(this.data.orderDetailInfo.statusLogList)
    wx.navigateTo({
      url: '/pages/order/orderStatusChangeLog/orderStatusChangeLog?statusLogList=' + logListString + '&orderNo=' + this.data.orderNo,
    })
  },
  /**
    * 查看物流进度操作
    */
  goToSeeLogisticsScheduleAction(event) {
    let expressCompanyUrl = event.target.dataset.expressCompanyUrl
    //expressCompanyUrl='123456';
    if (expressCompanyUrl !== undefined) {
      if (expressCompanyUrl.length) {
        if (expressCompanyUrl.indexOf('http') > -1) {
          wx.navigateTo({
            url: '/pages/webview/webView?url=' + expressCompanyUrl + '&title=' + '物流进度',
          })
        } else {
          expressCompanyUrl = 'http://' + expressCompanyUrl
          wx.navigateTo({
            url: '/pages/webview/webView?url=' + expressCompanyUrl + '&title=' + '物流进度',
          })
        }
      }
    } else {
      wx.showToast({
        title: '快递公司网址不正确，请手动查询',
        icon: 'none'
      })
    }
  },
  /**
    * 完善配送信息事件
    */
  completeSendInfoAction() {
    let orderItem = this.data.orderDetailInfo
    let orderList = [orderItem]
    var context = this
    var listObject = ({
      orderList: orderList
    })
    let str = JSON.stringify(listObject);
    wx.navigateTo({
      url: '/pages/order/perfectDeliveryOrderInfo/perfectDeliveryOrderInfo' + "?jsonStr=" + str
    });
    this.setData({
      enterType: 'COMPLETE_ORDERINFO'
    })
  },
  /**
    * 修改是否已打开更多事件
    */
  changeIsOpenMoreContentAction() {
    this.data.isOpenMoreContent = !this.data.isOpenMoreContent
    this.setData({
      isOpenMoreContent: this.data.isOpenMoreContent
    })
  }
})

function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
  } 