$(".tab-link").click(function () {
    if ($("#daiban").attr("id") == "daiban") {
        // url = "/getWarningMessageSignalEvents";
        $(".title").html("待办事项");
    } else if ($("#zaiban").attr("id") == "zaiban") {
        // url = "/getWarningMessageOverLimitEvents";
        $(".title").html("在办事项");
    } else if ($("#banbi").attr("id") == "banbi") {
        // url = "/getWarningMessagePlatformRunEvents";
        $(".title").html("办毕事项");
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

$.init();