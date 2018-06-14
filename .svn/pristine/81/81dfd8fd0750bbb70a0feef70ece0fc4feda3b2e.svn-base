//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    objectUrl: '/pages/account/loginFail/loginFail',
    id: ''
  },
  onLoad: function (options) {
    if (options.objectUrl !== undefined && options.objectUrl !== '') {
      this.setData({
        objectUrl: options.objectUrl
      })
    }

    if (options.q!=undefined){
      var url = decodeURIComponent(options.q)
      console.log(url)
      var params = app.utils.analysisUrl(url).params
      if (params[0] !== undefined && params[0] !== '') {
        if (params[0].type == 1) {
          if (params.length >= 3) {
            //课程签到
            this.setData({
              objectUrl: "/pages/scanModule/sign/signResult/signResult?id=" + params[1].id + '&key=' + params[2].key
            })
          }
        } else if (params[0].type == 2) {
          if (params.length >= 2) {
            //使用餐券餐券
            this.setData({
              objectUrl: "/pages/scanModule/mealticket/mealTicketResult/mealTicketResult?id=" + params[1].id
            })
          }
        }
      }
    }

    
    this.centerPage()
  },
  centerPage() {
    wx.hideLoading()
    var _this = this
    //尝试读取用户信息
    wx.setStorage({
      key: 'objectUrl',
      data: this.data.objectUrl
    })
    app.requestData(app.config.getUserInfo, {}, "GET").then(data => {
      if (data.head.code === app.constant.network_result_success) {
        app.userInfo = data.data.userInfo
        console.log("[onLaunch] 场景值:", app.scene)
        wx.reLaunch({
          url: '/pages/account/loginFail/loginFail',
        })
      } 
    }).catch(e => {
      console.log(e)
    })
  },


})
