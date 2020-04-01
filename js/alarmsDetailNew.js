var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;
var clickID = Substation.GetQueryString("clickID");
// var clickID = "platform";
var titleName = localStorage.getItem("titleName");
$(".title.title_color").text(titleName);
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var selectSubid = "";
var clickSubid = "";
var alarmDetailList = [];
var saveAlarmParam = JSON.parse(localStorage.getItem("saveAlarmParam"));
localStorage.removeItem("saveAlarmParam");

function getFirstPage() {
    $(".list-container").empty();
    pageNum = 1;
    addItems(itemsPerLoad, 0);
    lastIndex = 30;
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
    var url = "/getAlarmEventLogList";
    var params = {};
    // var searchKey = $("#search").val();
    if (saveAlarmParam != null && saveAlarmParam != "") {
        params = saveAlarmParam;
        params['pageNum'] = pageNum;
        params['pageSize'] = number;
        var startTime = params['fStarttime'];
        var endTime = params['fEndtime'];
        if (startTime != "" && startTime != null) {
            $("#dateStart").val(startTime.substring(0, 10));
        }
        if (endTime != "" && endTime != null) {
            $("#dateEnd").val(endTime.substring(0, 10));
        }
        if (params['fConfirmstatus'] != undefined) {
            $("#fState").val(params['fConfirmstatus']);
        }
        $("#search").val(params['subName']);
    } else {
        params = {
            fMessinfotypeID: clickID,
            pageNum: pageNum,
            pageSize: number
        };
        if (selectSubid != "" && selectSubid != null) {
            params['fSubid'] = selectSubid;
        }
        var dateStartVal = $("#dateStart").val();
        var dateEndVal = $("#dateEnd").val();
        var stateVal = $("#fState").val();
        if (dateStartVal != "") {
            params['fStarttime'] = dateStartVal + " 00:00:00";
        }
        if (dateEndVal != "") {
            params['fEndtime'] = dateEndVal + " 23:59:59";
        }
        if (stateVal != "") {
            if (stateVal == '1') {
                params['fConfirmstatus'] = true;
            } else {
                params['fConfirmstatus'] = false;
            }
        }
    }
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
            var datadic = data.alarmEventLogList;
            if (datadic.hasOwnProperty("list") && datadic.list.length > 0) {
                if (pageNum == 1) {
                    $(".list-container").empty();
                }
                $(datadic.list).each(function () {
                    if (this.fConfirmstatus) {
                        html += "<div class=\"card hasConfirmed\" id=\"" + this.fAlarmeventlogid + "\">";
                    } else {
                        html += "<div class=\"card\" id=\"" + this.fAlarmeventlogid + "\">";
                    }
                    html += "                        <label class=\"label-checkbox item-content item-link\">";
                    html += "                            <input type=\"checkbox\" name=\"my-checkbox\" value=\"" + this.fAlarmeventlogid + "\">";
                    html += "                            <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"><\/i><\/div>";
                    html += "                            <div class=\"item-inner row no-gutter\">";
                    html += "                                <div class=\"col-75\">";
                    html += "                                    <p class=\"subName limit-length\"><i class=\"icon icon-subIcon\"><\/i>" + this.fSubname + "<\/p>";
                    html += "                                    <P>" + Operation['ui_MeterName'] + (clickID == "platform" ? (this.fDevicename) : (this.fDevicename)) + "<\/P>";
                    html += "                                    <p>" + Operation['ui_EventType'] + this.fMessInfoExplain + "<\/p>";
                    html += "                                <\/div>";
                    html += "                                <div class=\"col-25\">";
                    html += "                                    <p class=\"text-right\"><span class=\"danger\">" + this.fMessInfoTypeExplain + "<\/span><\/p>";
                    html += "                                    <P>" + this.fAlarmtime + "<\/P>";
                    html += "                                <\/div>";
                    html += "                            <\/div>";
                    html += "                        <\/label>";
                    html += "                    <\/div>";
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
                $('.list-container').append(html);

                addCardLongClick();
                //addClick();
                $(".item-media").hide();
                //保存记录
                params['subName'] = $("#search").val();
                localStorage.setItem("saveAlarmParam", JSON.stringify(params));
                Substation.getDataByAjaxNoLoading("/close", {}, function () {});
                pageNum++;
            } else {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("--end--");
                return;
            }
            if (datadic.list.length < itemsPerLoad) {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("--end--");
                return;
            }
            //复选框初始化
            $(".selectAlarms").toggle();
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

var lastIndex = 30;

$(document).on('infinite', '.infinite-scroll', function () {

    // 如果正在加载，则退出
    if (loading) return;

    // 设置flag
    loading = true;

    setTimeout(function () {
        loading = false;
        if (lastIndex >= maxItems) {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').html("--end--");
            return;
        }
        addItems(itemsPerLoad, lastIndex);
        lastIndex = $('.list-container .card').length;
    }, 1000);
});

function goBack() {
    if (isAndroid) {
        android.goBack();
    } else if (isIOS) {
        window.history.back();
        window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
    } else {
        window.history.back();
    }
}

function selectAll() {
    if ($(".back_btn").text() == Operation['ui_SelectAll']) {
        $(".back_btn").text(Operation['ui_UnselectAll']);
        $("input:checkbox").prop("checked", "checked");
    } else {
        $(".back_btn").text(Operation['ui_SelectAll']);
        $("input:checkbox").removeAttr("checked");
    }
}

$(".back_btn").on("click", goBack);
$(".item-media").hide();
$(".manager_btn").on("click", manageCard);

function manageCard() {
    //点击管理切换样式
    var html = "";
    if (!$("#bar-footer").length || $("#bar-footer").is(":hidden")) {
        $(".manager_btn").text(Operation['ui_cancel']);
        $(".back_btn").text(Operation['ui_SelectAll']);
        $(".selectAlarms").toggle();
        $("#bar-footer").toggle();
        $("#bar-footer").addClass("bar-footer");
        $(".open-panel").toggle();
        $(".item-media").show();
        $(".item-link").removeClass("item-link");
        $(".label-checkbox.item-content").off("touchstart touchmove touchend");
        $(".back_btn").off("click").on("click", selectAll);
        $(".hasConfirmed input").prop("checked", "checked").attr("disabled", true);
        //        html += '<nav class="bar bar-footer row">' +
        //            '<a href="#" class="button bg-primary col-33" onclick=""><i class="icon icon-downChange"></i>确认</a>' +
        //            '</nav>';
        //        $(".content").after(html);
    } else {
        $(".selectAlarms").toggle();
        $("#bar-footer").toggle();
        $("#bar-footer").removeClass("bar-footer");
        $(".open-panel").toggle();
        $(".label-checkbox.item-content").addClass("item-link");
        addCardLongClick();
        $(".item-media").hide();
        $(".manager_btn").text(Operation['ui_manager']);
        html += '<span class="icon icon-left"></span>' + '<span>' + Operation['ui_back'] + '</span>';
        $(".back_btn").html(html);
        $(".back_btn").off("click").on("click", goBack);
        $("input[type='checkbox']:checked").removeAttr("checked").removeAttr("disabled");
    }
}

addCardLongClick();

document.addEventListener("click", function () {
    $("#showDiv").hide();
});

//点击确认
$("#confirmed").on("click", function () {
    var thisId = $("#showDiv").attr("data-id");
    $("#" + thisId).addClass("hasConfirmed");
    setAlarmEventConfirmed(thisId, '1');
});

//未确认
$("#unConfirm").on("click", function () {
    var thisId = $("#showDiv").attr("data-id");
    $("#" + thisId).removeClass("hasConfirmed");
    setAlarmEventConfirmed(thisId, '0');
});
$("#manage").on("click", manageCard);

//多选确定事件
function selectConfirm() {
    var arr = [];
    $('input[type=checkbox]:checked').each(function (e) {
        if ($('input[type=checkbox]:checked').val()) {
            var num = this.value;
            arr.push(num);
        }
    });
    var logList = arr.join(','); //数组转成为字符串
    confirmAlarmEvents(logList);
}
//批量确认方法
function confirmAlarmEvents(logidList) {
    var url = "/confirmAlarmEvents";

    Substation.getDataByAjaxNoLoading(url, {
            "logidList": logidList
        },
        function (data) {
            manageCard();
            getFirstPage();
        },
        function (errorCode) {
            // if (errorCode == 0) {
            //     $.detachInfiniteScroll($(".infinite-scroll"));
            //     $(".infinite-scroll-preloader").html("--" + Operation['ui_neterror'] + "--");
            // } else {
            //     $.detachInfiniteScroll($(".infinite-scroll"));
            //     $(".infinite-scroll-preloader").html("");
            // }
            return;
        });
}
//单个确认取消方法
function setAlarmEventConfirmed(logid, confirmType) {
    var url = '';
    if (confirmType == '1') {
        //确认
        url = "/confirmAlarmEvents";
        Substation.getDataByAjaxNoLoading(url, {
                "logidList": logid
            },
            function (data) {

            },
            function (errorCode) {
                // if (errorCode == 0) {
                //     $.detachInfiniteScroll($(".infinite-scroll"));
                //     $(".infinite-scroll-preloader").html("--" + Operation['ui_neterror'] + "--");
                // } else {
                //     $.detachInfiniteScroll($(".infinite-scroll"));
                //     $(".infinite-scroll-preloader").html("");
                // }
                return;
            });
    } else {
        //未确认
        url = "/setAlarmEventUnConfirmed";
        Substation.getDataByAjaxNoLoading(url, {
                "fAlarmeventlogid": logid
            },
            function (data) {

            },
            function (errorCode) {
                // if (errorCode == 0) {
                //     $.detachInfiniteScroll($(".infinite-scroll"));
                //     $(".infinite-scroll-preloader").html("--" + Operation['ui_neterror'] + "--");
                // } else {
                //     $.detachInfiniteScroll($(".infinite-scroll"));
                //     $(".infinite-scroll-preloader").html("");
                // }
                return;
            });
    }

}


function addCardLongClick() {
    var longClick = 0;
    $(".item-link").on({
        touchstart: function (e) {
            var thisCardId = $(this).parent(".card").attr("id");
            longClick = 0;
            timeOutEvent = setTimeout(function () {
                longClick = 1;
                var touch = e.originalEvent.targetTouches[0];
                var screenWidth = $(window).width();
                var screenHeight = $(window).height();
                var divWidth = $("#showDiv").width();
                var divHeight = $("#showDiv").height();
                if (divWidth + touch.pageX > screenWidth) {
                    $("#showDiv").css("left", touch.pageX - divWidth + 'px');
                } else {
                    $("#showDiv").css("left", touch.pageX + 'px');
                }
                if (divHeight + touch.pageY + 10 > screenHeight) {
                    $("#showDiv").css("top", touch.pageY - 10 - divHeight + 'px');
                } else {
                    $("#showDiv").css("top", touch.pageY + 10 + 'px');
                }
                $("#showDiv").attr("data-id", thisCardId);
                $("#showDiv").show();
            }, 500);
        },
        touchmove: function (e) {
            clearTimeout(timeOutEvent);
            timeOutEvent = 0;
            e.preventDefault();
        },
        touchend: function (e) {
            clearTimeout(timeOutEvent);
            if (timeOutEvent != 0 && longClick == 0) { //点击
                if ($("#showDiv").is(':visible')) {
                    $("#showDiv").hide();
                } else {
                    var thisCardId = $(this).parent(".card").attr("id");
                    var paramStr = '';
                    $.each(alarmDetailList, function (index, value) {
                        if (value['fAlarmeventlogid'] == thisCardId) {
                            paramStr = JSON.stringify(value);
                        }
                    });
                    // window.location.href = encodeURI("alarmDetailView.html" + "?value=" + paramStr);
                    localStorage.setItem("DetailParam", paramStr);
                    window.location.href = "alarmDetailView.html";
                }
            }
            return false;
        }
    });
}

$('#searchBtn').click(function () {
    var start = new Date($("#dateStart").val().replace(/-/g, '/'));
    var end = new Date($("#dateEnd").val().replace(/-/g, '/'));
    if (start > end) {
        $.toast(Operation['ui_dateselecttip']);
        return;
    }
    $(".close-panel").click();
    //存变电所
    if (saveAlarmParam != null && clickSubid == "") {
        clickSubid = saveAlarmParam['fSubid'];
        saveAlarmParam = null;
    }
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
getSomeSubstation(1);

function getSomeSubstation(isAll) {
    var url = "/getSubListByLetter";
    if (isAll == 1) {
        url = "/getSubstationListByUser";
    }
    var listObj = [];
    var searchKey = $("#search").val();
    var params = {
        key: searchKey
    };
    $("#listContainer").empty();
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        if (isAll == 1) {
            listObj = data.list;
        } else {
            listObj = data;
        }
        $(listObj).each(function () {
            $("#listContainer").append(
                '<li class="item-content" data-id="' +
                this.fSubid +
                '">' +
                '<div class="item-inner">' +
                '<div class="item-title">' +
                this.fSubname +
                "</div>" +
                "</div>" +
                "</li>"
            );
        });
        $("#listContainer").show();
        $("#listContainer .item-content")
            .unbind()
            .click(function () {
                clickSubid = $(this).attr("data-id");
                var clickName = $(this)
                    .find(".item-title")
                    .text();
                $("#search").val(clickName);
                $("#listContainer").empty();
                $("#listContainer").hide();
                //            $("#subName").text(clickName);
            });
    });
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

$('#search').on("focus", function () {
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
$(".buttons-row .button").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
});
$("#today").click(function () {
    var myDate = new Date();
    var todayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart").val(todayVal);
    $("#dateEnd").val(todayVal);
});
$("#yestoday").click(function () {
    var myDate = new Date();
    myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
    var yestodayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart").val(yestodayVal);
    $("#dateEnd").val(yestodayVal);
});
$("#thisMonth").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart").val(firstDayVal);
    $("#dateEnd").val(lastDayVal);
});
$("#lastMonth").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart").val(firstDayVal);
    $("#dateEnd").val(lastDayVal);
});

Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

$("#dateStart,#dateEnd").click(function () {
    $(".buttons-row").find($(".active")).removeClass("active");
});

//解决键盘遮挡问题
var h = $(window).height();
window.addEventListener("resize", function () {
    if ($(window).height() < h) {
        $('.btnBar').hide();
    }
    if ($(window).height() >= h) {
        $('.btnBar').show();
    }
    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});


$.init();