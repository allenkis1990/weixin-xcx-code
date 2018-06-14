// pages/course/popupQuestionComponent/popupQuestionContainer/popupQuestionContainer.js
let app = getApp()
let popQuestionEngine = require("../../popupQuestionComponent/popQuestionEngine.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    currentAnswerQuestion: {
    },
    canAnswerTimes: -1,
    index: 1,
    isFinallyShouldShowAnswer: false,
    answerNeedParam: null
  },
  ready: function () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showTipToAnswerAction() {
      wx.showToast({
        title: '请进行答题！',
        image: '/image/toast-alert.png'
      })
    },
    _closePopQuestionWindow() {
      // 操作关闭事件
      popQuestionEngine.closePopQuestionWidow()
    }
  }
})
