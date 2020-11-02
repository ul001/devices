/*    function addClick(){
        $(".card").click(function(){
            localStorage.setItem("fSubid",10100001);
            window.location.href="deviceClass.html";
        });

        $(".goPhoto").click(function(e) {
            e.stopPropagation();
            window.location.href = "selectPhoto.html";
        });

        $(".goLocation").click(function(e) {
            e.stopPropagation();
            window.location.href = "location.html";
        });
    }*/
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

var upLoadClicktag = true;

window.addEventListener("pageshow", function (e) {
    // ios系统 返回页面 不刷新的问题 Safari内核缓存机制导致 方案一 方案二：设置meta标签，清除页面缓存
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (e.persisted && isIOS) {
        var needUpdate = localStorage.getItem("need-update");
        if (needUpdate) {
            localStorage.removeItem("need-update");
            window.location.reload();
        }
        // window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
    }
});

function goToLocation(subid) {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    localStorage.setItem("fSubid", subid);
    if (isAndroid) {
        android.goToIn3();
        return;
    }
    window.location.href = "location.html";
}

function goToManager(subId, subname) {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    localStorage.setItem("fSubid", subId);
    localStorage.setItem("fSubname", subname);
    if (isAndroid) {
        android.goToIn('alarmAnalysisManager.html');
        return;
    }
    window.location.href = "alarmAnalysisManager.html";
}

function cleanAlarm(subId) {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    $.confirm(Operation["ui_selectTip"], function () {
        var url = "/oneClickConfirmSubAlarms";
        var params = {
            fSubid: subId
        };
        var dateStartVal = $("#dateStart").val();
        var dateEndVal = $("#dateEnd").val();
        if (dateStartVal != "") {
            params["fStarttime"] = dateStartVal + " 00:00:00";
        }
        if (dateEndVal != "") {
            params["fEndtime"] = dateEndVal + " 23:59:59";
        }
        Substation.getDataByAjaxNoLoading(url, params, function (data) {
                $.toast("一键确认成功");
                getFirstPage();
            },
            function (errorCode) {
                $.toast("一键确认失败，errorCode:" + errorCode);
                return;
            });

    });

}

var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;

$("#dateStart").calendar();
$("#dateEnd").calendar();
var myDate = new Date;
var year = myDate.getFullYear(); //获取当前年
var mon = myDate.getMonth() + 1; //获取当前月
var date = myDate.getDate(); //获取当前日
var nowDate = year + "-" + format0(mon) + "-" + format0(date);
$("#dateStart").val(nowDate);
$("#dateEnd").val(nowDate);

function getFirstPage() {
    $(".list-container").empty();
    pageNum = 1;
    addItems(itemsPerLoad, 0);
    lastIndex = 10;
    $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
    loading = false;
    $.attachInfiniteScroll($('.infinite-scroll'));
}

$(document).on('refresh', '.pull-to-refresh-content', function (e) {
    setTimeout(function () {
        getFirstPage();
        // done
        $.pullToRefreshDone('.pull-to-refresh-content');
    }, 2000);
});

function addItems(number, lastIndex) {
    var html = '';
    var url = "/getSubstationAlarmLogNum";
    // var searchKey = $("#search").val();
    var dateStartVal = $("#dateStart").val();
    var dateEndVal = $("#dateEnd").val();
    var stateVal = $("#fState").val();
    var params = {
        pageNo: pageNum,
        pageSize: number,
        // key: searchKey
    }
    if (dateStartVal != "") {
        params["fStarttime"] = dateStartVal + " 00:00:00";
    }
    if (dateEndVal != "") {
        params["fEndtime"] = dateEndVal + " 23:59:59";
    }
    if (stateVal != "") {
        params["orderby"] = stateVal;
    }
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
            var listData = data.substationAlarmLogNum;
            if (listData.hasOwnProperty("list") && listData.list.length > 0) {
                if (pageNum == 1) {
                    $(".list-container").empty();
                }
                $(listData.list).each(function () {
                    var showStr;
                    if (this.fLognum > 0 && this.fLogconfirmednum > 0) {
                        showStr = ((this.fLogconfirmednum / this.fLognum) * 100).toFixed(1) + '%';
                    } else {
                        showStr = '0%';
                    }
                    html += "<div class=\"card\">\n" +
                        "                    <div class=\"card-content\">\n" +
                        "                        <div class=\"content-padded\">\n" +
                        "                            <div class=\"row  no-gutter sub_card\">\n" +
                        "                                <div class=\"col-90\"  onClick=\"goToManager(" + this.fSubid + ",'" + this.fSubname + "')\">\n" +
                        "                                    <p class=\"subName limit-length\">" + this.fSubname + "</p>\n" +
                        //                    "                                    <p><i class=\"icon icon-contact\"></i>" + Substation.removeUndefined(this.fContacts) + "  <i class=\"icon icon-contactphone\"></i>" + Substation.removeUndefined(this.fContactsPhone) + "</p>\n" +
                        "                                        <div>" + Operation['ui_AlarmDealPer'] + "：" +
                        "                                            <div class=\"progress\">" +
                        "                                                <div class=\"progressbar\" style=\"width:" + showStr + ";\"><\/div>" +
                        "                                            <\/div>" +
                        "                                            <span class=\"total\">" + showStr + "<\/span>" +
                        "                                        <\/div>" +
                        "                                     <p style=\"margin: 0.4rem 0;\">" + Operation['ui_AlarmAnalysisSum'] + "：" + this.fLognum + "<\/p>" +
                        "                                <\/div>" +
                        "                                <div class=\"col-10\">\n" +
                        "                                        <button class=\"external goPhoto\" type=\"button\" onClick=\"cleanAlarm('" + this.fSubid + "')\">" +
                        "                                            <img class=\"upload_img\" src=\"img\/clear_alarm.png\" style=\"width:90%\" \/>" +
                        "                                        <\/button>" +
                        "                                </div>\n" +
                        "                            </div>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                </div>";
                });
                $('.list-container').append(html);
                //addClick();
                pageNum++;
            } else {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
                return;
            }
            if (listData.list.length < itemsPerLoad) {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
                return;
            }
        },
        function (errorCode) {
            if (errorCode == 0) {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").html("--" + Operation['ui_neterror'] + "--");
            } else {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").html("");
            }
            return;
        });
}
addItems(itemsPerLoad, 0);

var lastIndex = 10;


$(document).on('infinite', '.infinite-scroll', function () {

    // 如果正在加载，则退出
    if (loading) return;

    // 设置flag
    loading = true;

    setTimeout(function () {
        loading = false;

        if (lastIndex >= maxItems) {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
            return;
        }

        addItems(itemsPerLoad, lastIndex);
        lastIndex = $('.list-container .card').length;
    }, 1000);
});

$('#search').bind('keydown', function (event) {
    if (event.keyCode == 13) {
        getFirstPage();
        document.activeElement.blur();
    }
});

$(".searchbar-cancel").click(function () {
    $("#search").val("");
    getFirstPage();
});

//右上角
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
    // if ($("#search").val() == "") {
    //     //        $("#subName").text("所有变电所");
    //     selectSubid = "";
    // } else if (clickSubid != "") {
    //     //        $("#subName").text($("#search").val());
    //     selectSubid = clickSubid;
    //     clickSubid = "";
    // }
    getFirstPage();
});


function format0(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

$("#search").bind("keydown", function (event) {
    if (event.keyCode == 13) {
        getSomeSubstation();
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
    getSomeSubstation(1);
    $(this).hide();
});

//时间快捷按钮
// $(".buttons-row .button").click(function () {
//     $(this)
//         .addClass("active")
//         .siblings()
//         .removeClass("active");
// });

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

$(".back_btn").click(function () {
    if (isAndroid) {
        android.goBack();
    } else if (isIOS) {
        window.history.back();
        window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
    } else {
        window.history.back();
    }
});

//开启一个定时器
// function run() {
//     var bar = document.getElementById("bar");
//     var total = document.getElementById("total");
//     bar.style.width = 60 + "%";
//     total.innerHTML = bar.style.width;
// bar.style.width = parseInt(bar.style.width) + 1 + "%";
// total.innerHTML = bar.style.width;
// if (bar.style.width == "100%") {
//     window.clearTimeout(timeout);
//     return;
// }
// var timeout = window.setTimeout("run()", 100);
// }

// run();

$.init();