var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,
    useMealTicketTime:'',//使用餐券时间
    restaurantId: '',
    restaurantInfo: {},
    hasAutomaticUse: false,  //是否要自动使用餐券
    hasSuccessful: false,    //是否使用成功
    useState: 0              //餐券使用状态  0:没有可用餐券 | 1:成功使用餐券 | 2:已经使用过（30分钟后可再次使用）| 3:餐券已用完 | 4：餐券使用时段已过期 5 使用餐券失败
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      restaurantId: options.id
    })
  },
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.requestTrainingClassList(1)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.requestTrainingClassList()
    this.initComponent()
  },
  /**
   * 初始化--控件
   */
  initComponent() {
    this.mealTicketComponent = this.selectComponent('#mealTicket')
  },
  /**
    * 网络请求-培训列表的餐券
    * @param  type 0 默认  1 刷新
    */
  requestTrainingClassList(type) {
    var _this = this
    var params = {
      restaurantId: this.data.restaurantId
    }
    wx.showLoading({ title: '加载中......', mask: true })
    app.requestData(app.config.restaurantMealTicketInfo, params, "GET").then(data => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      }
      this.setData({
        restaurantInfo: data.data
      })
      if (data.data.trainingClassList.length == 1 && type!=1) {
        if (data.data.trainingClassList.length >= 1) {
          this.setData({
            hasAutomaticUse: true
          })
          if (type != 1) {
            this.mealTicketComponent.requestSubmitMealTicket()
          }
        }
      }
    }).catch(e => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      console.log(e)
    })
  },
  /**
   * 使用餐券状态回调
   */
  useResultStateCallBack(e) {
    this.setData({
      useState: e.detail,
      hasSuccessful: e.detail === 1 ? true : false,
      isShow:true
    })
    if (e.detail === 0){
      this.setData({
        hasAutomaticUse:true
      })
    }
  },
  /**
   * 使用餐券的时间回调
   */
  useMealTicketTimeCallBack(e){
    this.setData({
      useMealTicketTime: e.detail
    })
    var _this=this
    setTimeout(function(){
      _this.requestTrainingClassList(1)
    },1000)
    
  },
  changeSignResultState(e) {

  },
  /**
   * 点击事件--使用餐券
   */
  sumbitMealTicketClick(){
    this.mealTicketComponent.requestSubmitMealTicket()
  }
})