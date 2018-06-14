// pages/course/popupQuestionComponent/multiple/multiple.js
let paperInterface = require('../../popupQuestionComponent/paperInterface.js')
let app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    question: Object,
    index: Number,
    canAnswerTimes: Number,
    isFinallyShouldShowAnswer: Boolean,
    answerNeedParam: Object
  },
  /**
   * 组件的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    userAnswer: [],
    correctAnswer: [],
    userAnswerStr: '',
    correctAnswerStr: '',
    EnglishArray: app.constant.alphabeticalOrder,
    itemClass: [],
    showAnswerItemClass: [],
    answerTimes: 0,
    remainAnswerTimes: 0,
    // 是否正在作答
    isReplying: true,
    // 所有回答次数用完，显示答案时为true
    isEndReply: false
  },
  // 生命周期
  attached: function () {
    let that = this
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight * (750 / res.windowWidth)
        });
      }
    });
    this.setData({
      remainAnswerTimes: this.properties.canAnswerTimes
    })
    // 初始化toast
    new app.WeToast(this)
  },
  ready: function () {
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initData() {
      if (this.data.correctAnswer.length == 0) {
        if (this.data.question.correctAnswer) {
          for (var i = 0; i < this.data.question.correctAnswer.length; i++) {
            this.data.correctAnswer.push(this.data.question.correctAnswer[i])
          }
          this.setData({
            correctAnswer: this.data.correctAnswer
          })
        }
      }

      for (var k = 0; k < this.data.question.items.length; k++) {
        this.data.itemClass[k] = 'select-items'
        this.data.showAnswerItemClass[k] = 'select-items'

        var optionId = this.data.question.items[k].optionId
        if (this.isContains(this.data.userAnswer, optionId) && this.isContains(this.data.correctAnswer, optionId)) {
          this.data.showAnswerItemClass[k] = 'select-items right'
        } else {
          if (this.isContains(this.data.userAnswer, optionId)) {
            this.data.showAnswerItemClass[k] = 'select-items wrong'
          } else if (this.isContains(this.data.correctAnswer, optionId)) {
            this.data.showAnswerItemClass[k] = 'select-items right'
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
        itemClass: this.data.itemClass
      })
      this.setData({
        showAnswerItemClass: this.data.showAnswerItemClass
      })
      this.setData({
        userAnswerStr: this.data.userAnswerStr
      })
      this.setData({
        correctAnswerStr: this.data.correctAnswerStr
      })

    },
    chooseItem: function (e) {
      // 已经选中则取消
      if (this.data.userAnswer.includes(e.currentTarget.dataset.optionid)) {
        this.uncheckItem(e.currentTarget.dataset.index, e.currentTarget.dataset.optionid)
      } else {
        this.checkItem(e.currentTarget.dataset.index, e.currentTarget.dataset.optionid)
      }
    },
    // 选中选项
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
    // 取消选中选项
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
    isContains: function (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          return true;
        }
      }
      return false;
    },
    // 重新答题事件
    reAnswerQuestionAction() {
      this.setData({
        userAnswer: [],
        isReplying: true
      })
      // 设置
      for (var k = 0; k < this.data.question.items.length; k++) {
        this.data.itemClass[k] = 'select-items'
        this.data.showAnswerItemClass[k] = 'select-items'
      }
      this.setData({
        itemClass: this.data.itemClass,
        showAnswerItemClass: this.data.showAnswerItemClass
      })

    },
    // 提交答案
    submitAnswerAction() {
      let context = this
      if (!this.data.userAnswer.length) {
        // 提示用户作答
        context.wetoast.toast({
          title: '请选择答案后提交！'
        })
        return
      }
      if (this.data.commitAnswerResultData && this.data.commitAnswerResultData.answeredQuestionId) {
        this.properties.answerNeedParam.answerQuestionId = this.data.commitAnswerResultData.answeredQuestionId
      }
      paperInterface.submitPopQuestionAnswer(this.properties.answerNeedParam, this.data.userAnswer).then(function (data) {

        if (data.head.code == 200) {
          // 判断正确或错误
          context.setData({
            commitAnswerResultData: data.data
          })
          // 正确时，隐藏答题容器，使用通知，并显示toast
          if (data.data.answerResult) {
            context.triggerEvent("closePopQuestionWindow")
            wx.showToast({
              title: '本次回答正确！',
            })
          } else {
            // 错误时，显示重新答题
            context.data.answerTimes++
            context.setData({
              answerTimes: context.data.answerTimes,
              isReplying: false
            })
            if (context.properties.canAnswerTimes !== -1) {
              if (context.data.remainAnswerTimes > 0) {
                context.data.remainAnswerTimes--
              }
              context.setData({
                remainAnswerTimes: context.data.remainAnswerTimes
              })
              if (context.properties.canAnswerTimes <= context.data.answerTimes) {
                // 判断是否显示答案
                if (context.properties.isFinallyShouldShowAnswer) {
                  context.setData({
                    showAnswer: true,
                    isEndReply: true
                  })
                  context.initData()
                } else {
                  // 不显示答案操作
                  wx.showToast({
                    title: '回答错误！',
                    image: '/image/toast-error.png'
                  })
                  context.triggerEvent("closePopQuestionWindow")
                }
              }
            }
          }
        } else {
          // 请求网络失败提示
          context.wetoast.toast({
            title: '答案提交失败，请重新提交！'
          })

        }

      })

    },
    closeAction() {
      this.triggerEvent("closePopQuestionWindow")
    }
  }
})
