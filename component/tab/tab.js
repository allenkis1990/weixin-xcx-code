// component/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navTab:{
      type:Array,
      value:[]
    },
    currentIndex:{
      type:Number,
      value:0
    }
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
    tabClick(e){
      var idx=e.currentTarget.dataset.idx
      this.setData({
        currentIndex:idx
      })
      this.triggerEvent("tabClick",idx)
    }
  }
})
