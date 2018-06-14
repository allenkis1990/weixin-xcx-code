// pages/findtraining/trainingDetail/trainingDetailCourseDirectoryCompoment/trainingDetailCourseDirectoryCompoment.js
let trainingDetailTool = require('../trainingDetailTool.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    chapterList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal.length) {
          this.resetChaptListData(newVal)
        }
      }
    },
    courseDetailInfo: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (newVal.length) {
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
      * 章节选中事件
      */
    chapterClickAction(event) {
      let chapterArray = this.data.chapterList
      let index = event.currentTarget.dataset.currentIndex
      chapterArray[index].isOpen = !chapterArray[index].isOpen
      this.setData({
        chapterList: chapterArray
      })
    },
    /**
      * 课件选中事件
      */
    couseWareSelectedAction(event) {
      let courseWare = event.currentTarget.dataset.courseWare
      if (courseWare.supportListen) {
        wx.navigateTo({
          url: '/pages/course/coursedetail/courseDetail?isTest=' + true + '&schemeId=' + this.properties.courseDetailInfo.schemeId + '&packageId=' + this.properties.courseDetailInfo.coursePackageId + '&studyType=' + 1 + '&courseId=' + this.properties.courseDetailInfo.courseId + '&sourceType=' + 'FIND_TRAINNING' + '&shouldSubmitProgress=' + false
        })
      }
    },
    /**
      * 重置列表数据，满足显示需求
      */
    resetChaptListData(chapterListArray) {
      // 遍历添加是否展开的属性
      let array = chapterListArray
      for (let index = 0; index < chapterListArray.length; index++) {
        let chapterObject = array[index]
        for (let subIndex = 0; subIndex < chapterObject.coursewareList.length; subIndex++) {
          let courseObject = chapterObject.coursewareList[subIndex]
          courseObject.totalTimeText = trainingDetailTool.changeTimeStyle(courseObject.coursewareLength)
          // 解决js中的0.07*100等的失精度算法问题
          courseObject.showSchedule = Math.floor(courseObject.schedule)
        }
        if (index == 0) {
          chapterObject.isOpen = true
        } else {
          chapterObject.isOpen = false
        }
      }
      this.setData({
        chapterList: array
      })
    },
  }
})
