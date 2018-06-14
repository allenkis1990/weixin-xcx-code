let _compData = {
  '_hintdailog_.isShow': false,
  '_hintdailog_.title': '',
  '_hintdailog_.right': '',
  '_hintdailog_.left': ''
}

let _compEvent = {
  _hintdialog_show: function () {
    this.setData({ '_hintdailog_.isShow': true })
  },
  _hintdialog_right: function () {
    typeof this.hintDialog._config.rightbtn == "function" &&
      this.hintDialog._config.rightbtn()
  },
  _hdialogpanel_left: function () {
    typeof this.hintDialog._config.leftbtn == "function" &&
      this.hintDialog._config.leftbtn()
  }
}

/**
 * 暴露方法
 */
let hintDialog = {
  // 显示
  show: function (data) {
    this._page.setData({
      '_hintdailog_.isShow': true,
      '_hintdailog_.title': data.title,
      '_hintdailog_.right': data.right,
      '_hintdailog_.left': data.left
    })
    if (data) {
      Object.assign(this._config, data)
    }
  },
  // 隐藏
  hide: function (data) {
    this._page.setData({ '_hintdailog_.isShow': false })
  }
}

function HintDialog() {
  this._config = {
    rightbtn: null,
    leftbtn: null
  }
  // 拿到当前页面对象
  let pages = getCurrentPages()
  let curPage = pages[pages.length - 1]

  // 把组件的事件“合并到”页面对象上
  Object.assign(curPage, _compEvent)

  this._page = curPage

  //附加到page上，方便访问

  Object.assign(this, hintDialog)

  curPage.hintDialog = this

  //把组件的数据“注入”到页面的data对象中
  curPage.setData(_compData)
  return this
}


module.exports = {
  HintDialog
} 