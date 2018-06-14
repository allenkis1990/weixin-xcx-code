let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    windowHeight: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
      }
    },
    trainingClassList: {
      type: Array,
      value: 0,
      observer: function (newVal, oldVal) {
      }
    },
    isFinish:{
      type:Boolean,
      value:false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    
  },
  attached() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * item选中事件
     */
    itemCellClickAction(event) {
      let item = event.currentTarget.dataset.currentItem
      wx.setStorageSync("goodItem", JSON.stringify(item))
      wx.navigateTo({
        url: '/pages/findtraining/trainingDetail/trainingDetail?categoryType=TRAINING_CLASS_GOODS' + '&trainingItem=' + JSON.stringify(item)
      })
    },
  }
})
