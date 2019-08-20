var unreadCountSum = 0;
var bianweiCount = 5;
var yuexianCount = 37;
var platformCount = 2;

var string = '<span class="badge" id="bianweiCount">' + bianweiCount + '</span>';
$("#bianwei").html(string);

var string = '<span class="badge" id="yuexianCount">' + yuexianCount + '</span>';
$("#yuexian").html(string);

var string = '<span class="badge" id="platformCount">' + platformCount + '</span>';
$("#platform").html(string);

function fillData(parentId) {

    Substation.getDataByAjax("/getUnreadWarningMessage", {}, function (data) {
        if (!data.length) {
            return;
        }
        $(data).each(function (key, value) {
            var name = value.name;
            if (name == "遥测越限") {
                $("#bianweiCount").html(value.count);
            } else if (name == "遥信变位") {
                $("#yuexianCount").html(value.count);
            } else if (name == "平台运行") {
                $("#platformCount").html(value.count);
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
            // if (fField != "" && fField != null) {
            localStorage.setItem("fTempId", clickId);
            //localStorage.setItem("fFunctionfield",fField);
            localStorage.setItem("fPid", parentId);
            window.location.href = "alarmsDetail.html";
        });
    });
    // }
    // });
}

fillData(0);