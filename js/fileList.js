var unreadCountSum = 0;
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var menuId = "350";
if (isIOS) {
    window.webkit.messageHandlers.iOS.postMessage(null);
    var storage = localStorage.getItem("accessToken");
    storage = JSON.parse(storage);
    menuId = storage.fmenuId;
} else if (isAndroid) {
    menuId = android.getMenuId();
}

var clickSubid;
var subObj = JSON.parse(localStorage.getItem("subObj"));
try {
    if (isAndroid) {
        subObj = JSON.parse(android.getSpItem("subObj"));
    }
} catch (e) {}
var selectSubid = "";
var clickName;
if (subObj != null && subObj != undefined) {
    selectSubid = subObj.subId;
    clickName = subObj.subName;
    $("#subName").text(clickName);
    //  $("#search").val(subObj.subName);
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
    $.showPreloader(Operation['ui_loading']);
    Substation.getDataByAjaxNoLoading("/selectDocumentCategory", {
        pid: menuId,
        fSubId: selectSubid
    }, function (data) {
        //增加常驻按钮 全部
        $(".list-container").append("<li class=\"item-content item-link selectLine\" \" value=\"" + -1 + "\"\">\n" +
            "                        <div class=\"item-media\"><i class=\"icon icon-file\"></i></div>\n" +
            "                        <div class=\"item-inner\">\n" +
            "                            <div class=\"item-title\">全部</div>\n" +
            '                         <div class="item-after" id=""itemAfter"></div>\n' +
            "                        </div>\n" +
            "                    </li>")

        if (data.hasOwnProperty("documentsCategories") && data.documentsCategories.length > 0) {
            $(data.documentsCategories).each(function () {
                $(".list-container").append("<li class=\"item-content item-link selectLine\" \" value=\"" + this.fCategoryid + "\"\">\n" +
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
    }, function (errorcode) {});
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
    var upLoadClicktag = true;
    $(".item-link").unbind().click(function () {
        if (!upLoadClicktag) {
            return;
        }
        upLoadClicktag = false;
        setTimeout(function () {
            upLoadClicktag = true;
        }, 1000);
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

$('#searchBtn').click(function () {
    // var start = new Date($("#dateStart").val().replace(/-/g, '/'));
    // var end = new Date($("#dateEnd").val().replace(/-/g, '/'));
    // if (start > end) {
    //     $.toast(Operation['ui_dateselecttip']);
    //     return;
    // }
    $(".close-panel").click();
    /*    if(saveParam!=null){
            clickSubid = saveParam['fSubid'];
            saveParam=null;
        }*/
    if ($("#search").val() == "") {
        //        $("#subName").text("所有变电所");
        selectSubid = "";
    } else if (clickSubid != "") {
        //        $("#subName").text($("#search").val());
        selectSubid = clickSubid;
        var subObj = {
            subId: clickSubid,
            subName: clickName
        };
        localStorage.setItem("subObj", JSON.stringify(subObj));
        try {
            if (isAndroid) {
                android.setSpItem("subObj", JSON.stringify(ubObj));
            }
        } catch (e) {}
        clickSubid = "";
        $("#subName").text(clickName);
    }
    $("#outTip").hide();
    loadMenu();
});

$("#dateStart").calendar();
$("#dateEnd").calendar();
$("#listContainer").hide();

$("#outTip").click(function () {
    $("#outTip").hide();
});

function getSomeSubstation(isAll) {
    var url = "/getSubListByLetter";
    if (isAll == 1) {
        url = "/getSubstationListByUser";
    }
    var listObj = [];
    var searchKey = $("#search").val();
    var params = {
        key: searchKey
    }
    $("#listContainer").empty();
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        if (isAll == 1) {
            listObj = data.list;
        } else {
            listObj = data;
        }
        $(listObj).each(function () {
            $("#listContainer").append('<li class="item-content" data-id="' + this.fSubid + '">' +
                '<div class="item-inner">' +
                '<div class="item-title showTitleImg">' + this.fSubname + '</div>' +
                '</div>' +
                '</li>');
        });
        $("#listContainer").show();
        $("#listContainer .item-content").unbind().click(function () {
            clickSubid = $(this).attr("data-id");
            clickName = $(this).find(".item-title").text();
            $("#search").val(clickName);
            $("#listContainer").empty();
            $("#listContainer").hide();
            //            $("#subName").text(clickName);
        });
    });
}

$('#search').bind('keydown', function (event) {
    if (event.keyCode == 13) {
        if ($("#search").text() == "") {
            getSomeSubstation(1);
        } else {
            getSomeSubstation();
        }
        document.activeElement.blur();
    }
});

$('#search').on("input", function () {
    if ($("#search").val().length > 0) {
        $(".icon.icon-clear").show();
    } else {
        $(".icon.icon-clear").hide();
    }
});

$('#search').on("focus", function () {
    if ($("#search").val().length > 0) {
        $(".icon.icon-clear").show();
    } else {
        $(".icon.icon-clear").hide();
    }
});

/*$('#search').blur(function(){
    $(".icon.icon-clear").hide();
});*/

$(".icon.icon-clear").click(function () {
    $("#search").val("");
    getSomeSubstation(1);
    $(this).hide();

});
getSomeSubstation(1);

$(".back_btn").click(function () {
    if (isIOS) {
        localStorage.clear();
        window.webkit.messageHandlers.goBackiOS.postMessage("");
    } else {
        android.goBack();
    }
});

if (selectSubid != '' && selectSubid != undefined) {
    loadMenu();
    $("#outTip").hide();
} else {
    $(".pull-right").click();
    $.toast(Operation['ui_subSelectTip']);
}

$.init();