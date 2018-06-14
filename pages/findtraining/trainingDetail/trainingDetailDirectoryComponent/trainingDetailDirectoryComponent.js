// pages/findtraining/trainingDetail/trainingDetailDirectoryCompoment/trainingDetailDirectoryCompoment.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coursePackageList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal.length) {
          this.resetPackageListData(newVal)
        }
      }
    },
    trainingItemInfo: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedOptionPackageObject: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    resetPackageListData(array) {
      for (let index = 0; index < array.length; index++) {
        let item = array[index]
        if (index == 0) {
          item.isOpen = true
        } else {
          item.isOpen = false
        }
      }
      this.properties.coursePackageList = array
      this.setData(
        { coursePackageList: this.properties.coursePackageList }
      )
      this.loadCourseListData()
    },
    // 加载第一个课程包的课程数据
    loadCourseListData() {
      // 静默加载必修课数据
      let firseItem = this.properties.coursePackageList[0]
      let context = this
      let params = {
        trainingClassId: this.properties.trainingItemInfo.trainClassId,
        electiveWrapId: firseItem.electiveWrapId,
        pageNo: 1,
        pageSize: 100
      }
      wx.showLoading({
        title: '数据加载中...',
      })
      app.requestData(app.config.findTrainingCourseList, params, 'GET').then(function (response) {
        wx.hideLoading()
        if (response.head.code == app.constant.network_result_success) {
          firseItem.courseList = response.data.courseList
          context.setData({
            coursePackageList: context.properties.coursePackageList
          })
        } else {
          wx.showToast({
            title: response.head.message,
            icon: 'none'
          })
        }
      }).catch(function (error) {
        console.log('数据请求失败！')
      })
    },
    /**
     * 加载选修包课件列表
     */
    loadOptionCouseListData(optionPackageObject) {
      let context = this
      let params = {
        trainingClassId: this.properties.trainingItemInfo.trainClassId,
        electiveWrapId: optionPackageObject.electiveWrapId,
        pageNo: 1,
        pageSize: 100
      }
      wx.showLoading({
        title: '数据加载中...',
      })
      app.requestData(app.config.findTrainingCourseList, params, 'GET').then(function (response) {
        wx.hideLoading()
        if (response.head.code == app.constant.network_result_success) {
          context.data.selectedOptionPackageObject.courseList = response.data.courseList
          context.setData({
            coursePackageList: context.properties.coursePackageList
          })
        } else {
          wx.showToast({
            title: response.head.message,
            icon: 'none'
          })
        }
      }).catch(function (error) {
        console.log('数据请求失败！')
      })

    },
    /**
     * 课程包选中时候的事件
     */
    cousePackageItemClickAction(event) {
      let currentIndex = event.currentTarget.dataset.currentIndex
      let coursePackage = this.data.coursePackageList[currentIndex]
      this.data.selectedOptionPackageObject = coursePackage
      if (coursePackage.courseList == undefined) {
        coursePackage.isOpen = true
        this.loadOptionCouseListData(coursePackage)
      } else {
        coursePackage.isOpen = !coursePackage.isOpen
        this.setData({
          coursePackageList: this.properties.coursePackageList
        })
      }
    },
    /**
     * 课程选中时候的事件
     */
    couseItemClickAction(event) {
      let packageIndex = event.currentTarget.dataset.currentIndex
      let courseIndex = event.currentTarget.dataset.currentSubIndex
      let coursePackage = this.data.coursePackageList[packageIndex]
      let course = coursePackage.courseList[courseIndex]
      if (course.supportListen) {
        wx.navigateTo({
          url: '/pages/course/coursedetail/courseDetail?isTest=' + true + '&schemeId=' + this.data.trainingItemInfo.schemeId + '&packageId=' + coursePackage.courseWrapId + '&studyType=' + 2 + '&courseId=' + course.courseId + '&sourceType=' + 'FIND_TRAINNING' + '&shouldSubmitProgress=' + false
        })
      }
    }
  }
})
