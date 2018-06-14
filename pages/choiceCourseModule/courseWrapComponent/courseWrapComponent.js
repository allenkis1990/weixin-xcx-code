// pages/choiceCourseModule/courseWrapComponent/courseWrapComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courseWrapList:{
      type:Array,
      value:[]
    },
    currentWrapId:{
      type:String,
      value:''
    },
    optionalPackageRequires: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      hasShow:false,
      animationTime: 200
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemClick(e){
      var dataset=e.currentTarget.dataset
      this.triggerEvent("courseWrapClick",dataset)
      this.close()
    },
    close() {
      this.animationAction('close')
    },
    show() {
      this.animationAction('open')
    },
    animationAction(currentStatu) {
      /* 动画部分 */
      // 第1步：创建动画实例   
      var animation = wx.createAnimation({
        duration: 0,  //动画时长  
        timingFunction: "linear", //线性  
        delay: 0  //0则不延迟  
      });

      // 第2步：这个动画实例赋给当前的动画实例  
      this.animation = animation;

      // 第3步：执行第一组动画  透明度变为0，并进行在x轴旋转一个deg角度
      animation.opacity(0).rotateX(0).step();

      // 显示  
      if (currentStatu == "open") {
        this.setData(
          {
            hasShow: true,
          }
        );
      }

      // 第4步：导出动画对象赋给数据对象储存  
      this.setData({
        animationData: animation.export()
      })

      // 第5步：设置定时器到指定时候后，执行第二组动画  
      setTimeout(function () {
        //关闭  
        if (currentStatu == "close") {
          this.setData(
            {
              hasShow: false,
            }
          );
        } else {
          //透明度变为1，并进行在Y轴旋转一个deg角度（0 显示出来）
          animation.opacity(1).rotateX(0).step();
          // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
          this.setData({
            animationData: animation
          })
        }
      }.bind(this), 0)
    }
  }
})
