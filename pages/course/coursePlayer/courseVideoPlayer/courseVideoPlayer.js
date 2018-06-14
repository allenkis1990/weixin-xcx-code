// pages/course/courseVideoPlayer/courseVideoPlayer.js
let studyPlayerManager = require('../../../../utils/studyManager/studyPlayerManager.js')
let currentTime = 0
let videoCtx = null
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playUrl:{
      type:String,
      value:'',
      observer: function (newVal, oldVal) {
        if (newVal.length){
          videoCtx.play()
        }
      }
    },
    totalSecondsTime:{
      type:Number,
      value:10
    },
    playInfo:{
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
      }
    },
    coverImageUrl:{
      type: String,
      value: '../../../image/course-img.jpg',
      observer: function (newVal, oldVal) {
      }
    },
    isShowCoverView:{
      type:Boolean,
      value:true,
      observer: function (newVal, oldVal) {
      }
    },
    // 初始播放时间
    initialTime : {
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lastTime: 0,
    zindex: Math.max,
    currentTime: 0,
    isTest:false
  },
  attached: function () {
    wx.setStorageSync('lastTime', '0');
    wx.setStorageSync('maxTime', '0');
    videoCtx = wx.createVideoContext('myVideo', this)
    // 初始化toast
    new app.WeToast(this)
    studyPlayerManager.initStudyPlayerManager(this)
  },
  moved: function () {
    
  },
  detached: function () {
    studyPlayerManager.deallocStudyPlayerManager()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    play() {
      videoCtx.play()
    },
    pause() {
      videoCtx.pause()
    },
    timeUpdate(e) {
      this.triggerEvent("videoTimeUpdate", e.detail.currentTime)
      var maxTime = parseInt(wx.getStorageSync('maxTime'));
      console.log('maxTime:' + maxTime);
      var lastTime = parseInt(wx.getStorageSync('lastTime'));
      console.log('lastTime:' + lastTime);
      currentTime = e.detail.currentTime;
      console.log('currentTime:' + currentTime)
      if (currentTime != 0 && ((currentTime - lastTime) < 3)) {
        wx.setStorageSync('lastTime', currentTime);
      }
      if (currentTime != 0 && currentTime > maxTime && (((currentTime - lastTime) > 0) && ((currentTime - lastTime) < 3))) {
        wx.setStorageSync('maxTime', currentTime);
        console.log('设置最大时间！')
      }
      if (!this.data.isTest && currentTime > maxTime) {
        if ((currentTime - lastTime) > 3) {
          //跳转到上次的进度
          videoCtx.seek(maxTime);
          wx.setStorageSync('lastTime', maxTime);
          this.wetoast.toast({
            title: '不能进行跳转！请认真学习'
          })
        }
      }
    },
    endAction(e) {
      let maxTime = parseInt(wx.getStorageSync('maxTime'));

      if (!this.data.isTest && ((this.properties.totalSecondsTime - maxTime) > 3)) {
        this.wetoast.toast({
          title: '不能进行跳转！请认真学习'
        })
        videoCtx.seek(maxTime)
        videoCtx.play()
      }else{
        this.triggerEvent("videoPlayEndEvent")
        this._playEndAction()
      }
    },
    fullScreenChangeAction(e) {
      console.log(e)
    },
    changeScreenTap() {
      this.videoCtx.requestFullScreen({ direction: 90 })
    },
    // 跳转到某个点
    seekToPoint(time){
      console.log('跳转到时间：'+time)
      videoCtx.seek(time)
    }
  }
})
