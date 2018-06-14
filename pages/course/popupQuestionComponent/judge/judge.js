// pages/course/popupQuestionComponent/judge.js
let paperInterface = require('../../popupQuestionComponent/paperInterface.js')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    question: Object,
    index: Number,
    canAnswerTimes: Number,
    isFinallyShouldShowAnswer: Boolean,
    answerNeedParam: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    userAnswer: '',
    correctAnswer: '',
    winWidth: 0,
    winHeight: 0,
    answerTimes: 0,
    remainAnswerTimes: 0,
    commitAnswerResultData:null,
    showAnswer:false,
    // 是否正在作答
    isReplying:true,
    // 所有回答次数用完，显示答案时为true
    isEndReply:false
  },
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
    chooseAnswer: function (e) {
      this.setData({
        userAnswer: e.currentTarget.dataset.result
      })
    },
    initData: function () {
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
        }
      }
    },
    // 重新答题事件
    reAnswerQuestionAction() {
      this.setData({
        userAnswer: '',
        isReplying:true,
      })
    },
    // 提交答案
    submitAnswerAction() {
      let context = this
      let answer = []
      if (this.data.userAnswer.length) {
        answer.push(this.data.userAnswer)
      } else {
       // 提示用户作答
        context.wetoast.toast({
          title: '请选择答案后提交！'
        })
        return
      }
      if (this.data.commitAnswerResultData && this.data.commitAnswerResultData.answeredQuestionId){
        this.properties.answerNeedParam.answerQuestionId = this.data.commitAnswerResultData.answeredQuestionId 
      }
      paperInterface.submitPopQuestionAnswer(this.properties.answerNeedParam, answer).then(function (data) {

        if (data.head.code == 200) {
          // 判断正确或错误
          context.setData({
            commitAnswerResultData:data.data
          })
          // 正确时，隐藏答题容器，并显示toast
          if (data.data.answerResult){
            wx.showToast({
              title: '本次回答正确！',
            })
            context.triggerEvent("closePopQuestionWindow")
          }else{
            context.data.answerTimes++
            context.setData({
              answerTimes: context.data.answerTimes,
              isReplying:false
            })
            // 错误
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
                    isEndReply:true
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
        }else{
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