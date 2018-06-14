// component/alert/alert.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      value: ''
    },
    duration:{
      type:String,
      value:1000
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
    show(str) {
      this.setData({
        isShow:true,
        content:str
      })
      var duration = this.properties.duration
      var _this=this
      setTimeout(function(){
        _this.hide()
      }, duration)
    },
    hide() {
      this.setData({
        contetnt: '',
        isShow: false
      })
    }
  }
})
