const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    examList: Array,
    examPassScore: String,
    trainingClassDetail: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  // 当组件被加载
  created() {
    this.initComponent()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化控件
     */
    initComponent(){
      this.alert = this.selectComponent("#alert")
    },
    gotoExamEntrance: function (e) {
      var trainingClassDetail = this.properties.trainingClassDetail;
      //课程进度需达到100%，方可进入考试
      if (trainingClassDetail.completePercent < 100){
        this.alert.show('已选的课程进度需达到100%，方可进入考试！')
        return
      }
      var item = e.currentTarget.dataset.data
      if (item.examStatus==1){
        // 考试次数用完，考试未通过
        this.alert.show('考试次数已用完，无法考试！')
        return
      } else if (item.examStatus == 3){
        // 考试已通过
        this.alert.show( '您已通过培训的考试考核，无需继续考试。')
        return
      }
      app.constant.classDetailSceneType = 2
      var url = "/pages/exam/examEntrance/examEntrance?trainingClassId=" + trainingClassDetail.trainingClassId + "&examRoundId=" + item.examRoundId + '&examPassScore=' + this.data.examPassScore 
      console.log(url)
      wx.navigateTo({
        url: url
      })
      this.triggerEvent('enterExamEvent')
    },
    gotoExamHistory: function (e) {
      var item = e.currentTarget.dataset.data
      var trainingClassDetail = this.properties.trainingClassDetail;
      var url = "/pages/exam/examHistory/examHistory?trainingClassId=" + trainingClassDetail.trainingClassId + "&examRoundId=" + item.examRoundId
      + '&examPassScore=' + this.data.examPassScore 
      console.log(url)
      wx.navigateTo({
        url: url
      })
      this.triggerEvent('enterHistoryExamEvent')
    }
  }
})
