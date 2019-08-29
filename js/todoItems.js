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

    $("#tab1").click();

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
    $("#dealMission").click(function () {
        localStorage.setItem("fSubname", "任务详情");
        localStorage.setItem("showType", "missionDoing");
        localStorage.setItem("missionType", "patrol");
        window.location.href = "missionDetail.html";
    });

    //我要处理 巡视
    $("#dealMission1").click(function () {
        localStorage.setItem("fSubname", "任务详情");
        localStorage.setItem("showType", "missionDoing");
        localStorage.setItem("missionType", "patrol");
        window.location.href = "missionDetail.html";
    });

    //现场交接
    $("#dealMission2").click(function () {
        localStorage.setItem("fSubname", "任务详情");
        localStorage.setItem("showType", "missionDoing");
        localStorage.setItem("missionType", "scene");
        window.location.href = "missionDetail.html";
    });

    //缺陷整改
    $("#dealMission3").click(function () {
        localStorage.setItem("fSubname", "任务详情");
        localStorage.setItem("showType", "missionDoing");
        localStorage.setItem("missionType", "defect");
        window.location.href = "missionDetail.html";
    });

    //点击卡片
    $("#cardFinish").click(function () {
        localStorage.setItem("fSubname", "任务详情");
        localStorage.setItem("showType", "missionFinish");
        window.location.href = "missionDetail.html";
    });

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
                {
                    text: '首次拜访',
                    onClick: function () {
                        $(".clickrightbtn").text("首次拜访");
                    }
                },
                {
                    text: '拜访',
                    onClick: function () {
                        $(".clickrightbtn").text("拜访");
                    }
                },
                {
                    text: '交接驱动',
                    onClick: function () {
                        $(".clickrightbtn").text("交接驱动");
                    }
                },
                {
                    text: '现场交接',
                    onClick: function () {
                        $(".clickrightbtn").text("现场交接");
                    }
                },
                {
                    text: '巡视',
                    onClick: function () {
                        $(".clickrightbtn").text("巡视");
                    }
                },
                {
                    text: '缺陷整改',
                    onClick: function () {
                        $(".clickrightbtn").text("缺陷整改");
                    }
                },
                {
                    text: '合同收款',
                    onClick: function () {
                        $(".clickrightbtn").text("合同收款");
                    }
                },
                {
                    text: '合同续签',
                    onClick: function () {
                        $(".clickrightbtn").text("合同续签");
                    }
                },
            ]
        })
    });

    $.init();
});