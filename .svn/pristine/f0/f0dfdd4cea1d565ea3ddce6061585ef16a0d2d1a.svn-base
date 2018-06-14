var app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    trainingClassList:{
      type:Array,
      value:[],
      observer: function (newVal, oldVal) {
        if(newVal.length>0){
          this.setData({
            currentItem: newVal[0]
          })
        }
      },
    },
    hasAutomaticUse:{
      type:Boolean,
      value:false
    },
    isShow:{
      type: Boolean,
      value: false
    },
    restaurantId:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex:0,
    currentItem:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   *网络请求-提交餐券
   */
    requestSubmitMealTicket() {
      if (this.data.currentItem.trainingClassId == '' || this.data.restaurantId==''){
        return
      }
      if (this.data.currentItem.remainderMealTicketNum<=0){
        return wx.showToast({
          title: '该班级餐券已用完',
          icon:'none'
        })
      }
      let params = {
        trainingClassId: this.data.currentItem.trainingClassId,
        restaurantId: this.data.restaurantId
      }
      wx.showLoading({ title: '加载中......', mask: true })
      app.requestData(app.config.mealTicketSubmit, params, "GET").then(data => {
        wx.hideLoading()
        if (data.head.code === app.constant.network_result_success) {
          //0:没有可用餐券 | 1:成功使用餐券 | 2:已经使用过（30分钟后可再次使用）| 3:餐券已用完 | 4：餐券使用时段已过期
          if (data.data.status==0){
            this.triggerEvent("useResultState", 0, this.data.currentIndex)
          } else if (data.data.status == 1){
            this.triggerEvent("useResultState", 1, this.data.currentIndex)
            if (!this.properties.hasAutomaticUse) {
              wx.showToast({
                title: "餐券使用成功",
                icon: 'none'
              });
            }
            this.triggerEvent("useMealTicketTime", data.data.useMealTicketTime)
          } else if (data.data.status == 2) {
            wx.showToast({
              title: '已经使用过,30分钟后可再次使用!',
              icon:'none'
            })
          } else if (data.data.status == 3) {
            this.triggerEvent("useResultState", 3, this.data.currentIndex)
          } else if (data.data.status == 4) {
            this.triggerEvent("useResultState", 4, this.data.currentIndex)
          }
         
        }else{
          if (this.properties.hasAutomaticUse) {
            this.triggerEvent("useResultState", 5)
          } else {
            wx.showToast({
              title: "餐券使用失败",
              icon: 'none'
            });
            this.triggerEvent("useResultState", 5)
          }
        }
      }).catch(e => {
        wx.hideLoading()
        console.log(e)
      })
    },
    /**
     * 提供外部调用---使用餐券事件
     */
    useMealTicketEvent(){
      this.requestSubmitMealTicket()
    },
    itemClick(e){
      var index=e.currentTarget.dataset.index
      var item=e.currentTarget.dataset.item
      this.setData({
        currentItem: item,
        currentIndex:index
      })
    }
  }
})
