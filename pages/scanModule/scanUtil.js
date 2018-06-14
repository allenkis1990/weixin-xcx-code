function scan() {
  wx.scanCode({
    onlyFromCamera: true,
    scanType: ["qrCode"],
    success: (res) => {
      if (res.result) {
        scanNavigateToUrl(res)
      } else {
        wx.showToast({
          ttitle: '扫描失败',
          icon: 'none'
        })
      }
    },
    fail: (res) => {
      wx.showToast({
        title: '扫描失败',
        icon: 'none'
      })
    }
  })
}

function scanNavigateToUrl(res) {
  var app=getApp()
  console.log(res)
  var params = app.utils.analysisUrl(res.result).params
  var url = ''
  if (params[0] !== undefined && params[0] !== '') {
    if (params[0].type == 1) {
      if (params.length < 3) {
        return
      }
      //课程签到
      url = "/pages/scanModule/sign/signResult/signResult?id=" + params[1].id + '&key=' + params[2].key
    } else if (params[0].type == 2) {
      if (params.length < 2) {
        return
      }
      //使用餐券餐券
      url = "/pages/scanModule/mealticket/mealTicketResult/mealTicketResult?id=" + params[1].id
    }
    wx.navigateTo({
      url: url
    })
  }
}

module.exports = {
  scan: scan,
}