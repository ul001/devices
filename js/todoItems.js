jQuery(document).ready(function () {
    $("#titleContent").text("待办事项");

    $(".buttons-tab .tab-link").click(function () {
        var i = $(this).index();
        if (i == 0) {
            // url = "/getWarningMessageSignalEvents";
            $("#titleContent").text("待办事项");
        } else if (i == 1) {
            // url = "/getWarningMessageOverLimitEvents";
            $("#titleContent").text("在办事项");
        } else if (i == 2) {
            // url = "/getWarningMessagePlatformRunEvents";
            $("#titleContent").text("办毕事项");
        }
    });

    $(".back_btn").click(function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓系统
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
        if (isIOS) {
            window.webkit.messageHandlers.goBackiOS.postMessage("");
        } else {
            android.goBack();
        }
    });

    //我要处理 巡视
    // $("#dealMission1").click(function () {
    //     localStorage.setItem("fSubname", "任务详情");
    //     localStorage.setItem("showType", "missionDoing");
    //     localStorage.setItem("missionType", "patrol");
    //     window.location.href = "missionDetail.html";
    // });

    // //现场交接
    // $("#dealMission2").click(function () {
    //     localStorage.setItem("fSubname", "任务详情");
    //     localStorage.setItem("showType", "missionDoing");
    //     localStorage.setItem("missionType", "scene");
    //     window.location.href = "missionDetail.html";
    // });

    // //缺陷整改
    // $("#dealMission3").click(function () {
    //     localStorage.setItem("fSubname", "任务详情");
    //     localStorage.setItem("showType", "missionDoing");
    //     localStorage.setItem("missionType", "defect");
    //     window.location.href = "missionDetail.html";
    // });



    //点击卡片
    // $(".card").click(function () {
    //     var id = this.attr("id");
    //     localStorage.setItem("fSubname", "任务详情");
    //     localStorage.setItem("showType", "missionFinish");
    //     window.location.href = "missionDetail.html";
    // });

    //右上角按钮事件
    $(".clickrightbtn").click(function () {
        $.modal({
            title: '任务类型筛选',
            text: '',
            verticalButtons: true,
            buttons: [{
                    text: '全部',
                    onClick: function () {
                        $(".clickrightbtn").text("全部");

                    }
                },
                // {
                //     text: '首次拜访',
                //     onClick: function () {
                //         $(".clickrightbtn").text("首次拜访");
                //     }
                // },
                // {
                //     text: '拜访',
                //     onClick: function () {
                //         $(".clickrightbtn").text("拜访");
                //     }
                // },
                // {
                //     text: '交接驱动',
                //     onClick: function () {
                //         $(".clickrightbtn").text("交接驱动");
                //     }
                // },
                // {
                //     text: '现场交接',
                //     onClick: function () {
                //         $(".clickrightbtn").text("现场交接");
                //     }
                // },
                {
                    text: '巡视',
                    onClick: function () {
                        $(".clickrightbtn").text("巡视");
                    }
                },
                // {
                //     text: '缺陷整改',
                //     onClick: function () {
                //         $(".clickrightbtn").text("缺陷整改");
                //     }
                // },
                // {
                //     text: '合同收款',
                //     onClick: function () {
                //         $(".clickrightbtn").text("合同收款");
                //     }
                // },
                // {
                //     text: '合同续签',
                //     onClick: function () {
                //         $(".clickrightbtn").text("合同续签");
                //     }
                // },
            ]
        })
    });

    var loading = false;
    var maxItems = 1000;
    var itemsPerLoad = 10;
    var pageNum = 1;

    //点击tab
    $(".tab-link.button").click(function () {
        var tabName = Number(this.name);
        pageNum = 1;
        getFirstPage(tabName);
    });

    $("#tab1").click();

    function getFirstPage(clickNum) {
        var num = "#tab" + clickNum;
        // if (num == 1) {
        //     $("#tab1").empty();
        //     addItems(itemsPerLoad, 0);
        //     lastIndex = 10;
        // } else if (num == 2) {
        //     $("#tab2").empty();
        //     addItems(itemsPerLoad, 0);
        //     lastIndex = 10;
        // } else {
        //     $("#tab3").empty();
        //     addItems(itemsPerLoad, 0);
        //     lastIndex = 10;
        // }
        // $(".list-container").empty();
        $(num).empty();
        $(num).html('<div class="list-container"></div>');
        pageNum = 1;
        addItems(itemsPerLoad, 0, clickNum);
        lastIndex = 10;
        $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
        // $('.infinite-scroll-preloader').html('<div class="list-container"></div>');
        loading = false;
        $.attachInfiniteScroll($('.infinite-scroll'));
    }

    //下拉刷新
    $(document).on('refresh', '.pull-to-refresh-content', function (e) {
        setTimeout(function () {
            var tabName = $(".tab-link.button").attr("name");
            getFirstPage(Number(tabName));
            // done
            $.pullToRefreshDone('.pull-to-refresh-content');
        }, 2000);
    });

    //初始化页面接口
    function addItems(number, lastIndex, clickNum) {
        var text = '';
        var url = "/selectByStateAndType";
        // var searchKey = $("#search").val();
        var params = {
            pageNo: pageNum,
            pageSize: number,
            fTaskstateid: clickNum
            // fSubid: 10100001
            // key: searchKey
        };

        Substation.getDataByAjaxNoLoading(url, params, function (data) {
            var taskList = data.taskList;
            if (taskList.hasOwnProperty("list") && taskList.list.length > 0) {
                var user = this.fTaskcreateuserid;
                var username = "";
                if (user != undefined) {
                    username = user;
                }
                if (clickNum == 3) {
                    $(taskList.list).each(function () {
                        text += "                            <div class=\"card\" id=" + this.fTaskid + ">";
                        text += "                                <div class=\"card-content\">";
                        text += "                                    <div class=\"row no-gutter sub_card\">";
                        text += "                                        <div class=\"col-10\">";
                        text += "                                            <img class=\"showImg\"";
                        text += "                                                src=\"http://gqianniu.alicdn.com/bao/uploaded/i4//tfscom/i3/TB10LfcHFXXXXXKXpXXXXXXXXXX_!!0-item_pic.jpg_250x250q60.jpg\" />";
                        text += "                                        </div>";
                        text += "                                        <div class=\"col-75\">";
                        text += "                                            <p class=\"subName\">" + this.fTaskcontent;
                        text += "                                            </p>";
                        text += "                                            <p><span>" + this.fTaskcreateuserid + "</span>";
                        text += "                                                <span>" + this.fTaskcreatedate + "</span></p>";
                        text += "                                        </div>";
                        text += "                                        <div class=\"col-15\">";
                        text += "                                        </div>";
                        text += "                                    </div>";
                        text += "                                </div>";
                        text += "                            </div>";
                    });
                } else {
                    $(taskList.list).each(function () {
                        text += "                            <div class=\"card\" id=" + this.fTaskid + ">";
                        text += "                                <div class=\"card-content\">";
                        text += "                                    <div class=\"row no-gutter sub_card\">";
                        text += "                                        <div class=\"col-10\">";
                        text += "                                            <img class=\"showImg\"";
                        text += "                                                src=\"http://gqianniu.alicdn.com/bao/uploaded/i4//tfscom/i3/TB10LfcHFXXXXXKXpXXXXXXXXXX_!!0-item_pic.jpg_250x250q60.jpg\" />";
                        text += "                                        </div>";
                        text += "                                        <div class=\"col-75\">";
                        text += "                                            <p class=\"subName\">" + this.fTaskcontent;
                        text += "                                            </p>";
                        text += "                                            <p><span>" + this.fTaskcreateuserid + "</span>";
                        text += "                                                <span>" + this.fTaskcreatedate + "</span></p>";
                        text += "                                        </div>";
                        text += "                                        <div class=\"col-15\">";
                        text += "                                            <button class=\"button button-fill button-success\" id=\"dealMission" + this.fTaskid + "\"";
                        text += "                                                type=\"button\" name=" + this.fTaskid + " >我要处理";
                        text += "                                            </button>";
                        text += "                                        </div>";
                        text += "                                    </div>";
                        text += "                                </div>";
                        text += "                            </div>";
                    });
                }
                $('.list-container').append(text);
                //addClick();
                //我要处理 巡视
                $(".button.button-fill").click(function () {
                    var taskID = this.name;
                    localStorage.setItem("fSubname", "任务详情");
                    localStorage.setItem("showType", "missionDoing");
                    localStorage.setItem("missionType", "patrol");
                    localStorage.setItem("taskID", taskID);
                    window.location.href = "missionDetail.html";
                });
                pageNum++;
            } else {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("--end--");
                return;
            }
            if (data.taskList.length < itemsPerLoad) {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("--end--");
                return;
            }


        });
    }
    addItems(itemsPerLoad, 0, 1);

    var lastIndex = 10;
    //上拉加载
    $(document).on('infinite', '.infinite-scroll', function () {

        // 如果正在加载，则退出
        if (loading) return;

        // 设置flag
        loading = true;

        setTimeout(function () {
            loading = false;

            if (lastIndex >= maxItems) {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("--end--");
                return;
            }
            var tabName = $(".tab-link.button").attr("name");
            addItems(itemsPerLoad, lastIndex, Number(tabName));
            lastIndex = $('.list-container .card').length;
        }, 1000);
    });

    $.init();
});