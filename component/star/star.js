Component({
  /**
   * 组件的属性列表
   */
  properties: {
     key:{
       type:Number,
       value:0
     },
     size:{
       type: Number,
       value: 40
     },
     clickSwitch:{
       type:Boolean,
       value:false
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
    stars:[0,1,2,3,4],
    normalSrc: '/image/star-gray.png',
    selectedSrc:'/image/star.png',
    halfSrc:'/image/star-half.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectLeft: function (e) {
      if (this.properties.clickSwitch==false) return
      var key = e.currentTarget.dataset.key
      if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
        //只有一颗星的时候,再次点击,变为0颗
        key = 0;
      }
      console.log("得" + key + "分")
      this.setData({
        key: key
      })
    },
    //点击左边,整颗星
    selectRight: function (e) {
      if (this.properties.clickSwitch == false) return
      var key = e.currentTarget.dataset.key
      if (this.data.key == 1 && e.currentTarget.dataset.key == 1) {
          //只有一颗星的时候,再次点击,变为0颗
          key = 0;
      }
      console.log("得" + key + "分")
      this.setData({
        key: key
      })
    }
  }
})
