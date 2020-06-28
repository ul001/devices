var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;
var clickID = Substation.GetQueryString("clickID");
// var clickID = "platform";

var jumpId = Substation.GetQueryString("jumpId");
var isPush = "1";
if (jumpId != undefined && jumpId != null && jumpId != "") {
    clickID = jumpId;
    isPush = "1";
}
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var selectSubid = "";
var clickSubid = "";
var alarmDetailList = [];
var isControl = false;
//var saveAlarmParam = JSON.parse(localStorage.getItem("saveAlarmParam"));
//localStorage.removeItem("saveAlarmParam");
Date.prototype.format = function (fmt) {
    //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
};

function getFirstPage() {
    $(".list-container").empty();
    pageNum = 1;
    addItems(itemsPerLoad, 0);
    lastIndex = 10;
    $(".infinite-scroll-preloader").html('<div class="preloader"></div>');
    loading = false;
    $.attachInfiniteScroll($(".infinite-scroll"));
}

$(document).on("refresh", ".pull-to-refresh-content", function (e) {
    setTimeout(function () {
        getFirstPage();
        // done
        $.pullToRefreshDone(".pull-to-refresh-content");
    }, 2000);
});

function addItems(number, lastIndex) {
    var html = "";
    var url = "/getMessPushLogList";
    var params = {};
    var searchKey = $("#search").val();
    //    if (saveAlarmParam != null && saveAlarmParam != "") {
    //        params = saveAlarmParam;
    //        params['pageNum'] = pageNum;
    //        params['pageSize'] = number;
    //        var startTime = params['fStarttime'];
    //        var endTime = params['fEndtime'];
    //        if (startTime != "" && startTime != null) {
    //            $("#dateStart").val(startTime.substring(0, 10));
    //        }
    //        if (endTime != "" && endTime != null) {
    //            $("#dateEnd").val(endTime.substring(0, 10));
    //        }
    //        if (params['fConfirmstatus'] != undefined) {
    //            $("#fState").val(params['fConfirmstatus']);
    //        }
    //        $("#search").val(params['subName']);
    //    } else {

    params = {
        fPushType: "1",
        pageNo: pageNum,
        pageSize: number
    };
    if (isAndroid) {
        params["fTargetType"] = "Android";
    } else if (isIOS) {
        params["fTargetType"] = "IOS";
    }
    if (selectSubid != "" && selectSubid != null) {
        params["fSubid"] = selectSubid;
    }
    var dateStartVal = $("#dateStart").val();
    var dateEndVal = $("#dateEnd").val();
    var stateVal = $("#fState").val();
    if (dateStartVal != "") {
        params["fStartTime"] = dateStartVal + " 00:00:00";
    } else {
        var myDate = new Date();
        var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
        var firstDayVal = firstDay.format("yyyy-MM-dd");
        params["fStartTime"] = firstDayVal + " 00:00:00";
        Substation.changeCalendar(firstDayVal, "dateStart", "selectStartTime");
    }
    if (dateEndVal != "") {
        params["fEndTime"] = dateEndVal + " 23:59:59";
    } else {
        var myDate = new Date();
        var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
        var lastDayVal = lastDay.format("yyyy-MM-dd");
        params["fEndTime"] = lastDayVal + " 23:59:59";
        Substation.changeCalendar(lastDayVal, "dateEnd", "selectEndTime");
    }
    if (searchKey != "") {
        params["fPushtitle"] = searchKey;
    }
    //    }
    // fPushbody: "变电所[10100007]，网关名称[云平台演示箱]，最后上传时间[2019-06-21 11:06:02.0]"

    // fPushid: "2020050913020820173798"

    // fPushtime: "2020-05-09 13:02:08"

    // fPushtitle: "网关离线"

    // fPushtype: "1"

    // fPushtypeexplain: "通知"

    // fTargettype: "Android"

    // fTargetvalue: "116.236.149.165-312"

    // fUserid: 312

    // fUsername: "潘弘"
    Substation.postDataByAjaxNoLoading(
        url,
        params,
        function (data) {
            var datadic = data.messPushLogList;
            // var messgeInfo = data.tDtMessInfoType;
            // if (messgeInfo != undefined) {
            //     titleName = messgeInfo.fMessinfotypeexplain;
            //     if (
            //         titleName != null &&
            //         titleName != undefined &&
            //         titleName.length > 8
            //     ) {
            //         titleName = titleName.substring(0, 8) + "...";
            //     }
            //     $("#titleName").text(titleName);
            // }
            if (datadic.hasOwnProperty("list") && datadic.list.length > 0) {
                if (pageNum == 1) {
                    $(".list-container").empty();
                }
                $(datadic.list).each(function () {
                    // if (this.fConfirmstatus) {
                    //     html +=
                    //         '<div class="card hasConfirmed" id="' +
                    //         this.fPushid +
                    //         '">';
                    // } else {
                    html += '<div class="card" id="' + this.fPushid + '">';
                    // }
                    html +=
                        '                        <label class="label-checkbox item-content">';
                    // html +=
                    //     '                            <input type="checkbox" name="my-checkbox" value="' +
                    //     this.fAlarmeventlogid +
                    //     '">';
                    // html +=
                    //     '                            <div class="item-media"><i class="icon icon-form-checkbox"></i></div>';
                    html +=
                        '                            <div class="item-inner row no-gutter">';
                    html += '                                <div class="col-75">';
                    html +=
                        '                                    <p class="subName limit-length">' +
                        this.fPushtitle +
                        "</p>";
                    html +=
                        "                                    <P>" +
                        Operation["ui_messageName"] +
                        (this.fUsername ? this.fUsername : "") +
                        "</P>";
                    html +=
                        "                                    <P>" +
                        Operation["ui_messageId"] +
                        (this.fAlimessageid ? this.fAlimessageid : "") +
                        "</P>";

                    html +=
                        "                                    <p>" +
                        Operation["ui_messageBody"] +
                        (this.fPushbody ? this.fPushbody : "") +
                        "</p>";
                    html += "                                </div>";
                    html += '                                <div class="col-25">';
                    html +=
                        '                                    <p class="text-right"><span class="danger">' +
                        this.fPushtypeexplain +
                        "</span></p>";
                    html +=
                        '                                    <P class="text-right">' +
                        this.fPushtime +
                        "</P>";
                    html += "                                </div>";
                    html += "                            </div>";
                    html += "                        </label>";
                    html += "                    </div>";
                    // html += "<div class=\"card\">\n" +
                    //     "                    <div class=\"card-content\">\n" +
                    //     "                        <div class=\"content-padded\">\n" +
                    //     "                            <div class=\"row no-gutter sub_card\">\n" +
                    //     "                                <div class=\"col-10 selectAlarms\">\n" +
                    //     "                                    <input type=\"checkbox\" name=\"checkbox\">\n" +
                    //     "                                </div>\n" +
                    //     "                                <div class=\"col-60\">\n" +
                    //     "                                    <p class=\"subName\"><i class=\"icon icon-subIcon\"></i>" + this.fSubname + "</p>\n" +
                    //     "                                    <P>" + Operation['ui_MeterName'] + (clickID == "platform" ? (this.fDevicename) : (this.fDevicename)) + "</P>\n" +
                    //     "                                    <p>" + Operation['ui_EventType'] + this.fMessInfoExplain + "</p>\n" +
                    //     "                                </div>\n" +
                    //     "                                <div class=\"col-25\">\n" +
                    //     "                                    <p><i class=\"icon icon-alarm\"></i></p>\n" +
                    //     "                                    <p><span class=\"cardtime\">" + this.fAlarmtime + "</span></p>" +
                    //     "                                </div>\n" +
                    //     "                                <div class=\"col-5\">\n" +
                    //     "                                    <i class=\"icon icon-right\"></i>\n" +
                    //     "                                </div>\n" +
                    //     "                            </div>\n" +
                    //     "                        </div>\n" +
                    //     "                    </div>\n" +
                    //     "                </div>";
                    alarmDetailList.push(this);
                });
                $(".list-container").append(html);
                //addClick();
                //保存记录
                //                params['subName'] = $("#search").val();
                //                localStorage.setItem("saveAlarmParam", JSON.stringify(params));
                //                Substation.getDataByAjaxNoLoading("/close", {}, function () {});
                localStorage.setItem("need-update", "1");
                pageNum++;
            } else {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").html(
                    "<span class='bottomTip'>--" +
                    Operation["ui_nomoredata"] +
                    "--</span>"
                );
                return;
            }
            if (datadic.list.length < itemsPerLoad) {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").html(
                    "<span class='bottomTip'>--" +
                    Operation["ui_nomoredata"] +
                    "--</span>"
                );
                return;
            }
            //复选框初始化
            $(".selectAlarms").toggle();
        },
        function (errorCode) {
            if (errorCode == 0) {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").html(
                    "--" + Operation["ui_neterror"] + "--"
                );
            } else {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").html("");
            }
            return;
        }
    );
}

addItems(itemsPerLoad, 0);

var lastIndex = 10;

$(document).on("infinite", ".infinite-scroll", function () {
    // 如果正在加载，则退出
    if (loading) return;

    // 设置flag
    loading = true;

    setTimeout(function () {
        loading = false;
        if (lastIndex >= maxItems) {
            $.detachInfiniteScroll($(".infinite-scroll"));
            $(".infinite-scroll-preloader").html(
                "<span class='bottomTip'>--" + Operation["ui_nomoredata"] + "--</span>"
            );
            return;
        }
        addItems(itemsPerLoad, lastIndex);
        lastIndex = $(".list-container .card").length;
    }, 1000);
});

function goBack() {
    if (isPush == "1") {
        //推送详情点击返回事件
        if (isAndroid) {
            android.goBack();
        } else if (isIOS) {
            //            window.history.back();
            window.webkit.messageHandlers.goBackiOS.postMessage("");
        }
    } else {
        if (isAndroid) {
            android.goBack();
        } else if (isIOS) {
            window.history.back();
            window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
        } else {
            window.history.back();
        }
    }
}

function selectAll() {
    if ($(".back_btn").text() == Operation["ui_SelectPageAll"]) {
        $(".back_btn").text(Operation["ui_UnselectAll"]);
        $("input:checkbox").prop("checked", "checked");
    } else {
        $(".back_btn").text(Operation["ui_SelectPageAll"]);
        $("input:checkbox").removeAttr("checked");
    }
}

$(".back_btn").on("click", goBack);
$(".item-media").hide();

$("#searchBtn").click(function () {
    var start = new Date(
        $("#dateStart")
        .val()
        .replace(/-/g, "/")
    );
    var end = new Date(
        $("#dateEnd")
        .val()
        .replace(/-/g, "/")
    );
    if (start > end) {
        $.toast(Operation["ui_dateselecttip"]);
        return;
    }
    $(".close-panel").click();
    //存变电所
    //    if (saveAlarmParam != null && clickSubid == "") {
    //        clickSubid = saveAlarmParam['fSubid'];
    //        saveAlarmParam = null;
    //    }
    if ($("#search").val() == "") {
        //        $("#subName").text("所有变电所");
        selectSubid = "";
    } else if (clickSubid != "") {
        //        $("#subName").text($("#search").val());
        selectSubid = clickSubid;
        clickSubid = "";
    }
    getFirstPage();
});

$("#dateStart").calendar();
$("#dateEnd").calendar();
$("#listContainer").hide();
// getSomeSubstation(1);

// function getSomeSubstation(isAll) {
//     var url = "/getSubListByLetter";
//     if (isAll == 1) {
//         url = "/getSubstationListByUser";
//     }
//     var listObj = [];
//     var searchKey = $("#search").val();
//     var params = {
//         key: searchKey
//     };
//     $("#listContainer").empty();
//     Substation.getDataByAjaxNoLoading(url, params, function (data) {
//         if (isAll == 1) {
//             listObj = data.list;
//         } else {
//             listObj = data;
//         }
//         $(listObj).each(function () {
//             $("#listContainer").append(
//                 '<li class="item-content" data-id="' +
//                 this.fSubid +
//                 '">' +
//                 '<div class="item-inner">' +
//                 '<div class="item-title">' +
//                 this.fSubname +
//                 "</div>" +
//                 "</div>" +
//                 "</li>"
//             );
//         });
//         $("#listContainer").show();
//         $("#listContainer .item-content")
//             .unbind()
//             .click(function () {
//                 clickSubid = $(this).attr("data-id");
//                 var clickName = $(this)
//                     .find(".item-title")
//                     .text();
//                 $("#search").val(clickName);
//                 $("#listContainer").empty();
//                 $("#listContainer").hide();
//                 //            $("#subName").text(clickName);
//             });
//     });
// }

$("#search").bind("keydown", function (event) {
    if (event.keyCode == 13) {
        // getSomeSubstation();
        document.activeElement.blur();
    }
});

$("#search").on("input", function () {
    if ($("#search").val().length > 0) {
        $(".icon.icon-clear").show();
    } else {
        $(".icon.icon-clear").hide();
    }
});

$("#search").on("focus", function () {
    if ($("#search").val().length > 0) {
        $(".icon.icon-clear").show();
    } else {
        $(".icon.icon-clear").hide();
    }
});

$(".icon.icon-clear").click(function () {
    $("#search").val("");
    // getSomeSubstation(1);
    $(this).hide();
});

//时间快捷按钮
$(".buttons-row .button").click(function () {
    $(this)
        .addClass("active")
        .siblings()
        .removeClass("active");
});
$("#today").click(function () {
    var myDate = new Date();
    var todayVal = myDate.format("yyyy-MM-dd");
    Substation.changeCalendar(todayVal, "dateStart", "selectStartTime");
    Substation.changeCalendar(todayVal, "dateEnd", "selectEndTime");
});
$("#yestoday").click(function () {
    var myDate = new Date();
    myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
    var yestodayVal = myDate.format("yyyy-MM-dd");
    Substation.changeCalendar(yestodayVal, "dateStart", "selectStartTime");
    Substation.changeCalendar(yestodayVal, "dateEnd", "selectEndTime");
});
$("#thisMonth").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    Substation.changeCalendar(firstDayVal, "dateStart", "selectStartTime");
    Substation.changeCalendar(lastDayVal, "dateEnd", "selectEndTime");
});
$("#lastMonth").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    Substation.changeCalendar(firstDayVal, "dateStart", "selectStartTime");
    Substation.changeCalendar(lastDayVal, "dateEnd", "selectEndTime");
});

$("#dateStart,#dateEnd").click(function () {
    $(".buttons-row")
        .find($(".active"))
        .removeClass("active");
});

//解决键盘遮挡问题
var h = $(window).height();
window.addEventListener("resize", function () {
    if ($(window).height() < h) {
        $(".btnBar").hide();
    }
    if ($(window).height() >= h) {
        $(".btnBar").show();
    }
    if (
        document.activeElement.tagName == "INPUT" ||
        document.activeElement.tagName == "TEXTAREA"
    ) {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

$.init();