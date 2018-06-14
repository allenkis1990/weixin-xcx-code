var app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courseList:{
      type:Array,
      value:[],
      observer: function (newVal, oldVal) {
        if (newVal.length > 0) {
          this.setData({
            currentItem: newVal[0]
          })
        }
      },
    },
    hasAutomaticSign:{
      type:Boolean,
      value:false,
      observer: function (newVal, oldVal) {
        debugger
        console.log('[component--observer]hasAutomaticSign' + newVal)
      },
    },
    lng: {
      type: Number,
      value: 0.0
    },
    lat: {
      type: Number,
      value: 0.0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentItem:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   *网络请求-签退
   */
    requestCourseSignOut() {
      console.log("[courseComponent]hasAutomaticSign的值" + this.properties.hasAutomaticSign)
      let params = {
        planItemId: this.data.currentItem.planItemId,
        appRegisterKey: this.data.currentItem.appRegisterKey,
        pointKey: this.data.currentItem.pointKey,
        lng: this.properties.lng,//经度
        lat: this.properties.lat,//维度
        signType: 1              //签到类型  1  表示手机应用
      }
      wx.showLoading({ title: '加载中......', mask: true })
      app.requestData(app.config.lineCourseSign, params, "POST").then(data => {
        wx.hideLoading()
        /**
         * 签到结果码，
         * 200 签到成功，
         * 300 已签到，
         * 400 签到时间无效，
         * 402 签到地点无效
         */
        if (data.head.code === 300) {
          if (!this.properties.hasAutomaticSign) {
            wx.showToast({
              title: "签退成功，无需重复操作",
              icon: 'none'
            });
            return
          }
          console.log("签退状态："+21)
          this.triggerEvent("signResultState", 21)
        } else if (data.head.code === 400) {
          if (!this.properties.hasAutomaticSign) {
            wx.showToast({
              title: "当前不在可签退时段",
              icon: 'none'
            });
            return
          }
          console.log("签退状态：" + 22)
          this.triggerEvent("signResultState", 22)
        } else if (data.head.code === 402) {
          if (!this.properties.hasAutomaticSign) {
            wx.showToast({
              title: "当前不在可签退的区域，请根据要求到达指定地点进行签退",
              icon: 'none'
            });
            return
          }
          console.log("签退状态：" + 23)
          this.triggerEvent("signResultState", 23)
        }else if (data.head.code === app.constant.network_result_success) {
          //网络请求失败
          if (!this.properties.hasAutomaticSign) {
            wx.showToast({
              title: '签退成功！',
              icon: 'none'
            });
          }
          console.log("签退状态：" + 20)
          this.triggerEvent("signResultState" ,20)
        } else {
          if (!this.properties.hasAutomaticSign){
            wx.showToast({
              title: data.head.message,
              icon: 'none'
            });
          }
          console.log("签退状态：" + 24)
          this.triggerEvent("signResultState", 24)
        }
      }).catch(e => {
        wx.hideLoading()
        console.log(e)
      })
    },
    /**
     *网络请求-签到
     */
    requestCourseSignIn() {
      console.log("[courseComponent]hasAutomaticSign的值" + this.properties.hasAutomaticSign)
      let params = {
        planItemId: this.data.currentItem.planItemId,
        appRegisterKey: this.data.currentItem.appRegisterKey,
        pointKey: this.data.currentItem.pointKey,
        lng: this.properties.lng,//经度
        lat: this.properties.lat,//维度
        signType: 1
      }
      wx.showLoading({ title: '加载中......', mask: true })
      app.requestData(app.config.lineCourseSign, params, "POST").then(data => {
        wx.hideLoading()
        if (data.head.code === 300) {
          if (!this.properties.hasAutomaticSign) {
            this.triggerEvent("signResultState", 11)
            wx.showToast({
              title: "签到成功，无需重复操作",
              icon: 'none'
            });
          }
          console.log("签到状态：" + 11)
          this.triggerEvent("signResultState", 11)
        } else if (data.head.code === 400) {
          if (!this.properties.hasAutomaticSign) {
            wx.showToast({
              title: "当前不在可签到时段，无法签到",
              icon: 'none'
            });
          }
          console.log("签到状态：" + 12)
          this.triggerEvent("signResultState", 12)
        } else if (data.head.code === 402) {
          if (this.properties.hasAutomaticSign) {
            wx.showToast({
              title: "当前不在可签到的区域，请根据要求到达指定地点进行签到",
              icon: 'none'
            });
          }
          console.log("签到状态：" + 13)
          this.triggerEvent("signResultState", 3)
        } else if (data.head.code === app.constant.network_result_success) {
          if (!this.properties.hasAutomaticSign) {
            wx.showToast({
              title: '签到成功!',
              icon: 'none'
            });
          }
          console.log("签到状态：" + 10)
          this.triggerEvent("signResultState", 10)
        } else {
          if (!this.properties.hasAutomaticSign) {
            wx.showToast({
              title: data.head.message,
              icon: 'none'
            });
          }
          console.log("签到状态：" + 14)
          this.triggerEvent("signResultState", 14)
        }
      }).catch(e => {
        wx.hideLoading()
        console.log(e)
      })
    },
    /**
     * 点击事件---签到
     */
    signInClick(e){
      var item = e.currentTarget.dataset.item
      if (item.signState == 1) {
        return wx.showToast({
          title: '已经签到，无需重复操作！',
          icon: 'none'
        })
        
      }
      this.setData({
        currentItem:item
      })
      this.requestCourseSignIn()
      },
    /**
     * 点击事件---签退
     */
    signOutClick(e){
      var item = e.currentTarget.dataset.item
      if (item.signState==1){
        return wx.showToast({
          title: "已经签退，无需重复操作！",
          icon:'none'
        })
        
      }
      this.setData({
        currentItem: item
      })
      this.requestCourseSignOut()
    },
    /**
     * 提供外部调用---签到事件
     */
    signEvent(point){
      debugger
      console.log('签到类型：' + point.signType)
      if (point.signType==1){
        this.requestCourseSignIn(point)
      }else{
        this.requestCourseSignOut(point)
      }
    }
  }
})
