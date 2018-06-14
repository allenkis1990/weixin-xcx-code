/**
 * WeToast by kiinlam
 * WeApp Toast add-ons
 * 微信小程序toast增强插件
 * Github: https://github.com/kiinlam/wetoast
 * LICENSE: MIT
 */

function AlertMessageClass(context) {

  //构造函数
  function AlertMessage() {
    let pages = getCurrentPages()
    let curPage = pages[pages.length - 1]
    if (context) {
      this.__page = context
      context.alertmessage = this
    }else{
      this.__page = curPage
    }
    this.__timeout = null
    //附加到page上，方便访问
    curPage.alertmessage = this

    return this
  }

  //切换显示/隐藏
  AlertMessage.prototype.message = function (data) {
    try {
      if (!data) {
        this.hide()
      } else {
        this.show(data)
      }
    } catch (err) {
      console.error(err)

      // fail callback
      data && typeof data.fail === 'function' && data.fail(data)
    } finally {
      // complete callback
      data && typeof data.complete === 'function' && data.complete(data)
    }
  }

  //显示
  AlertMessage.prototype.show = function (data) {
    let page = this.__page

    clearTimeout(this.__timeout)

    //display需要先设置为block之后，才能执行动画
    page.setData({
      '__alertmessage__.reveal': true
    })

    // setTimeout(() => {
    //   let animation = wx.createAnimation()
    //   animation.opacity(1).step()
    //   data.animationData = animation.export()
      
    // }, 0)   // 背景图的动画效果时间

    data.reveal = true
    page.setData({
      __alertmessage__: data
    })
    
    if (data.duration === 0) {
      // success callback after toast showed
      setTimeout(() => {
        typeof data.success === 'function' && data.success(data)
      }, 430) 
    } else {
      this.__timeout = setTimeout(() => {
        this.message()

        // success callback
        typeof data.success === 'function' && data.success(data)
      }, (data.duration || 1000) + 400) //alert显示时间
    }

  }

  //隐藏
  AlertMessage.prototype.hide = function () {
    let page = this.__page

    clearTimeout(this.__timeout)

    if (!page.data.__alertmessage__.reveal) {
      return
    }

    let animation = wx.createAnimation()
    animation.opacity(0).step()
    page.setData({
      '__alertmessage__.animationData': animation.export()
    })

    setTimeout(() => {
      page.setData({
        __alertmessage__: { 'reveal': false }
      })
    }, 400)
  }

  return new AlertMessage()
}

module.exports = {
  AlertMessage: AlertMessageClass
}