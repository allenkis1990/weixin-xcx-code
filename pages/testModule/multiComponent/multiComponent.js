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
    userAnswer: [],
    correctAnswer: [],
    userAnswerStr: '',
    correctAnswerStr: '',
    EnglishArray: app.constant.alphabeticalOrder,
    itemClass: [],
    showAnswerItemClass: []
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
      //初始化原生数据，防止容器调取初始化方法，userAnswer和correctAnswer数据重复问题
      this.data.userAnswerStr = ''
      this.data.correctAnswerStr = ''
      this.data.userAnswer = []
      this.data.correctAnswer = []
      this.setData({
        userAnswerStr: '',
        correctAnswerStr: '',
        userAnswer: [],
        correctAnswer: []
      })

      if (this.data.question.correctAnswer) {
        for (var i = 0; i < this.data.question.correctAnswer.length; i++) {
          this.data.correctAnswer.push(this.data.question.correctAnswer[i])
        }
        this.setData({
          correctAnswer: this.data.correctAnswer
        })
      }
      if (this.data.question.answersResult) {
        for (var j = 0; j < this.data.question.answersResult.length; j++) {
          this.data.userAnswer.push(this.data.question.answersResult[j])
        }
        this.setData({
          userAnswer: this.data.userAnswer
        })
      }

      for (var k = 0; k < this.data.question.configurationItems.length; k++) {
        this.data.itemClass[k] = 'select-items'
        this.data.showAnswerItemClass[k] = 'select-items'

        var optionId = this.data.question.configurationItems[k].optionId
        if (this.isContains(this.data.userAnswer, optionId) && this.isContains(this.data.correctAnswer, optionId)) {
          this.data.showAnswerItemClass[k] = 'select-items right'
        } else {
          if (this.isContains(this.data.userAnswer, optionId)) {
            this.data.showAnswerItemClass[k] = 'select-items wrong'
          } else if (this.isContains(this.data.correctAnswer, optionId)) {
            if (this.data.showResult) {
              this.data.showAnswerItemClass[k] = 'select-items right'
            } else {
              this.data.showAnswerItemClass[k] = 'select-items'
            }
          }
        }

        for (var n = 0; n < this.data.userAnswer.length; n++) {
          if (this.data.userAnswer[n] === optionId) {
            this.data.itemClass[k] = 'select-items selected'
            this.data.userAnswerStr = this.data.userAnswerStr + this.data.EnglishArray[k]
          }
        }

        for (var m = 0; m < this.data.correctAnswer.length; m++) {
          if (this.data.correctAnswer[m] === optionId) {
            this.data.correctAnswerStr = this.data.correctAnswerStr + this.data.EnglishArray[k]
          }
        }
      }
      this.setData({
        itemClass: this.data.itemClass,
        showAnswerItemClass: this.data.showAnswerItemClass,
        userAnswerStr: this.data.userAnswerStr,
        correctAnswerStr: this.data.correctAnswerStr
      })
    },
    /**
     * 
     */
    chooseItem: function (e) {
      // 已经选中则取消
      if (this.data.userAnswer.includes(e.currentTarget.dataset.optionid)) {
        this.uncheckItem(e.currentTarget.dataset.index, e.currentTarget.dataset.optionid)
      } else {
        this.checkItem(e.currentTarget.dataset.index, e.currentTarget.dataset.optionid)
      }
      this.updateQuestionData()
    },
    /**
     * 更新子题
     */
    updateQuestionData: function () {
      this.data.question.answered = true
      this.data.question.commit = true
      this.data.question.answersResult = this.data.userAnswer
      try {
        wx.setStorageSync(app.constant.testCurrentQuestion, this.data.question)
      } catch (e) {
      }
    },
    /**
     * 选中选项
     */
    checkItem: function (currentIndex, optionId) {
      this.data.itemClass[currentIndex] = 'select-items selected'
      this.setData({
        itemClass: this.data.itemClass
      })
      //未选中 进行选中
      this.data.userAnswer.push(optionId)
      this.setData({
        userAnswer: this.data.userAnswer
      })
    },
    /**
     * 取消选中选项
     */
    uncheckItem: function (currentIndex, optionId) {
      for (var i = 0; i < this.data.userAnswer.length; i++) {
        if (this.data.userAnswer[i] === optionId) {
          this.data.userAnswer.splice(i, 1)
          break
        }
      }
      this.setData({
        userAnswer: this.data.userAnswer
      })
      this.data.itemClass[currentIndex] = 'select-items'
      this.setData({
        itemClass: this.data.itemClass
      })
    },
    /**
     * 是否显示答案
     */
    switchShowAnswer: function () {
      this.triggerEvent("switchShowAnswer", !this.data.showAnswer)
    },
    isContains: function (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          return true;
        }
      }
      return false;
    }
  }
})
