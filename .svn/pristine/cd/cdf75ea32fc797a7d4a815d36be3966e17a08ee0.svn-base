const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    question: {
      type: Object,
      value: Object,
      observer: function (newVal, oldVal) {
        this.initData()
      }
    },
    showAnswer: Boolean,
    showDescription: Boolean,
    showResult: Boolean,
    currentQuestionIndex: Number,
    allQuestionIndex: Number,
    examOrCheckResult: Boolean
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
    /**
     * 初始化
     */
    initData: function () {
      if (this.data.question.correctAnswer.length > 0) {
        this.setData({
          correctAnswer: this.data.question.correctAnswer[0]
        })
      } else {
        this.setData({
          correctAnswer: ''
        })
      }

      if (this.data.question.answersResult.length > 0) {
        this.setData({
          userAnswer: this.data.question.answersResult[0]
        })
      } else {
        this.setData({
          userAnswer: ''
        })
      }
    },
    /**
     * 点击事件--选项
     */
    chooseItem: function (e) {
      this.setData({
        userAnswer: e.currentTarget.dataset.result
      })
      this.updateQuestionData()
    },
    /**
     * 更新子题
     */
    updateQuestionData: function () {
      this.data.question.answered = true
      this.data.question.commit = true
      this.data.question.answersResult[0] = this.data.userAnswer
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
