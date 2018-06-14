// pages/order/orderList/unpayListComponent/unpayListComponent.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    loadingStatus: '',
    currentPage: 1,
    pageSize: 10,
    isLoadingData: false,
    dataSource: [],
    isFinish: true,
    isFirstLoad: true
  },
  attached() {
    this.refreshData()
    // 获取控件
    this.alert = this.selectComponent("#alert", this)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadDataSource() {
      let context = this
      if (context.data.isLoadingData) {
        return
      }
      let params = {
        pageNo: this.data.currentPage,
        pageSize: this.data.pageSize,
        orderStatus: 'WAIT_FOR_PAYMENT',
        propertyQueries: []
      }
      if (this.data.isFirstLoad) {
        wx.showLoading({
          title: '数据加载中...',
        })
      }
      app.requestData(app.config.orderList, params, 'GET').then(function (response) {
        if (context.data.isFirstLoad) {
          wx.hideLoading()
        }
        context.setData({
          isFirstLoad: false
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        if (response.head.code == app.constant.network_result_success) {
          // 停止刷新状态
          if (context.data.loadingStatus == 'refresh') {

          } else if (context.data.loadingStatus == 'loadMore') {

          }
          if (response.data.currentPageData.length >= context.data.pageSize) {
            // 有更多数据，可以加载更多
            context.setData({
              isFinish: false
            })
          } else {
            // 显示已加载全部
            context.setData({
              isFinish: true
            })
          }
          if (context.data.loadingStatus == 'refresh') {

            context.setData({
              dataSource: response.data.currentPageData
            })
            console.log(context)
          } else if (context.data.loadingStatus == 'loadMore') {

            context.data.dataSource = context.data.dataSource.concat(response.data.currentPageData)
            context.setData({
              dataSource: context.data.dataSource
            })
          }
          context.setData({
            recordPage: context.data.currentPage
          })
          context.data.currentPage++
          context.setData({
            currentPage: context.data.currentPage
          })
        } else {
          wx.showToast({
            title: response.head.message,
            icon: 'none'
          })
          // 加载失败时
          if (context.data.loadingStatus === 'refresh') {
            context.setData({
              currentPage: context.data.recordPage
            })
          }
        }
      }).catch(e => {
        if (context.data.isFirstLoad) {
          wx.hideLoading()
        }
        context.setData({
          isFirstLoad: false
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        context.data.isLoadingData = false
        if (context.data.loadingStatus === 'refresh') {
          context.data.currentPage = context.data.recordPage
        }
      })
    },
    refreshData() {
      this.setData({
        currentPage: 1,
        loadingStatus: 'refresh'
      })
      this.loadDataSource()

    },
    loadMoreData() {
      if (this.data.isFinish) {
        return
      }
      this.setData({
        loadingStatus: 'loadMore'
      })
      this.loadDataSource()
    },
    /**
     * 立即支付事件
     */
    _gotoPayAction(event) {
      let orderItem = event.detail.item;
      console.log(orderItem);

      var params={
        orderNo:event.detail.item.orderNo,
        paymentChannel:'WECHAT'
      };
      wx.showLoading({
        title: '数据加载中...'
      });
      var that=this;
      app.requestData(app.config.orderPayOrderInfo, params, 'GET').then(function(response){
        wx.hideLoading();
        if(response.head.code == app.constant.network_result_success){
            if(response.data.paymentAccountList.length>0){
              wx.navigateTo({
                url: '/pages/order/orderPay/orderPay?orderNo=' + orderItem.orderNo,
              })
            }else{
              console.log(111);
              that.triggerEvent("tipCanNotPayEvenet");
            }
        }else{
          wx.showToast({
            title: response.head.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: "数据请求失败!",
          icon: 'none'
        })
      });


    },
    /**
     * 取消订单事件
     */
    _cancelOrderAction(event) {
      let orderItem = event.detail.item
      let context = this
      // TODO调用取消订单接口
      wx.showModal({
        title: '提示',
        content: '确认取消订单？',
        success: function (res) {
          if (res.confirm) {
            context.realCancelOrder(orderItem)
          } else if (res.cancel) {
          }
        }
      })
    },
    /**
     * 确认取消订单执行事件
     */
    realCancelOrder(orderItem) {
      let context = this
      let params = {
        orderNo: orderItem.orderNo
      }
      app.requestData(app.config.orderCancle, params, 'GET').then(function (response) {
        if (response.head.code == app.constant.network_result_success) {
          wx.showToast({
            title: '订单取消成功！',
            icon: 'none'
          })
          context.triggerEvent("refreashDataEvent")
        } else {
          context.alert.show(response.head.message)
        }
      }).catch(function (error) {
        wx.showToast({
          title: "数据请求失败!",
          icon: 'none'
        })
      })
    }
  }
})
