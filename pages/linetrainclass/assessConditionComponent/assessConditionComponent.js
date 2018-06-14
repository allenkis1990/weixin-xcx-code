Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classInfo: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (newVal.assessInformation) {
          if (newVal.haveExam){
            this.setData({
              scrollViewTopDistance: 480
            })
          }else{
            this.setData({
              scrollViewTopDistance: 390
            })
          }
          // this.setData({
          //   signLocation: location,
          // })
          // this.resetSignLocationData();
        }

      }
    },
    hasExam: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.setData({
            scrollViewTopDistance: 480
          })
        } else {
          this.setData({
            scrollViewTopDistance: 390
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hasExam: false,
    signLocation: {
      latitude: 0,
      longitude: 0
    },
    markers: [],
    circles: [],
    // 页面配置   
    winWidth: 0,
    winHeight: 0,
    mapTop: "0rpx",
    rpxScale: 0,
    isShowMap: true,
    scrollViewTopDistance: 480
  },
  attached: function () {
    // 获取系统信息 
    let context = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        context.setData({
          rpxScale: (750 / res.windowWidth),
          winWidth: res.windowWidth,
          winHeight: res.windowHeight * (750 / res.windowWidth)
        });
      }
    });
  },
  ready() {
    var query = wx.createSelectorQuery().in(this)
    query.select('#map-container').boundingClientRect(function (res) {
    }).exec()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    regionChangeAction(event) {
    },
    scrollingAction(event) {
      let context = this
      context.setData({
        mapTop: "0rpx"
      })
      var query = wx.createSelectorQuery().in(this)
      query.select('#map-container').boundingClientRect(function (res) {
        let rpxTop = res.top * context.data.rpxScale
        if (rpxTop < context.data.scrollViewTopDistance) {
          context.setData({
            isShowMap: false
          })
        } else {
          context.setData({
            isShowMap: true
          })
        }
      }).exec()
    },
    resetSignLocationData() {
      let showCircles = [
        {
          color: "#188BF1AA",
          radius: this.data.classInfo.assessInformation.signRulesObj.locationRulesInstance,
          fillColor: "#FFFFFF00",
          strokeWidth: 1
        }
      ]
      let showMarkers = [{
        iconPath: "/image/icon-position.png",
        id: 0,
        width: 12,
        height: 20,
        callout: {
          content: this.data.classInfo.classLocation,
          color: "#000000FF",
          fontSize: 10,
          borderRadius: 5,
          bgColor: "#FFFFFFFF",
          padding: 5,
          textAlign: "center",
          display: "ALWAYS"
        }
      }]
      this.setData({
        markers: showMarkers,
        circles: showCircles
      })
    }
  }
})
