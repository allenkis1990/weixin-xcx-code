// pages/linetrainclass/lineTrainClassList/lineTrainClassList.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNavtab: '0',
    currentYearObject: {},
    yearList: [],
    trainingList: [],
    centerType: 0,   //1 进入详情  2 进入二维码
    pageNo:1,
    pageSize:5,
    isFinish:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestYearList(0);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //通过id 获取控件
    this.alert = this.selectComponent("#alert")

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //详情页返回或是二维码---班级列表刷新数据
    if (this.data.centerType == 1 || this.data.centerType == 2) {
      this.requestClassList(this.data.currentYearObject, 3)
      this.setData({
        centerType: 0
      })
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
    wx.showNavigationBarLoading()
    this.requestYearList(1);
    this.requestClassList(this.data.currentYearObject, 1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触发了")
    this.requestClassList(this.data.currentYearObject, 2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 网络请求------线下班年度列表
   * @param index 0 默认 1 下拉刷新
   */
  requestYearList(index) {

    var _this = this
    wx.showLoading({ title: '加载中......', mask: true })
    var param = {
      skuPropertyName: "继续教育年度",
      type:1
    }
    app.requestData(app.config.trainingYear, param, "GET").then(data => {
      wx.hideLoading()
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return _this.toast.show(data.head.message)
      }
      //默认请求 全部
      var all = [{
        'skuPropertyValueId': '-1',
        'skuPropertyValueName': '全部'
      }]
      var newYearList = all.concat(data.data.skuPropertyValueList)
      
      if(index == 0){
        //数据赋值
        _this.setData({
          yearList: newYearList,
          currentYearObject: newYearList[0]
        })
      }else if(index == 1){
        
        for (var i = 0; i <newYearList.length; i++){
          if (_this.data.currentYearObject.skuPropertyValueName == newYearList[i].skuPropertyValueName){
            this.setData({
              currentNavtab: i,
              currentYearObject: newYearList[i],
              yearList: newYearList
            })
          }
        }
      }


      _this.requestClassList(_this.data.currentYearObject, 0)
    }).catch(e => {
      wx.hideLoading()
      console.log(e)
    })
  },
  /**
   * 网络请求--------线下班培训列表
   * @param item 年份对象  
   * @param index 0 默认 1 下拉刷新 2 上拉加载 3 详情返回
   */
  requestClassList(item, index) {
    var _this = this
    //详情页返回---刷新数据（加载视图不显示）
    if (index != 3) {
      wx.showLoading({ title: '加载中......', mask: true })
    }
    var sku = []
    if (item.skuPropertyValueId != -1) {
      sku.push({
        "skuPropertyName": "年度",
        "skuPropertyValueId": item.skuPropertyValueId
      })
    }
    if (index == 2){
      _this.setData({
        pageNo: _this.data.pageNo + 1,
      })
    }else{
      _this.setData({
        pageNo:1,
        isFinish: false
      })
    }
    // 参数
    var param = {
      skuPropertySearchList: sku,
      pageNo: _this.data.pageNo,
      pageSize: _this.data.pageSize
    }

    app.requestData(app.config.lineTrainingClass, param, "GET").then(data => {
      wx.hideLoading()
      if (index == 1) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return _this.toast.show(data.head.message)
      }else{
        var trainingList = []
        if (data.data.trainingList.length<5){
          _this.setData({
          isFinish:true
          })
        }
        if (index == 2){
          trainingList = _this.data.trainingList.concat(data.data.trainingList)
        }else{
          trainingList = data.data.trainingList
        }
        _this.setData({
          trainingList: trainingList
        })
      } 
    }).catch(e => {
      wx.hideLoading()
      if (index == 1) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
      console.log(e)
    })
  },
  /**
   * 点击事件---年份切换
   */
  yearItemClick: function (e) {
    var item = e.currentTarget.dataset.item
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx,
      currentYearObject: item
    });
    this.requestClassList(item, 0)
  },
  /**
   * 点击事件---进入详情页
   */
  itemClick(e) {
    var item = e.currentTarget.dataset.item
    if (item.trainingState == 2) {
      return this.alert.show('培训已结束！')
    }
    this.setData({
      centerType: 1
    })
    wx.navigateTo({
      //TODO 需要更改跳转入口
      url: '/pages/linetrainclass/trainclassDetail/trainclassDetail' + "?trainingClassId=" + item.trainingClassId + "&trainingClassName=" + item.trainingClassName
    });
  },
  /**
    * 点击事件--扫一扫
    */
  scanClick: function () {
    this.setData({
      centerType:1
    })
    require('../../scanModule/scanUtil.js').scan()
  }
})