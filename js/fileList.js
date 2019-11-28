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
//menuId = 350;
}

// window.addEventListener('pageshow', function (e) {
//     //ios系统 返回页面 不刷新的问题 Safari内核缓存机制导致 方案一 方案二：设置meta标签，清除页面缓存
//     var u = navigator.userAgent,
//         app = navigator.appVersion;
//     var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
//     if (e.persisted && isIOS) {
//         // var needUpdate = localStorage.getItem("need-update");
//         // if (needUpdate) {
//         //     localStorage.removeItem("need-update");
//         // window.location.reload();
//         // }
//         window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
//     }
// });

function loadMenu() {
    $(".list-container").empty();
    $.showPreloader();
    Substation.getDataByAjaxNoLoading("/selectDocumentCategory", {
        pid: menuId
    }, function (data) {
        if (data.hasOwnProperty("documentsCategories") && data.documentsCategories.length > 0) {
            $(data.documentsCategories).each(function () {
                $(".list-container").append("<li class=\"item-content item-link\" \" value=\"" + this.fCategoryid + "\">\n" +
                    "                        <div class=\"item-media\"><i class=\"icon icon-file\"></i></div>\n" +
                    "                        <div class=\"item-inner\">\n" +
                    "                            <div class=\"item-title\">" + this.fCategoryname + "</div>\n" +
                    '                         <div class="item-after" id=""itemAfter"></div>\n' +
                    "                        </div>\n" +
                    "                    </li>")
            });
            fillData(0);
        }
        $.hidePreloader();
    });
}

function fillData(parentId) {
    // Substation.getDataByAjaxNoLoading("/getUnreadWarningMessage", {}, function (data) {
    //     if (!data.length) {
    //         return;
    //     }
    //     $(data).each(function (key, value) {
    //         var name = value.name;
    //         if (name == "遥测越限") {
    //             if ($("#yuexian")) {
    //                 if (value.count > 0) {
    //                     var string = '<span class="badge">' + value.count + '</span>';
    //                     $("#yuexian").html(string);
    //                     unreadCountSum += value.count;
    //                 }
    //             }
    //         } else if (name == "遥信变位") {
    //             if ($("#bianwei")) {
    //                 if (value.count > 0) {
    //                     var string = '<span class="badge">' + value.count + '</span>';
    //                     $("#bianwei").html(string);
    //                     unreadCountSum += value.count;
    //                 }
    //             }
    //         } else if (name == "平台运行") {
    //             if ($("#platform")) {
    //                 if (value.count > 0) {
    //                     var string = '<span class="badge">' + value.count + '</span>';
    //                     $("#platform").html(string);
    //                     unreadCountSum += value.count;
    //                 }
    //             }
    //         }
    //     });
    //     if (isIOS) {
    //         //iOS回调未读数
    //         var message = {
    //             'unreadCountSum': unreadCountSum
    //         };
    //         window.webkit.messageHandlers.jsToOcWithPrams.postMessage(message);
    //     } else {
    //         android.getAlarmNum(unreadCountSum);
    //     }
    //    

    // });
    // }
    // });

    $(".item-link").unbind().click(function () {
        var clickId = $(this).attr("value");
        var titleName = $(this).find($(".item-title")).text();
        localStorage.setItem("titleName", titleName);
        if (clickId != "" && clickId != null) {
            //                if (isIOS) {
            //                    window.webkit.messageHandlers.pushNewWebView.postMessage({
            //                        "title": titleName,
            //                        "url": "?clickID=" + clickId
            //                    });
            //                } else {
            if (isAndroid) {
//                android.goToWebActivity(titleName, "fileManagement.html?clickID=" + clickId);
                window.location.href = "fileManagement.html?clickID=" + clickId;
            } else if (isIOS) {
                window.location.href = "fileManagement.html?clickID=" + clickId;
                window.webkit.messageHandlers.needHiddenTabbar.postMessage("YES");
            } else {
                window.location.href = "fileManagement.html?clickID=" + clickId;
            }
        }
    });

}

$(".back_btn").click(function () {
    if (isIOS) {
        localStorage.clear();
        window.webkit.messageHandlers.goBackiOS.postMessage("");
    } else {
        android.goBack();
    }
});

loadMenu();

$.init();