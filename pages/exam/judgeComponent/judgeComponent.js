// pages/exam/judgeComponent/judgeComponent.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: Object,
    question: Object,
    index: Number,
    subIndex: Number,
    currentQuestionIndex: Number,
    allQuestionIndex:Number,
    showAnswer: Boolean,
    showDescription: Boolean,
    showResult: Boolean
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
          }else{
            this.setData({
              userAnswer: false
            })
          }
        }
      }
      if (this.data.question.correctAnswer) {
        if (this.data.question.correctAnswer.length > 0) {
          if (this.data.question.correctAnswer[0]=='true'){
            this.setData({
              correctAnswer: true
            })
          }else{
            this.setData({
              correctAnswer: false
            })
          }
        }
      }
    },
    updateQuestionData: function () {
      // 更新子题
      this.data.question.answered = true
      if(this.data.userAnswer){
        this.data.question.answersResult[0] = 'true'
      }else{
        this.data.question.answersResult[0] = 'false'
      }
      try {
        wx.setStorageSync(app.constant.currentQuestion, this.data.question)
      } catch (e) {
      }
    }
  }
})
