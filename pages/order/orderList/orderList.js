// pages/order/orderList/orderList.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let context = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        context.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight * (750 / res.windowWidth)
        });
      }
    });
    this.unpayList = this.selectComponent("#unpayList");
    this.paidList = this.selectComponent("#paidList");
    this.closeList = this.selectComponent("#closeList");
    this.alert = this.selectComponent("#alert");
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
    //console.log(this.firstEnter);
    //如果页面是第一次进入到列表不触发刷新订单列表 只有当从别的页面返回到这个页面才刷新
    if(this.hasEntered){
      if (this.paidList) {
        this.paidList.refreshData()
        //console.log(1);
      }
      if (this.unpayList) {
        this.unpayList.refreshData()
      }
      if (this.closeList) {
        this.closeList.refreshData()
      }
    }

    this.hasEntered=true;

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
   * 触顶
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    switch (parseInt(this.data.currentTab)) {
      case 0: {
        this.unpayList.refreshData()
        break
      }
      case 1: {
        this.paidList.refreshData()
        break
      }
      case 2: {
        this.closeList.refreshData()
        break
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   * 触底
   */
  onReachBottom: function () {
    switch (parseInt(this.data.currentTab)) {
      case 0: {
        this.unpayList.loadMoreData()
        break
      }
      case 1: {
        this.paidList.loadMoreData()
        break
      }
      case 2: {
        this.closeList.loadMoreData()
        break
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    // 点击切换时，停止下拉刷新UI操作
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
    // 点击切换时，UI滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  _tipCanNotPayAction() {
    this.alert.show('订单的支付方式不是【微信支付】，请前往PC端支付或者取消订单，重新下单!')
  },
  _refreashDataAction() {
    let context = this
    setTimeout(function () {
      context.unpayList.refreshData()
      context.closeList.refreshData()
    }, 1500)

  },

  returnTop:function(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
})