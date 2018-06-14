// component/authorizationDialog/authorizationDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    image: {
      type: String,
      value: '/image/user-img.jpg'
    },
    title: {
      type: String,
      value: '华博教育6.0申请获得以下权限：'
    },
    content: {
      type: String,
      value: '获得你的公开信息（昵称、头像等）'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this.setData({
        isShow: true
      })
    },
    hide() {
      this.setData({
        isShow: false
      })
    },

    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _refuselEvent() {
      //触发取消回调
      this.triggerEvent("refuselEvent")
    },
    _allowEvent(res) {
      //触发成功回调
      if (res.detail.rawData != undefined){
        this.triggerEvent("allowEvent");
      }else{
        this.triggerEvent("refuselEvent")
      }
    }
  },

  doNoting(){

  }
  
})
