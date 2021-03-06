const app = getApp();
let initStarKey=4.5
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        condition: {
            type: Boolean,
            value: false
        },
        choiceHourse: {
            type: String,
            value: '0'
        },
        needHourse: {
            type: String,
            value: '0'
        },
        courseList: {
            type: Array,
            value: []
        },
        trainingClassId: {
            type: String,
            value: '',
            observer: function (nv) {
                var that = this;
                if (nv) {
                    //console.log(nv);
                    app.requestData(app.config.getAssessRequireInfoById, {trainingClassId: nv}, "POST").then(function (res) {
                        console.log(that.data);
                        //requiredHours:0,//必修
                        //courseChooseHours:0//选修
                        that.data.courseChooseHours = res.data.courseChooseHours;
                        that.data.requiredCourseHours = res.data.requiredCourseHours;
                        that.setData({
                            courseChooseHours: that.data.courseChooseHours,
                            requiredCourseHours: that.data.requiredCourseHours
                        });
                    });
                }
            }

        },
        requireCourseHours: {
            type: String,
            value: 0
        },
        hasInterestCourse: {
            type: Boolean,
            value: false
        },
        hasSelectCourse: {
            type: Boolean,
            value: false
        },
        periodType: {
            type: Number,
            valuse: 0
        },
        wholeRemainingHours: {
            type: Number,
            valuse: 0
        },
        optionalPackageRequires: {
            type: Boolean,
            value: false
        },
        courseRequireHours: {
            type: Number,
            valuse: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showAppraise: false,
        appraiseKey:0,
        courseId:'',
        poolId:'',
        canClick:true//如果评价过了就不能点击星星 默认是可以点击
    },
    created() {
        // 初始化
        new app.AlertMessage(this)
        new app.WeToast(this)
    },
    /**
     * 组件的方法列表
     */
    methods: {
        openAppraise: function (e) {
            //console.log(e);
            var item =e.currentTarget.dataset.item;
            var that = this;
            this.data.showAppraise = true;
            this.data.courseId=item.courseId;
            this.data.poolId=item.poolId;
            this.data.evaluationTime=item.evaluationTime;
            if(item.evaluationScore){
                this.data.appraiseKey=item.evaluationScore;
            }else{
                this.data.appraiseKey=0;
            }

            if(item.evaluation){
                that.data.canClick=false;
            }else{
                that.data.canClick=true;
            }

            this.setData({
                showAppraise: that.data.showAppraise,
                courseId:that.data.courseId,
                poolId:that.data.poolId,
                appraiseKey:that.data.appraiseKey,
                canClick:that.data.canClick,
                evaluationTime:that.data.evaluationTime
            });
        },

        closeAppraise: function () {
            console.log(1);
            var that = this;
            this.data.showAppraise = false;
            this.data.courseId='';
            this.data.poolId='';
            this.data.appraiseKey=0;
            this.setData({
                showAppraise: that.data.showAppraise,
                courseId:that.data.courseId,
                poolId:that.data.poolId,
                appraiseKey:that.data.appraiseKey
            });
        },

        submitAppraise:function(){


            if(!this.data.canClick){
                wx.showToast({
                    title: ' 您已评价过当前课程',
                    icon: 'none'
                })
                return false;
            }

            let pages = getCurrentPages();
            let curPage = pages[pages.length - 1];
            //this.curPage=curPage;
            console.log(curPage);
            //return false;
            //console.log(app);
            var that=this;
            var appraiseKey=this.selectComponent("#detailAppraise").data.key;
            var param = {
                userId: app.userInfo.userId, 		// 用户Id
                courseId: that.data.courseId, 	// 课程Id
                coursePoolId: that.data.poolId, 	// 课程包id
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
                    curPage.requestCourseList(1);
                    that.closeAppraise();
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


        goChoiceCourse() {
          if (this.properties.condition && this.data.periodType!=2) {
                this.triggerEvent('goToChoiceCourseCallback')
                return
            }
            wx.navigateTo({
                url: '/pages/choiceCourseModule/selectedCourse/selectedCourse?' + "trainingClassId=" + this.data.trainingClassId
            })
            app.constant.classDetailSceneType = 4
        },
        onPullDownRefresh() {
            wx.showNavigationBarLoading()
        },
        /**
         * 兴趣课点击事件
         */
        interestClick() {
            wx.navigateTo({
                url: '/pages/trainclass/interestCourse/interestCourse' + '?trainingClassId=' + this.data.trainingClassId,
            })
        },
        /**
         * 视频播放
         */
        coursePlayClick(e) {
            app.constant.classDetailSceneType = 1
            var item = e.currentTarget.dataset.item
            wx.navigateTo({
                url: '/pages/course/coursedetail/courseDetail' + '?trainingClassId=' + this.data.trainingClassId + '&courseId=' + item.courseId + '&type=' + '1'+'&courseEvaluationId='+item.courseEvaluationId+'&poolId='+item.poolId
            })
        }
    }
})
