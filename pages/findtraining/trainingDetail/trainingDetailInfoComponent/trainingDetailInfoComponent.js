// pages/findtraining/trainingDetail/trainingDetailInfoComponent/trainingDetailInfoComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courseDetailInfo: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {

      },
      categoryType:{
        type:String,
        value:'',
        observer: function (newVal, oldVal) {
          
        }
      },
      courseDirectoryList:{
        type: Array,
        value: '',
        observer: function (newVal, oldVal) {
          
        }
      }
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
  
  }
})
