// pages/exam/examContainer/examContainer.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,                       // 大题索引
    subIndex: 0,                    // 小题索引
    maxIndex: 0,                    // 最大大题索引
    maxSubIndex: 0,                 // 最大子题索引
    currentQuestionIndex: 0,
    allQuestionIndex: 0,
    subIndexArray: [],              // 每个大题的子题数 数组
    paper: Object,                  // 当前试卷
    questionArray: [],              // 考题数组
    
    rangeArray: [],
    currentQuestionInfo: Object,    // 当前大题信息（用来显示 一.选择题 总分 之类的)
    currentAnswerQuestion: Object,  // 当前考题信息 (当前做的题目)
    clock: '',

    showAnswer: false,
    showDescription: false,
    showAnswerCard: false,
    showResultCard: false,
    showResult:false,
    // 路由传进来的值
    examOrCheckResult: -1,           // 0查看卷子  1考试

    answerRightCount: 0,
    timeKey: Object,
    examPassScore: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.WeToast(this)
    new app.AlertMessage(this)
    this.setData({
      examOrCheckResult: Number(options.examOrCheckResult)
    })
    this.setData({
      examPassScore: Number(options.examPassScore)
    })
    // 0查看解析 1考试
    if (this.data.examOrCheckResult === 0) {
      this.setData({
        showResultCard: true
      })
      this.setData({
        showAnswer: true
      })
      this.setData({
        showDescription: true
      })
    }
    try {
      var value = wx.getStorageSync(app.constant.examPaper)
      if (value) {
        this.setData({
          paper: value,
          showResult: value.showCorrectAnswer == undefined ? false : value.showCorrectAnswer
        })
        this.initData()
      } else {
        // TODO 获取习题失败
      }
    } catch (e) {
      // Do something when catch error
    }
    // 0查看解析 1考试
    if (this.data.examOrCheckResult !== 0) {
      // this.alertmessage.message({ title: '请勿在考试中随意点击返回按钮，返回后考试将在考试用时结束后自动提交，可能会导致考试成绩不理想。' })
      wx.showModal({
        // title: '请勿在考试中随意点击返回按钮，返回后考试将在考试用时结束后自动提交，可能会导致考试成绩不理想。',
        content: '请勿在考试中随意点击返回按钮，返回后考试将在考试用时结束后自动提交，可能会导致考试成绩不理想。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      this.countDown(this.data.paper.surplusTime)
    } else {
      wx.setNavigationBarTitle({
        title: '考试题析',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.data.timeKey)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 初始化数据
  initData: function () {
    // 1.将题目由树形结构打平
    for (var i = 0; i < this.data.paper.questionItemDtos.length; i++) {
      this.data.subIndexArray.push(this.data.paper.questionItemDtos[i].answerQuestionDtos.length)
      for (var j = 0; j < this.data.paper.questionItemDtos[i].answerQuestionDtos.length; j++) {
        this.data.questionArray.push(this.data.paper.questionItemDtos[i].answerQuestionDtos[j])
        // 0查看卷子  1考试
        if (this.data.examOrCheckResult === 0) {
          if (this.data.paper.questionItemDtos[i].answerQuestionDtos[j].answersResultState == 1) {
            this.data.answerRightCount = this.data.answerRightCount + 1
          }
        }
      }
    }
    this.setData({
      answerRightCount: this.data.answerRightCount
    })
    var total = 0
    for (var i = 0; i < this.data.subIndexArray.length; i++) {
      this.data.rangeArray.push(total + this.data.subIndexArray[i])
      total = total + this.data.subIndexArray[i]
    }
    this.setData({
      questionArray: this.data.questionArray
    })
    this.setData({
      currentQuestionInfo: this.data.paper.questionItemDtos[0]
    })
    if (this.data.questionArray.length > 0) {
      this.setData({
        currentQuestionIndex: 1,
        allQuestionIndex: this.data.questionArray.length
      })
      this.setData({
        currentAnswerQuestion: this.data.questionArray[0],
      })
    }

    wx.setStorageSync(app.constant.currentQuestion, this.data.currentAnswerQuestion)

    // 大题数
    this.data.maxIndex = this.data.paper.questionItemDtos.length
    // 每个大题下子题数
    this.data.maxSubIndex = this.data.paper.questionItemDtos[0].answerQuestionDtos.length
  },
  // 1 / 2 / 3  判断/ 单选 / 多选
  //上一题
  previousQuestion: function () {
    this.setData({
      showAnswerCard: false
    })
    if (this.data.subIndex > 0) {
      if (this.data.examOrCheckResult === 1) {
        this.saveCurrentQuestionData()
      }
      this.previousSubQuestion()
    } else if (this.data.subIndex == 0) {
      if (this.data.index > 0) {
        if (this.data.examOrCheckResult === 1) {
          this.saveCurrentQuestionData()
        }
        this.previousBigQuestion()
      } else if (this.data.index == 0) {
        // 没有上一题
        this.wetoast.toast({ title: '已经是第一题' })
      }
    }
  },
  //下一题
  nextQuestion: function () {
    if (this.data.subIndex + 1 < this.data.maxSubIndex) {
      if (this.data.examOrCheckResult === 1) {
        this.saveCurrentQuestionData()
      }
      this.nextSubQuestion()
    } else if (this.data.subIndex + 1 == this.data.paper.questionItemDtos[this.data.index].answerQuestionDtos.length) {
      // 是否有下一题大题
      if (this.data.index + 1 < this.data.maxIndex) {
        if (this.data.examOrCheckResult === 1) {
          this.saveCurrentQuestionData()
        }
        this.nextBigQuestion()
      } else if (this.data.index + 1 == this.data.maxIndex) {
        // 0查看卷子  1考试
        if (this.data.examOrCheckResult === 0) {
          this.wetoast.toast({ title: '已经是最后一题了' })
        } else {
          this.saveCurrentQuestionData()
          this.setData({
            showAnswerCard: true
          })
        }
      }
    }
  },
  //跳转至某一题
  gotoQuestion: function (e) {
    var currentIndex = e.currentTarget.dataset.index
    var bigQuestionIndex = 0
    for (var i = 0; i <= this.data.rangeArray.length; i++) {
      if (i === 0) {
        if (0 < currentIndex + 1 && currentIndex + 1 <= this.data.rangeArray[i]) {
          bigQuestionIndex = i
          break
        }
      } else {
        if (this.data.rangeArray[i - 1] < currentIndex + 1 && currentIndex + 1 <= this.data.rangeArray[i]) {
          bigQuestionIndex = i
          break
        }
      }
    }
    this.setData({
      index: bigQuestionIndex
    })
    var subIndex = 0
    if (bigQuestionIndex === 0) {
      subIndex = currentIndex
    } else {
      subIndex = currentIndex - this.data.rangeArray[bigQuestionIndex - 1]
    }
    this.setData({
      subIndex: subIndex
    })
    this.data.maxSubIndex = this.data.paper.questionItemDtos[this.data.index].answerQuestionDtos.length
    this.setData({
      currentQuestionInfo: {}
    })
    this.setData({
      currentQuestionInfo: this.data.paper.questionItemDtos[bigQuestionIndex]
    })
    this.setData({
      currentQuestionIndex: e.currentTarget.dataset.index + 1
    })
    this.setData({
      currentAnswerQuestion: this.data.questionArray[e.currentTarget.dataset.index]
    })
    try {
      wx.setStorageSync(app.constant.currentQuestion, this.data.currentAnswerQuestion)
    } catch (e) {
    }
    this.setData({
      showAnswerCard: false
    })
    // 0查看卷子  1考试
    if (this.data.examOrCheckResult === 0) {
      this.setData({
        showResultCard: false
      })
    }
  },
  //提交
  commit: function () {
    var isAllAnswerd = true
    for (var i = 0; i < this.data.questionArray.length; i++) {
      if (!this.data.questionArray[i].answered) {
        isAllAnswerd = false
        break
      }
    }
    if (isAllAnswerd) {
      let that = this
      wx.showModal({
        title: '提示',
        content: '确定提交考试？',
        success: function (res) {
          if (res.confirm) {
            that.commitResult()
          }
        }
      })
    } else {
      let that = this
      wx.showModal({
        title: '确认提交？',
        content: '本次考试还有题目未作答',
        success: function (res) {
          if (res.confirm) {
            that.commitResult()
          }
        }
      })
    }
  },
  // 查看答题卡
  showAnswerCard: function () {
    // 0查看卷子  1考试
    if (this.data.examOrCheckResult === 0) {
      this.setData({
        showResultCard: true
      })
    } else {
      this.saveCurrentQuestionData()
      this.setData({
        showAnswerCard: true
      })
    }
  },
  showTips: function () {
    wx.showModal({
      title: '绿色表示答对，红色表示答错。',
      content: '',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
        }
      }
    })
  },
  showAllAnswers: function () {
    this.setData({
      showResultCard: false
    })
  },
  /****************************和页面逻辑无关的函数******************************************/
  // 手势
  swipeView: function (e) {
  },
  countDown: function (micro_second) {
    if (micro_second <= 1000) {
      this.setData({
        clock: "考试时间到"
      })
      this.commitResult()
      // timeout则跳出递归
      clearTimeout(this.data.timeKey)
      return;
    }

    if (micro_second <= 60 * 1000 && micro_second >= 59 * 1000) {
      if (wx.getSystemInfoSync().system.indexOf('iOS') == 0 ){
        wx.showModal({
          title: '距离自动交卷，还余1分钟。',
          content: '请注意答卷进度。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        })
      }else {
        this.alertmessage.message({ title: '距离自动交卷，还余1分钟。请注意答卷进度。' })
      }
    }

    // 渲染倒计时时钟
    this.setData({
      clock: this.dateformat(micro_second)
    })
    wx.setNavigationBarTitle({
      title:  this.data.clock,
    })
    let that = this


    this.data.timeKey = setTimeout(function () {
      // 放在最后--
      micro_second -= 1000;
      that.countDown(micro_second)
    }, 1000)
  },
  /** 
   * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
   * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
   * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
   * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
   */
  // 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
  // 时间格式化输出，如3:25:19 86。每10ms都会调用一次
  dateformat: function (micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000)
    // 小时位
    var hr = Math.floor(second / 3600)
    // 分钟位
    var min = Math.floor((second - hr * 3600) / 60)
    // 秒位
    var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;

    return hr + ":" + min + ":" + sec
  },

  previousSubQuestion: function () {
    // 更新子题索引
    this.setData({
      subIndex: this.data.subIndex - 1
    })
    this.updateViewQuestionData()
  },
  previousBigQuestion: function () {
    this.setData({
      index: this.data.index - 1
    })
    this.setData({
      subIndex: this.data.subIndexArray[this.data.index] - 1
    })
    // 每个大题下子题数
    this.data.maxSubIndex = this.data.paper.questionItemDtos[this.data.index].answerQuestionDtos.length
    this.updateViewQuestionData()
  },
  nextSubQuestion: function () {
    // 更新子题索引
    this.setData({
      subIndex: this.data.subIndex + 1
    })
    this.updateViewQuestionData()
  },
  nextBigQuestion: function () {
    // 更新大题 和子题索引
    this.setData({
      index: this.data.index + 1
    })
    this.setData({
      subIndex: 0
    })
    // 每个大题下子题数
    this.data.maxSubIndex = this.data.paper.questionItemDtos[this.data.index].answerQuestionDtos.length
    this.updateViewQuestionData()
  },
  // 在跳转时候保存当前做题数据
  saveCurrentQuestionData: function () {
    // 取出当前试题
    // 当答题为true 时候 存入平层试题数据 然后提交远端
    // 当大题为false 时候 不做任何处理
    try {
      var value = wx.getStorageSync(app.constant.currentQuestion)
      if (value) {
        if (value.answered) {
          var param = {
            "answersResult": value.answersResult,
            "answerExamPaperId": this.data.paper.answerExamPaperId,
            "index": this.data.index,
            "subIndex": this.data.subIndex,
            "submitType": value.questionType
          }
          app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileOnlineExam/submitQuestion', param, "POST").then(data => {
            if (data.head.code !== app.constant.network_result_success) {
              //网络请求失败
              return this.wetoast.toast({ title: data.head.message })
            }
          })

          var indexOfQuestionArray = this.locationIndexOfQuestionArray()
          this.data.questionArray[indexOfQuestionArray] = value
          this.setData({
            questionArray: this.data.questionArray
          })
        }
      }
    } catch (e) {
    }
  },
  //更新下一题内容 自动渲染下一题
  updateViewQuestionData: function () {
    // 服务器提交当前题目内容
    //更新大题
    this.setData({
      currentQuestionInfo: {}
    })
    this.setData({
      currentQuestionInfo: this.data.paper.questionItemDtos[this.data.index]
    })
    // 更新子题
    var indexOfQuestionArray = this.locationIndexOfQuestionArray()
    // 上/下一题数据准备
    this.setData({
      currentQuestionIndex: indexOfQuestionArray + 1
    })
    this.setData({
      currentAnswerQuestion: this.data.questionArray[indexOfQuestionArray]
    })
    // 更新数据库中上／下一题内容
    try {
      wx.setStorageSync(app.constant.currentQuestion, this.data.currentAnswerQuestion)
    } catch (e) {
    }
  },
  locationIndexOfQuestionArray: function () {
    var indexOfQuestionArray = 0
    for (var i = 0; i <= this.data.index; i++) {
      if (i === this.data.index) {
        indexOfQuestionArray = indexOfQuestionArray + this.data.subIndex
      } else {
        indexOfQuestionArray = indexOfQuestionArray + this.data.subIndexArray[i]
      }
    }
    return indexOfQuestionArray
  },
  commitResult: function () {
    var items = []
    for (var i = 0; i < this.data.paper.questionItemDtos.length; i++) {
      var questions = []
      for (var j = 0; j < this.data.paper.questionItemDtos[i].answerQuestionDtos.length; j++) {
        for (var k = 0; k < this.data.questionArray.length; k++) {
          var question = this.data.paper.questionItemDtos[i].answerQuestionDtos[j]
          if (question.questionId === this.data.questionArray[k].questionId) {
            questions.push({ questionId: question.questionId, answersResult: this.data.questionArray[k].answersResult })
          }
        }
      }
      var item = {
        itemId: this.data.paper.questionItemDtos[i].itemId,
        questions: questions
      }
      items.push(item)
    }
    var param = {
      "replyDto": {
        "answerExamPaperId": this.data.paper.answerExamPaperId,
        "questionItems": items
      },
      "end": true,
    }
    app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileOnlineExam/completeExam', param, "POST").then(data => {
      if (data.head.code === app.constant.network_result_success || data.head.code === 57) {
        let that = this
        wx.showModal({
          title: '提交考试成功',
          // content: '',
          cancelText: '查看结果',
          cancelColor: '#3CC51F',
          confirmText: '返回列表',
          confirmColor: '#000000',
          success: function (res) {
            if (res.confirm) {
              // 返回列表  
              wx.navigateBack({
                delta: 1
              })
            }
            if (res.cancel) {
              // 查看结果
              // 获取答卷
              var param = {
                "viewLastOne": true,
                "answerExamPaperId": that.data.paper.answerExamPaperId,
                "historyAnswerExamPaperId": ''
              }
              wx.setNavigationBarTitle({
                title: '考试题析',
              })
              clearTimeout(that.data.timeKey)
              app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileOnlineExam/viewExamPaper', param, "POST").then(data => {
                if (data.head.code !== app.constant.network_result_success) {
                  //网络请求失败
                  return that.wetoast.toast({ title: data.head.message })
                }
                try {
                  wx.setStorageSync(app.constant.examPaper, data.data)
                } catch (e) {
                }
                that.setData({
                  paper: data.data
                })
                that.data.index = 0
                that.data.subIndex = 0,                    // 小题索引
                  that.data.maxIndex = 0,                    // 最大大题索引
                  that.data.maxSubIndex = 0,                 // 最大子题索引
                  that.data.subIndexArray = [],              // 每个大题的子题数 数组
                  that.data.questionArray = [],              // 考题数组
                  that.data.rangeArray = [],
                  that.setData({
                    examOrCheckResult: 0,
                    showAnswer: true,
                    showDescription: true,
                    showResultCard: true,
                    showAnswerCard: false
                  })
                that.initData()
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      } else {
        //网络请求失败
        this.wetoast.toast({ title: data.head.message })
        return
      }
    })
  }
})
