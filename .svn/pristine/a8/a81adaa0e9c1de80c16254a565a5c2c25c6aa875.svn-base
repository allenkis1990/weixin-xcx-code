// pages/order/orderList/closeListComponent/closeListComponent.js
let app = getApp()
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
    isFinish: true
  },
  attached() {
    this.refreshData()
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
        orderStatus: 'TRADE_CLOSE',
        propertyQueries: []
      }
      app.requestData(app.config.orderList, params, 'GET').then(function (response) {
        if (response.head.code == app.constant.network_result_success) {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
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
    }
  }
})
