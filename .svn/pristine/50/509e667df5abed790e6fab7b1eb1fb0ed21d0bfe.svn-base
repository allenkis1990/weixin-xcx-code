var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lng: {
      type: Number,
      value: 0
    },
    lat: {
      type: Number,
      value: 0
    },
    hasExam: {
      type: Boolean,
      value: 0
    },
    courseList: {
      type: Array,
      value: []
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击事件---参考资料下载
     */
    refenceMatrialClick(e) {
      var item = e.currentTarget.dataset.item
      this.itemClick(e)
    },
    /**
     * 点击事件--课程点击
     */
    itemClick(e) {
      var item = e.currentTarget.dataset.item
      //跳转到课程详情
      wx.navigateTo({
        url: '/pages/linetrainclass/lineCourseDetail/lineCourseDetail' + '?trainingClassId=' + this.data.trainingClassId + '&planItemId=' +
        item.planItemId
      })
    },
  
    /**
    * 点击事件--扫一扫
    */
    scanClick: function () {
      this.triggerEvent('enterScanEvent',1)
      require('../../scanModule/scanUtil.js').scan()
    }
  }
})
