// pages/trainclass/trainingClassEmpty/trainingClassEmpty.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
      * 点击事件--扫一扫
      */
    scanClick: function () {
      this.setData({
        centerType: 1
      })
      require('../../scanModule/scanUtil.js').scan()
    },
    goFindTrainingAction () {
      wx.switchTab({
        url: '/pages/findtraining/trainingList/trainingList'
      })
    }
  }
})
