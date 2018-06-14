let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      //获取完善订单数组
      orderList: [],
      //当前完善主订单对象
      orderItem: {},
      //当前订单班级信息
      orderClassDetial: {},
      //发票类型：强行提供
      isNeedInvoice: false,
      //订单前置条件对象
      preConditionInfo: {},
      //发票对象
      invoiceInfo: {},
      //证明对象
      certificateSendInfo: {},
      showInvoiceSendText: '请选择配送方式',
      showCertificateSendText: '请选择配送方式',
      showInvoiceTypeText: '请选择发票类型',
      totoalPrice: 30,
      isSubmitingOrder: false,
      index:0
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      debugger
      let context = this
      //来自获取完善配送信息弹窗
      let list = JSON.parse(options.jsonStr);
      context.setData({
        orderList: list.orderList
      })
      var item = this.data.orderList[0]
      this.setData({
        orderItem: item
      })
      this.loadPreconditionData()
      this.loadOrderDetialData() 
      context.alert = context.selectComponent("#alert")
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
     * 获取加载订单前置条件
     */
    loadPreconditionData() {
      debugger
      let context = this
      let params = {
        orderNo: context.data.orderItem.orderNo
      }
      app.requestData(app.config.orderSubmitPreCondition, params, 'GET').then(function (response) {
      debugger
      wx.hideLoading()
      if (response.head.code == app.constant.network_result_success) {
        context.setData({
          preConditionInfo: response.data
        })
        if (response.data.provideType == 2) {
          context.setData({
            isNeedInvoice: true
          })
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

    /**
     * 获取加载订单详情
     */
    loadOrderDetialData() {
      debugger
      let context = this
      let params = {
        orderNo: context.data.orderItem.orderNo
      }
      wx.showLoading({
        title: '数据加载中...',
      })
      app.requestData(app.config.orderDetailInfo, params, 'GET').then(function (response) {
        debugger
        if (response.head.code == app.constant.network_result_success) {
          context.setData({
            orderClassDetial: response.data,
            totoalPrice: response.data.totalAmount
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


    /**
     * 修改用户是否索要发票
     */
    changeIsNeedInvoiceAction() {
      if (this.data.preConditionInfo.provideType == 2) {
        return
      }
      this.data.isNeedInvoice = !this.data.isNeedInvoice
      this.setData({
        isNeedInvoice: this.data.isNeedInvoice
      })
    },

    /**
     * 选择发票类型
     */
    chooseInvoiceTypeAction() {
      wx.navigateTo({
        url: '/pages/order/orderInvoice/orderInvoice?invoiceInfo=' + JSON.stringify(this.data.invoiceInfo) + '&supportInvoiceType=' + JSON.stringify(this.data.preConditionInfo.supportInvoiceType) + '&supportTitleType=' + JSON.stringify(this.data.preConditionInfo.supportTitleType)
      })
    },
    /**
     * 选择发票配送方式
     */
    chooseInvoiceSendModeAction() {
      wx.navigateTo({
        url: '/pages/order/orderInvoiceSend/orderInvoiceSend?invoiceInfo=' + JSON.stringify(this.data.invoiceInfo) + '&supportDeliveryType=' + JSON.stringify(this.data.preConditionInfo.supportInvoiceDeliveryType),
      })
    },
    /**
     * 选择证书配送方式
     */
    chooseCertificateSendModeAction() {
      wx.navigateTo({
        url: '/pages/order/certificateSend/certificateSend?certificateSendInfo=' + JSON.stringify(this.data.certificateSendInfo) + '&supportDeliveryType=' + JSON.stringify(this.data.preConditionInfo.supportCertificateDeliveryType),
      })
    },
    /**
     * 选择物品配送方式
     */
    chooseGoodsSendTypeAction() {
      wx.navigateTo({
        url: '/pages/order/goodsSend/goodsSend?certificateSendInfo=' + JSON.stringify(this.data.certificateSendInfo),
      })
    },
    creatOrderAction() {
      // 提交订单数据
      if (this.checkInfoCorrent()) {
          let context = this
          let params = {
            orderNo: context.data.orderItem.orderNo
          }
          params.deliverInfo = {}
          if (parseFloat(context.data.totoalPrice) == 0) {
            context.data.invoiceInfo.needInvoice = false
            params.deliverInfo.invoiceInfo = context.data.invoiceInfo
            if (context.data.certificateSendInfo.deliverType !== undefined) {
              params.deliverInfo.cerInfo = context.data.certificateSendInfo
            }
            context.submitOrder(params)
          } else {
            context.data.invoiceInfo.needInvoice = context.data.isNeedInvoice
            params.deliverInfo.invoiceInfo = context.data.invoiceInfo
            params.deliverInfo.cerInfo = context.data.certificateSendInfo
            context.submitOrder(params)
          }
      }
    },

    submitOrder(params) {
      debugger
      if (this.data.isSubmitingOrder) {
        return
      }
      let context = this
      context.setData({
        isSubmitingOrder: true,
        index:context.data.index+1
      })
      wx.showLoading({
        title: '提交配送信息中...',
      })
      app.requestData(app.config.SubmitOrderInfo, params, 'POST').then(function (response) {
        debugger
        wx.hideLoading()
        setTimeout(function () {
          if (context) {
            context.setData({
              isSubmitingOrder: false
            })
          }
        }, 1000)
        if (response.head.code == app.constant.network_result_success) {
          if (context.data.index < context.data.orderList.length) {
            var item = context.data.orderList[context.data.index]
            context.setData({
              orderItem: item
            })
            context.loadPreconditionData()
            context.loadOrderDetialData() 
          } else {
            wx.navigateBack({
              delta: 1
            })
          }
        } else {
          wx.showToast({
            title: response.head.message,
            icon: 'none'
          })
        }
      }).catch(function (error) {
        wx.hideLoading()
        context.setData({
          isSubmitingOrder: false
        })
        wx.showToast({
          title: "数据请求失败!",
          icon: 'none'
        })
      })
    },
    // 检测信息是否已经填写
    checkInfoCorrent() {
      // 0元订单的情况
    if (this.data.totoalPrice == 0) {
      if (this.data.preConditionInfo.type == 2 || this.data.preConditionInfo.type == 3 || this.data.preConditionInfo.type == 4) {
        if (this.data.certificateSendInfo.deliverType == undefined) {
          this.showToast('请完善证明配送信息！')
          return false
        }
      } else {
        return true
      }
    }
    if (this.data.totoalPrice !== 0) {
      switch (this.data.preConditionInfo.type) {
        case 1: {
          if (this.data.isNeedInvoice) {
            if (this.data.invoiceInfo.invoiceType == undefined) {
              this.showToast('请填写发票信息！')
              return false
            }
            if (this.data.invoiceInfo.invoiceType == 2) {
              return true
            } else {
              if (this.data.invoiceInfo.deliverType == undefined) {
                this.showToast('请完善发票配送信息！')
                return false
              }
            }
          } else {
            return true
          }
          break
        }
        case 2: {
          if (this.data.certificateSendInfo.deliverType == undefined) {
            this.showToast('请完善证明配送信息！')
            return false
          }
        }
        case 3: {
          if (this.data.isNeedInvoice) {
            if (this.data.invoiceInfo.invoiceType == undefined) {
              this.showToast('请填写发票信息！')
              return false
            }
            if (this.data.invoiceInfo.invoiceType == 2) {
              if (this.data.certificateSendInfo.deliverType == undefined) {
                this.showToast('请完善证明配送信息！')
                return false
              }
            } else {
              if (this.data.certificateSendInfo.deliverType == undefined) {
                this.showToast('请完善配送信息！')
                return false
              }
            }
          }
          break
        }
        case 4: {
          if (this.data.isNeedInvoice) {
            if (this.data.invoiceInfo.invoiceType == undefined) {
              this.showToast('请填写发票信息！')
              return false
            }
            if (this.data.invoiceInfo.invoiceType == 2) {
              if (this.data.certificateSendInfo.deliverType == undefined) {
                this.showToast('请完善证明配送信息！')
                return false
              }
            } else {
              if (this.data.invoiceInfo.deliverType == undefined) {
                this.showToast('请完善发票配送信息！')
                return false
              }
              if (this.data.certificateSendInfo.deliverType == undefined) {
                this.showToast('请完善证明配送信息！')
                return false
              }
            }
          }
          break
        }
      }
    }
    return true
    },
    showToast(title) {
      wx.showToast({
        title: title,
        icon: 'none'
      })
    }

})