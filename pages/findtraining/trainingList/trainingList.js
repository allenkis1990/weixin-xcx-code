let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearList: [],
    currentNavtab: '0',
    currentYearObject: {},
    trainingClassList: [],
    isFinish: true,
    winWidth: 750,
    winHeight: 0,
    isShowBuy: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initConfigure()
    this.initData(options);
    this.initComponent()
    this.initRequire()
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
    // this.requestTrainingClassList(3)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.requestYearList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.requestTrainingClassList(2)
  },
  /**
   * 初始化配置
   */
  initConfigure() {
    let _this = this
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight * (750 / res.windowWidth)
        });
      }
    });
    this.setData({
      isShowBuy: app.config.isShowBuy
    }
    );
  },
  /**
   *初始化数据
   */
  initData(options) {

  },
  /**
   * 初始控件
   */
  initComponent() {
    this.trainigClassListComponent = this.selectComponent("#trainigClass");
  },
  /**
   * 初始化网络请求
   */
  initRequire() {
    this.requestYearList(0)
  },
  /**
    * 网络请求------年度列表
    * @param index 0 默认 1 下拉刷新
    */
  requestYearList(index) {
    var _this = this
    wx.showLoading({ title: '加载中......', mask: true })
    var param = {
      skuPropertyName: "继续教育年度"
    }
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    app.requestData(app.config.goodsTrainingYear, param, "GET").then(data => {
      wx.hideLoading()
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      }
      //默认请求 全部
      var all = [{
        'skuPropertyValueId': '-1',
        'skuPropertyValueName': '全部'
      }]
      var newYearList = all.concat(data.data.skuPropertyValueList)
      //数据赋值
      if (index == 0) {
        _this.setData({
          yearList: newYearList,
          currentYearObject: newYearList[0]
        })
      } else if (index == 1) {
        for (var i = 0; i < newYearList.length; i++) {
          if (_this.data.currentYearObject.skuPropertyValueName == newYearList[i].skuPropertyValueName) {
            _this.setData({
              currentNavtab: i,
              currentYearObject: newYearList[i],
              yearList: newYearList
            })
          }
        }
      }

      _this.requestTrainingClassList(index)
    }).catch(e => {
      wx.hideLoading()
      console.log(e)
    })
  },
  /**
    * 网络请求---请求班级商品列表
    *@param index 0 默认 1 下拉刷新 2 上拉加载 3 详情返回
    */
  requestTrainingClassList(index) {
    var currentYearObject = []
    if (this.data.currentYearObject.skuPropertyValueId != -1) {
      var item ={
          skuPropertyValueId: this.data.currentYearObject.skuPropertyValueId,
          skuPropertyName: "继续教育年度"
        }
      currentYearObject.push(item);
    }

    let params = {
      skuPropertySearchList: currentYearObject
    }
    wx.showLoading({
      title: '加载中',
      icon: 'none'
    })
    app.requestData(app.config.findTrainingClassList, params, 'GET').then(data => {
      if (index == 1) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
      wx.hideLoading()

      if (data.head.code != app.constant.network_result_success) {
        return wx.showToast({
          title: '',
          icon: 'none'
        })
      }
      this.setData({
        trainingClassList: data.data.commodityList
      })

    }).catch(e => {
      console.log(e)
      wx.hideLoading()
      if (index == 1) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
   * 年度点击事件
   */
  yearItemClick(options) {
    let data = options.currentTarget.dataset;
    this.setData({
      currentNavtab: data.idx,
      currentYearObject: data.item
    })
    this.requestTrainingClassList(0)
  },
  /**
    * 滚回顶部事件
    */
  backToTopAction() {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  }
})