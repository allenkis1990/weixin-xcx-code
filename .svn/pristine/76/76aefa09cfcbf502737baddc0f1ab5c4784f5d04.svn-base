Component({
  behaviors: [],
  properties: {
    circlePercentage: {
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
      // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串
      observer: function (newVal, oldVal) {
        this.drawContex(newVal)
      }
    },
    circleSize:{
      type: Number,
      value: 30,
      observer: function (newVal, oldVal) {

      }
    }
  },
  data: {}, 
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    this.drawContex(this.properties.circlePercentage);
  },
  moved: function () {

  },
  detached: function () { },
  methods: {
    onMyButtonTap: function () {
      this.setData({
        // 更新属性和数据的方法与更新页面数据的方法类似
      })
    },
    drawContex(percentageValue) {
      // 页面渲染完成 
      let centerPoint = this.properties.circleSize
      var cxt_arc = wx.createCanvasContext('canvasArc', this);//创建并返回绘图上下文context对象。 
      cxt_arc.setLineWidth(1);
      cxt_arc.setStrokeStyle('#d2d2d2');
      cxt_arc.beginPath();//开始一个新的路径 
      cxt_arc.arc(centerPoint + 1, centerPoint + 1, centerPoint, 0, 2 * Math.PI, false); 
      cxt_arc.stroke();//对当前路径进行描边 

      cxt_arc.setLineWidth(1);
      cxt_arc.setStrokeStyle('red');
      cxt_arc.beginPath();//开始一个新的路径 
      cxt_arc.arc(centerPoint + 1, centerPoint +1, this.properties.circleSize - 3, 0 ,2 * Math.PI * percentageValue, false);
      cxt_arc.lineTo(centerPoint + 1, centerPoint + 1);
      cxt_arc.stroke();//对当前路径进行描边  
      cxt_arc.setFillStyle('red')
      cxt_arc.fill();
      cxt_arc.draw(false);
    }
  }
})