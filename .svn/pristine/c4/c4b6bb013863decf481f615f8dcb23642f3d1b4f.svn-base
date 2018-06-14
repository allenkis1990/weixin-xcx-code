// pages/order/orderCreat/orderCreat.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNeedInvoice: false,
    invoiceInfo: {},
    certificateSendInfo: {},
    showInvoiceSendText: '请选择配送方式',
    showCertificateSendText: '请选择配送方式',
    showInvoiceTypeText: '请选择发票类型',
    // 购买班级信息列表
    traningShoopingItems: [],
    isShowMoreTrainingContent: false,
    showMoreTrainingContentText: '',
    totoalPrice: 0,
    firstTrainingItem: {},
    preConditionInfo: {},
    orderNo: '',
    isCreatingOrder: false,
    skuId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      skuId: options.skuId
    })
    // 获取将要购买的商品列表
    try {
      var value = wx.getStorageSync('SELECTED_SHOPPING_ITEMS')
      if (value.length) {
        this.setData({
          traningShoopingItems: value,
          firstTrainingItem: value[0]
        })
        for (let index = 0; index < value.length; index++) {
          let item = value[index]
          this.data.totoalPrice += item.totalAmount
          this.setData({
            totoalPrice: this.data.totoalPrice
          })
        }
        if (value.length >= 2) {
          var showString = '共' + value.length + '个培训内容，点击查看更多'
          this.setData({
            showMoreTrainingContentText: showString,
            isShowMoreTrainingContent: true,
          })
        }
      }
    } catch (e) {
    }
    this.loadPreconditionData()
    this.alert = this.selectComponent("#alert")
    this.customModal = this.selectComponent("#customModal")
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
    try {
      wx.removeStorageSync('SELECTED_SHOPPING_ITEMS')
    } catch (e) {
      console.log('SELECTED_SHOPPING_ITEMS数据清除失败')
    }
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
   * 查看培训班内容列表
   */
  goToTrainingContentListAction() {
    wx.navigateTo({
      url: '/pages/order/orderCreatContentList/orderCreatContentList',
    })
  },
  /**
   * 选择发票类型
   */
  chooseInvoiceTypeAction() {
    var supportInvoiceType = []
    if (this.data.preConditionInfo.invoiceType == 1) {
      supportInvoiceType = [1]
    } else if (this.data.preConditionInfo.invoiceType == 2) {
      supportInvoiceType = [2]
    } else if (this.data.preConditionInfo.invoiceType == 3) {
      supportInvoiceType = [1, 2]
    }

    var supportTitleType = []
    if (this.data.preConditionInfo.invoiceTitle == 1) {
      supportTitleType = [1]
    } else if (this.data.preConditionInfo.invoiceTitle == 2) {
      supportTitleType = [2]
    } else if (this.data.preConditionInfo.invoiceTitle == 3) {
      supportTitleType = [1, 2]
    }

    wx.navigateTo({
      url: '/pages/order/orderInvoice/orderInvoice?invoiceInfo=' + JSON.stringify(this.data.invoiceInfo) + '&supportInvoiceType=' + JSON.stringify(supportInvoiceType) + '&supportTitleType=' + JSON.stringify(supportTitleType)
    })
  },
  /**
   * 选择发票配送方式
   */
  chooseInvoiceSendModeAction() {
    var supportInvoiceDeliveryType = [1, 2]
    if (this.data.preConditionInfo.invDistributionType ==1){
      supportInvoiceDeliveryType = [1]
    } else if (this.data.preConditionInfo.invDistributionType == 2){
      supportInvoiceDeliveryType = [2]
    } else if (this.data.preConditionInfo.invDistributionType == 3){
      supportInvoiceDeliveryType = [1, 2]
    }
    wx.navigateTo({
      url: '/pages/order/orderInvoiceSend/orderInvoiceSend?invoiceInfo=' + JSON.stringify(this.data.invoiceInfo) + '&supportDeliveryType=' + JSON.stringify(supportInvoiceDeliveryType)
    })
    //JSON.stringify(this.data.preConditionInfo.supportInvoiceDeliveryType)
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
      if (this.checkOrderSuitableAndInvoiceType()) {
        let context = this
        let params = {
          paymentChannel: 'WECHAT',
        }
        params.deliverInfo = {}
        // TODO 存入商品id列表
        let orderSkuPlaceInfoList = []
        if (this.data.traningShoopingItems.length) {
          for (let index = 0; index < this.data.traningShoopingItems.length; index++) {
            let item = this.data.traningShoopingItems[index]
            let skuObject = {
              skuId: '',
              purchaseQuantity: 1
            }
            if (this.data.skuId !== undefined) {
              skuObject.skuId = this.data.skuId
            }
            orderSkuPlaceInfoList.push(skuObject)
          }
        }
        params.orderSkuPlaceInfoList = orderSkuPlaceInfoList
        if (parseFloat(this.data.totoalPrice) == 0) {
          this.data.invoiceInfo.needInvoice = false
          params.deliverInfo.invoiceInfo = this.data.invoiceInfo
          if (this.data.certificateSendInfo.deliverType !== undefined) {
            params.deliverInfo.cerInfo = this.data.certificateSendInfo
          }
          this.submitOrder(params)
        } else {
          this.data.invoiceInfo.needInvoice = this.data.isNeedInvoice
          params.deliverInfo.invoiceInfo = this.data.invoiceInfo
          params.deliverInfo.cerInfo = this.data.certificateSendInfo
          this.submitOrder(params)
        }
      }
    }
  },
  // 校验订单为电子发票并金额数大于1000的情况
  checkOrderSuitableAndInvoiceType() {
    if (this.data.invoiceInfo.invoiceType == 2 && this.data.totoalPrice > 1000) {
      this.showToast('由于本单位电子发票的面额最大为1000元，因此无法整笔购买，请拆分下单购买！')
      return false
    }
    return true
  },
  submitOrder(params) {
    if (this.data.isCreatingOrder) {
      return
    }
    let context = this
    this.setData({
      isCreatingOrder: true
    })
    wx.showLoading({
      title: '订单创建中...',
    })
    app.requestData(app.config.orderCreat, params, 'POST').then(function (response) {
      wx.hideLoading()
      setTimeout(function () {
        if (context) {
          context.setData({
            isCreatingOrder: false
          })
        }
      }, 500)
      if (response.head.code == app.constant.network_result_success) {
        if (context.data.totoalPrice == 0) {
          context.setData({
            orderNo: response.data.orderNo
          })
          app.refreshMyTraining = true
          context.customModal.show()
        } else {
          wx.redirectTo({
            url: '/pages/order/orderPay/orderPay?orderNo=' + response.data.orderNo,
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
        isCreatingOrder: false
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
  },
  // 加载前置条件
  loadPreconditionData() {
    let context = this
    let params = {
      skuId: this.data.skuId
    }
    wx.showLoading({
      title: '数据加载中...',
    })
    app.requestData(app.config.orderCreatPreCondition, params, 'GET').then(function (response) {
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
  _modalConfirmAction() {
    wx.redirectTo({
      url: '/pages/order/orderDetail/orderDetail?orderNo=' + this.data.orderNo,
    })
  },
  _modalConfirmGotoStudyAction() {
    wx.switchTab({
      url: '/pages/trainclass/trainingClassList/trainingClassList',
    })
  }
})