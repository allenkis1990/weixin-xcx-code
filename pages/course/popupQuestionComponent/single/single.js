// pages/course/popupQuestionComponent/single/single.js
const app = getApp()
let paperInterface = require("../../popupQuestionComponent/paperInterface.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    question: Object,
    index:Number,
    canAnswerTimes:Number,
    isFinallyShouldShowAnswer:Boolean,
    answerNeedParam:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    winWidth:0,
    winHeight:0,
    userAnswer: '',
    correctAnswer: '',
    EnglishArray: app.constant.alphabeticalOrder,
    showAnswer:false,
    answerTimes: 0,
    remainAnswerTimes:0,
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
    initData: function () {
      if (this.data.question.correctAnswer) {
        this.setData({
          correctAnswer: this.data.question.correctAnswer[0]
        })
      }
    },
    // 选中事件
    chooseItem: function (e) {
      this.setData({
        userAnswer: e.currentTarget.dataset.result
      })
    },
    // 重新答题事件
    reAnswerQuestionAction() {
     this.setData({
       userAnswer:'',
       isReplying: true
     })
    },
    // 提交答案
    submitAnswerAction() {
      let context = this
      let answer = []
      if (this.data.userAnswer.length){
        answer.push(this.data.userAnswer)
      }else{
        // 提示用户答题
        context.wetoast.toast({
          title: '请选择答案后提交！'
        })
        return
      }
      if (this.data.commitAnswerResultData && this.data.commitAnswerResultData.answeredQuestionId) {
        this.data.answerNeedParam.answerQuestionId = this.data.commitAnswerResultData.answeredQuestionId
      }
      paperInterface.submitPopQuestionAnswer(this.data.answerNeedParam, answer).then(function (data) {

        if (data.head.code == 200) {
          // 判断正确或错误
          context.setData({
            commitAnswerResultData: data.data
          })
          // 正确时，隐藏答题容器，使用通知，并显示toast
          if (data.data.answerResult) {
            wx.showToast({
              title: '本次回答正确！',
            })
            context.triggerEvent("closePopQuestionWindow")
          } else {
            // 错误
            context.data.answerTimes++
            context.setData({
              answerTimes: context.data.answerTimes,
              isReplying:false
            })
            if (context.properties.canAnswerTimes == -1) {
              // 显示重新答题

            } else {
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

