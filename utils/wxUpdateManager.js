
function forceUpdate() {
  try {
    const updateManager = wx.getUpdateManager();
    // 请求完新版本信息的回调
    updateManager.onCheckForUpdate(function (res) {
      let version = res.hasUpdate ? '有新版本待更新' : '最新版本'
      console.log(version);
    })

    //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    updateManager.onUpdateReady(function () {
      // wx.showModal({
      //   title: '更新提示',
      //   content: '新版本已经准备好，是否重启应用？',
      //   success: function (res) {
      //     if (res.confirm) {
      //       updateManager.applyUpdate()
      //     }
      //   }
      // });
      updateManager.applyUpdate()
    })

    // 新的版本下载失败
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '新的版本下载失败, 请重新安装小程序',
        icon: 'success',
        duration: 2000
      });
    })
  } catch (e) {
    console.log(e)
  }
}//end forceUpdate

module.exports = {
  forceUpdate: forceUpdate
}