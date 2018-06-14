// 获取到某个课件的问题列表对象
function getCourseWareQuestionModelWithId(courseWareQuestionList, courseWareId) {
  if (!courseWareId.length || courseWareQuestionList == undefined || courseWareQuestionList == null) {
    return {}
  }
  for (let index = 0; index < courseWareQuestionList.length; index++) {
    let courseWareQuestionObject = courseWareQuestionList[index]
    if (courseWareQuestionObject.courseWareId == courseWareId) {
      return courseWareQuestionObject
    }
  }
  return {}
}
// 获取弹窗列表的题目对象列表
function getCourseWareQuestListWithId(courseWareQuestionObject, courseWareId) {
  if (!courseWareId.length) {
    return []
  }
  if (courseWareQuestionObject == undefined) {
    return []
  }
  if (courseWareQuestionObject.questionList) {
    return courseWareQuestionObject.questionList
  } else {
    return []
  }
}
// 获取弹窗列表的题目id列表
function getQuestionIdListWithId(courseWareQuestionObject, courseWareId) {
  let arrId = []
  if (courseWareQuestionObject == null) {
    return []
  }
  if (!courseWareQuestionObject.questionList) {
    return []
  }
  for (let index = 0; index < courseWareQuestionObject.questionList.length; index++) {
    let courseWareQuestListModel = courseWareQuestionObject.questionList[index]
    arrId.push(courseWareQuestListModel.questionId)
  }
  return arrId
}
// 将百分比活固定时间间隔转成时间节点数组
function getTimePointsWithDuration(pointsType, duration, span) {
  let timePoints = []
  if (span !== 0) {
    switch (pointsType) {
      //百分比
      case 1: {
        let second = parseInt(duration * (span * 1.0 / 100))
        let numbers = 100 / span
        for (let index = 0; index < numbers; index++) {
          let value = second * (index + 1)
          if (value >= duration) {
            value = duration - 4
          }
          timePoints.push(parseInt(value))
        }
        break
      }
      //固定时间间隔
      case 2: {
        let count = duration / span
        for (let index = 0; index < count; index++) {
          let value = span * (index + 1)
          if (value >= duration) {
            value = duration - 4;
          }
          timePoints.push(parseInt(value))
        }
      }
        break
    }
  }
  return timePoints
}
// 获取可以答题的次数
function getCanAnswerTimes(currentAnswerConfigValue, answerConfigListModel) {
  let count = 1
  switch (currentAnswerConfigValue.interceptMode) {
    // 知识点组题
    case 0: {
      if (answerConfigListModel == undefined) {
        return count
      }
      // 答对为止
      if (currentAnswerConfigValue.verificationForm == 0) {
        count = -1
      } else {
        count = answerConfigListModel.verificationFormValue
      }
      break
    }
    // 随机组题
    case 1: {
      if (currentAnswerConfigValue.verificationForm == 0) {
        count = -1
      } else {
        count = currentAnswerConfigValue.verificationFormValue
      }
      break
    }
  }
  return count

}
module.exports = {
  getCourseWareQuestionModelWithId: getCourseWareQuestionModelWithId,
  getCourseWareQuestListWithId: getCourseWareQuestListWithId,
  getQuestionIdListWithId: getQuestionIdListWithId,
  getTimePointsWithDuration: getTimePointsWithDuration,
  getCanAnswerTimes: getCanAnswerTimes
}