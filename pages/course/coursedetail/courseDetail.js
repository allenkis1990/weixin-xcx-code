// pages/course/courseDetail.js
let app = getApp()
let initStarKey=4.5
let studyPlayerManager = require('../../../utils/studyManager/studyPlayerManager.js')
let courseDetailTool = require('../../../utils/studyManager/courseDetailTool.js')
let popQuestionEngine = require('../popupQuestionComponent/popQuestionEngine.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        queryOptions: {},
        // 是否是试听，用于是否要提交进度
        isTest: false,
        // 页面配置
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        //当前选中的课件
        selectedCourseWare: {},
        // 课程详情
        courseInfo: {},
        // 章节列表
        chapterList: [],
        coursePlayInfo: {},
        // 培训班id
        trainingClassId: '',
        // 多个讲师 拼接
        teachers: '',
        currentAnswerQuestion: {},
        // 是否登录考试系统
        isLoginExam: false,
        // 获取到弹窗题
        courseWareQuestionList: null,
        // 用于控制是否显示弹窗题
        showPopupQuestion: false,
        teacherInfo:[]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        // options.type 1:代表已选课程；2、代表选课课程，试听模式
        // 获取上一页传递的参数
        let objectType = -1
        let objectValue = -1
        let packageId = ''
        if (options.trainingClassId && options.trainingClassId.length) {
            objectType = 1
            objectValue = options.trainingClassId
            this.setData({
                trainingClassId: options.trainingClassId
            })
        }
        if (options.packageId && options.packageId.length) {
            packageId = options.packageId
        }
        let isTest = false
        if (options.type) {
            if (options.type == 1) {
                isTest = false
            } else if (options.type == 2) {
                isTest = true
                objectType = -1
                objectValue = -1
            }
        }
        let queryOptions = {
            courseId: options.courseId,
            objectType: objectType,
            objectValue: objectValue,
            packageId: packageId,
            courseEvaluationId:options.courseEvaluationId,
            poolId:options.poolId
        }
        this.setData({
            queryOptions: queryOptions,
            isTest: isTest
        })
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
            .all([this.loadCourseChapterListInfo(), this.loadCourseDetailInfo(), this.loadCoursePlayInfo()])
            .then(function (results) {
                wx.hideLoading()
                if (results.length != 3) {
                    context.wetoast.toast({
                        title: '数据获取失败！'
                    })
                    return
                }
                console.log(results);
                let chaptListResult = results[0];
                if (chaptListResult.head.code == app.constant.network_result_success) {
                    context.resetChaptListData(chaptListResult.data.chapterList)
                } else {
                    context.wetoast.toast({
                        title: chaptListResult.head.message
                    })
                }
                let courseDetailResult = results[1]
                if (courseDetailResult.head.code == app.constant.network_result_success) {
                    context.setData({
                        courseInfo: courseDetailResult.data
                    })
                    if (context.data.courseInfo.teacherList.length == 1) {
                        context.setData({
                            teachers: context.data.courseInfo.teacherList[0]
                        })
                    } else {
                        for (var i = 0; i < context.data.courseInfo.teacherList.length; i++) {
                            context.data.teachers = context.data.courseInfo.teacherList[i] + ' ' + context.data.teachers
                        }
                        context.setData({
                            teachers: context.data.teachers
                        })
                    }
                } else {
                    context.wetoast.toast({
                        title: courseDetailResult.head.message
                    })
                }
                let coursePlayInfoResult = results[2]
                if (coursePlayInfoResult.head.code == app.constant.network_result_success) {
                    context.setData({
                        coursePlayInfo: coursePlayInfoResult.data
                    })
                } else {
                    context.wetoast.toast({
                        title: coursePlayInfoResult.head.message
                    })
                }
                // 设置学习控制管理器的初始数据
                studyPlayerManager.setStudyPlayerInitializeData(context, context.data.courseInfo.coursePicPath, context.data.coursePlayInfo, context.data.isTest, app.userInfo.userId, context.data.trainingClassId, context.data.queryOptions.courseId, context.data.chapterList, context.data.courseInfo.marker, context.uploadProgressSynchronizationAct)
            })
            .catch(function (reason) {
                console.log("reason")
                console.log(reason)
                wx.hideLoading()
                context.wetoast.toast({
                    title: '数据获取失败'
                })
            });

        this.loadTeacherInfo();//获取教师信息
        this.loadCourseEvaluationInfo();//获取评价信息

        // 加载试题列表
        this.loadPopQuestionList()
        popQuestionEngine.loginExam(this)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log('onShow')
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        studyPlayerManager.hideStudyPlayerManager()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        popQuestionEngine.deallocPopQuestionEngine()
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

    submitAppraise:function(){
        var that=this;
        var appraiseKey=this.selectComponent("#courseDetailAppraise").data.key;

        var param = {
            userId: app.userInfo.userId, 		// 用户Id
            courseId: that.data.queryOptions.courseId, 	// 课程Id
            coursePoolId: that.data.queryOptions.poolId, 	// 课程包id
            schemeId: that.data.trainingClassId, 	// 培训班Id
            evaluationScore: appraiseKey 		// 课程评分
        };
        console.log(param);
        //return false;
        wx.showLoading({title: '加载中......', mask: true});
        app.requestData(app.config.submitEvaluationCourse, param, "POST").then(data => {
            wx.hideLoading();
            if (data.head.code === app.constant.network_result_success) {
                that.wetoast.toast({title: '评价成功'});
                that.loadCourseEvaluationInfo(data.data.courseEvaluationId);
            }else{
                wx.showToast({
                    title: data.head.message,
                    icon: 'none'
                })
            }
        }).catch(e => {
            wx.hideLoading();
            console.log(e)
        })
        console.log(appraiseKey);
    },


    loadCourseEvaluationInfo:function(){
        var courseEvaluationId=arguments[0]?arguments[0]:this.data.queryOptions.courseEvaluationId;
        var that=this;
        if(courseEvaluationId){
            var param={
                courseEvaluationId:courseEvaluationId
            };
            console.log(courseEvaluationId);
            app.requestData(app.config.getEvaluationCourse, param, "GET").then(data => {
                if (data.head.code === app.constant.network_result_success) {

                    that.data.evaluationScore=data.data.evaluationScore;
                    that.data.evaluation=data.data.evaluation;
                    that.data.evaluationTime=data.data.evaluationTime;
                    that.setData({
                        evaluationScore:that.data.evaluationScore,
                        evaluation:that.data.evaluation,
                        evaluationTime:that.data.evaluationTime
                    });

                }else{
                    wx.showToast({
                        title: data.head.message,
                        icon: 'none'
                    })
                }
            }).catch(e => {
                console.log(e)
            })


        }else{
            that.data.evaluationScore=initStarKey;
            that.data.evaluation=false;
            that.setData({
                evaluationScore:that.data.evaluationScore,
                evaluation:that.data.evaluation
            });
        }
    },

    loadTeacherInfo:function(){
        var that=this;
        var courseId=this.data.queryOptions.courseId;
        ///mobile/user/mobileTrainingClass/getLecturerInfo
        var param={
            courseId:courseId
        };
        app.requestData(app.config.getLecturerInfo, param, "GET").then(data => {
            if (data.head.code === app.constant.network_result_success) {

                that.data.teacherInfo=data.data.teacherList;
                that.setData({
                    teacherInfo:that.data.teacherInfo
                });
            }else{
                wx.showToast({
                    title: data.head.message,
                    icon: 'none'
                })
            }
        }).catch(e => {
            console.log(e)
        })
        console.log(courseId);
    },

    // 获取数据
    /**
     * 获取课程详情
     */
    loadCourseDetailInfo() {
        getApp().getServeContextInfo()
        let param = {
            courseId: this.data.queryOptions.courseId,
            objectType: this.data.queryOptions.objectType,
            objectValue: this.data.queryOptions.objectValue,
            packageId: this.data.queryOptions.packageId
        }
        return app.requestData(app.config.courseDetailInfo, param, 'POST')
    },
    /**
     * 获取班级章节
     */
    loadCourseChapterListInfo() {
        let param = {
            courseId: this.data.queryOptions.courseId,
            objectType: this.data.queryOptions.objectType,
            objectValue: this.data.queryOptions.objectValue,
            packageId: this.data.queryOptions.packageId
        }
        return app.requestData(app.config.courseChapterList, param, 'POST')
    },
    /**
     * 获取课程的播放信息
     */
    loadCoursePlayInfo() {
        let param = {
            courseId: this.data.queryOptions.courseId,
            objectType: this.data.queryOptions.objectType,
            objectValue: this.data.queryOptions.objectValue,
            playType: 0,
            packageId: this.data.queryOptions.packageId
        }
        return app.requestData(app.config.courseVideoPlayInfo, param, 'POST')
    },
    /**
     * 获取弹窗题信息列表
     */
    loadPopQuestionList() {
        let param = {
            courseId: this.data.queryOptions.courseId,
            objectType: this.data.queryOptions.objectType,
            objectValue: this.data.queryOptions.objectValue,
            playType: 0,
            packageId: this.data.queryOptions.packageId
        }
        let context = this
        app.requestData(app.config.coursePopQuestionList, param, 'POST').then(function (results) {
            if (results.head.code == app.constant.network_result_success) {
                context.setData({
                    courseWareQuestionList: results.data.courseWareQuestionList
                })
            } else {
                context.wetoast.toast({
                    title: '弹窗题数据获取失败！'
                })
            }
        })
    },
    /**
     * 课件选中事件
     */
    couseSelectedAction(e) {
        if (e.currentTarget.dataset.courseWare) {
            //必须该操作在前（该操作中有修改进度的操作），先修改进度，再重新赋值选中课件
            studyPlayerManager.playChooseCourseWare(e.currentTarget.dataset.courseWare)
            this.setData({
                selectedCourseWare: e.currentTarget.dataset.courseWare,
            })
            // 为当前选中的弹窗题赋值
            let mediaId = this._getSelectedMediaId()
            popQuestionEngine.selectedCourseWareWithDatas(this, this.data.courseWareQuestionList, this.data.selectedCourseWare, this.data.selectedCourseWare.coursewareId, this.data.queryOptions.courseId, mediaId, this.data.courseInfo.marker, this.data.selectedCourseWare.coursewareLength)
        } else {
            this.wetoast.toast({
                title: '选择课件失败！'
            })
        }

    },
    /**
     * 滑动切换tab
     */
    bindChange: function (e) {
        var that = this;
        that.setData({currentTab: e.detail.current});
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
     * 章节点击事件
     */
    chapterTapAction(e) {
        let chapterArray = this.data.chapterList
        let index = e.currentTarget.dataset.currentIndex
        chapterArray[index].isOpen = !chapterArray[index].isOpen
        this.setData({
            chapterList: chapterArray
        })
    },
    // 与上传进度同步的回调方法，实质为修改进度
    uploadProgressSynchronizationAct() {
        this.changeCurrentProcess()
    },
    /**
     * 修改当前视频播放进度
     */
    changeCurrentProcess() {
        if (!this.data.selectedCourseWare.coursewareId) {
            return
        }
        let maxTime = parseInt(wx.getStorageSync('maxTime')) ? parseInt(wx.getStorageSync('maxTime')) : 0;
        // pdf类型
        if (this.data.selectedCourseWare.type === 1) {
            maxTime = this.data.selectedCourseWare.coursewareLength
        }
        let array = this.data.chapterList
        for (let index in array) {
            let chapterObject = array[index]
            for (let subIndex in chapterObject.coursewareList) {
                let courseObject = chapterObject.coursewareList[subIndex]
                if (courseObject.coursewareId == this.data.selectedCourseWare.coursewareId) {
                    if (maxTime >= (this.data.selectedCourseWare.coursewareLength - 20)) {
                        courseObject.schedule = 100
                        courseObject.showSchedule = 100
                    } else {
                        courseObject.schedule = Math.floor(((maxTime / this.data.selectedCourseWare.coursewareLength).toFixed(2)) * 100)
                        courseObject.showSchedule = Math.floor(((maxTime / this.data.selectedCourseWare.coursewareLength).toFixed(2)) * 100)
                    }
                }
            }
        }
        this.setData({
            chapterList: array
        })
    },
    /**
     * 重置列表数据，满足显示需求
     */
    resetChaptListData(chapterListArray) {
        // 遍历添加是否展开的属性
        let array = chapterListArray
        for (let index in array) {
            let chapterObject = array[index]
            for (let subIndex in chapterObject.coursewareList) {
                let courseObject = chapterObject.coursewareList[subIndex]
                courseObject.totalTimeText = courseDetailTool.changeTimeStyle(courseObject.coursewareLength)
                // 解决js中的0.07*100等的失精度算法问题
                courseObject.showSchedule = Math.floor(courseObject.schedule)
            }
            chapterObject.isOpen = true
        }
        this.setData({
            chapterList: array
        })
    },
    /**
     * 视频播放过程中的更新进度事件
     */
    _videoTimeUpdate(event) {
        let currentTime = event.detail
        popQuestionEngine.didUplaodProgressWithDuration(currentTime, this.data.selectedCourseWare.coursewareLength)
    },
    /**
     * 播放结束事件
     */
    _playEndAction() {
        if (this.data.selectedCourseWare.type !== 1 && !this.data.isTest) {
            this.changeCurrentProcess()
        }
    },
    /**
     * 点击视频界面上的播放按钮
     */
    _startFirstPlayAction(event) {
        this.setData({
            selectedCourseWare: event.detail
        })
        // 为当前选中的弹窗题赋值
        let mediaId = this._getSelectedMediaId()
        popQuestionEngine.selectedCourseWareWithDatas(this, this.data.courseWareQuestionList, this.data.selectedCourseWare, this.data.selectedCourseWare.coursewareId, this.data.queryOptions.courseId, mediaId, this.data.courseInfo.marker, this.data.selectedCourseWare.coursewareLength)
    },
    // 获取选中课件的媒体id
    _getSelectedMediaId() {
        let multiMediaId = ''
        for (let index = 0; index < this.data.coursePlayInfo.coursewarePlayList.length; index++) {
            let coursePlay = this.data.coursePlayInfo.coursewarePlayList[index]
            if (coursePlay.coursewareId === this.data.selectedCourseWare.coursewareId) {
                if (coursePlay.multimediaList.length >= 1) {
                    multiMediaId = coursePlay.multimediaList[0].multimediaId
                }
            }
        }
        return multiMediaId
    }
})