// pages/map/classInformationComponent/classInformationComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hasExam: {
      type: Boolean,
      value: false
    },
    classInfo: {
      type: Object,
      value: {},

    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready: function (options) {
    this.toast = this.selectComponent("#toast")
  },
  /**
   * 组件的方法列表
   */
  methods: {
    callTelPhoneAction() {
      let context = this
      wx.makePhoneCall({
        phoneNumber: context.data.classInfo.headmasterTelNumber,
        success: function (res) {

        },
        fail: function (res) {

        },
        complete: function (res) {

        }
      })
    }
  }
})
