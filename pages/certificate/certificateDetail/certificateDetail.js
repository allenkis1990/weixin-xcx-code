// pages/certificate/certificateDetail.js
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    certificateId: '',      //证书id
    certificateImageUrl: '',//证书图片地址
    certificateDetail: {},  //证书详情
    requestPicModel: {},     //证书model
    saveFilePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.certificateId !== undefined && options.certificateId.length) {
      this.setData({
        certificateId: options.certificateId
      })
    }
    this.loadCertificateDetailData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 请求证书详情信息
   */
  loadCertificateDetailData() {
    var _this = this
    wx.showLoading({
      title: '证书加载中...',
      mask: true
    })
    let param = {
      certificateId: this.data.certificateId
    }

    app.requestData(app.config.certificateDetail, param, 'GET').then(function (data) {
      if (data.head.code != app.constant.network_result_success) {
        return wx.showToast({
          title: data.head.message,
          icon: 'none'
        })
      }
      _this.setData({ certificateDetail: data.data })
      _this.generateImageUrlFirst()
    }).catch(e => {
      wx.hideLoading()
      console.log('>>' + e)
    })
  },
  /**
   * 通过证书信息以及上下文等信息去证书生成模版生成图片（或pdf等格式）图片地址资源
   */
  generateImageUrlFirst() {
    let requestPicModel = {}
    let userDetail = {}
    userDetail.uniqueId = this.GETGUID()
    userDetail.userId = app.userInfo.userId
    userDetail.platformId = app.serveContextInfo.platformId
    // requestPicModel.model = {
    //   'modelList':[this.data.certificateDetail]
    // }
    requestPicModel.model = this.data.certificateDetail
    requestPicModel.userDetail = userDetail
    requestPicModel.templateUrl = this.data.certificateDetail.templateUrl

    // requestPicModel.qrcodeText = this.data.certificateDetail.qrcodeText
    this.getPicUrl(JSON.stringify(requestPicModel))
  },
  /**
   * 网络请求---证书模版平台生成证书
   */
  getPicUrl(formData) {
    var _this = this
    let requestUrl = app.serveContextInfo.generateCerPicDomain
    wx.request({
      method: 'POST',
      url: requestUrl,
      timeout: 15000,
      data: formData,
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (response) {
        wx.hideLoading()
        if (response.data.code !== app.constant.network_result_success) {
          return wx.showToast({
            title: "证书加载失败",
            icon: 'none'
          });
        }
        console.log('imageUrl:'+ app.config.host + response.data.info.resourceUrl + response.data.info.path)
        _this.setData({ certificateImageUrl: app.config.host + response.data.info.resourceUrl + response.data.info.path })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: "证书加载失败",
          icon: 'none'
        });
      }
    })
  },
  GETGUID() {
    var guid = ''
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16)
      guid += n
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        guid += '-'
      }
    }
    return guid
  },
  saveCertificateToAlbumAction() {
    if (!this.data.certificateImageUrl.length) {
      wx.showToast({
        title: "证书下载失败，无法进行保存！",
        icon: 'none'
      });
      return
    }
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认保存证书到相册？',
      success: function (res) {
        if (res.confirm) {
          if (_this.data.saveFilePath.length) {
            _this.saveImageToPhotoAlbum()
          } else {
            wx.showLoading({
              title: '证书保存中...',
            })
            wx.downloadFile({
              url: _this.data.certificateImageUrl,
              success: function (e) {
                wx.hideLoading()
                let path = e.tempFilePath
                _this.setData({
                  saveFilePath: path
                })
                _this.saveImageToPhotoAlbum()
              },
              fail: function (e) {
                wx.hideLoading()
                wx.showToast({
                  title: "证书保存失败",
                  icon: 'none'
                });
              }
            })
          }
        } else if (res.cancel) {

        }
      }
    })
  },
  // 保存证书到相册
  saveImageToPhotoAlbum() {
    let context = this
    wx.saveImageToPhotosAlbum({
      filePath: context.data.saveFilePath,
      success(res) {
        //提示保存证书成功
        wx.showToast({
          title: "证书保存成功",
          icon: 'none'
        });
      },
      fail(res) {
        // 保存失败
        wx.showToast({
          title: "证书保存失败",
          icon: 'none'
        });
      }

    })
  }
})