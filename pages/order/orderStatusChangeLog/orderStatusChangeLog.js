Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    statusLogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取loglist数据
    let orderStatusLog = JSON.parse(options.statusLogList)
    let orderNo = options.orderNo
    if (orderStatusLog !== undefined && orderStatusLog) {
      this.data.orderNo = orderNo
      let newOrderStatusLog = []
      for (let index = 0; index < orderStatusLog.length; index++) {
        let item = orderStatusLog[index]
        if (item.processed) {
          newOrderStatusLog.push(item)
        }
        this.data.statusLogList = newOrderStatusLog
      }
      this.data.statusLogList = this.renewLogSort(this.data.statusLogList)
      this.setData({
        statusLogList: this.data.statusLogList,
        orderNo: this.data.orderNo
      })
    } else {
      wx.showToast({
        title: '数据错误！',
        icon: 'none'
      })
    }
  },

  /**
   * 重排数据
   */
  renewLogSort: function (array) {
    // 冒泡排序
    var len = array.length
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (array[j].status < array[j + 1].status) {
          var temp = array[j]
          array[j] = array[j + 1]
          array[j + 1] = temp
        }
      }
    }
    return array
  }
})