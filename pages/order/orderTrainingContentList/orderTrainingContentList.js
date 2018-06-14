// pages/order/orderTrainingContentList/orderTrainingContentList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainingContentList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.trainingContentList !== undefined && options.trainingContentList.length){
      let trainingContentListArray = JSON.parse(options.trainingContentList)
      this.setData({
        trainingContentList: trainingContentListArray
      })
    }else{
      wx.showToast({
        title: '数据错误，请重新进入！',
        icon:'none'
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
  
  }
})