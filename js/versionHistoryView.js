var historyLog = localStorage.getItem("updateLog");
var videoSrc = localStorage.getItem("videoUrl"); //新的视频播放地址
var appId = "ab55ce55Ac213hlkhl23419f179c5f6f";
if (isAndroid) {
    appId = "ab55ce55Ac213hlkhl23419f179c5f6f";
} else if (isIOS) {
    appId = "iose70eeb320a58230925c02e7";
}

var jumpId = Substation.GetQueryString("jumpId");
var isPush = "0";
if (jumpId != undefined && jumpId != null && jumpId != "") {
    isPush = "1";
}

if (isPush == "0" && historyLog) {
    //配置说明
    historyLog = JSON.parse(historyLog);
    var reg = new RegExp("<br>", "g"); //g,表示全部替换。
    historyLog.replace(reg, "/n");
    //配置视频
    if(videoSrc==undefined || videoSrc=="" || videoSrc==null){
        $("#videoRoom").remove();
        $("#updateLog").css("height","calc(100% - 10px)");
    }else{
        document.getElementById("videoplay").src = videoSrc;
        document.getElementById("videoplay").play();
    }
    $("#updateLog").html(historyLog);
//    document.getElementById("videoplay").play();
} else {
    getData();
}

function getData() {
    $.ajax({
        type: "GET",
        url: "http://116.236.149.165:8090/SubstationWEBV2/sys/getAndroidVersionHistory",
        data: {
            fId: appId
        },
        beforeSend: function (request) {
            // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
            //                        request.setRequestHeader("Authorization", tokenFromAPP);
            $.showPreloader(Operation['ui_loading']);
        },
        success: function (data) {
            $.hidePreloader();
            if (data == undefined) {

                return;
            } else {
                if (data.code == "200") {

                    if (data.data == null || data.data == "" || data.data == undefined) {

                    } else {
                        videoUrl = 'http://116.236.149.165:8090/' + data.data.fileURL + '/';
                        if (data.data.list != undefined && data.data.list.length > 0) {
                            var showDate = data.data.list[0];
                            historyLog = showDate.fUpdatelog;
                            videoSrc = videoUrl + showDate.fDemofile;
                            //配置说明
                            // historyLog = JSON.parse(historyLog);
                            var reg = new RegExp("<br>", "g"); //g,表示全部替换。
                            historyLog.replace(reg, "/n");
                            //配置视频
                            if(videoSrc==undefined || videoSrc=="" || videoSrc==null){
                                $("#videoRoom").remove();
                                $("#updateLog").css("height","calc(100% - 10px)");
                            }else{
                                document.getElementById("videoplay").src = videoSrc;
                                document.getElementById("videoplay").play();
                            }
                            $("#updateLog").html(historyLog);
                        }
                    }
                } else if (data.code == "5000") {
                    Substation.showCodeTips(data.code);
                    Substation.reportError(JSON.stringify(data.data.stackTrace));
                } else {
                    Substation.showCodeTips(data.code);
                }
            }
        },
        error: function (data) {
            if (data.status == 0) {
                $.toast(Operation['ui_neterror']);
            } else {
                $.toast(Operation['code_fail']);
            }
        },
        complete: function () {
            $.hidePreloader();
        }
    });
}

$(".back_btn").click(function () {
    localStorage.removeItem("historyLog");
    localStorage.removeItem("videoUrl");
    if (isPush == "1") {
        //推送详情点击返回事件
        if (isAndroid) {
            android.goBack();
        } else if (isIOS) {
            //            window.history.back();
            window.webkit.messageHandlers.goBackiOS.postMessage("");
        }
    } else {
        window.history.back();
    }
});