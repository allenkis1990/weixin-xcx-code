// pages/mine/changePassword/changePassword.js
let app = getApp();
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     oldPassword:'',
//     newPassword:'',
//     againPassword:'',
//     buttonStyleFlag:false,
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {
  
//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
  
//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {
  
//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {
  
//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {
  
//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {
  
//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {
  
//   },

//   /**
//     * 输入框失去焦点--旧密码
//     */
//   oldPasswordOclick: function (e) {
//     this.setData({
//       oldPassword: e.detail.value
//     })
//     this.judgeButtonStyle();
//   },

//   /**
//     * 输入框失去焦点--新密码
//     */
//   newPasswordOclick: function (e) {
//     this.setData({
//       newPassword: e.detail.value
//     })
//     this.judgeButtonStyle();
//   },

//   /**
//     * 输入框失去焦点--再次输入
//     */
//   againPasswordOclick: function (e) {
//     this.setData({
//       againPassword: e.detail.value
//     })
//     this.judgeButtonStyle();
//   },

//   /**
//     * 判断是否按钮灰显
//     */
//   judgeButtonStyle: function () {
//     if (this.data.oldPassword.length > 0 && this.data.newPassword.length > 0 && this.data.againPassword.length > 0){
//       this.setData({
//         buttonStyleFlag: true
//       })
//     }else{
//       this.setData({
//         buttonStyleFlag: false
//       })
//     }
//   },

//   /**
//     *确定修改--点击事件 
//     */
//   sureChangeClick: function () {
//     if (this.data.oldPassword.length == 0 && this.data.newPassword.length == 0 && this.data.againPassword.length == 0) {
//       //TODO 预留提示--输入完整信息
//       return
//     } else if (this.data.oldPassword.length > 0 && this.data.newPassword.length > 0 && this.data.againPassword.length > 0){
//       //TODO 发起修改网络请求
//       if (this.judgeInfoLegality(this.data.oldPassword, this.data.newPassword, this.data.againPassword)) {
//         this.requestChangePassword(this.data.oldPassword, this.data.newPassword);
//       }
//     }else{
//       this.judgeInfoEmpty(this.data.oldPassword, this.data.newPassword, this.data.againPassword);      
//     }
//   },

//   /**
//   * 判断输入信息的空值
//   */
//   judgeInfoEmpty: function (oldPassword, newPassword, againPassword) {
//     var context = this
//     if (this.data.buttonStyleFlag && (oldPassword == '' || oldPassword == undefined)) {
//       return wx.showToast({
//         title: '当前密码不能为空！',
//         icon: 'none'
//       })
//     }

//     if (this.data.buttonStyleFlag && (newPassword == '' || newPassword == undefined)) {
//       return wx.showToast({
//         title: '新密码不能为空！',
//         icon: 'none'
//       })
//     }

//     if (this.data.buttonStyleFlag && (againPassword == '' || againPassword == undefined)) {
//       return wx.showToast({
//         title: '确认密码不能为空！',
//         icon: 'none'
//       })
//     }
//   },

//   /**
//     * 判断输入信息的合法性
//     */
//   judgeInfoLegality: function (oldPassword, newPassword, againPassword) {
//     var context = this
    
//     var regu = "^[ ]+$";
//     var re = new RegExp(regu);
//     if (re.test(oldPassword)){
//       wx.showToast({
//         title: '当前密码不能为空格！',
//         icon: 'none'
//       })
//       return false;
//     }
    
//     var regEx = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
//     if (!regEx.test(newPassword)){
//       wx.showToast({
//         title: '18位由字母、数字组成的密码！',
//         icon: 'none'
//       })
//       return false;
//     }

//     if (!regEx.test(againPassword)) {
//       wx.showToast({
//         title: '请输入6~18位由字母、数字组成的确认密码！',
//         icon: 'none'
//       })
//       return false;
//     }


//     if (newPassword != againPassword){
//       wx.showToast({
//         title: '密码前后不一致，请核查！',
//         icon: 'none'
//       })
//       return false;
//     }

//     return true

//   },

//   /**
//     * 网络请求--修改用户密码
//     */
//   requestChangePassword(oldPassword, newPassword) {
//     wx.showLoading({ title: '加载中......', mask: true })
//     var param = {
//       oldPassword: oldPassword,
//       newPassword: newPassword
//     }
//     app.requestData(app.config.changePassword, param, "POST").then(data => {
//       wx.hideLoading()
//       if (data.head.code !== app.constant.network_result_success) {
//         //网络请求失败
//         return wx.showToast({
//           title: data.head.message,
//           icon: 'none'
//         })
//       }
//       wx.showToast({
//         title: '密码修改成功！',
//         icon: 'succes',
//         mask: true,
//         success: function () {
//           setTimeout(function () {
//             //要延时执行的代码
//             wx.switchTab({
//               url: '/pages/mine/mine/mine'
//             })
//           }, 2000) //延迟时间
//         }
//       })

//     }).catch(e => {
//       wx.hideLoading()
//       console.log(e)
//     })
    
//   }

// })