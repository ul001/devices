var unreadCountSum = 0;
var bianweiCount = 0;
var yuexianCount = 0;
var platformCount = 0;

function fillData(parentId) {

    Substation.getDataByAjax("/getUnreadWarningMessage", {}, function (data) {
        if (!data.length) {
            return;
        }
        $(data).each(function (key, value) {
            var name = value.name;
            if (name == "遥测越限") {
                if (value.count > 0) {
                    var string = '<span class="badge" id="bianweiCount">' + value.count + '</span>';
                    $("#bianwei").html(string);
                }
            } else if (name == "遥信变位") {
                if (value.count > 0) {
                    var string = '<span class="badge" id="yuexianCount">' + value.count + '</span>';
                    $("#yuexian").html(string);
                }
            } else if (name == "平台运行") {
                if (value.count > 0) {
                    var string = '<span class="badge" id="platformCount">' + value.count + '</span>';
                    $("#platform").html(string);
                }
            }
            unreadCountSum += value.count;
        });

        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓系统
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
        if (isIOS) {
            //iOS回调未读数
            var message = {
                'unreadCountSum': unreadCountSum
            };
            window.webkit.messageHandlers.jsToOcWithPrams.postMessage(message);
        } else {

        }
        $(".item-link").unbind().click(function () {
            var clickId = $(this).attr("id");
            var titleName = $(this).find($(".item-title")).text();
            if (clickId != "" && clickId != null) {
                if (isIOS) {
                    window.webkit.messageHandlers.needHiddenTabbar.postMessage("YES");
                } else {
                    android.goToWebActivity(titleName,"alarmsDetail.html?clickID="+clickId);
                }
            }
        });
    });
    // }
    // });
}

fillData(0);