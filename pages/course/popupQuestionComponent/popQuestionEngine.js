let paperInterface = require('./paperInterface.js')
let popQuestionTool = require('./popQuestionTool.js')
var _lastPosition = 0
var selectedCourseWare = null
var popQuestionEngineData = {}
// 当前选中的弹窗题题目内容列表
var questionContextModelList = []
// 当前选中课件的弹窗题配置信息
var selectedQuestionConfigModel = null
// 当前选中的题目配置列表，通过这个可以获取弹窗题题目内容
var questionConfigModelList = []
var timePoints = []

// 公开方法
function loginExam(currentPage) {
  // 登录考试系统
  paperInterface.examLogin().then(function (data) {
    if (data.data.result == 'success') {
      popQuestionEngineData.isLoginExam = true
      currentPage.setData({
        isLoginExam: true
      })
    } else {
      popQuestionEngineData.isLoginExam = false
      currentPage.setData({
        isLoginExam: false
      })
    }
  })
}
/**
  * 选中当前课件事件，得到当前选中课件的弹窗题对象
  * currentPage 当前绑定事件的页面
  * popUpQuestionModelConfigResultList 弹窗题列表
  * selectedCourseWare 当前选中的课件对象
  * courseWareId 当前选中的课件的课件id
  * courseId 课程id
  * mediaId 当前播放的媒体id
  * markers 标识
  * duration 当前选中课件的总时长
  */
function selectedCourseWareWithDatas(currentPage, popUpQuestionModelConfigResultList, selectedCourseWare, courseWareId, courseId, mediaId, markers, duration) {
  // 获取到的弹窗题配置列表
  popQuestionEngineData.popUpQuestionModelConfigResultList = popUpQuestionModelConfigResultList
  // 通过选中的课件取到当前选中的弹窗题config信息对象
  selectedQuestionConfigModel = popQuestionTool.getCourseWareQuestionModelWithId(popUpQuestionModelConfigResultList, courseWareId)
  if (selectedQuestionConfigModel) {
    questionConfigModelList = popQuestionTool.getCourseWareQuestListWithId(selectedQuestionConfigModel, courseWareId)
  }
  popQuestionEngineData.currentPage = currentPage
  popQuestionEngineData.selectedCourseWare = selectedCourseWare
  popQuestionEngineData.courseWareId = courseWareId
  popQuestionEngineData.mediaId = mediaId
  popQuestionEngineData.markers = markers
  popQuestionEngineData.duration = duration
  popQuestionEngineData.courseId = courseId
  // 选中之后立即去获取试题列表,同时将百分比以及固定时间点的转化成时间节点
  if (popQuestionEngineData.isLoginExam !== undefined && popQuestionEngineData.isLoginExam) {
    // 非随机弹题时，立即获取弹窗题内容列表
    if (selectedQuestionConfigModel.interceptMode !== 1){
      _getPopupQuestionContext(selectedQuestionConfigModel, courseWareId)
    }
    // 将时间转化为时间点
    let triggerForm = selectedQuestionConfigModel.triggerForm
    let triggerFormValue = selectedQuestionConfigModel.triggerFormValue
    if (triggerForm == 1 || triggerForm == 2) {
      timePoints = popQuestionTool.getTimePointsWithDuration(triggerForm, duration, triggerFormValue)
    }
  } else {
    loginExam(popQuestionEngineData.currentPage)
    return
  }
}
/**
  * 视频播放，当前进度更新事件
  * progress 当前进度
  * duration 总时长
  */
function didUplaodProgressWithDuration(position, duration) {
  if (!selectedQuestionConfigModel) {
    return
  }
  // 如果题目配置列表有内容但题目内容列表为空，则为获取题目内容失败，重新发起获取题目内容请求，同时不是随机弹题时
  if (questionConfigModelList.length && !questionContextModelList.length && selectedQuestionConfigModel.interceptMode !== 1) {
    _getPopupQuestionContext(selectedQuestionConfigModel, popQuestionEngineData.courseWareId)
    return
  }
  console.log("进行判断是否弹题")
  let triggerForm = selectedQuestionConfigModel.triggerForm
  switch (triggerForm) {
    case 0: {
      if (questionConfigModelList.length) {
        let count = questionConfigModelList.length
        for (let index = 0; index < count; index++) {
          let questionConfigModel = questionConfigModelList[index]
          let timePoint = questionConfigModel.timePoint
          if (parseInt(position) == timePoint && _lastPosition != position) {
            _showPopQuestionWithIndexAndPosition(index, timePoint)
          }
        }
      }
      break
    }
    case 1: {
      _showPopQuestionWithPoints(timePoints, position)
      break
    }
    case 2: {
      _showPopQuestionWithPoints(timePoints, position)
      break
    }
  }
}
/**
  * 关闭弹窗题事件
  */
function closePopQuestionWidow() {
  // 操作，先隐藏再继续播放
  if (popQuestionEngineData.currentPage) {
    popQuestionEngineData.currentPage.setData({
      showPopupQuestion: false
    })
    popQuestionEngineData.currentPage.selectComponent('#videoPlayer').play()
  }
}
/**
  * 当前页面销毁时调用
  * 用于重置数据，同时解除循环，应用了currentpage
  */
function deallocPopQuestionEngine() {
  _lastPosition = 0
  selectedCourseWare = null
  popQuestionEngineData = {}
  questionContextModelList = []
  selectedQuestionConfigModel = null
  questionConfigModelList = []
  timePoints = []
}

// 内部方法 
// 通过百分比转化的时间点，查找选中的index的操作方法
function _showPopQuestionWithPoints(_timePoints, position) {
  let count = _timePoints.length
  let quesitonCount = questionContextModelList.length
  for (let i = 0; i < count; i++) {
    let index = 0
    let timePoint = _timePoints[i]
    if (parseInt(position) == timePoint && _lastPosition != position) {
      index = i
      if (i >= quesitonCount && quesitonCount != 0) {
        index = count % quesitonCount
        if (index >= quesitonCount) {
          index = index - 1
        }
      }
      _showPopQuestionWithIndexAndPosition(index, position)
      return
    }
  }
}
// 获取弹窗题内容列表
function _getPopupQuestionContext(configModel, wareid) {
  return new Promise(function (resolve, reject) {
    let questionConfigList = popQuestionTool.getCourseWareQuestListWithId(configModel, wareid)
    let questionIdList = popQuestionTool.getQuestionIdListWithId(configModel)
    let questionSourceType = 1
    if (configModel.interceptMode == 0) {
      questionSourceType = 1
    } else {
      questionSourceType = 2
    }
    // 获取题目成功
    paperInterface.getQuestionById(questionIdList, questionSourceType).then(function (result) {
      if (result.head.code == 200) {
        questionContextModelList = result.data.answerQuestionDtos
        // 当为随机弹题时，取到题目后，弹题
        resolve(questionContextModelList)
      } else {
        popQuestionEngineData.currentPage.wetoast.toast({
          title: result.head.message
        })
      }
    })
  })
}
// 显示弹窗题，通过index与当前视频播放的position
function _showPopQuestionWithIndexAndPosition(index, position) {
  if (!_isShowPopQuestion()) {
    return
  }
  // 当前选中的课件配置信息
  let isShowed = false;
  // 当前选中的习题配置
  let listQuestionConfigModel = null
  let selectedQuestionContext = null

  // 非随机弹窗题获取到题目的方式
  if (selectedQuestionConfigModel.interceptMode !== undefined && selectedQuestionConfigModel.interceptMode !== 1) {
    // 此情况下即非获取到弹窗题配置列表的时候，直接获取首个
    if (questionConfigModelList && questionConfigModelList.length) {
      if (index >= 0 && index < questionConfigModelList.length) {
        listQuestionConfigModel = questionConfigModelList[index]
        isShowed = listQuestionConfigModel.isShowed == undefined ? false : listQuestionConfigModel.isShowed
      }
    }
    // 获取当前选中的弹窗题的题目内容
    for (let j = 0; j < questionContextModelList.length; j++) {
      let questionContextObject = questionContextModelList[j]
      if (listQuestionConfigModel.questionId == questionContextObject.questionId) {
        selectedQuestionContext = questionContextObject
      }
    }
  }
  // 获取需要可以答题的次数
  let tactics = popQuestionTool.getCanAnswerTimes(selectedQuestionConfigModel, listQuestionConfigModel)
  // 补充：随机组题的弹窗规则
  if (selectedQuestionConfigModel && selectedQuestionConfigModel.interceptMode == 1) {
    let popForm = selectedQuestionConfigModel.popForm
    switch (popForm) {
      case 0: {
        isShowed = false
        break
      }
      case 1: {
        if (selectedQuestionConfigModel.hasAnswerRecord !== undefined && selectedQuestionConfigModel.hasAnswerRecord) {
          isShowed = true
        } else {
          isShowed = false
        }
        break
      }
    }
  }
  if (isShowed == false) {
    if (selectedQuestionConfigModel.interceptMode !== undefined && selectedQuestionConfigModel.interceptMode !== 1) {
      if (listQuestionConfigModel) {
        listQuestionConfigModel.isShowed = true
        _showPopUiWithlistQuestionConfig(selectedQuestionContext, listQuestionConfigModel, index, position, tactics)
      }
    }
    // 其他情况 == 1 或者其他
    else {
      _getPopupQuestionContext(selectedQuestionConfigModel, popQuestionEngineData.courseWareId).then(function(questionContextListResult){
        _showPopUiWithlistQuestionConfig(questionContextListResult[0], listQuestionConfigModel, index, position, tactics)
      })
    }
  }

}
// 真正去执行显示弹窗题的事件
function _showPopUiWithlistQuestionConfig(selectedQuestionContext, listQuestionConfigModel, index, position, tactics) {
  _lastPosition = parseInt(position)
  // 通知播放暂停事件，通过选中的questionId取出当前试题内容对象
  // 给popcontainer设置提交答案时所需要的参数
  let objectList = []
  if (popQuestionEngineData.markers.length) {
    for (let k = 0; k < popQuestionEngineData.markers.length; k++) {
      let markerModel = popQuestionEngineData.markers[k]
      let examObj = {
        objectId: markerModel.value,
        type: markerModel.key
      }
      objectList.push(examObj)
    }
  }
  let questionId = ""
  if (selectedQuestionContext) {
    questionId = selectedQuestionContext.questionId
  }
  let submitAnswerNeedParam = {
    courseId: popQuestionEngineData.courseId,
    courseWareId: popQuestionEngineData.courseWareId,
    mediaId: popQuestionEngineData.mediaId,
    questionId: questionId,
    answerQuestionId: questionId,
    objectList: objectList
  }
  if (popQuestionEngineData.currentPage) {
    // TODO 可以用通知的方式对pop管理器和videoPlayer进行解耦
    // 如果是全屏状态，则先暂停让后转回竖屏，然后显示
    let videoPlayer = popQuestionEngineData.currentPage.selectComponent('#videoPlayer')
    // 暂停播放
    videoPlayer.pause()
    // 退出全屏
    let videoCtx = wx.createVideoContext('myVideo', videoPlayer)
    videoCtx.exitFullScreen()
    // 显示弹窗题
    popQuestionEngineData.currentPage.setData({
      showPopupQuestion: true,
    })
    popQuestionEngineData.currentPage.selectComponent('#popupQuestionContainer').setData({
      currentAnswerQuestion: selectedQuestionContext,
      canAnswerTimes: tactics,
      isFinallyShouldShowAnswer: selectedQuestionConfigModel.showAnswer,
      index: index,
      answerNeedParam: submitAnswerNeedParam
    })
  }
}
// 是否显示弹窗题
function _isShowPopQuestion() {
  // if (!questionConfigModelList.length) {
  //   return false
  // }
  if (selectedQuestionConfigModel == null || selectedQuestionConfigModel == undefined) {
    return false
  }
  return selectedQuestionConfigModel.enable
}

module.exports = {
  loginExam: loginExam,
  selectedCourseWareWithDatas: selectedCourseWareWithDatas,
  didUplaodProgressWithDuration: didUplaodProgressWithDuration,
  deallocPopQuestionEngine: deallocPopQuestionEngine,
  closePopQuestionWidow: closePopQuestionWidow
}