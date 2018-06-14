// pages/order/orderList/listCellComponent/listCellComponent.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderItem: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
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
    cellClickAction(event) {
      wx.navigateTo({
        url: "/pages/order/orderDetail/orderDetail?orderNo=" + this.properties.orderItem.orderNo,
      })
    },
    // 底部按钮事件
    /**
     * 组件的方法列表
     */
    buttonAction(event) {
      let detail = {
        item: this.properties.orderItem
      }
      switch (event.target.dataset.buttonType) {
        case 'seeRefund': {
          detail.item = this.properties.orderItem.subOrderList[0]
          this.triggerEvent("seeRefundEvent",detail)
          break
        }
        case 'changeClassRecord': {
          detail.item = this.properties.orderItem.subOrderList[0]
          this.triggerEvent("changeClassRecordEvent", detail)
          break
        }
        case 'relevanceOrder': {
          detail.item = this.properties.orderItem.subOrderList[0]
          this.triggerEvent("relevanceOrderEvent", detail)
          break
        }
        case 'cancelOrder': {
          this.triggerEvent("cancelOrderEvent", detail)
          break
        }
        case 'goToPay': {
          this.triggerEvent("goToPayEvent", detail)
          break
        }
        case 'completeDistributionInfo': {
          this.triggerEvent("completeInfoEvent", detail)
          break
        }
      }
    },
    goToSeeTrainingContentAction(event){
      let contentList = this.properties.orderItem.subOrderList
      wx.navigateTo({
        url: '/pages/order/orderTrainingContentList/orderTrainingContentList?trainingContentList=' + JSON.stringify(contentList),
      })
    }
  }
})
