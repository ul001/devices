var unreadCountSum = 0;
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var menuId;
if (isIOS) {
    window.webkit.messageHandlers.iOS.postMessage(null);
    var storage = localStorage.getItem("accessToken");
    storage = JSON.parse(storage);
    menuId = storage.fmenuId;
} else {
    menuId = android.getMenuId();
}

function loadMenu() {
    $(".content").empty();
    Substation.getDataByAjax("/getSubinfoVoByPid", {
        pid: menuId
    }, function (data) {
        if (data.hasOwnProperty("menuList") && data.menuList.length > 0) {
            $(data.menuList).each(function () {
                $(".content").append("<div class=\"content-block-title\"></div>\n" +
                    "            <div class=\"list-block\">\n" +
                    "                <ul>\n" +
                    "                    <li class=\"item-content item-link\" id=\"" + this.fMenuid + "\" value=\"" + this.fCode + "\">\n" +
                    "                        <div class=\"item-media\"><img src=\"img/alarmPic.png\" width=\"20\"></div>\n" +
                    "                        <div class=\"item-inner\">\n" +
                    "                            <div class=\"item-title\">" + this.fMenuname + "</div>\n" +
                    "                            <div class=\"item-after\" id=\"" + this.fCode + "\"></div>\n" +
                    "                        </div>\n" +
                    "                    </li>\n" +
                    "                </ul>\n" +
                    "                <div class=\"list-block-label\"></div>\n" +
                    "            </div>");
            });
            fillData(0);
        }
    });
}

function fillData(parentId) {
    Substation.getDataByAjaxNoLoading("/getUnreadWarningMessage", {}, function (data) {
        if (!data.length) {
            return;
        }
        $(data).each(function (key, value) {
            var name = value.name;
            if (name == "遥测越限") {
                if ($("#yuexian")) {
                    if (value.count > 0) {
                        var string = '<span class="badge">' + value.count + '</span>';
                        $("#yuexian").html(string);
                        unreadCountSum += value.count;
                    }
                }
            } else if (name == "遥信变位") {
                if ($("#bianwei")) {
                    if (value.count > 0) {
                        var string = '<span class="badge">' + value.count + '</span>';
                        $("#bianwei").html(string);
                        unreadCountSum += value.count;
                    }
                }

            } else if (name == "平台运行") {
                if ($("#platform")) {
                    if (value.count > 0) {
                        var string = '<span class="badge">' + value.count + '</span>';
                        $("#platform").html(string);
                        unreadCountSum += value.count;
                    }
                }
            }
        });
        if (isIOS) {
            //iOS回调未读数
            var message = {
                'unreadCountSum': unreadCountSum
            };
            window.webkit.messageHandlers.jsToOcWithPrams.postMessage(message);
        } else {
            android.getAlarmNum(unreadCountSum);
        }
        $(".item-link").unbind().click(function () {
            var clickId = $(this).attr("value");
            var titleName = $(this).find($(".item-title")).text();
            if (clickId != "" && clickId != null) {
                if (isIOS) {
                    window.webkit.messageHandlers.pushNewWebView.postMessage({
                        "title": titleName,
                        "url": "?clickID=" + clickId
                    });
                } else {
                    android.goToWebActivity(titleName, "alarmsDetail.html?clickID=" + clickId);
                }
            }
        });
    });
    // }
    // });
}

loadMenu();