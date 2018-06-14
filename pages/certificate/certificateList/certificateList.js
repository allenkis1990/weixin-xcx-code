// pages/certificate/certificateList/certificateList.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipMessage: "",
    cancelText: "确认",
    confirmText: "取消",
    modalType: "",
    isShowCancel: true,
    selectedCertificate:{},
    cerlistData: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.loadCertificateListData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
    wx.showNavigationBarLoading()
    this.loadCertificateListData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  loadCertificateListData(){
    let context = this
    wx.showLoading({
      title: '加载中...',
    })
    app.requestData(app.config.certificateList, {}, 'GET').then(function (data) {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      wx.hideLoading()
      if (data.head.code == app.constant.network_result_success) {
        context.setData({
          cerlistData: data.data.certificateList
        })
        
      }else{
        wx.showToast({
          title: data.head.message,
          icon: 'none'
        });
      }
    }).catch(e => {
      wx.hideLoading()
      console.log('>>' + e)
    })

  },
  scrollToTopAction(){
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  itemClickAction(event){
    var item = event.currentTarget.dataset.item
    this.setData({
      selectedCertificate:item
    })
    wx.navigateTo({
      url: '/pages/certificate/certificateDetail/certificateDetail?certificateId=' + this.data.selectedCertificate.certificateId,
    })
    // this.checkHasConfimUserInfo()
  },
  checkHasConfimUserInfo() {
    let idNumArr = wx.getStorageSync("seeCertificatePersonIds")
    if (this.checkIsContainUserId(idNumArr, app.userInfo.userId)) {
      // 用户校验过正确准确性，直接进行证书状态核实
      this.checkCertificateStatus()
    } else {
      // 提示用户确认信息
      this.showConfimUserInfomationTip()
    }
  },
  checkCertificateStatus() {
    let context = this
    let param = {
      certificateId: this.data.selectedCertificate.certificateId
    }
    app.requestData(app.config.checkCertificateStatus, param, 'GET').then(function (data) {
      if (data.head.code == app.constant.network_result_success) {
        //进入证书详情
        wx.navigateTo({
          url: '/pages/certificate/certificateDetail/certificateDetail?certificateId=' + context.data.selectedCertificate.certificateId,
        })
      } else if (data.head.code === 301) {
        // 学员通过考试，考试证明编号尚未导入平台
        context.showCertificateIsCheckingTip()
      } else if (data.head.code === 302) {
        // 学员通过考试，考试证明编号已经导入，但是有重复班级
        context.showCertificateHasDuplicateTip()
      }
    }).catch(e => {
      wx.hideLoading()
      console.log('>>' + e)
    })
  },
  showConfimUserInfomationTip() {
    this.setData({
      modalType: "confirmUserInfomation",
      tipMessage: `亲爱的学员，请再次确认您的个人信息无误。<br>一旦获取培训合格证明即无法修改！<br>姓名：${app.userInfo.userName}<br>身份证号：${app.userInfo.identityCardNo}`,
      confirmText: "确认正确，查看证明",
      cancelText: "信息有误",
      isShowCancel: true
    })
    this.selectComponent('#modal').show()
  },
  showCertificateIsCheckingTip() {
    this.setData({
      modalType: "certificateIsChecking",
      tipMessage: '恭喜您考试合格，本次培训信息须经过四川省住房和城乡建设厅培训考核办公室审核，通过审核即可下载培训证明，请于5个工作日后登录查看！',
      confirmText: "确认",
      cancelText: "取消",
      isShowCancel: false
    })
    this.selectComponent('#modal').show()

  },
  showCertificateHasDuplicateTip() {
    this.setData({
      modalType: "hasDuplicateCertificate",
      tipMessage: "您的本次培训信息已通过四川省住房和城乡建设厅培训考核办公室审核。<span style='color:red'>经查，您在其他机构还有一条培训信息，请尽快处理。</span><br>如有疑问请联系四川住房和城乡建设厅培训考核办公室，电话：028-85439023",
      confirmText: "确认",
      cancelText: "取消",
      isShowCancel: false
    })
    this.selectComponent('#modal').show()
  },
  checkIsContainUserId(idNumArr, userId) {
    if (!idNumArr.length) {
      return false
    }
    for (let i = 0; i < idNumArr.length; i++) {
      if (idNumArr[i] == userId) {
        return true
      }
    }
    return false
  },
  modalConfirmAction() {
    if (this.data.modalType == "certificateIsChecking") {

    } else if (this.data.modalType == "hasDuplicateCertificate") {
      // 进入证书详情页
      wx.navigateTo({
        url: '/pages/certificate/certificateDetail/certificateDetail?certificateId=' + this.data.selectedCertificate.certificateId,
      })
    } else if (this.data.modalType == "confirmUserInfomation") {
      // 存储用户校验过证书信息
      let idNumArr = wx.getStorageSync("seeCertificatePersonIds").length ? wx.getStorageSync("seeCertificatePersonIds") : []
      idNumArr.push(app.userInfo.userId)
      wx.setStorageSync("seeCertificatePersonIds", idNumArr)
      // 校验证书状态
      this.checkCertificateStatus()
    }
  },
  modalCancelAction() {
    if (this.data.modalType == "confirmUserInfomation") {
      // 提示用户联系客户修改信息

      wx.showToast({
        title: '四川建设人才在线教育平台”微信服务号,发送关键字“修改个人信息”，联系客服为您修改信息',
        icon: 'none'
      });
      // that.toast('请通过“四川建设人才在线教育平台”微信服务号</br>发送关键字“修改个人信息”，联系客服为您修改信息');
    } else if (this.data.modalType == "certificateIsChecking") {

    } else if (this.data.modalType == "hasDuplicateCertificate") {

    }
  }
})