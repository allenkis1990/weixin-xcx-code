// component/customModal/customModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "提示"
    },
    content: {
      type: String,
      value: "提示内容"
    },
    cancelText: {
      type: String,
      value: "取消"
    },
    confirmText: {
      type: String,
      value: "确认"
    },
    buttonFontSize: {
      type: Number,
      value: 32
    },
    contentFontSize: {
      type: Number,
      value: 34
    },
    modalType: {
      type: String,
      value: "modal"
    },
    isShowCancel: {
      type: Boolean,
      value: true
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    butonFontSizeString: "32rpx",
    contentFontSizeString: "34rpx",
    richTextContext: "<div>亲爱的学员，请再次确认您的个人信息无误。<br>HEHEHEHEH<br>哈哈哈哈</div>",
    isShow: false
  },
  /**
   * 组件的方法列表
   */
  attached: function () {
    this.setData({
      butonFontSizeString: this.properties.buttonFontSize + 'rpx',
      contentFontSizeString: this.properties.contentFontSize + 'rpx'
    })
  },
  methods: {
    show() {
      this.doAnimation("open")
    },
    hide() {
      this.doAnimation("close")
    },
    _cancelButtonAction(event) {
      this.hide()
      this.triggerEvent("cancelAction")
    },
    _confirmButtonAction(event) {
      this.hide()
      this.triggerEvent("confirmAction")
    },
    doAnimation(currentStatu) {
      if (currentStatu == "open") {
        this.setData({
          isShow: true
        })
      }
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: "linear",
        delay: 0,
      })
      this.animation = animation
      if (currentStatu == "open") {
        animation.opacity(0).step()
      } else {
        animation.opacity(1).step()
      }
      this.setData({
        animationData: animation.export()
      })
      let context = this
      setTimeout(function () {
        if (currentStatu == "open") {
          animation.opacity(1).step()
        } else {
          animation.opacity(0).step()
        }
        context.setData({
          animationData: animation,
        })
        setTimeout(function () {
          if (currentStatu == "close") {
            context.setData({
              isShow: false
            })
          }
        }, 500)
      }.bind(this), 500)

    }
  }
})
