let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 支持的开票方式 | Int | 发票类型 | 1.普通发票 2.普通电子发票 3.增值税专用发票 | 4.非税务票（纸质）
    supportInvoiceTypeArray: [],
    // 支持的开票抬头方式 | Int | 发票类型 | 1.个人 2.单位
    supportInvoiceTitleTypeArray: [],
    // 开票方式数组
    invoiceTypeItemsArray: [],
    // 开票抬头方式数组
    invoiceTitleTypeItemsArray: [],
    // 选中的发票抬头类型 1为个人，2为单位
    selectedInvoiceTitleType: -1,
    // 选中的开票方式：1 普通纸质发票 2 普通电子发票 3 增值税专用发票 4非税务票
    selectedInvoiceType: -1,
    deliverInfo: {},
    invoiceInfo: {},
    cerInfo: {},
    incrementInvoiceInfo: {
      unitName: '',
      taxpayerNo: '',
      registerAddress: '',
      registerTelNumber: '',
      bankAccount: '',
      bankTitle: ''
    },
    personName: '',
    unitName: '',
    taxNumber: '',
    email:'',
    preInvoiceInfo: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化数据
    let supportInvoiceTypeArray = JSON.parse(options.supportInvoiceType)
    if (supportInvoiceTypeArray !== undefined && supportInvoiceTypeArray.length) {
      supportInvoiceTypeArray = this.refundArraySort(supportInvoiceTypeArray)
      this.setData({
        supportInvoiceTypeArray: supportInvoiceTypeArray
      })
    }
    let supportTitleTypeArray = JSON.parse(options.supportTitleType)
    if (supportTitleTypeArray !== undefined && supportTitleTypeArray.length) {
      supportTitleTypeArray = this.refundArraySort(supportTitleTypeArray)
      this.setData({
        supportInvoiceTitleTypeArray: supportTitleTypeArray
      })
    }
    if (options.invoiceTitle !== undefined) {
      this.setData({
        invoiceTitle: options.invoiceTitle
      })
    }
    this.setData({
      email: app.userInfo.email,
      personName: app.userInfo.userName
    })

    // 与设置上个页面传递的参数存在先后顺序，不可互换
    this.getInvioceTitleTypeArray()
    this.getSelectedInvoiceTitleType()
    this.getInvoiceTypeArray()
    this.getSelectedInvoiceType()
    // 设置上个页面传递的参数
    let invoiceInfo = JSON.parse(options.invoiceInfo)
    if (invoiceInfo.invoiceType !== undefined) {
      this.setData({
        selectedInvoiceType: invoiceInfo.invoiceType,
        preInvoiceInfo: invoiceInfo
      })
      if (invoiceInfo.invoiceType == 1 || invoiceInfo.invoiceType == 2 || invoiceInfo.invoiceType == 4) {
        this.setData({
          selectedInvoiceTitleType: invoiceInfo.titleType
        })
      }
      if (invoiceInfo.invoiceType == 1) {
        if (invoiceInfo.titleType == 1) {
          // this.setData({
          //   personName: invoiceInfo.title
          // })
        } else if (invoiceInfo.titleType == 2) {
          this.setData({
            unitName: invoiceInfo.title,
            taxNumber: invoiceInfo.taxpayerNo
          })
        }
      }
      if (invoiceInfo.invoiceType == 2) {
        if (invoiceInfo.titleType == 1) {
          this.setData({
            personName: invoiceInfo.title,
            email: invoiceInfo.email
          })
        } else if (invoiceInfo.titleType == 2) {
          this.setData({
            unitName: invoiceInfo.title,
            taxNumber: invoiceInfo.taxpayerNo,
            email: invoiceInfo.email
          })
        }
      }
      if (invoiceInfo.invoiceType == 3) {
        this.setData({
          incrementInvoiceInfo: invoiceInfo.increasedTicket
        })
      }
      if (invoiceInfo.invoiceType == 4) {
        if (invoiceInfo.titleType == 1) {
          this.setData({
            personName: invoiceInfo.title
          })
        } else if (invoiceInfo.titleType == 2) {
          this.setData({
            unitName: invoiceInfo.title
          })
        }
      }
    }
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
  getInvioceTitleTypeArray() {
    if (!this.data.supportInvoiceTitleTypeArray.length) {
      return
    }
    let invoiceTitleTypeItemsArray = []
    for (let index = 0; index < this.data.supportInvoiceTitleTypeArray.length; index++) {
      let item = this.data.supportInvoiceTitleTypeArray[index]
      switch (item) {
        case 1: {
          invoiceTitleTypeItemsArray.push({
            invoiceTitleTypeTitle: "个人",
            invoiceTitleTypeValue: 1
          })
          break
        }
        case 2: {
          invoiceTitleTypeItemsArray.push({
            invoiceTitleTypeTitle: "单位",
            invoiceTitleTypeValue: 2
          })
          break
        }
      }
    }
    this.setData({
      "invoiceTitleTypeItemsArray": invoiceTitleTypeItemsArray
    })
  },
  getSelectedInvoiceTitleType() {
    if (this.data.invoiceTitleTypeItemsArray.length) {
      let invoiceTitleItem = this.data.invoiceTitleTypeItemsArray[0]
      this.data.selectedInvoiceTitleType = invoiceTitleItem.invoiceTitleTypeValue
      this.setData({
        selectedInvoiceTitleType: this.data.selectedInvoiceTitleType
      })
    }
  },
  getInvoiceTypeArray() {
    if (!this.data.supportInvoiceTypeArray.length) {
      return
    }
    // 1.普通发票 2.普通电子发票 3.增值税专用发票 | 4.非税务票（纸质）
    let invoiceTypeItemsArray = []
    for (let index = 0; index < this.data.supportInvoiceTypeArray.length; index++) {
      let item = this.data.supportInvoiceTypeArray[index]
      switch (item) {
        case 1: {
          invoiceTypeItemsArray.push({
            invoiceTypeTitle: "纸质普票",
            invoiceTypeValue: 1
          })
          break
        }
        case 2: {
          invoiceTypeItemsArray.push({
            invoiceTypeTitle: "普通电子发票",
            invoiceTypeValue: 2
          })
          break
        }
        case 3: {
          invoiceTypeItemsArray.push({
            invoiceTypeTitle: "增值税专用发票",
            invoiceTypeValue: 3
          })
          break
        }
        case 4: {
          invoiceTypeItemsArray.push({
            invoiceTypeTitle: "非税务票(纸质)",
            invoiceTypeValue: 4
          })
          break
        }
      }
    }
    this.setData({
      "invoiceTypeItemsArray": invoiceTypeItemsArray
    })
  },
  getSelectedInvoiceType() {
    if (this.data.invoiceTypeItemsArray.length) {
      var invoiceItem = this.data.invoiceTypeItemsArray[0]
      this.data.selectedInvoiceType = invoiceItem.invoiceTypeValue
      this.setData({
        selectedInvoiceType: this.data.selectedInvoiceType
      })
    }
  },
  /**
   * 选择发票抬头类型事件
   */
  chooseInvoiceTitleTypeAction(event) {
    let item = event.currentTarget.dataset.item
    this.setData({
      selectedInvoiceTitleType: item.invoiceTitleTypeValue
    })
  },
  /**
  * 选择发开票方式事件
  */
  invoiceTypeItemClickAction(event) {
    let currentItem = event.currentTarget.dataset.item
    switch (currentItem.invoiceTypeValue) {
      case 1: {

      }
      case 2: {

      }
      case 3: {

      }
      case 4: {

      }
    }
    this.setData({
      selectedInvoiceType: currentItem.invoiceTypeValue
    })
  },
  inputeAction(event) {
    let value = event.detail.value
    switch (event.currentTarget.dataset.inputKey) {
      case 'personName': {
        this.data.personName = value
        break
      }
      case 'unitName': {
        this.data.unitName = value
        break
      }
      case 'taxNumber': {
        this.data.taxNumber = value
        break
      }
      case 'ZunitName': {
        this.data.incrementInvoiceInfo.unitName = value
        break
      }
      case 'ZtaxNumber': {
        this.data.incrementInvoiceInfo.taxpayerNo = value
        break
      }
      case 'ZregisterAddress': {
        this.data.incrementInvoiceInfo.registerAddress = value
        break
      }
      case 'ZregisterPhoneNumber': {
        this.data.incrementInvoiceInfo.registerTelNumber = value
        break
      }
      case 'ZregisterBank': {
        this.data.incrementInvoiceInfo.bankTitle = value
        break
      }
      case 'ZbankNumber': {
        this.data.incrementInvoiceInfo.bankAccount = value
        break
      }
      case  'email' :{
        this.data.email = value
        break
      }
    }
    this.setData({
      personName: this.data.personName,
      unitName: this.data.unitName,
      taxNumber: this.data.taxNumber,
      email: this.data.email,
      incrementInvoiceInfo: this.data.incrementInvoiceInfo
    })
  },
  // 保存发票
  saveInvoiceInfo: function () {
    if (this.checkInfoCorrect()) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      let showText = ''
      for (let index = 0; index < this.data.invoiceTypeItemsArray.length; index++) {
        let item = this.data.invoiceTypeItemsArray[index]
        if (item.invoiceTypeValue == this.data.selectedInvoiceType) {
          showText = item.invoiceTypeTitle
        }
      }
      if (this.data.selectedInvoiceType == 1 || this.data.selectedInvoiceType == 2 || this.data.selectedInvoiceType == 4) {
        if (this.data.selectedInvoiceTitleType == 1) {
          showText = showText + '-个人' + '(' + this.data.personName + ')'
        } else if (this.data.selectedInvoiceTitleType == 2) {
          showText = showText + '-单位' + '(' + this.data.unitName + ')'
        }
      } else if (this.data.selectedInvoiceType == 3) {
        showText = showText + '(明细)'
      }
      prevPage.setData({
        showInvoiceTypeText: showText,
      })
      prevPage.data.invoiceInfo.invoiceType = this.data.selectedInvoiceType
      // 修改页面的invoiceInfo
      if (this.data.selectedInvoiceType == 1) {
        prevPage.data.invoiceInfo.titleType = this.data.selectedInvoiceTitleType
        if (this.data.selectedInvoiceTitleType == 1) {
          prevPage.data.invoiceInfo.title = this.data.personName
          prevPage.data.invoiceInfo.taxpayerNo = ''
        } else if (this.data.selectedInvoiceTitleType == 2) {
          prevPage.data.invoiceInfo.title = this.data.unitName
          prevPage.data.invoiceInfo.taxpayerNo = this.data.taxNumber
        }
        prevPage.data.invoiceInfo.electron = false
      } else if (this.data.selectedInvoiceType == 2) {
        prevPage.data.invoiceInfo.titleType = this.data.selectedInvoiceTitleType
        if (this.data.selectedInvoiceTitleType == 1) {
          prevPage.data.invoiceInfo.title = this.data.personName
          prevPage.data.invoiceInfo.taxpayerNo = ''
        } else if (this.data.selectedInvoiceTitleType == 2) {
          prevPage.data.invoiceInfo.title = this.data.unitName
          prevPage.data.invoiceInfo.taxpayerNo = this.data.taxNumber
        }
        prevPage.data.invoiceInfo.email = this.data.email
        prevPage.data.invoiceInfo.electron = true
      } else if (this.data.selectedInvoiceType == 3) {
        prevPage.data.invoiceInfo.increasedTicket = this.data.incrementInvoiceInfo
      } else if (this.data.selectedInvoiceType == 4) {
        prevPage.data.invoiceInfo.titleType = this.data.selectedInvoiceTitleType
        prevPage.data.invoiceInfo.taxpayerNo = ''
        if (this.data.selectedInvoiceTitleType == 1) {
          prevPage.data.invoiceInfo.title = this.data.personName
        } else if (this.data.selectedInvoiceTitleType == 2) {
          prevPage.data.invoiceInfo.title = this.data.unitName
        }
      }
      prevPage.setData({
        invoiceInfo: prevPage.data.invoiceInfo
      })
      wx.navigateBack({})
    }
  },
  /**
    * 校验信息是否正确
    */
  checkInfoCorrect() {
    //1 普通纸质发票 2 普通电子发票 3 增值税专用发票 4非税务票
    if (this.data.selectedInvoiceType == 1) {
      // 1为个人，2为单位
      if (this.data.selectedInvoiceTitleType == 1) {
        if (!this.data.personName.trim().length) {
          this.showToast('请填写个人姓名，不可为空！')
          return false
        }
      } else if (this.data.selectedInvoiceTitleType == 2) {
        if (!this.data.unitName.trim().length) {
          this.showToast('请填写单位全称，不可为空！')
          return false
        }
        if (!this.data.taxNumber.trim().length) {
          this.showToast('请填写纳税人识别号，不可为空！')
          return false
        }
      }
      return true
    } else if (this.data.selectedInvoiceType == 2){
      // 1为个人，2为单位
      if (this.data.selectedInvoiceTitleType == 1) {
        if (!this.data.personName.trim().length) {
          this.showToast('请填写个人姓名，不可为空！')
          return false
        }
      } else if (this.data.selectedInvoiceTitleType == 2) {
        if (!this.data.unitName.trim().length) {
          this.showToast('请填写单位全称，不可为空！')
          return false
        }
        if (!this.data.taxNumber.trim().length) {
          this.showToast('请填写纳税人识别号，不可为空！')
          return false
        }
      }
      if (!this.data.email.trim().length) {
        this.showToast('请填写您的邮箱，不可为空！')
        return false
      }else{
        if (!app.utils.checkEmail(this.data.email)) {
          this.showToast('请填写正确格式的邮箱！')
          return false
        }
      }
      return true
    }
      else if (this.data.selectedInvoiceType == 3) {
      if (!this.data.incrementInvoiceInfo.unitName.trim().length) {
        this.showToast('请填写单位全称，不可为空！')
        return false
      }
      if (!this.data.incrementInvoiceInfo.taxpayerNo.trim().length) {
        this.showToast('请填写纳税人识别号，不可为空！')
        return false
      }
      if (!this.data.incrementInvoiceInfo.registerAddress.trim().length) {
        this.showToast('请填写注册地址，不可为空！')
        return false
      }
      if (!this.data.incrementInvoiceInfo.registerTelNumber.trim().length) {
        this.showToast('请填写注册电话，不可为空！')
        return false
      }
      if (!this.data.incrementInvoiceInfo.bankTitle.trim().length) {
        this.showToast('请填写开户银行，不可为空！')
        return false
      }
      if (!this.data.incrementInvoiceInfo.bankAccount.trim().length) {
        this.showToast('请填写银行账号，不可为空！')
        return false
      }
      return true
    } else if (this.data.selectedInvoiceType == 4) {
      // 1为个人，2为单位
      if (this.data.selectedInvoiceTitleType == 1) {
        if (!this.data.personName.trim().length) {
          this.showToast('请填写个人姓名，不可为空！')
          return false
        }
      } else if (this.data.selectedInvoiceTitleType == 2) {
        if (!this.data.unitName.trim().length) {
          this.showToast('请填写单位全称，不可为空！')
          return false
        }
      }
      return true
    }
    return false
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