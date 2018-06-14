var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classRoomId: '',
    key: '',
    classCourseInfo: {},
    hasAutomaticSign:false, //是否要自动签到
    hasSuccessful: -1,       //是否签到成功 0 1
    signType: 0,             //签到类型  1 签到   2 签退
    signState: 0             //签到状态  10 签到成功   11 已经签到  12 签到不在时间段  13 签到地点无效  14 签到失败  20 签退失败 21 已经签退 22 签退不在时间段 23 签到地点无效   24 签退失败  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id == undefined || options.id == '') return
    this.setData({
      classRoomId: options.id,
      key: options.key
    })
  },

  /**
   * 生命周期函数--监听  页面初次渲染完成
   */
  onReady: function () {
    this.requestCourseList()
    this.initComponent()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.requestCourseList(2)
  },
  /**
   * 初始化--控件
   */
  initComponent() {
    this.courseListComponent = this.selectComponent('#courseList')
  },
  /**
    * 网络请求-线下班课程列表
    * type:签到刷新
    * 
    */
  requestCourseList(type) {
    var _this = this
    var params = {
      classRoomId: this.data.classRoomId,
      key: this.data.key
    }
    if(type!=1){
      wx.showLoading({ title: '加载中......', mask: true })
    }
    app.requestData(app.config.lineCoursSignInfo, params, "GET").then(data => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      if (type != 1) {
        wx.hideLoading()
      }
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateBack({ delta: 1 })
        }, 1500)
        return
      }
      this.setData({
        classCourseInfo: data.data
      })
      console.log("courseList的长度" + data.data.courseList.length)
      console.log("[signResult]hasAutomaticSign:" + this.data.hasAutomaticSign)
      if (data.data.courseList.length == 1) {
        if (type == 2){
          return
        }
        if (data.data.courseList[0].signState != 0) {
          return
        }
        if (data.data.courseList[0].signState == 2) {
          return
        }
        var type = data.data.courseList[0].signType
        this.setData({
          signType: type,
          hasAutomaticSign: true
        })
        this.courseListComponent.signEvent(data.data.courseList[0])
      } else if (data.data.courseList.length == 0) {
        this.setData({
          hasAutomaticSign: true
        })
      }
      console.log("[signResult]hasAutomaticSign:" + this.data.hasAutomaticSign)
    }).catch(e => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      console.log(e)
    })
  },
  /**
   * 签到状态回调
   */
  signResultStateCallBack(e) {
    if (this.data.hasAutomaticSign){
      this.setData({
        signState: e.detail,
        hasSuccessful: e.detail === 10 || e.detail === 20 ? 1 : 0
      })
      if (e.detail === 10 || e.detail === 20) {
        this.requestCourseList(2)
      }
    }else{
      if (e.detail === 10 || e.detail === 20) {
        this.requestCourseList(1)
      }
    }
    console.log('[signResult]detail:' + e.detail)
    console.log('[signResult]hasSuccessful：' + this.data.hasSuccessful)
    console.log('[signResult]signState:' + this.data.signState)
    
  },
  changeSignResultState(e) {

  }
})