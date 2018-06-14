const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showAnswer: false,              // 是否显示答案
    showDescription: false,         // 是否显示解析
    showResult: true,               // （后台配置是否显示正确答案）

    currentQuestionIndex: 0,        // 当前题的索引
    allQuestionIndex: 0,            // 全部题数总数
    paper: Object,                  // 当前试卷
    questionArray: [],              // 考题数组
    currentAnswerQuestion: Object,  // 当前考题信息 (当前做的题目)

    // 路由传进来的值
    examOrCheckResult: -1,          // 0查看卷子  1考试
    trainingClassId: '',            // 培训班的id
    testParamObject: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initComponent()
  },
  /**
   * 初始化
   */
  init: function (options) {
    //路由传参数据
    if (options.examOrCheckResult !== undefined && options.trainingClassId !== undefined && options.testParamObject !== undefined) {
      this.setData({
        examOrCheckResult: Number(options.examOrCheckResult), // 0查看卷子  1考试
        trainingClassId: options.trainingClassId,
        testParamObject: JSON.parse(options.testParamObject)
      })
    } else {
      wx.showToast({
        title: '数据错误！',
        icon: 'none'
      })
    }

    // 0查看解析
    if (this.data.examOrCheckResult === 0) {
      this.setData({
        showAnswer: true,
        showDescription: true
      })
    }

    try {
      var value = wx.getStorageSync(app.constant.testPaper)    //获取练习
      if (value) {
        this.setData({
          paper: value
        })
        this.initData()
      } else {// TODO 获取习题失败
      }
    } catch (e) {
      // Do something when catch error
    }

    if (this.data.examOrCheckResult !== 0) {
      wx.setNavigationBarTitle({ title: '做练习' })
    } else {
      wx.setNavigationBarTitle({ title: '历史练习试题' })
    }
  },
  /**
   * 初始化---试题的自定义控件声明
   */
  initComponent() {
    this.judge = this.selectComponent("#judge")
    this.single = this.selectComponent("#single")
    this.multi = this.selectComponent("#multi")
  },
  /**
   * 初始化----试题数据
   */
  initData: function () {
    var _this = this
    var questionsLength = this.data.paper.length        // 试题数量
    // 1.将题目由树形结构打平
    for (var i = 0; i < questionsLength; i++) {
      this.data.questionArray.push(this.data.paper[i])  // 试题添加到questionArray集合
    }
    this.requireQuestion(this.data.questionArray[0]).then(data => {
      if (data) {
        _this.setData({
          currentQuestionIndex: 0,
          allQuestionIndex: questionsLength,
          currentAnswerQuestion: this.data.questionArray[0]
        })
        //当前题存储在storage中，临时保存
        wx.setStorageSync(app.constant.testCurrentQuestion, this.data.currentAnswerQuestion)
        if (this.data.questionArray.length<=1){
          return
        }
        _this.requireQuestion(this.data.questionArray[1])
      }
    })
  },
  /**
   * 获取试题内容
   */
  requireQuestion: function (question) {
    var _this = this
    return new Promise((resolve, reject) => {   
      var params = {}
      var url = ''
      var requestMethod = 'POST'
      if (this.data.examOrCheckResult == 0) {
        params = {
          questionId: question.questionId,
          trainingClassId: this.data.trainingClassId
        }
        requestMethod = 'GET'
        url = app.config.historyPracticeQuestion
        
      } else {
        params = {
          questionId: question.questionId,
          questionType: question.questionType
        }
        requestMethod = 'POST'
        url = app.getServeContextInfo().examServeDomain + '/mobile/mobileQuestionAnswer/getQuestionById'
      }
      app.requestData(url, params, requestMethod ).then(data => {
        if (data.head.code !== app.constant.network_result_success) {
          //网络请求失败
          return wx.showToast({
            title: data.head.message,
            icon: 'none'
          });
        }
        if (data.data.answersResult == undefined || data.data.answersResult == null) {
          data.data.answersResult = []
        }

        for (var i = 0; i < this.data.questionArray.length; i++) {
          if (this.data.questionArray[i].questionId == question.questionId) {
            this.data.questionArray[i] = data.data
          }
        }
        this.setData({
          questionArray: this.data.questionArray
        })
        resolve(data)
      })
    })
  },
  /**
   * 点击事件---上一题 
   */
  previousQuestion: function () {
    if (this.data.currentQuestionIndex > 0) {
      //保存当前作答题，并切换到上一题信息
      if (this.data.examOrCheckResult === 1) {
        this.saveCurrentQuestionData()
      }
      this.previousSubQuestion()
    } else if (this.data.currentQuestionIndex == 0) {
      //保存当前作答题，到达顶部，没有上一题，进行提醒
      if (this.data.examOrCheckResult === 1) {
        this.saveCurrentQuestionData()
      }
      wx.showToast({
        title: '已是第一题',
        icon: 'none'
      })
    }
  },
  /**
   * 点击事件---下一题
   */
  nextQuestion: function () {
    if (this.data.currentQuestionIndex + 1 < this.data.allQuestionIndex) {
      //保存当前作答题，并切换到下一题信息
      if (this.data.examOrCheckResult === 1) {
        this.saveCurrentQuestionData()
      }
      this.nextSubQuestion()
    } else if (this.data.currentQuestionIndex + 1 >= this.data.allQuestionIndex) {
      //保存当前作答题，到达低部，没有下一题，进行提醒
      if (this.data.examOrCheckResult === 1) {
        this.saveCurrentQuestionData()
      }
      wx.showToast({
        title: '已是最后一题了',
        icon: 'none'
      })
    }
  },

  /**
   * 是否显示答案
   */
  openAnswerEvent: function (e) {
    if (e.detail) {
      this.setData({
        showAnswer: true,
        showDescription: true
      })
    } else {
      this.setData({
        showAnswer: false,
        showDescription: false
      })
    }
  },
  /****************************和页面逻辑无关的函数******************************************/
  /**
   * 上一题切换事件
   */
  previousSubQuestion: function () {
    var _this = this
    var currentQuestionIndex = this.data.currentQuestionIndex - 1
    var question = this.data.questionArray[currentQuestionIndex]
    if (question.topic === undefined) {
      //切题，该试题没有内容，网络加载该试题，并做预加载动作
      this.requireQuestion(this.data.questionArray[currentQuestionIndex]).then(data => {
        if (data) {

          //赋值当前试题数据
          _this.setData({
            currentAnswerQuestion: this.data.questionArray[currentQuestionIndex]
          })

          //当前题存储在storage中，临时保存
          wx.setStorageSync(app.constant.testCurrentQuestion, this.data.currentAnswerQuestion)

          //判断是否需要预加载试题
          if (currentQuestionIndex - 1 >= 0) {
            var question1 = this.data.questionArray[currentQuestionIndex - 1]
            if (question1.topic === undefined) {
              _this.requireQuestion(this.data.questionArray[currentQuestionIndex - 1])
            }
          }

        }
      })
    } else {
      if (currentQuestionIndex - 1 >= 0) {
        var question2 = this.data.questionArray[currentQuestionIndex - 1]
        if (question2.topic === undefined) {
          this.requireQuestion(this.data.questionArray[currentQuestionIndex - 1])
        }
      }
    }
    // 更新子题索引
    this.setData({
      currentQuestionIndex: this.data.currentQuestionIndex - 1
    })
    this.updateViewQuestionData()
  },
  /**
   * 下一题切换事件
   */
  nextSubQuestion: function () {
    var _this = this
    var currentQuestionIndex = this.data.currentQuestionIndex + 1
    var question = this.data.questionArray[currentQuestionIndex]
    if (question.topic === undefined) {
      //切题，该试题没有内容，网络加载该试题，并做预加载动作
      this.requireQuestion(this.data.questionArray[currentQuestionIndex]).then(data => {
        if (data) {

          //赋值当前试题数据
          _this.setData({
            currentAnswerQuestion: this.data.questionArray[currentQuestionIndex]
          })

          //当前题存储在storage中，临时保存
          wx.setStorageSync(app.constant.testCurrentQuestion, this.data.currentAnswerQuestion)

          //判断是否需要预加载试题
          if (currentQuestionIndex + 1 < this.data.allQuestionIndex) {
            var question1 = this.data.questionArray[currentQuestionIndex + 1]
            if (question1.topic === undefined) {
              _this.requireQuestion(this.data.questionArray[currentQuestionIndex + 1])
            }
          }

        }
      })
    } else {
      if (currentQuestionIndex + 1 < this.data.allQuestionIndex) {
        var question2 = this.data.questionArray[currentQuestionIndex + 1]
        if (question2.topic === undefined) {
          this.requireQuestion(this.data.questionArray[currentQuestionIndex + 1])
        }
      }
    }

    // 更新子题索引
    this.setData({
      currentQuestionIndex: this.data.currentQuestionIndex + 1
    })
    this.updateViewQuestionData()
  },
  /**
   * 在跳转时候保存当前做题数据
   */
  saveCurrentQuestionData: function () {
    // 取出当前试题
    // 当答题为true 时候 存入平层试题数据 然后提交远端
    // 当答题为false 时候 不做任何处理
    try {
      var value = wx.getStorageSync(app.constant.testCurrentQuestion)
      this.data.questionArray[this.data.currentQuestionIndex] = value
      if (value) {
        if (value.answered) {
          if (value.commit != undefined && value.commit) {
            var param = {
              userAnswers: value.answersResult,
              questionId: value.questionId,
              examObjects: this.data.testParamObject.situations
            }
            //临时关闭   网络请求  提交该试题答案
            app.requestData(app.getServeContextInfo().examServeDomain + '/mobile/mobileQuestionAnswer/submitQuestionAnswer', param, "POST").then(data => {
              if (data.head.code !== app.constant.network_result_success) {
                //网络请求失败
                return wx.showToast({
                  title: data.head.message,
                  icon: 'none'
                })
              }
            })
          }
        }
      }
    } catch (e) {
    }
  },
  //更新下一题内容 自动渲染下一题
  updateViewQuestionData: function () {
    // 上/下一题数据准备
    this.setData({
      currentAnswerQuestion: this.data.questionArray[this.data.currentQuestionIndex]
    })

    var currentQuestion = this.data.currentAnswerQuestion
    // 更新数据库中上／下一题内容
    try {
      wx.setStorageSync(app.constant.testCurrentQuestion, currentQuestion)
    } catch (e) {
    }
  }
})
