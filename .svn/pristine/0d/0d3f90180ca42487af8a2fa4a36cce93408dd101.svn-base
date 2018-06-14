const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: Object,
    question: {
      type: Object,
      value: Object,
      observer: function (newVal, oldVal) {
        this.initData()
      }
    },
    index: Number,
    subIndex: Number,
    currentQuestionIndex: Number,
    allQuestionIndex: Number,
    showAnswer: Boolean,
    showDescription: Boolean,
    showResult: Boolean,
    examOrCheckResult: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    userAnswer: Boolean,
    correctAnswer: Boolean
  },
  ready: function () {
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    chooseAnswer: function (e) {
      this.setData({
        userAnswer: e.currentTarget.dataset.result
      })
      this.updateQuestionData()
    },
    initData: function () {
      if (this.data.question.answersResult) {
        if (this.data.question.answersResult.length > 0) {
          if (this.data.question.answersResult[0] == 'true') {
            this.setData({
              userAnswer: true
            })
          } else {
            this.setData({
              userAnswer: false
            })
          }
        } else {
          this.setData({
            userAnswer: -1
          })
        }
      }
      if (this.data.question.correctAnswer) {
        if (this.data.question.correctAnswer.length > 0) {
          if (this.data.question.correctAnswer[0] == 'true') {
            this.setData({
              correctAnswer: true
            })
          } else {
            this.setData({
              correctAnswer: false
            })
          }
        } else {
          this.setData({
            correctAnswer: -1
          })
        }
      }
    },
    updateQuestionData: function () {
      // 更新子题
      this.data.question.answered = true
      this.data.question.commit = true
      if (this.data.userAnswer) {
        this.data.question.answersResult[0] = 'true'
      } else {
        this.data.question.answersResult[0] = 'false'
      }
      try {
        wx.setStorageSync(app.constant.testCurrentQuestion, this.data.question)
      } catch (e) {
      }
    },
    /**
     * 是否显示答案
     */
    switchShowAnswer: function () {
      this.triggerEvent("switchShowAnswer", !this.data.showAnswer)
    }
  }
})
