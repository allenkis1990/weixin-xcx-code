/**
 * 小程序配置文件
 */

/**
 * CAS登录相关配置参数
 * casHost：指向CAS服务，如果是内网测试，这里的值是基于在微信后端配置的生产环境CAS服务域名，做扩展。在代理中配置HOST:
 * 192.168.1.13 appssov1.59iedu.com 
 * 192.168.1.13 scjs.59iedu.com
 * 合并13服务器的nginx中做重定向处理。
 * 
 * trainPlatformHost:设置培训平台服务地址，此值一定要在培训平台服务参数中有配置，不然CAS服务认不到。
 * 
 * loginUrl：第1步的地址
 * ssoUrl：第3步的地址
 */
var casConfig = {
  //------------------------------------------------------------------
  casHost: '',
  trainPlatformHost: '',
  //------------------------------------------------------------------
  loginUrl: '/login',
  // ssoUrl: 'web/sso/auth',
  ssoUrl: 'mobile/sso/auth',
  //以下三个值是小程序授权后获取到的
  accessToken: '',
  unionId: '',
  openId: '',
  code: ''
}

// 此处主机域名是腾讯云解决方案分配的域名
//------------------------------------------------------------------
var host = ""  //测试1
var version = "18051001" //版本号，示例：18051001，每次提高审核，需要配置一个版本，并且提供给后端服务
//------------------------------------------------------------------
/**
 * 连接的环境，
 * dev : 开发环境
 * test1 ：测试1
 * test2 ：测试2
 * release ：生产环境
 */
var env = 'test1'

if (env === 'dev') {
  //开发环境
  casConfig.casHost = 'http://dev.cas.com'
  casConfig.trainPlatformHost = 'http://dev.qztgjy.com:8080/'
  host = "http://dev.qztgjy.com:8080"
} else if (env === 'test1') {
  //测试1
  casConfig.casHost = 'https://appssov1.59iedu.com/test1'
  casConfig.trainPlatformHost = 'https://ynsdtest1.testab.59iedu.com:8443/'
  host = "https://ynzjpx.59iedu.com/test1"
} else if (env === 'test2') {
  //测试2
  casConfig.casHost = 'https://appssov1.59iedu.com/test2'
  casConfig.trainPlatformHost = 'https://ynsdtest2.testab.59iedu.com:8443/'
  host = "https://ynzjpx.59iedu.com/test2"
} else if (env === 'localTest') {
  casConfig.casHost = 'https://${host}'
  casConfig.trainPlatformHost = 'https://${host}'
  host = 'http://192.168.1.208:3000/mock/55'
} else {
  //生产环境
  casConfig.casHost = 'https://hwappssov1.59iedu.com'
  casConfig.trainPlatformHost = 'https://ynzjpx.59iedu.com/'
  host = "https://ynzjpx.59iedu.com"
}


//***************************************************************************

var config = {  
  //当前版本号
  version,
  isShowBuy: false,
  
  // 下面的地址配合云端 Server 工作
  host,
  //CAS相关配置
  casConfig,
  // 域名地址
  apiHost: `${host}/`,
  //登录过期跳转的页面
  loginTimeoutPage: '/pages/account/loginFail/loginFail',


  //登录时用账号密码获取userId
  adminSystemUserLogin: `${host}/mobile/home/mobileRegister/adminSystemUserLogin`,
//----------------------------------------------------------------------------------------------------------
  //************************************************ 班级模块 **********************************************************************
  //获取练习已答多少题
  mobileGetHistoryPracticeCount: `${host}/mobile/user/mobileTrainingExam/mobileGetHistoryPracticeCount`,
  //培训班年份
  trainingYear: `${host}/mobile/user/mobileTrainingClass/getSkuPropertyValuesByName`,
  //云师大获取我的班级年度列表
  getAllTrainingYears:`${host}/mobile/user/mobileTrainingClass/getAllTrainingYears`,
  //云师大获取我的班级列表
  getMyClassInfo:`${host}/mobile/user/mobileTrainingClass/getMyClassInfo`,
  //培训班列表
  trainingClass: `${host}/mobile/user/mobileTrainingClass/getMyClassInfoTemp`,
  //培训班详情信息
  trainingClassDetail: `${host}/mobile/user/mobileTrainingClass/getTrainDetailInfoById`,
  //培训班学时要求信息
  trainingClassPeriodRequire: `${host}/mobile/user/mobileTrainingClass/getPeriodRequire`,
  //培训班信息
  trainingClassCourseInfo: `${host}/mobile/user/mobileTrainingClass/getCourseInfoByTrnId`,
  //培训班课程列表
  trainingClassCourseList: `${host}/mobile/user/mobileTrainingClass/getCourseList`,
  //培训班课程选课学时信息
  trainingClassSelectedInfo: `${host}/mobile/user/mobileTrainingClass/getCourseInfoByTrnId`,
  //培训班考试列表
  trainingClassExamList: `${host}/mobile/user/mobileTrainingExam/getMyClassExamRoundList`,
  //培训班选课包
  trainingClassPackageList: `${host}/mobile/user/mobileTrainingClass/getPackageList`,
  //培训班选课包选课列表
  trainingClassChooseCoursePage: `${host}/mobile/user/mobileTrainingClass/getChooseCoursePage`,
  //提交选课
  trainingClassCommitCourse: `${host}/mobile/user/mobileTrainingClass/commitChosen`,
  //获取练习题信息
  traningClassPracticeInfo: `${host}/mobile/user/mobileTrainingExam/mobileGetHistoryPracticeCount`,
  //*********************************************** 班级结束模块 *******************************************************************
  //************************************************* 兴趣模块   *******************************************************************
  hasLegal: `${host}/mobile/home/mobileRegister/checkSendPhoneValidateCode`,
  // 未选兴趣包列表
  interestCourseWrapList: `${host}/mobile/user/mobileTrainingClass/findInterestCoursePoolList`,
  // 已选兴趣包列表
  interestSelectedCourseWrapList: `${host}/mobile/user/mobileTrainingClass/findSelectedInterestCoursePoolList`,
  //未选兴趣包  课程列表
  interestCourseList: `${host}/mobile/user/mobileTrainingClass/findInterestCourseInPoolList`,
  // 已选兴趣包 课程列表
  interestSelectedCourseList: `${host}/mobile/user/mobileTrainingClass/findUserSelectedInterestCourseInPoolList`,
  // 提交兴趣课程
  submitInterestCourseList: `${host}/mobile/user/mobileTrainingClass/chooseInterestCourse`,

  //选课包列表
  selectedCourseWrapList: `${host}/mobile/user/mobileTrainingClass/getPackageList`,
  //选课课程列表
  selectedCourseList:`${host}/mobile/user/mobileTrainingClass/getChooseCoursePage`,
  //
  assessmentRequirements: `${host}/mobile/user/mobileTrainingClass/getPeriodRequire`,
  //提交选课课程
  commitCourseList: `${host}/mobile/user/mobileTrainingClass/commitChosen`,
  //************************************************* 兴趣结束模块 *****************************************************************
  //*************************************************   课程模块   *****************************************************************
  //课程详情
  courseDetailInfo: `${host}/mobile/user/course/getCourseById`,
  //课程目录列表
  courseChapterList: `${host}/mobile/user/course/getChapterList`,
  //课程播放信息
  courseVideoPlayInfo: `${host}/mobile/user/course/getCoursePlay`,
  //课程播放初始化
  courseInitializeVideoPlayInfo: `/api/LearningMarker/Initing`,
  //课程进度提交
  coursePlayProcessUpload: `/api/LearningMarker/Timing`,
  //获取弹窗题列表
  coursePopQuestionList: `${host}/mobile/user/course/getPopConfig`,
  // 获取能力层参数
  serveContextInfoUrl: `${host}/mobile/home/mobileHome/getApplicationContext`,
  //************************************************  课程模块结束  ****************************************************************
  //************************************************    账号模块    ****************************************************************
  // 用code换取openId
  wxInfoUrl: `${host}/mobile/home/mobileRegister/getWXInfo`,
  // 获取上下文
  contextInfo: `${host}/mobile/home/mobileHome/getApplicationContext`,

  // 完善个人信息
  perfectInformation: `${host}/mobile/home/mobileRegister/userRegister`,
  // 图形验证码
  imageValidateCode: `${host}/mobile/home/mobileRegister/appSendImageValidateCode`,
  // 短信验证码
  smsValidateCode: `${host}/mobile/home/mobileRegister/appSendPhoneValidateCode`,
  // 获取用户信息
  getUserInfo: `${host}/mobile/user/userInfo/getUserInfo`,
  // 修改个人信息
  changeUserInfo:`${host}/mobile/user/userInfo/updateUserInfo`,


  haveBingWX: `${host}/mobile/home/mobileRegister/haveBindWeiXin`,
  accountBindWX: `${host}/mobile/home/mobileRegister/bindWeiXin`,

  //找回密码
  findPassword: `${host}/mobile/home/mobileHome/findPassword`,
  // 地区信息
  regionInfo: `${host}/mobile/home/userInfo/getRegionByParentId`,
  // 常见问题列表
  getMessagePage: `${host}/mobile/home/mobileMessage/getMessagePage`,
  // 常见问题详情
  getMessageDetail: `${host}/mobile/home/mobileMessage/getMessageDetail`,
//**************************************************   账号模块结束  ****************************************************************
  //************************************************     考试模块    ***************************************************************
  // 获取考试试卷预览
  examPaperPreview: `${host}/mobile/user/mobileTrainingExam/getExamPaperPreview`,
  // 获取考试历史记录
  examHistoryList: `${host}/mobile/user/mobileTrainingExam/getHistoryExamPaper`,
  // 获取答卷
  createExamPaper: `${host}/mobile/user/mobileTrainingExam/beforeExaminationCheck`,
  //***********************************************     考试模块结束  ***************************************************************

  //************************************************     练习模块    *****************************************************************
  //获取练习抽题参数
  testQuestionParam: `${host}/mobile/user/mobileTrainingExam/getFetchQuestionParam`,
  //获取练习题列表
  testQuestions: `${host}/mobile/user/mobileTrainingExam/listQuestionId`,
  // 获取练习试题历史id列表
  testHistoryQuestions: `${host}/mobile/user/mobileTrainingExam/listQuestionId`,
  //获取练习题历史记录试题内容
  historyPracticeQuestion: `${host}/mobile/user/mobileTrainingExam/getHistoryPracticeQuestionById`,

  //************************************************     练习模块结束    *****************************************************************
  
  //----------------------------------------------------------------------------------------------------------
  //************************************************ 线下班班级模块 **********************************************************************
  //线下班培训详情
  lineTrainingClassDetail: `${host}/mobile/user/mobileOffLineTrainingClass/getTrainClassDetail`,
  //线下班课程列表
  lineTrainingClassCourseList: `${host}/mobile/user/mobileOffLineTrainingClass/getCourseList`,
  //线下班的课程签到签退
  lineCourseSign: `${host}/mobile/user/course/signIn`,
  //线下班培训列表
  lineTrainingClass: `${host}/mobile/user/mobileOffLineTrainingClass/getMyClassList`,
  //获取课程参考资料列表
  courseRefenceMateriaList: `${host}/mobile/user/teachingPlan/getPlanItemResourceList`,
  //获取线下班课程详情
  lineCourseDetailInfo: `${host}/mobile/user/teachingPlan/getPlanItemInfo`,
  //获取线下班课程签到信息
  lineCoursSignInfo: `${host}/mobile/user/mobileTrainingClass/courseInfo`,
  //获取线下培训班餐劵信息
  lineMealTicketInfo: `${host}/mobile/user/mobileOffLineTrainingClass/getTrainingTicketConfig`,
  //获取线下培训班使用餐劵列表
  lineUseMealTicketList: `${host}/mobile/user/mobileOffLineTrainingClass/getTicketHistoryList`,
  //获取学员具体餐厅所有培训班餐券列表
  restaurantMealTicketInfo: `${host}/mobile/user/mobileOffLineTrainingClass/getTrainingTicketList`,
  //提交餐券
  mealTicketSubmit: `${host}/mobile/user/mobileOffLineTrainingClass/commitMealTicket`,
  //************************************************ 线下班班级结束 **********************************************************************
  //************************************************ 证书模块 **********************************************************************
  certificateDetail: `${host}/mobile/user/mobileTrainingCertify/getCertifiedDetail`,
  checkCertificateStatus: `${host}/mobile/user/mobileTrainingCertify/canPrintCertificate`,
  certificateList: `${host}/mobile/user/mobileTrainingCertify/getCertifiedList`,
  changePassword: `${host}/mobile/user/userInfo/updateUserPassWord`,

  //************************************************ 订单模块 **********************************************************************
  orderDetailInfo: `${host}/mobile/user/mobileStudentOrder/getStudentOrderInfo`,
  orderEletronInvoiceUrl: `${host}/mobile/user/mobileStudentOrder/downloadBlueBill`,
  orderUserReceiverAddress: `${host}/mobile/user/deliveryInformation/getReceiverAddress`,
  orderUpdateUserReceiverAddress: `${host}/mobile/user/deliveryInformation/updateReceiverAddress`,
  orderAreaInfo: `${host}/mobile/user/deliveryInformation/findRegion`,
  orderCreat: `${host}/mobile/user/mobileStudentOrder/createOrder`,
  orderPayOrderInfo: `${host}/mobile/user/mobileStudentOrder/getOrderPaidInfo`,//
  orderList: `${host}/mobile/user/mobileStudentOrder/getOrderPage`,///mobile/user/mobileStudentOrder/getOrderPage
  orderRefundLog: `${host}/mobile/user/userOrder/getRefundLog`,
  orderCancle: `${host}/mobile/user/mobileStudentOrder/cancelOrder`,
  //换班记录
  changeRecord: `${host}/mobile/user/userOrder/getAssociateOrder`,
  perfectOrderList: `${host}/mobile/user/userOrder/pageImperfectOrder`,
  //orderCancle: `${host}/mobile/user/userOrder/cancel`,
  orderWeiXinPay: `${host}/mobile/user/mobileStudentOrder/payByWeiXinV2`,
  orderSubmitPreCondition: `${host}/mobile/user/deliveryInformation/getPerfectOrderConfig`,
  SubmitOrderInfo: `${host}/mobile/user/userOrder/applyOrderInvoice`,
  //************************************************ 订单模块结束 **********************************************************************


  //************************************************ 证书模块结束 **********************************************************************
  //************************************************ 商品模块 **********************************************************************
  goodsTrainingYear: `${host}/mobile/home/mobileCommodity/findCommodityTrainingYearList`,
  findTrainingClassList: `${host}/mobile/home/mobileCommodity/findTrainClassCommodityList`,
  findTrainingClassDetailInfo: `${host}/mobile/home/mobileCommodity/findTrainClassCommodityInfo`, //班级商品详情
  findTrainingCoursePackageList: `${host}/mobile/home/mobileCommodity/findTrainingCoursePoolList`,//班级商品课程包
  findTrainingCourseList: `${host}/mobile/home/mobileCommodity/findTrainingCourseList`,           //班级商品课程包下课程列表
  shoppingCartCheckClassStatus: `${host}/mobile/home/mobileCommodity/enablePurchase`,             //判断用户能否购买指定的商品sku
  orderCreatPreCondition: `${host}/mobile/user/deliveryInformation/getPerfectOrderConfigBySkuId`, //获取创建订单前置配置信息
  userReceiverAddress: `${host}/mobile/user/deliveryInformation/getReceiverAddress`,                      // 用户收货地址
  userReceiverAddressUpdate:`${host}/mobile/user/deliveryInformation/updateReceiverAddress`,//修改用户收货地址
  orderSelfStorageList: `${host}/mobile/user/deliveryInformation/getSelfStorageList`,              //获取物品自取地址信息列表

  getAllRegion:   `${host}/mobile/home/mobileRegister/findRegion`,//获取福建下所有市区
  getAssessRequireInfoById:`${host}/mobile/user/mobileTrainingClass/getPeriodRequire`,
  submitEvaluationCourse:`${host}/mobile/user/mobileTrainingClass/submitEvaluationCourse`,//提交评价
  getLecturerInfo:`${host}/mobile/user/mobileTrainingClass/getLecturerInfo`,//获取讲师信息
  getEvaluationCourse:`${host}/mobile/user/mobileTrainingClass/getEvaluationCourse`//获取评价
};

module.exports = config
