// pages/linetrainclass/lineCourseDetail/lineCourseDetail.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryOptions: {},
    // tab切换  
    currentTab: 0,
    // 页面高度配置
    winHeight: 0,
    winWidth: 0,
    //参考资料列表
    refenceMateriaList: [],
    lineCourseDetailInfo: {},
    //下载过的文件
    drowloadRefenceMateriaList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置请求参数数据
    let queryOptions = {
      planItemId: options.planItemId,
      trainingClassId: options.trainingClassId
    }

    this.setData({
      queryOptions: queryOptions
    })

    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList)
      }
    })

    let value = wx.getStorageSync('refenceMateriaList')
    if (value.length != 0){
      this.setData({
        drowloadRefenceMateriaList: wx.getStorageSync('refenceMateriaList')
      })
    }else{
      wx.setStorageSync('refenceMateriaList',[])
    }

    let that = this
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight * (750 / res.windowWidth)
        });
      }
    });

    // 初始化toast
    new app.WeToast()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '数据加载中...',
    })
    let context = this
    // 开始加载数据
    Promise
      .all([this.loadCourseRefenceMateriaList(), this.loadLineCourseDetailInfo()])
      .then(function (results) {
        wx.hideLoading()
        // if (results.length != 2) {
        //   context.wetoast.toast({
        //     title: '数据获取失败！'
        //   })
        //   return
        // }
        console.log(results);
        //返回线下班课程详情参考资料列表
        let refenceMateriaListResult = results[0];
        if (refenceMateriaListResult.head.code == app.constant.network_result_success) {
          context.setData({
            refenceMateriaList: refenceMateriaListResult.data.refenceMateriaList
          })
        } else {
          context.wetoast.toast({
            title: refenceMateriaListResult.head.message
          })
        }
        //返回线下班课程详情信息
        let lineCourseDetailInfoResult = results[1]
        if (lineCourseDetailInfoResult.head.code == app.constant.network_result_success) {
          context.setData({
            lineCourseDetailInfo: lineCourseDetailInfoResult.data.planItemInfo
          })
        } else {
          context.wetoast.toast({
            title: lineCourseDetailInfoResult.head.message
          })
        }
      })
      .catch(function (reason) {
        console.log("reason")
        wx.hideLoading()
        context.wetoast.toast({
          title: '数据获取失败！'
        })
      });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 网络请求--获取参考资料列表
   */
  loadCourseRefenceMateriaList() {
    let param = {
      planItemId: this.data.queryOptions.planItemId,
    }
    return app.requestData(app.config.courseRefenceMateriaList, param, 'GET')
  },

  /**
   * 获取线下班课程详情
   */
  loadLineCourseDetailInfo() {
    let param = {
      planItemId: this.data.queryOptions.planItemId,
    }
    return app.requestData(app.config.lineCourseDetailInfo, param, 'GET')
  },

  /**
 * 滑动切换tab
 */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 点击下载参考资料
   */
  chickItem(e){
    var item = e.currentTarget.dataset.item;
    
    this.judgeDownloaded(item);
    
  },

  /**
   * 判断是否下载过
   */
  judgeDownloaded(item){
    //本地存储是否已下载过文件
    var drowloadRefenceMateriaList = this.data.drowloadRefenceMateriaList;
    if (drowloadRefenceMateriaList.length > 0) {
      for (var i = 0; i < drowloadRefenceMateriaList.length; i++) {
        var object = drowloadRefenceMateriaList[i]
        if (object['refenceMaterialUrl'] == item.refenceMaterialUrl) {
          let url =  object[item.refenceMaterialUrl]
          this.openDocument(url);
          return
        }
      }

      this.downloadAndSave(item.refenceMaterialUrl);
    } else {
      this.downloadAndSave(item.refenceMaterialUrl);
    }
  },

  /**
   * 下载并保存文件操作
   */
  downloadAndSave(refenceMaterialUrl){
    var context = this;
    let pdfUrl = refenceMaterialUrl
    //兼容测试环境的内网地址，自动转换为默认外网443地址
    let index = pdfUrl.indexOf(':8443/')
    if (index >= 0) {
      pdfUrl = getApp().config.apiHost + pdfUrl.substring(index + ':8443/'.length, pdfUrl.length)
    }
    index = pdfUrl.indexOf(':1457/')
    if (index >= 0) {
      pdfUrl = getApp().config.apiHost + pdfUrl.substring(index + ':1457/'.length, pdfUrl.length)
    }
    console.log(pdfUrl)

    wx.downloadFile({
      url: pdfUrl,
      success: function (res) {
        let filePath = res.tempFilePath;
        wx.saveFile({
          tempFilePath: filePath,
          success: function (res) {
            var refenceMaterial = {}
            refenceMaterial['refenceMaterialUrl'] = refenceMaterialUrl
            refenceMaterial[refenceMaterialUrl] = res.savedFilePath
            var list = context.data.drowloadRefenceMateriaList;
            list.push(refenceMaterial);
            context.setData({
              drowloadRefenceMateriaList: list,
            })
            //保存已下载列表
            wx.setStorageSync('refenceMateriaList', list); 
            context.wetoast.toast({
              title: '保存成功'
            })
          },
          fail: function (res) { },
          complete: function (res) { }
        })

      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },

  /**
   * 打开已支持文件格式：doc, xls, ppt, pdf, docx, xlsx, pptx
   */
  openDocument(url) {
    var filePath = url
    wx.openDocument({
      filePath: filePath,
      success: function (res) {
        console.log('打开文档成功')
      }
    })
  },
  /**
   * 删除已下载文件
   */
  deteleDocument(e){
    var item = e.currentTarget.dataset.item;  
    let url=''
    var context = this;
    var object = {}
    var drowloadRefenceMateriaList = this.data.drowloadRefenceMateriaList;

    for (var i = 0; i < drowloadRefenceMateriaList.length; i++) {
      object = drowloadRefenceMateriaList[i]
      if (object['refenceMaterialUrl'] == item.refenceMaterialUrl) {
        url = object[item.refenceMaterialUrl]
      }
    }
    

    wx.getSavedFileList({
      success: function (res) {
        if (res.fileList.length > 0) {
          for (var i = 0; i < res.fileList.length; i++){
            if (res.fileList[i].filePath == url){
              wx.removeSavedFile({
                filePath: res.fileList[i].filePath,
                success: function (res) {
                  console.log('res')

                  Array.prototype.indexOf = function (val) {
                    for (var i = 0; i < this.length; i++) {
                      if (this[i] == val) return i;
                    }
                    return -1;
                  };

                  Array.prototype.remove = function (val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                      this.splice(index, 1);
                    }
                  };

                  drowloadRefenceMateriaList.remove(object);

                  context.setData({
                    drowloadRefenceMateriaList: drowloadRefenceMateriaList,
                  })
                  //保存已下载列表
                  wx.setStorageSync('refenceMateriaList', drowloadRefenceMateriaList); 
                  context.wetoast.toast({
                    title: '删除成功'
                  })
                },
                complete: function (res) {
                }
              })
            }
          }
        }
      }
    })
  }
  
})