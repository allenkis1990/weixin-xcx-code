let selectedCourseWare = {}
let studyPlayerData = {}
let currentCoursePage = null
let videoPlayer = null
let isFirstLoad = true
let app = getApp()
let studyTimeServer = require('./studyTimeServer.js')
let courseDetailTool = require('./courseDetailTool.js')
let studyAbilityInterface = require('./studyAbilityInterface.js')
let pdfReaderManager = require('../../pages/course/coursePlayer/pdfReaderManager.js')
// 私有方法，绑定到courseVideoPlayer组件上的方法
let _studyPlayerManagerEvent = {
  // 点击上面播放的触发事件
  _startFirstPlayAction: function () {
    if (studyPlayerData.courseResourceInfo == undefined || studyPlayerData.courseResourceInfo.courseId === undefined) {
      return
    }
    if (isFirstLoad) {
      // 第一次进入后去掉coverView
      console.log("第一次进入后去掉coverView")
      isFirstLoad = false
      let currentSelectedCourseWare = {}
      // 默认为上次播放的地址资源
      if (studyPlayerData.courseResourceInfo.lastPlayCoursewareId && studyPlayerData.courseResourceInfo.lastPlayCoursewareId.length) {
        if (!studyPlayerData.chapterList.length) {
          return
        }
        for (let index = 0; index < studyPlayerData.chapterList.length; index++) {
          let chapterListObject = studyPlayerData.chapterList[index]
          for (let subIndex = 0; subIndex < chapterListObject.coursewareList.length; subIndex++) {
            let courseObjectWare = chapterListObject.coursewareList[subIndex]
            if (courseObjectWare.coursewareId == studyPlayerData.courseResourceInfo.lastPlayCoursewareId) {
              currentSelectedCourseWare = courseObjectWare
            }
          }
        }
      } else {
        if (!studyPlayerData.chapterList.length) {
          return
        }
        currentSelectedCourseWare = studyPlayerData.chapterList[0].coursewareList[0]
      }
      this.triggerEvent("startFirstPlayTapEvent", currentSelectedCourseWare)
      this.studyPlayerManager.playChooseCourseWare(currentSelectedCourseWare)

    } else {
      //非首次触发，就继续播放
      this.studyPlayerManager.playChooseCourseWare(selectedCourseWare)
    }
  },
  //播放结束事件
  _playEndAction: function () {
    if (studyPlayerData.readyToPlayInfo == undefined || studyPlayerData.readyToPlayInfo.courseId === undefined) {
      return
    }
    if (selectedCourseWare.type !== 1 && !studyPlayerData.isTest) {
      studyTimeServer.submitVideoProgress()
    }
  }
}
//公开方法
/**
  * 初始化事件，将事件绑定到courseVideoPlayer组件，在组件加载的时候调用
  */
function initStudyPlayerManager(context) {
  // 拿到当前页面对象
  let pages = getCurrentPages()
  let curPage = pages[pages.length - 1]
  if (context) {
    curPage = context
  }
  // 把组件的事件“合并到”页面对象上
  if (context) {
    Object.assign(curPage.__proto__, _studyPlayerManagerEvent)
  } else {
    Object.assign(curPage, _studyPlayerManagerEvent)
  }
  curPage.studyPlayerManager = this
  this.studyPlayerData = studyPlayerData
  this.selectedCourseWare = selectedCourseWare
  return this
}
/**
  * 销毁事件，当组件或者页面销毁的时候调用
  */
function deallocStudyPlayerManager() {
  isFirstLoad = true
  selectedCourseWare = {}
  studyPlayerData = {}
  currentCoursePage = null
  videoPlayer = null
  studyTimeServer.stopServer()
  if (selectedCourseWare.type !== 1 && !studyPlayerData.isTest) {
    studyTimeServer.submitVideoProgress()
  }
}
/**
  * 销毁事件，当组件或者页面销毁的时候调用
  */
function hideStudyPlayerManager() {
  if (selectedCourseWare.type !== 1 && !studyPlayerData.isTest) {
    studyTimeServer.submitVideoProgress()
  }
}
/**
  * 设置初始化数据，当获取课程的信息成功之后，调用该方法
  * courseDetailPage  当前页面
  * coverImageUrl 视频封面图片地址
  * courseResourceInfo 课件资源信息
  * isTest 是否为试听
  * userId 用户id
  * classId 班级id
  * courseId 课程id
  * chapterList 章节列表
  * markers 特征标识数组
  * uploadProgressSynchronizationAction 提交进度时的同步事件，类型为function
  */
function setStudyPlayerInitializeData(courseDetailPage, coverImageUrl, courseResourceInfo, isTest, userId, classId, courseId, chapterList, markers, uploadProgressSynchronizationAction) {
  studyPlayerData.courseResourceInfo = courseResourceInfo
  studyPlayerData.coverImageUrl = coverImageUrl
  studyPlayerData.isTest = isTest
  studyPlayerData.userId = userId
  studyPlayerData.classId = classId
  studyPlayerData.courseId = courseId
  studyPlayerData.chapterList = chapterList
  studyPlayerData.markers = markers
  studyPlayerData.uploadProgressSynchronizationAction = uploadProgressSynchronizationAction
  currentCoursePage = courseDetailPage
  videoPlayer = courseDetailPage.selectComponent("#videoPlayer")
  if (videoPlayer) {
    videoPlayer.setData({
      isTest: isTest,
      coverImageUrl: coverImageUrl
    })
  }
}
/**
  * 播放课件事件，用户选中新课件时，调用该方法
  * newSelectedCourseWare 选中的课件
  */
function playChooseCourseWare(newSelectedCourseWare) {
  //调用了该方法即非首次点击
  isFirstLoad = false
  //type为1时是文档，非1时是视频
  // 当由用户通过选中事件操作时，移除点击事件
  //如果原本是视频===》暂停视频播放
  if (newSelectedCourseWare.type == 1 && selectedCourseWare.type != 1) {
    // 停止视频播放  
    videoPlayer.pause()
  }
  if (newSelectedCourseWare.type == 1) {
    //PDF===》显示遮罩层
    videoPlayer.setData({
      isShowCoverView: true
    })
  }
  else {
    //视频===》隐藏遮罩层
    videoPlayer.setData({
      isShowCoverView: false
    })
  }
  if (newSelectedCourseWare.coursewareId == selectedCourseWare.coursewareId && selectedCourseWare.type !== 1) {
    return
  }
  // 若操作为视频切换到其他类型课件（视频或pdf），则进行提交上一次进度
  if (newSelectedCourseWare.coursewareId != selectedCourseWare.coursewareId && selectedCourseWare.type !== 1 && !studyPlayerData.isTest && selectedCourseWare.coursewareId !== undefined) {
    typeof studyPlayerData.uploadProgressSynchronizationAction === 'function' && studyPlayerData.uploadProgressSynchronizationAction()
    studyTimeServer.submitVideoProgress()
  }
  if (newSelectedCourseWare.type == 1) {
    studyTimeServer.stopServer()
  }
  selectedCourseWare = newSelectedCourseWare
  // 初始化播放环境
  // 如果是试听模式，直接打开url进行播放，不是的话进行提交进度初始化操作
  if (!studyPlayerData.isTest) {
    loadInitializePlayCondition()
  } else {
    openResourceOperation()
  }

}
// 内部方法
/**
  * 获取播放初始化信息
  */
function loadInitializePlayCondition() {
  wx.showLoading({
    title: '初始化...',
  })
  // 设置当前最大时间
  let time = selectedCourseWare.coursewareLength * (selectedCourseWare.schedule / 100)
  wx.setStorageSync('maxTime', time + '');
  let multiMediaId = ''
  for (let index = 0; index < studyPlayerData.courseResourceInfo.coursewarePlayList.length; index++) {
    let coursePlay = studyPlayerData.courseResourceInfo.coursewarePlayList[index]
    if (coursePlay.coursewareId === selectedCourseWare.coursewareId) {
      if (coursePlay.multimediaList.length >= 1) {
        multiMediaId = coursePlay.multimediaList[0].multimediaId
      }
    }
  }
  let playType = courseDetailTool.getCourseTypeByType(selectedCourseWare.type)
  studyAbilityInterface.studyInit(studyPlayerData.classId, studyPlayerData.courseId,
    selectedCourseWare.coursewareId, multiMediaId, playType, app.getServeContextInfo().trainSourceId, studyPlayerData.markers).then(data => {
      wx.hideLoading()
      if (data.head.code == 200) {
        // 保存初始化信息
        studyPlayerData.readyToPlayInfo = data.data
        // 打开文件
        openResourceOperation()
        if (selectedCourseWare.type == 2 || selectedCourseWare.type == 3) {
          if (!(selectedCourseWare.schedule >= 98)) {
            setTimeout(() => {
              wx.setStorageSync('lastTime', time + '');
              videoPlayer.seekToPoint(time)
            }, 1000)
          }
          // 开启定时提交进度
          if (selectedCourseWare.schedule !== 100 && !studyPlayerData.isTest) {
            let hasMarker = false
            if (studyPlayerData.markers.length > 0) {
              hasMarker = true
            } else {
              hasMarker = false
            }
            studyTimeServer.onPlayTimeServerInit(studyPlayerData.readyToPlayInfo, studyPlayerData.readyToPlayInfo.objectives.policy.intervalTime * 1000, selectedCourseWare.type, selectedCourseWare.coursewareLength, app.userInfo.userId, studyPlayerData.classId, studyPlayerData.courseId, selectedCourseWare.coursewareId, hasMarker, timerIntervalCallBack)
          }
        }
      } else {
        currentCoursePage.wetoast.toast({
          title: '初始化失败!'
        })
      }
    }, message => {
      wx.hideLoading()
      currentCoursePage.wetoast.toast({
        title: message
      })
    })
}
//定时器事件的回调事件，定时刷新进度UI
function timerIntervalCallBack() {
  typeof studyPlayerData.uploadProgressSynchronizationAction === 'function' && studyPlayerData.uploadProgressSynchronizationAction()
}
/**
  * 打开资源文件
  */
function openResourceOperation() {
  let playUrl = getResUrl()
  // pdf
  if (selectedCourseWare.type == 1) {
    let hasMarker = false
    if (studyPlayerData.markers.length > 0) {
      hasMarker = true
    } else {
      hasMarker = false
    }
    pdfReaderManager.openPdfFile(playUrl, currentCoursePage, studyPlayerData.readyToPlayInfo, selectedCourseWare.coursewareLength, app.userInfo.userId, studyPlayerData.classId, studyPlayerData.courseId, selectedCourseWare.coursewareId, hasMarker, studyPlayerData.uploadProgressSynchronizationAction)
  }
  // 视频文件
  else if (selectedCourseWare.type == 2 || selectedCourseWare.type == 3) {
    videoPlayer.setData({
      totalSecondsTime: selectedCourseWare.coursewareLength
    })
    if (videoPlayer.properties.playUrl == playUrl) {
      videoPlayer.play()
    } else {
      console.log('播放地址：' + playUrl)
      videoPlayer.setData({
        playUrl: playUrl
      })
    }
  }
}
function getResUrl() {
  let resUrl = ''
  for (let index = 0; index < studyPlayerData.courseResourceInfo.coursewarePlayList.length; index++) {
    let coursePlay = studyPlayerData.courseResourceInfo.coursewarePlayList[index]
    if (coursePlay.coursewareId === selectedCourseWare.coursewareId) {
      if (coursePlay.multimediaList.length >= 1) {
        let resListArray = coursePlay.multimediaList[0].resList
        resListArray = courseDetailTool.resetResList(resListArray)
        if (resListArray.length >= 1) {
          debugger
          resUrl = resListArray[0].httpsResUrl
        }
      }
    }
  }
  return resUrl
}

module.exports = {
  initStudyPlayerManager: initStudyPlayerManager,
  setStudyPlayerInitializeData: setStudyPlayerInitializeData,
  playChooseCourseWare: playChooseCourseWare,
  deallocStudyPlayerManager: deallocStudyPlayerManager,
  hideStudyPlayerManager: hideStudyPlayerManager
}