const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],                 //课程集合
    courseWrapList: [],             //课程包集合
    standardCourseWrapList: [],     //达标课程包集合
    noStandardCourseWrapList: [],   //未达标课程包集合
    selectCourseWrapState: false,   //是否显示课程包列表状态
    currentWrapId: '',              //当前选中课程包id
    currentWrapName: '',            //当前选中课程包名
    currentWrapIndex: 0,            //当前选中课程包列表的下标
    currentWraphourStandard: false,  //当前选中课程包是否达标状态
    selecCoursetHours: 0,           //选中选课多少学时
    needCourseHours: 0,             //需要选课多少学时
    requireHours: 0,                //选课要求多少学时
    hasStandardCourseWrap: true,    //是否存在未达标的课程包
    listHeight: 0,                  //scroll-view的高度
    optionalPackageRequires: false, //是否取消选修包课时要求  true:没有包内要求 false:有包内要求
    wholeRemainingHours: 0,         //整体还需选多少学时    包内没有具体要求学时状况
    periodType: 0,                  //整体选课要求学时状态 1.学员选课需学时=要求学时 2.学员选课学时不可<要求学时,但可>=要求学时
    pageNo: 1,                      //页码
    pageSize: 10,                   //页数
    assessmentRequirementObject: {} //选课考核信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.getSystemInfo({
      success: function (res) {
        var newHeight = res.windowHeight - 90
        _this.setData({
          listHeight: newHeight
        })
      }
    })
    this.initData(options)
    this.initComponent()
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.setData({
      selecCoursetHours: 0,
      needCourseHours: this.data.optionalPackageRequires ? this.data.courseWrapList[this.data.currentWrapIndex].remainingHours : this.data.wholeRemainingHours
    })
    this.requestCourseList(1)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.requestCourseList(2)
  },
  /**
   * 初始化--数据
   */
  initData(options) {
    this.setData({
      trainingClassId: options.trainingClassId
    })
    this.requestCourseWrapList()
    this.requestAssessmentRequirements()
  },
  /**
   * 初始化--控件
   */
  initComponent() {
    this.requirementComponent = this.selectComponent('#requirementComponent')
    this.courseWrapComponent = this.selectComponent('#courseWrapComponent')
    this.alert = this.selectComponent('#alert')
  },
  /**
  * 网络请求   兴趣包列表
  * type      0 默认  1 提交课程刷新
  */
  requestCourseWrapList(type) {
    let param = {
      trainingClassId: this.data.trainingClassId
    }
    wx.showLoading({
      title: '加载中....',
    })
    app.requestData(app.config.selectedCourseWrapList, param, 'POST').then(data => {
      wx.hideLoading()
      if (data.head.code != app.constant.network_result_success) {
        return wx.showToast({
          title: data.head.message,
        })
      }
      this.setData({ courseWrapList: data.data.electiveWrapList })
      if (data.data.electiveWrapList.length > 0) {
        var courseWrapList = data.data.electiveWrapList
        var standardCourseWrapList = []
        var noStandardCourseWrapList = []

        //组装两个集合：达标的集合和未达标集合
        for (var i = 0; i < courseWrapList.length; i++) {
          if (courseWrapList[i].hourStandard) {
            standardCourseWrapList.push(courseWrapList[i])     //达标集合
          } else {
            noStandardCourseWrapList.push(courseWrapList[i])   //未达标集合
            this.setData({ currentWraphourStandard: true })    //设置是否存在未达标课程包
          }
        }

        //type提交课程后列表刷新情况
        if (type == 1) {
          if (this.data.currentWrapIndex < data.data.electiveWrapList.length) {
            this.setData({ 
              currentWraphourStandard: data.data.electiveWrapList[this.data.currentWrapIndex].hourStandard,
              needCourseHours: data.data.optionalPackageRequires ? data.data.electiveWrapList[this.data.currentWrapIndex].remainingHours : data.data.wholeRemainingHours ,
              periodType: data.data.periodType
              })
          }
        } else {
          this.setData({
            currentWrapIndex: 0,
            currentWrapId: data.data.electiveWrapList[0].electiveWrapId,
            currentWraphourStandard: data.data.electiveWrapList[0].hourStandard,
            currentWrapName: data.data.electiveWrapList[0].electiveWrapName,
            needCourseHours: data.data.optionalPackageRequires ? data.data.electiveWrapList[0].remainingHours : data.data.wholeRemainingHours,
            periodType: data.data.periodType
          })
        }
        this.setData({
          standardCourseWrapList: standardCourseWrapList,
          noStandardCourseWrapList: noStandardCourseWrapList,
          optionalPackageRequires: data.data.optionalPackageRequires,//包内是否有选课要求
          wholeRemainingHours: data.data.wholeRemainingHours,         //整体选课要求学时
        })
        this.requestCourseList()
      }
    }).catch(e => {
      wx.hideLoading()
      console.log(e)
    })
  },
  /**
   * 网络请求   兴趣课程列表
   * type:0 默认 1 刷新 2  加载更多
   */
  requestCourseList(type) {
    let param = {
      trainingClassId: this.data.trainingClassId,
      electiveWrapId: this.data.currentWrapId,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }
    wx.showLoading({
      title: '加载中....',
    })
    app.requestData(app.config.selectedCourseList, param, 'POST').then(data => {
      if (type == 1) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
      wx.hideLoading()
      if (data.head.code != app.constant.network_result_success) {
        return wx.showToast({
          title: data.head.message,
        })
      }
      if (data.data.length > 0) {
        this.setData({
          pageNo: this.data.pageNo + 1
        })
      }
      var courseList = []
      if (type == 2) {
        courseList = this.data.courseList.concat(data.data.courseList)
      } else {
        courseList = data.data.courseList
      }
      this.setData({
        courseList: courseList
      })

    }).catch(e => {
      wx.hideLoading()
      if (type == 0) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
      console.log(e)
    })
  },
  /**
  * 网络请求--获取考核信息
  */
  requestAssessmentRequirements() {
    var param = {
      trainingClassId: this.data.trainingClassId
    }
    app.requestData(app.config.assessmentRequirements, param, "POST").then(data => {
      if (data.head.code !== app.constant.network_result_success) {
        //网络请求失败
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      }
      //数据赋值
      this.setData({
        assessmentRequirementObject: data.data,
        hasStandardCourseWrap: data.data.courseNeedHours == undefined || data.data.courseNeedHours <= 0 ? false : true,
        requireHours: this.data.optionalPackageRequires ? this.data.requireHours : data.data.courseRequireHours
      })
    }).catch(e => {
      // wx.hideLoading()
      console.log(e)
    })
  },
  /**
   * 网络请求  提交兴趣课程列表
   */
  requestSubmitCourseList(courseList) {
    var _this = this
    var commitCourseList = this.selectCourse(courseList)
    let param = {
      courseList: commitCourseList,
      electiveWrapId: this.data.currentWrapId,
      trainingClassId: this.data.trainingClassId
    }
    wx.showLoading({
      title: '提交中....',
    })
    app.requestData(app.config.commitCourseList, param, 'POST').then(data => {
      if (data.head.code != app.constant.network_result_success) {
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      }
      setTimeout(function () {
        _this.setData({ selecCoursetHours: 0 })
        _this.requestCourseWrapList(1)
        _this.requestAssessmentRequirements()
      }, 1500)
    }).catch(e => {
      wx.hideLoading()
      console.log(e)
    })
  },
  /**
   * 选课包下拉菜单点击事件
   */
  switchCourseWrap() {
    if (this.data.selectCourseWrapState) {
      this.courseWrapComponent.close()
    } else {
      this.courseWrapComponent.show()
    }
    this.setData({
      selectCourseWrapState: !this.data.selectCourseWrapState
    })
  },
  /**
   * 自定义控件点击回调---课程包切换
   */
  courseWrapEvent(e) {
    this.setData({
      courseList: [],
      selecCoursetHours: 0,
      selectCourseWrapState: false,
      currentWrapId: e.detail.item.electiveWrapId,
      currentWrapName: e.detail.item.electiveWrapName,
      currentWraphourStandard: e.detail.item.hourStandard,
      currentWrapIndex: e.detail.idx,
      needCourseHours: this.data.optionalPackageRequires ? e.detail.item.remainingHours : this.data.wholeRemainingHours,
      requireHours: this.data.optionalPackageRequires ? e.detail.item.requireHours : this.data.assessmentRequirementObject.courseRequireHours,
    })
    this.requestCourseList(0)
  },
  /**
   * 课程item选择事件
   */
  courseItemClick(e) {
    var item = e.currentTarget.dataset.item
    var idx = e.currentTarget.dataset.idx
    var state = false
    if (item.checkState == undefined || item.checkState == false) {
      //获取当前课程包的还需要多少学时
      var remainingHours = 0
      remainingHours = this.data.optionalPackageRequires ? this.data.courseWrapList[this.data.currentWrapIndex].remainingHours : this.data.wholeRemainingHours
      //判断选的课程学时是否超过需要学时   当前打钩未算在内
      //隐藏上线考核要求
      if (this.data.periodType!==2){
        if (this.data.selecCoursetHours >= remainingHours) {
          return this.alert.show('当前勾选的课程，已达到本课程要求的学时，无须再添加课程！')
        }
      }
      //选课程已勾选学时 当前打钩算在内
      var hours = this.data.selecCoursetHours + item.period
      //赋值当前已选学时字段
      this.setData({ selecCoursetHours: hours })
      //计算还需选多少学时  如果大于0 选课学时没超  小于学时超过，需选学时设置为0
      var needCourseHous = remainingHours - hours
      this.setData({ needCourseHours: needCourseHous > 0 ? needCourseHous : 0})
      state = true
    } else {
      //获取当前课程包的还需要多少学时
      var remainingHours = 0
      //课程包还需要多少学时
      remainingHours = this.data.optionalPackageRequires ? this.data.courseWrapList[this.data.currentWrapIndex].remainingHours : this.data.wholeRemainingHours

      //当前取消勾选  选课学时
      var hours = this.data.selecCoursetHours - item.period
      //赋值当前已选学时
      this.setData({ selecCoursetHours: hours })
      //赋值当前需选学时   课程包需选学时-当前已勾选选课学时
      var needCourseHous = remainingHours - hours
      this.setData({ needCourseHours: needCourseHous > 0?needCourseHous:0})
      state = false
    }
    var modifyItem = 'courseList[' + idx + '].checkState'
    this.setData({
      [modifyItem]: state
    })
  },

  /**
   * 课程播放
   */
  playCourseClick(e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/course/coursedetail/courseDetail' + '?packageId=' + this.data.currentWrapId + '&courseId=' + item.courseId + '&type=' + '2' + '&trainingClassId=' + this.data.trainingClassId
    })
  },
  /**
   * 确认选择事件
   */
  confirmClick() {
    var _this = this
    wx.showModal({
      title: "已选" + this.data.selecCoursetHours + "学时课程，请确认！",
      content: '选课成功后，暂不支持删除课程，请谨慎选课！',
      showCancel: true,
      cancelText: '暂不选择',
      confirmText: '确定选择',
      success: function (res) {
        if (res.confirm) {
          _this.requestSubmitCourseList(_this.data.courseList)
        } else if (res.cancel) {
          
        }
      }
    })
  },
  /**
   * 显示选课要求
   */
  showRequireInfo() {
    this.requirementComponent.show()
  },
  /**
    * 选中课程组装一个集合中
    */
  selectCourse(courseList) {
    var courseNewList = courseList;
    for (var i = 1; i < courseNewList.length; i++) {
      var temp = courseNewList[i];
      for (var j = i; j > 0 && temp.period < courseNewList[j - 1].period; j--) {
        courseNewList[j] = courseNewList[j - 1];
      }
      courseNewList[j] = temp
    }

    var selectCourse = [];
    for (var i = 0; i < courseNewList.length; i++) {
      if (courseNewList[i].checkState == true) {
        var courseItem = {
          courseId: null
        }
        courseItem.courseId = courseNewList[i].courseId;
        selectCourse.push(courseItem.courseId)
      }
    }
    return selectCourse;
  },
})