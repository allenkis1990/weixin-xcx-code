var QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainingClassId:'',
    navTab: [{ name: "课程表" }, { name: "餐券" }, { name: "班级简介" }, { name: "考核要求" }],
    currentTabIndex: 0,
    location:'',
    classDetail: {},
    courseList:[],
    classroom:'',
    lng:0,
    lat:0,
    centerType:0  // 1 课程签到  2  餐券使用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     trainingClassId: options.trainingClassId
    })
    wx.setNavigationBarTitle({
      title: options.trainingClassName,
    })
    this.initComponent()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.requestClassDetail(0)
    this.requestCourseList(0)
    this.mealTicketComponent.loadData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.centerType==1){
      this.requestCourseList(0)
    } else if (this.data.centerType == 2){
       this.mealTicketComponent.loadData()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.requestCourseList(1)
    this.requestClassDetail(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 初始化控件
   */
  initComponent:function(){
    this.mealTicketComponent = this.selectComponent('#mealTicketComponent')
  },
  /**
   * tab切换的回调函数
   */
  tabEvent(e) {
    this.setData({
      currentTabIndex: e.detail == undefined ? 0 : e.detail
    })
  },
  /**
   * 使用微信地图权限
   */
  userLoaction() {
    var _this = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用地图定位功能
              _this.loactionInfo()
            }
          })
        } else {
          _this.loactionInfo()
        }
      }
    })
  },
  /**
   * 获取当前位置
   */
  loactionInfo() {
    qqmapsdk = new QQMapWX({
      key: 'QBQBZ-BIE6U-2YTVY-4DIVJ-N62UQ-Q6FAJ'
    })
    var _this=this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        //通过经纬度获取当前位置的名称
        _this.setData({
          lng: res.longitude,
          lat: res.latitude
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            _this.setData({
              location: addressRes.result.formatted_addresses.recommend === undefined ? '' : addressRes.result.formatted_addresses.recommend
            })
            console.log("地理位置：" + addressRes.result.formatted_addresses.recommend)
          }
        })
      }
    })
  },
  /**
   * 网络请求-班级详情
   * @prams  type             类型    0 默认   1 刷新
   */
  requestClassDetail(type){
    var params = {
      trainingClassId: this.data.trainingClassId
    }
   
    app.requestData(app.config.lineTrainingClassDetail, params, "GET").then(data=>{
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return this.wetoast.toast({ title: data.head.message })
      }
      
      if (data.head.code === '31203' || data.head.code === 31203) {
        this.wetoast.toast({ title: data.head.message })
        wx.navigateBack({
          delta: 1
        })
      }else{
        this.setData({ classDetail: data.data })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  /**
     * 网络请求-班级列表
     *@prams  trainingClassId  培训id
     *@prams  type             类型    0 默认   1 刷新
     */
  requestCourseList(type) {
    var _this = this
    var params = {
      trainingClassId: this.data.trainingClassId
    }
    wx.showLoading({ title: '加载中......', mask: true })
    app.requestData(app.config.lineTrainingClassCourseList, params, "GET").then(data => {
      wx.hideLoading()
      if (type == 1) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return this.toast.show(data.head.message)
      }
      var courseList=data.data.courseList
      _this.setData({
        courseList: courseList
      })
      if (courseList!==undefined && courseList.length>0){
        _this.setData({
          classroom: 'courseList[0].'
        })
      }
    }).catch(e => {
      wx.hideLoading()
      if (type == 1) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
      console.log(e)
    })
  },
  /**
   * 进入具体界面  0 课程签到   1  餐券使用
   */
  _enterScanEvent(e){
      this.setData({
        centerType:e.detail
      })
  }
})