// jQuery(document).ready(function () {
$("#titleContent").text("待办事项");
// });
$(".tab-link").click(function () {
    if ($("#daiban").attr("id") == "daiban") {
        // url = "/getWarningMessageSignalEvents";
        $("#titleContent").text("待办事项");
    } else if ($("#zaiban").attr("id") == "zaiban") {
        // url = "/getWarningMessageOverLimitEvents";
        $("#titleContent").text("在办事项");
    } else if ($("#banbi").attr("id") == "banbi") {
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

$("#dealMission").click(function () {
    localStorage.setItem("fSubname", "任务详情");
    window.location.href = "missionDetail.html";
});

$.init();