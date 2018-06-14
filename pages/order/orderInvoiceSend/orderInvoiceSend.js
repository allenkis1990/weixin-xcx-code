// pages/order/orderInvoiceSend/orderInvoiceSend.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 选中的配送方式 1、自取 2、邮寄
    selectedDeliverType: -1,
    // 支持的方式
    supportDeliveryTypeArray: [],
    deliverTypeItemsArray: [],

    selectedSelfPickerAddress: {},
    userAddressInfo: {
      receiverName: '',
      mobileNo: '',
      postCode: '',
      addressDetails: '',
      provinceId: '',
      areaValue: '',
      districtId: ''
    },
    selfPickerAddressList: [],
    areaInfo: {},
    prePickerIndex: [],
    // 上一次保存的发票数据
    preInvoiceInfo: {},
    textAreaTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let context = this
    wx.getSystemInfo({
      success: function (res) {
        if (res.system.indexOf('iOS') >= 0) {
          context.setData({
            textAreaTop: -12
          })
        }
      }
    })
    if (options.supportDeliveryType !== undefined && options.supportDeliveryType.length) {
      let supportDeliveryTypeArray = JSON.parse(options.supportDeliveryType)
      supportDeliveryTypeArray = this.refundArraySort(supportDeliveryTypeArray)
      this.setData({
        "supportDeliveryTypeArray": supportDeliveryTypeArray
      })
      this.getSenDdeliverTypeArray()
      this.getSelectedDeliverType()
    }
    if (options.invoiceInfo !== undefined && options.invoiceInfo.length) {
      let invoiceInfo = JSON.parse(options.invoiceInfo)
      if (invoiceInfo.deliverType !== undefined) {
        if (invoiceInfo.deliverType == 1) {
          invoiceInfo.deliverType = 2
        } else if (invoiceInfo.deliverType == 2) {
          invoiceInfo.deliverType = 1
        }
        this.setData({
          selectedDeliverType: invoiceInfo.deliverType,
          preInvoiceInfo: invoiceInfo
        })
      }
    }
    this.loadSelfPickAddressListData()
    this.setAreaInfo()
    setTimeout(function () {
      context.setUserAddressInfo()
    }, 500)

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
   * 请求自取地点列表数据
   */
  loadSelfPickAddressListData() {
    let context = this
    let params = {
      type: 1
    }
    wx.showLoading({
      title: '数据加载中...',
    })
    app.requestData(app.config.orderSelfStorageList, params, 'GET').then(function (response) {
      wx.hideLoading()
      if (response.head.code == app.constant.network_result_success) {
        context.setData({
          selfPickerAddressList: response.data.selfStorageList
        })
        if (context.data.preInvoiceInfo.deliverType !== undefined && context.data.preInvoiceInfo.deliverType == 1 && context.data.preInvoiceInfo.selfStorageId.length) {
          for (let index = 0; index < context.data.selfPickerAddressList.length; index++) {
            let item = context.data.selfPickerAddressList[index]
            if (item.selfStorageId == context.data.preInvoiceInfo.selfStorageId) {
              context.setData({
                selectedSelfPickerAddress: item
              }
              )
            }
          }
        }
      } else {
        wx.showToast({
          title: response.head.message,
          icon: 'none'
        })
      }
    }).catch(function (error) {
      debugger
      wx.showToast({
        title: "数据请求失败!",
        icon: 'none'
      })
    })
  },
  /**
   * 设置用户收货地址
   */
  setUserAddressInfo() {
    let context = this
    if (app.getUserReceiveAddress().receiverId !== undefined) {
      let userReceiveInfoString = JSON.stringify(app.getUserReceiveAddress())
      let newUserReceiveInfo = JSON.parse(userReceiveInfoString)
      this.setData({
        userAddressInfo: newUserReceiveInfo
      })
    }
    debugger
    let userReceiveAddress = this.data.userAddressInfo
    if (userReceiveAddress !== undefined && userReceiveAddress.receiverId !== undefined) {
      // 获取选择当前选中地区的index
      let selectedIndex = [0, 0, 0]
      if (userReceiveAddress.provinceId.length && userReceiveAddress.cityId.length && userReceiveAddress.districtId.length && context.data.areaInfo.provinces !== undefined && context.data.areaInfo.provinces.length) {
        for (let i = 0; i < context.data.areaInfo.provinces.length; i++) {
          let provinceObject = context.data.areaInfo.provinces[i]
          if (provinceObject.provinceCode == userReceiveAddress.provinceId) {
            selectedIndex[0] = i
            for (let j = 0; j < provinceObject.cities.length; j++) {
              let cityObject = provinceObject.cities[j]
              if (cityObject.cityCode == userReceiveAddress.cityId) {
                selectedIndex[1] = j
                for (let k = 0; k < cityObject.districts.length; k++) {
                  let countyObject = cityObject.districts[k]
                  if (countyObject.districtCode == userReceiveAddress.districtId) {
                    selectedIndex[2] = k
                    break
                  }
                }
                break
              }
            }
          }
        }
        context.setData({
          prePickerIndex: selectedIndex
        })
      }
    }
  },
  /**
   * 设置地区选择
   */
  setAreaInfo() {
    let regionData = app.getAllRegionData()
    debugger
    if (regionData !== undefined && regionData.provinces !== undefined && regionData.provinces.length) {
      this.setData({
        areaInfo: regionData
      })
    }
  },
  /**
  * 保存事件
  */
  saveAction() {
    //直接获取到上一个页面的数据进行修改
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    let context = this
    if (this.data.selectedDeliverType == 2) {
      if (this.checkInformation()) {
        let context = this
        let params = {}
        params = this.data.userAddressInfo
        app.requestData(app.config.orderUpdateUserReceiverAddress, params, 'POST').then(function (response) {
          if (response.head.code == app.constant.network_result_success) {
            app.userReceiveAddress = response.data
            prevPage.data.invoiceInfo.deliverType = 1
            prevPage.data.invoiceInfo.receiverAddressId = response.data.id
            prevPage.data.invoiceInfo.addressDetails = response.data.addressDetails
            prevPage.setData({
              invoiceInfo: prevPage.data.invoiceInfo,
              showInvoiceSendText: '邮寄（' + context.data.userAddressInfo.addressDetails + ')'
            })
            wx.navigateBack()
          } else {
            wx.showToast({
              title: "用户收货地址修改失败，请重新进行保存",
              icon: 'none'
            })
          }
        }).catch(function (error) {
          wx.showToast({
            title: "用户收货地址修改失败，请重新进行保存",
            icon: 'none'
          })
        })
      }
    } else if (this.data.selectedDeliverType == 1) {
      if (context.data.selectedSelfPickerAddress.selfStorageId == undefined) {
        context.showToast('请选择自取地点！')
        return
      }
      prevPage.data.invoiceInfo.deliverType = 2
      prevPage.data.invoiceInfo.selfStorageId = context.data.selectedSelfPickerAddress.selfStorageId
      prevPage.data.invoiceInfo.selfStorageName = context.data.selectedSelfPickerAddress.selfStorageName
      prevPage.setData({
        invoiceInfo: prevPage.data.invoiceInfo,
        showInvoiceSendText: '自取（' + context.data.selectedSelfPickerAddress.selfStoragePickupAddress + ')'
      })
      wx.navigateBack({})
    }
  },
  _pickerConfirmAction(event) {
    let ids = event.detail.ids
    let names = event.detail.names
    this.data.userAddressInfo.provinceId = ids[0]
    this.data.userAddressInfo.cityId = ids[1]
    this.data.userAddressInfo.districtId = ids[2]
    this.data.userAddressInfo.cityName = names[0]
    this.data.userAddressInfo.provinceName = names[0]
    this.data.userAddressInfo.cityName = names[1]
    this.data.userAddressInfo.districtName = names[2]
  },
  checkInformation() {
    if (!this.data.userAddressInfo.receiverName.length) {
      this.showToast('请填写收件人，不可为空！')
      return false
    }
    if (!this.data.userAddressInfo.mobileNo.length) {
      this.showToast('请填写手机号，不可为空！')
      return false
    }
    if (this.data.userAddressInfo.mobileNo.length !== 11) {
      this.showToast('手机号不正确，请核对后提交！')
      return false
    }
    if (!this.data.userAddressInfo.cityId.length || !this.data.userAddressInfo.districtId.length) {
      this.showToast('请选择收件地区，不可为空！')
      return false
    }
    if (!this.data.userAddressInfo.addressDetails.length) {
      this.showToast('请填写收货详细地址，不可为空！')
      return false
    }
    if (!this.data.userAddressInfo.postCode.length) {
      this.showToast('请填写邮政编号，不可为空！')
      return false
    }
    if (!this.isPostalCodeAvailable(this.data.userAddressInfo.postCode)) {
      this.showToast('邮政编号不正确，请核对后提交')
      return false
    }
    return true
  },
  getSenDdeliverTypeArray() {
    if (this.data.supportDeliveryTypeArray == undefined || !this.data.supportDeliveryTypeArray.length) {
      return
    }
    let deliverTypeItemsArray = []
    for (let index = 0; index < this.data.supportDeliveryTypeArray.length; index++) {
      let item = this.data.supportDeliveryTypeArray[index]
      switch (item) {
        case 1: {
          deliverTypeItemsArray.push({
            deliverTypeName: "自取",
            deliverTypeValue: 1
          })
          break
        }
        case 2: {
          deliverTypeItemsArray.push({
            deliverTypeName: "邮寄",
            deliverTypeValue: 2
          })
          break
        }
      }
      this.setData({
        deliverTypeItemsArray: deliverTypeItemsArray
      })
    }
  },
  getSelectedDeliverType() {
    if (this.data.deliverTypeItemsArray.length) {
      let deliverTypeItem = this.data.deliverTypeItemsArray[0]
      this.setData({
        selectedDeliverType: deliverTypeItem.deliverTypeValue
      })
    }
  },
  chooseDeliverTypeAction(event) {
    let deliverItem = event.currentTarget.dataset.deliverItem
    this.setData({
      selectedDeliverType: deliverItem.deliverTypeValue
    })
  },
  selectSelfPickerItemAction(event) {
    let selfPickerAddress = event.currentTarget.dataset.pickerAddressItem
    this.setData({
      selectedSelfPickerAddress: selfPickerAddress
    })
  },
  inputeAction(event) {
    switch (event.currentTarget.dataset.inputKey) {
      case 'receiverName': {
        this.data.userAddressInfo.receiverName = event.detail.value
        break
      }
      case 'mobileNo': {
        this.data.userAddressInfo.mobileNo = event.detail.value
        break
      }
      case 'addressDetails': {
        this.data.userAddressInfo.addressDetails = event.detail.value
        break
      }
      case 'postCode': {
        this.data.userAddressInfo.postCode = event.detail.value
        break
      }
        this.setData({
          userAddressInfo: this.data.userAddressInfo
        })
    }
  },
  isPostalCodeAvailable(str) {
    let myreg = /^[0-9]{6}$/
    if (myreg.test(str)) {
      return true
    } else {
      return false
    }
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },
  refundArraySort: function (array) {
    // 冒泡排序
    var len = array.length
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (parseInt(array[j]) > parseInt(array[j + 1])) {
          var temp = array[j]
          array[j] = array[j + 1]
          array[j + 1] = temp
        }
      }
    }
    return array
  }
})