var videoUrl;

function getData() {
    $.ajax({
        type: "GET",
        url: "http://www.acrelcloud.cn/SubstationWEBV2/sys/getVersionHistory",
        data: {
            fId: appId
        },
        beforeSend: function (request) {
            // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
            //                        request.setRequestHeader("Authorization", tokenFromAPP);
            $.showPreloader(Operation['ui_loading']);
        },
        success: function (data) {
            if (data == undefined) {
                $("#noDataDiv").show();
                return;
            } else {
                if (data.code == "200") {
                    $(".list-container").empty();
                    if (data.data == null || data.data == "" || data.data == undefined) {
                        $("#noDataDiv").show();
                    } else {
                        videoUrl = 'http://www.acrelcloud.cn/' + data.data.fileURL + '/';
                        if (data.data.list != undefined && data.data.list.length > 0) {
                            $(data.data.list).each(function () {
                                $(".list-container").append("<li class=\"item-content item-link update-li\" data-str='" + JSON.stringify(this.fUpdatelog) + "'  data-str2=" + this.fDemofile + ">\n" +
                                    "                        <div class=\"item-inner\">\n" +
                                    "                            <div class=\"item-title-row\">\n" +
                                    "                                <div class=\"item-title\">" + Operation['ui_version'] + this.fVersion + Operation['ui_mainUpdate'] + "</div>\n" +
                                    "                            </div>\n" +
                                    "                            <div class=\"item-subtitle\">" + Operation['ui_updateTime'] + "<span class=\"blueColor\">" + this.fUpdatetime.substring(0, 10) + "</span></div>\n" +
                                    "                        </div>\n" +
                                    "                    </li>");
                                // $(".list-container").append("<li class=\"item-content item-link update-li\" data-str='" + JSON.stringify(this.fUpdatelog.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')) + "'>\n" +
                                //     "                        <div class=\"item-inner\">\n" +
                                //     "                            <div class=\"item-title-row\">\n" +
                                //     "                                <div class=\"item-title\">" + Operation['ui_version'] + this.fVersion + Operation['ui_mainUpdate'] + "</div>\n" +
                                //     "                            </div>\n" +
                                //     "                            <div class=\"item-subtitle\">" + Operation['ui_updateTime'] + "<span class=\"blueColor\">" + this.fUpdatetime.substring(0, 10) + "</span></div>\n" +
                                //     "                        </div>\n" +
                                //     "                    </li>");
                            });
                            addClick();
                        } else {
                            $("#noDataDiv").show();
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

function addClick() {
    $(".item-link.update-li").click(function () {
        var thisLog = $(this).attr("data-str");
        localStorage.setItem("updateLog", thisLog);
        var url = $(this).attr("data-str2");
        if (url == "undefined" || url == undefined || url == "" || url == null) {
            localStorage.removeItem("videoUrl");
        } else {
            localStorage.setItem("videoUrl", videoUrl + url);
        }
        //        console.log(thisLog);
        if (isAndroid) {
            var historyLog = JSON.parse(thisLog);
            var reg = new RegExp("<br>", "g"); //g,表示全部替换。
            historyLog.replace(reg, "/n");
            android.goToDetailView(videoUrl + url, historyLog);
        } else {
            window.location.href = "versionHistoryView.html";
        }
    });
}

getData();

$(".back_btn").click(function () {
    if (isIOS) {
        window.webkit.messageHandlers.goBackiOS.postMessage("");
    } else if (isAndroid) {
        android.goBack();
    }
});

$.init();