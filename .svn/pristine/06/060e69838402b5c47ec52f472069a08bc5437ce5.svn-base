// pages/findtraining/trainingDetail/trainingDetail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    trainingClassId: '',
    classDetailInfo: {},
    courseList: [],
    categoryType: "",
    totalPriceString: "0.00",
    trainingItem: {},
    priceString: '0.00',
    // JOIN_RIGHTNOW:加入购物车  JOIN_SHOPPINGCART：立即购买
    joinType: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取系统信息 
    var that = this
    if (options.categoryType !== undefined && options.categoryType.length) {
      this.setData({
        categoryType: options.categoryType
      })
      if (options.categoryType == 'TRAINING_CLASS_GOODS') {
        wx.setNavigationBarTitle({
          title: '班级详情'
        })
      } else if (options.categoryType == 'COURSE_SUPERMARKET_GOODS') {
        wx.setNavigationBarTitle({
          title: '课程详情'
        })
      }
    }
    var trainingItem=wx.getStorageSync("goodItem")
    if (trainingItem !== undefined && trainingItem.length) {
      this.setData({
        trainingItem: JSON.parse(trainingItem)
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight * (750 / res.windowWidth)
        });
      }
    });
    this.yearPicker = this.selectComponent("#yearPicker")
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
    this.loadData()
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
   * 滑动切换tab
   */
  bindChange: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({ currentTab: e.detail.current });
    }
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  // ==================================加载数据===============================
  loadData() {
    wx.showLoading({
      title: '数据加载中...',
    })
    let context = this
    Promise
      .all([context.loadTrainingDetailInfo(), context.loadCourseDirectoryData()])
      .then(function (results) {
        wx.hideLoading()
        if (results.length !== 2) {
          wx.showToast({
            title: '数据请求失败...',
            icon: 'none'
          })
          return
        }
        let classDetailInfoResult = results[0]
        if (classDetailInfoResult.head.code == app.constant.network_result_success) {
          context.setData({
            classDetailInfo: classDetailInfoResult.data,
            priceString: toDecimal2(classDetailInfoResult.data.totalAmount)
          })
        } else {
          wx.showToast({
            title: "数据请求失败...",
            icon: 'none'
          })
        }
        let courseListResult = results[1]
        if (courseListResult.head.code == app.constant.network_result_success) {
          if (context.data.categoryType == 'TRAINING_CLASS_GOODS') {
            context.setData({
              courseList: courseListResult.data.electiveWrapList
            })
          } else if (context.data.categoryType == 'COURSE_SUPERMARKET_GOODS') {
            context.setData({
              courseList: courseListResult.data.chapterList
            })
          }
        } else {
          wx.showToast({
            title: "数据请求失败...",
            icon: 'none'
          })
        }
      }).catch(function (result) {
        wx.showToast({
          title: "数据请求失败...",
          icon: 'none'
        })
      })
  },
  loadTrainingDetailInfo() {
    let params = {}
    let url = ''
    if (this.data.categoryType == 'TRAINING_CLASS_GOODS') {
      // 请求课程章节列表
      params.skuId = this.data.trainingItem.skuId
      url = app.config.findTrainingClassDetailInfo
    } else if (this.data.categoryType == 'COURSE_SUPERMARKET_GOODS') {
      params.skuId = this.data.trainingItem.skuId
      params.courseId = this.data.trainingItem.courseId
      params.coursePoolId = this.data.trainingItem.coursePackageId
      url = app.config.findTrainingCourseDetailInfo
    }
    return app.requestData(url, params, 'GET')
  },
  loadCourseDirectoryData() {
    let params = {}
    let url = ''
    let requestMethod = ''
    if (this.data.categoryType == 'TRAINING_CLASS_GOODS') {
      params.trainingClassId = this.data.trainingItem.trainClassId
      url = app.config.findTrainingCoursePackageList
      requestMethod = 'GET'
    } else if (this.data.categoryType == 'COURSE_SUPERMARKET_GOODS') {
      // 请求课程章节列表
      params.courseId = this.data.trainingItem.courseId
      params.objectType = 1
      params.objectValue = this.data.trainingItem.schemeId
      params.packageId = this.data.trainingItem.coursePackageId
      params.courseType = 1
      url = app.config.findTrainingCourseChapterList
      requestMethod = 'POST'
    }
    return app.requestData(url, params, requestMethod)
  },
  /**
    * 立即购买事件
    */
  joinRightNowAction() {
    this.setData({
      joinType: 'JOIN_RIGHTNOW'
    })
    // if (this.data.classDetailInfo.hasBuy) {
    //   if (this.data.categoryType == 'TRAINING_CLASS_GOODS') {
    //     this.showToast('该培训班已报名，无需重复报名！')
    //   } else if (this.data.categoryType == 'COURSE_SUPERMARKET_GOODS') {
    //     this.showToast('该课程已报名，无需重复报名！')
    //   }
    //   return
    // }
    this.checkClassStatus('JOIN_RIGHTNOW')
  },
  /**
    * 加入购物车
    */
  joinShoppingCartAction() {
    this.setData({
      joinType: 'JOIN_SHOPPINGCART'
    })
    if (this.data.classDetailInfo.hasBuy) {
      if (this.data.categoryType == 'TRAINING_CLASS_GOODS') {
        this.showToast('该培训班已报名，无需重复报名！')
      } else if (this.data.categoryType == 'COURSE_SUPERMARKET_GOODS') {
        this.showToast('该课程已报名，无需重复报名！')
      }
      return
    }
    this.checkClassStatus('JOIN_SHOPPINGCART')
  },
  checkClassStatus(joinType) {
    let context = this
    let params = {
      skuId: this.data.trainingItem.skuId
    }
    app.requestData(app.config.shoppingCartCheckClassStatus, params, 'GET').then(function (response) {
      // int | 200： 可购买  30821：已购买，无需重复购买；30824：已在未支付订单中；
      // 301：已购买，无需重复购买；302：已在未支付订单中；303：已存在于购物车中；
      if (response.head.code == app.constant.network_result_success) {
        // 200可购买
        switch (joinType) {
          case 'JOIN_RIGHTNOW': {
            // 跳转至创建订单页面
            let shoppingListArray = [context.data.classDetailInfo]
            try {
              wx.setStorageSync('SELECTED_SHOPPING_ITEMS', shoppingListArray);
            } catch (e) {
            }
            wx.navigateTo({
              url: '/pages/order/orderCreat/orderCreat?skuId=' + context.data.trainingItem.skuId,
            })
            break
          }
          case 'JOIN_SHOPPINGCART': {
            context.addShoppingAction()
            break
          }
        }
      } else if (response.head.code == 30821) {
        context.showToast('该班级已报名，无需重复报名！')

        //30824：已在未支付订单中
      } else if (response.head.code == 30824) {
        wx.showModal({
          title: '提示',
          content: '该班级已存在未支付的订单，是否前往支付？',
          success: function (res) {
            console.log('用户点击确定')
            if (res.confirm) {
              debugger
              if (response.head.message !== undefined && response.head.message.length) {
                //取到订单号，前往支付
                wx.navigateTo({
                  url: '/pages/order/orderPay/orderPay?orderNo=' + response.head.message,
                })
              } else {
                context.showToast('订单号错误，无法进行支付，请重试！')
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else if (response.head.code == 505) {
        context.showToast(response.data.msg)
      } else {
        console.log('未知错误！')
      }
    }).catch(function (error) {
      wx.showToast({
        title: "数据请求失败!",
        icon: 'none'
      })
    })
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },
  // 加入购物车事件
  addShoppingAction() {
    let params = {}
    let valueObject = {
      trainingPeriod: this.data.classDetailInfo.trainingPeriod,
      dealPrice: this.data.classDetailInfo.dealPrice,
      courseId: '',
      skuId: this.data.classDetailInfo.skuId,
      courseWrapId: '',
      schemeId: this.data.classDetailInfo.schemeId,
      yearOptionId: ''
    }
    if (this.data.classDetailInfo.courseId !== undefined && this.data.classDetailInfo.courseId.length) {
      valueObject.courseId = this.data.classDetailInfo.courseId
    }
    if (this.data.classDetailInfo.coursePackageId !== undefined && this.data.classDetailInfo.coursePackageId.length) {
      valueObject.courseWrapId = this.data.classDetailInfo.coursePackageId
    }
    if (this.data.classDetailInfo.yearOptionId !== undefined && this.data.classDetailInfo.yearOptionId.length) {
      valueObject.yearOptionId = this.data.classDetailInfo.yearOptionId
    }
    params.addCommodity = valueObject
    let context = this
    wx.showLoading({
      title: '数据请求中...',
    })
    app.requestData(app.config.shoppingCartAdd, params, 'POST').then(function (response) {
      wx.hideLoading()
      if (response.head.code == app.constant.network_result_success) {
        wx.showToast({
          title: '加入购物车成功!',
          icon: 'none'
        })
      } else if (response.head.code == 30801) {
        wx.showModal({
          title: '提示',
          content: response.head.message,
          success: function (res) {
            console.log('用户点击确定')
            if (res.confirm) {
              // 跳转购物车界面
              wx.switchTab({
                url: '/pages/shoppingcart/shoppingList/shoppingList'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showToast({
          title: response.head.message,
          icon: 'none'
        })
      }
    }).catch(function (error) {
      wx.hideLoading()
      wx.showToast({
        title: "加入购物车失败!",
        icon: 'none'
      })
    })
  },
  _yearPickerConfirmAction(event) {
    this.data.classDetailInfo.yearOptionId = event.detail.value.skuPropertyValueId
    for (let index = 0; index < this.data.classDetailInfo.optionYearList.length; index++) {
      let item = this.data.classDetailInfo.optionYearList[index]
      if (item.skuPropertyValueId == event.detail.value.skuPropertyValueId) {
        this.data.classDetailInfo.yearOptionValue = item.skuPropertyValueName
      }
    }
    let context = this
    switch (this.data.joinType) {
      case 'JOIN_RIGHTNOW': {
        // 跳转至创建订单页面
        let shoppingListArray = [context.data.classDetailInfo]
        try {
          wx.setStorageSync('SELECTED_SHOPPING_ITEMS', shoppingListArray);
        } catch (e) {
        }
        wx.navigateTo({
          url: '/pages/order/orderCreat/orderCreat',
        })
        break
      }
      case 'JOIN_SHOPPINGCART': {
        context.addShoppingAction()
        break
      }
    }
  }
})

function getSkuValueCodeWithKeyFromSkuArray(skuKey, skuPropertyArray) {
  if (skuPropertyArray == undefined || skuPropertyArray.length == 0) {
    return ''
  }
  var propertyValueCode = ''
  for (var i = 0; i < skuPropertyArray.length; i++) {
    var skuPropertyObject = skuPropertyArray[i]
    if (skuPropertyObject.skuPropertyCode === skuKey) {
      propertyValueCode = skuPropertyObject.skuPropertyValueCode
    }
  }
  return propertyValueCode
}
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