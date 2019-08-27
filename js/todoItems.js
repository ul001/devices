// jQuery(document).ready(function () {
$("#titleContent").text("待办事项");
// });
$("#tab1").click();

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

function getSelectedTabIndex() {
    var retIndex = $("#tabs").tabs('option', 'active');

    //alert("retIndex="+retIndex);

    return retIndex;

}

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