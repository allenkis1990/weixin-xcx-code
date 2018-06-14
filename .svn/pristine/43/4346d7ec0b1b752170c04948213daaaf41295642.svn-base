// pages/findtraining/trainingDetail/yearPickerComponent/yearPickerComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    yearDataSource: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal.length) {
          this.getDefaultSelectedData()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    addressMenuIsShow: false,
    value: [0],
    selectedIndex: -1,
    selectedValue: {}
  },
  attached() {
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show: function () {
      var that = this
      // 如果已经显示，不在执行显示动画
      if (that.data.addressMenuIsShow) {
        return
      }
      // 执行显示动画
      that.startAddressAnimation(true)
    },
    startAddressAnimation: function (isShow) {
      console.log(isShow)
      var that = this
      if (isShow) {
        that.animation.translateY('0%').step()
      } else {
        that.animation.translateY('100%').step()
      }
      that.setData({
        animationAddressMenu: that.animation.export(),
        addressMenuIsShow: isShow,
      })
    },
    // 点击地区选择取消按钮
    canceleAction: function (e) {
      this.startAddressAnimation(false)
    },
    // 点击地区选择确定按钮
    confirmAction: function (e) {
      this.startAddressAnimation(false)
      let detail = {
        value: this.data.selectedValue,
        index: this.data.selectedIndex
      }
      this.triggerEvent("confirmEvent", detail);
    },
    // 点击蒙版时取消组件的显示
    hideAction: function (e) {
      this.startAddressAnimation(false)
    },
    // 处理滑动事件
    valueChangeAction: function (e) {
      let index = e.detail.value[0]
      let item = this.properties.yearDataSource[index]
      this.setData({
        selectedIndex: index,
        selectedValue: item
      })
    },
    getDefaultSelectedData() {
      let index = 0
      let item = this.properties.yearDataSource[0]
      this.setData({
        selectedIndex: index,
        selectedValue: item
      })
    },
    pickerViewClickAction() {

    }
  }
})
