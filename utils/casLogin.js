/**
   * 登录页
   */
function loginWithWX(loginResultCallback,userId){
  let casConfig = getApp().config.casConfig //CAS配置
  let loginUrl = casConfig.loginUrl
  let ssoUrl = casConfig.ssoUrl
  let casUrl = casConfig.casHost
  let serverUrl = casConfig.trainPlatformHost
  // 【第一步】url
  let firstUrl = casUrl + loginUrl
  let target = serverUrl + ssoUrl
  //debugger
  let requestUrl = firstUrl + '?' + 'TARGET=' + target + '&' + 'js=' + '' + '&' + 'uidsso=true&withasyn=true'
  //console.log(requestUrl)
  //请求第1步
  wx.request({
    url: requestUrl,
    success: function (res) {
      if (res.statusCode === 200) {
        analysisCasFirstResult(res.data, loginResultCallback,userId)
      } else {
        //请求失败的处理
        loginResultCallback(-1, '网络异常')
      }
    },
    fail: function (res) {
      console.log(res)
      //请求失败的处理
      loginResultCallback(-1, '网络异常')
    }
  })
} 

function analysisCasFirstResult(responseData, loginResultCallback,userId) {
  //console.log(responseData)
  let index = responseData.indexOf('ssoLogin=')
  if (index < 0) {
    console.log('cas第一步请求返回格式有误.')
    //请求失败的处理
    loginResultCallback(-1, '网络异常')
  } else {
    index += 'ssoLogin='.length
    let ssoLogin = responseData.substring(index, responseData.indexOf("}", index) + 1)
    ssoLogin = ssoLogin.replace("lt:", "\"lt\":")
    ssoLogin = ssoLogin.replace("execution:", "\"execution\":")
    ssoLogin = ssoLogin.replace("eventId:", "\"eventId\":")
    ssoLogin = JSON.parse(ssoLogin)
    //console.log(ssoLogin.lt)

    //再次为下一步骤组合参数
    ssoLogin._eventId = ssoLogin.eventId
    ssoLogin.loginIdType = '1'
    ssoLogin.type = 43
    ssoLogin.figureUrl100 = ''
    ssoLogin.figureUrl50 = ''
    ssoLogin.gender = 0
    //ssoLogin.extAttribute = '{\'portalType\':\'mall\'}'


    let casConfig = getApp().config.casConfig //CAS配置




    if(userId){
        ssoLogin.accessToken = casConfig.accessToken
        //ssoLogin.unionId = casConfig.unionId
        //ssoLogin.openId = casConfig.openId
        ssoLogin.userId = userId

        //ssoCb=loginCallback&jsonp=ssoCb&callback=ssoCb
        ssoLogin.ssoCb = 'loginCallback'
        ssoLogin.jsonp = 'ssoCb'
        ssoLogin.callback = 'ssoCb'

        index = responseData.indexOf("url: \'")
        index += 'url: \''.length
        let url = responseData.substring(index, responseData.indexOf("\',", index))
        //为了适配测试环境，下面将URL做修改。将域名做替换
        //url = url.replace('appssotest2.59iedu.com:8443', 'appssov1.59iedu.com/test2')
        index = url.indexOf('/','https://'.length)
        url = casConfig.casHost + url.substring(index, url.length)
        //console.log(url)

        //console.log(ssoLogin)
        //请求第2步
        wx.request({
            url: url,
            method: 'GET',
            data: ssoLogin,
            success: function (res) {
                if (res.statusCode === 200) {
                    analysisCasSecondResult(res.data,loginResultCallback)
                } else {
                    //请求失败的处理
                    loginResultCallback(-1, '网络异常')
                }
            },
            fail: function (res) {
                //请求失败的处理
                loginResultCallback(-1, '网络异常')
            }
        })
    }else{
        wx.redirectTo({
            //跳转登录页
            url: '/pages/account/login/login'
        });
    }
    /*getApp().utils.getLoginUserId().then(function (data) {
      if (data.success && data.userId) {

      } else {
          wx.redirectTo({
              //跳转登录页
              url: '/pages/account/login/login'
          });
      }
    });*/
  }
}
function  analysisCasSecondResult (responseData, loginResultCallback) {
  //分析CAS第二步返回的结果
  // console.log(responseData)
  let index = responseData.indexOf('{')
  let loginCallback = responseData.substring(index, responseData.indexOf(")", index))
  loginCallback = JSON.parse(loginCallback)
  //console.log(loginCallback)
  if (loginCallback.code === 603) {
    //CAS第二步成功
    let config = getApp().config //配置
    let location = loginCallback.location
    //为了适配测试环境，下面将URL做修改。将域名做替换
    //console.log(location) 
    //location = location.replace('scjstest2https.59iedu.com:8443', 'scjs.59iedu.com/test2')
    let index = location.indexOf('/', 'https://'.length)
    location = config.apiHost + location.substring(index+1, location.length)
    //console.log(location) 

    let header = { 'X-Requested-With': "X-Requested-With"} //这个用来区分mobile请求或pc web请求        
    //请求第3步
    wx.request({
      url: location,
      method: 'GET',
      header: header,
      success: function (res) {
        console.log(res) 
        if (res.statusCode === 200 && res.data.state === true) {
          // config.trainPlatformCookie = res.header['Set-Cookie'] // 保存COOKIE值
          require('./requestUtil.js').putCookie(location,res)
          loginResultCallback(0, '登录成功')
        } else {
          //请求失败的处理
          loginResultCallback(-1, '网络异常')
        }
      },
      fail: function (res) {
        console.log(res) 
        //请求失败的处理
        loginResultCallback(-1, '网络异常')
      }
    })

  } else if (loginCallback.code === 610) {
    //TODO 帐号或密码有误
    loginResultCallback(1, '帐号或密码有误')
  }
}

module.exports = {
  loginWithWX: loginWithWX
}
