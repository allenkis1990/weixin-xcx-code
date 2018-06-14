// pages/exam/singleComponent/singleComponent.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: Object,
    question: Object,
    index: String,
    subIndex: Number,
    currentQuestionIndex: Number,
    allQuestionIndex: Number,
    showAnswer: Boolean,
    showDescription: Boolean,
    showResult: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    userAnswer: '',
    correctAnswer: '',
    EnglishArray: app.constant.alphabeticalOrder
  },
  ready: function () {
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initData: function () {
      if(this.data.question.correctAnswer.length > 0) {
        this.setData({
          correctAnswer: this.data.question.correctAnswer[0]
        }) 
      }
      if (this.data.question.answersResult.length > 0) {
        this.setData({
          userAnswer: this.data.question.answersResult[0]
        }) 
      }
    },
    chooseItem: function (e) {
      this.setData({
        userAnswer: e.currentTarget.dataset.result
      })  
      this.updateQuestionData()
    },
    updateQuestionData: function () {
      // 更新子题
      this.data.question.answered = true
      this.data.question.answersResult[0] = this.data.userAnswer
      try {
        wx.setStorageSync(app.constant.currentQuestion, this.data.question)
      } catch (e) {
      }
    }
  }
})
