var selectSubid = "";
var clickSubid = "";
//分页
var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;
var saveParam = JSON.parse(localStorage.getItem("saveParam"));
localStorage.removeItem("saveParam");

function getFirstPage() {
    $("#list-container").empty();
    pageNum = 1;
    addItems(itemsPerLoad);
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

function addItems(number) {
    var url = "/getPlaceCheckFormList";
    var params = {};
    if (saveParam != null && saveParam != "") {
        params = saveParam;
        params['pageNum'] = pageNum;
        params['pageSize'] = number;
        var startTime = params['ftimeStart'];
        var endTime = params['ftimeEnd'];
        if (startTime != "" && startTime != null) {
            $("#dateStart").val(startTime.substring(0, 10));
        }
        if (endTime != "" && endTime != null) {
            $("#dateEnd").val(endTime.substring(0, 10));
        }
        if (params['fTaskstateid'] != undefined) {
            $("#fState").val(params['fTaskstateid']);
        }
        $("#search").val(params['subName']);
    } else {
        params = {
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
            params['ftimeStart'] = dateStartVal + " 00:00:00";
        }
        if (dateEndVal != "") {
            params['ftimeEnd'] = dateEndVal + " 23:59:59";
        }
        if (stateVal != "") {
            params['fTaskstateid'] = stateVal;
        }
    }
    Substation.getDataByAjaxNoLoading("/getPlaceCheckFormList", params, function (data) {
            if (data.placecheckformAllList.list.length > 0) {
                if (pageNum == 1) {
                    $("#list-container").empty();
                }
                $(data.placecheckformAllList.list).each(function () {
                    /*var iconStr = "";
                    switch(this.fPeriodType){
                        case "周巡":
                            iconStr="<i class=\"icon icon-week\"></i>\n";
                            break;
                        case "月巡":
                            iconStr="<i class=\"icon icon-month\"></i>\n";
                            break;
                        case "年巡":
                            iconStr="<i class=\"icon icon-year\"></i>\n";
                            break;
                        default:
                            iconStr="<i class=\"icon icon-day\"></i>\n";
                            break;
                    }*/
                    var stateStr = "";
                    switch (this.fTaststateid) {
                        case 1:
                            stateStr = "待办";
                            break;
                        case 2:
                            stateStr = "在办";
                            break;
                        case 3:
                            stateStr = "办毕";
                            break;
                        default:
                            stateStr = "待办";
                            break;
                    }
                    $("#list-container").append("<div class=\"card\" data-task=\"" + this.fTaskid + "\" data-id=\"" + this.fSubid + "\" id=\"" + this.fPlacecheckformid + "\">\n" +
                        "                    <div class=\"card-content\">\n" +
                        "                        <div class=\"card-content-inner row no-gutter\">\n" +
                        //                                               "                            <div class=\"col-10\">\n" +
                        //                                                iconStr +
                        //                                               "                            </div>\n" +
                        "                            <div class=\"col-95\">\n" +
                        "                                <p class=\"subName\">" + this.fTaskName + "<span class=\"blueColor\">(" + stateStr + ")</span></p>\n" +
                        //                                               "                                <p>巡检人：<span class=\"blueColor\">"+this.fCreatebyuserid+"</span></p>\n" +
                        "                                <p>巡检任务单号：<span class=\"blueColor\">" + this.fTasknumber + "</span></p>\n" +
                        "                                <p>巡检开始时间：<span class=\"blueColor\">" + this.fCreatetime + "</span></p>\n" +
                        "                                <p>本次发现缺陷：<span class=\"redColor\">" + this.fproblemTotal + " </span>个  未处理：<span class=\"redColor\">" + this.funsolvedTotal + " </span>个</p>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"col-5\">\n" +
                        "                                <i class=\"icon icon-right\"></i>\n" +
                        "                            </div>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                </div>");
                    /*$("#list-container").append("<div class=\"card noClick\" data-id=\""+this.fSubid+"\" id=\""+this.fPlacecheckformid+"\">\n" +
                                              "                    <div class=\"card-content\">\n" +
                                              "                        <div class=\"card-content-inner\">\n" +
*/
                    /*                                               "                            <div class=\"col-10\">\n" +
                                                                   iconStr +
                                                                  "                            </div>\n" +*/
                    /*
                                                                  "                                <p class=\"subName limit-length\">"+this.fTaskName+"<span class=\"blueColor\">("+stateStr+")</span></p>\n" +
                    //                                               "                                <p>巡检人：<span class=\"blueColor\">"+this.fCreatebyuserid+"</span></p>\n" +
                                                                                           '<div class=\"row no-gutter\">'+
                                                                  "                            <div class=\"col-75\">\n" +
                                                                  "                                <p>开始时间:<span class=\"blueColor\">"+this.fCreatetime+"</span></p>\n" +
                                                                  "                                <p>发现缺陷:<span class=\"redColor\">"+this.fproblemTotal+" </span>个  未处理:<span class=\"redColor\">"+this.funsolvedTotal+" </span>个</p>\n" +
                                                                  "                            </div>\n" +
                                                                  "                            <div class=\"col-25\">\n" +
                                                                                                   '<a href="#" class="button button-fill goTask" data-task="'+this.fTaskid+'">执行情况</a>' +
                                                                                                   '<a href="#" class="button button-fill goPlace" style="margin-top:0.2rem;">巡检明细</a>' +
                                                                  "                            </div>\n" +
                                                                  "                        </div>\n" +
                                                                  "                    </div>\n" +
                                                                  "                </div>");*/
                });
                /*$(".goPlace").unbind().click(function(){
                    var fPlacecheckformid = $(this).parents(".card").attr("id");
                    var clickSub = $(this).parents(".card").attr("data-id");
                    localStorage.setItem("fPlacecheckformid",fPlacecheckformid);
                    localStorage.setItem("fSubid",clickSub);
                    localStorage.setItem("canClick",false);
                    window.location.href="patrolContent.html";
                });
                $(".goTask").unbind().click(function(){
                    var clickTaskId = $(this).attr("data-task");
                    localStorage.setItem("taskID",clickTaskId);
                    window.location.href="missionDetailForRecord.html";
                });*/
                $(".card").unbind().click(function () {
                    var fPlacecheckformid = $(this).attr("id");
                    var clickSub = $(this).attr("data-id");
                    var clickTaskId = $(this).attr("data-task");
                    localStorage.setItem("fPlacecheckformid", fPlacecheckformid);
                    localStorage.setItem("fSubid", clickSub);
                    localStorage.setItem("taskID", clickTaskId);
                    params['subName'] = $("#search").val();
                    localStorage.setItem("saveParam", JSON.stringify(params));
                    localStorage.setItem("canClick", false);
                    var u = navigator.userAgent,
                        app = navigator.appVersion;
                    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
                    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
                    if (isAndroid) {
                        android.goToIn();
                    } else {
                        window.location.href = "missionDetailForRecord.html";
                    }
                });
                pageNum++;
            } else {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("--end--");
                return;
            }
            if (data.placecheckformAllList.list.length < itemsPerLoad) {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("--end--");
                return;
            }
        },
        function (errorCode) {
            if (errorCode == 0) {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").html("--网络异常--");
            } else {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").html("");
            }
            return;
        });
}
$("#list-container").empty();
addItems(itemsPerLoad);

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
            $('.infinite-scroll-preloader').html("--end--");
            return;
        }
        addItems(itemsPerLoad);
        lastIndex = $('#list-container .card').length;
    }, 1000);
});

$('#searchBtn').click(function () {
    $(".close-panel").click();
    if (saveParam != null) {
        clickSubid = saveParam['fSubid'];
        saveParam = null;
    }
    if ($("#search").val() == "") {
        //        $("#subname").text("所有变电所");
        selectSubid = "";
    } else if (clickSubid != "") {
        //        $("#subname").text($("#search").val());
        selectSubid = clickSubid;
        clickSubid = "";
    }
    getFirstPage();
});

$("#dateStart").calendar();
$("#dateEnd").calendar();
$("#listContainer").hide();

function getSomeSubstation() {
    var url = "/getSubListByLetter";
    var searchKey = $("#search").val();
    var params = {
        key: searchKey
    }
    $("#listContainer").empty();
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        $(data).each(function () {
            $("#listContainer").append('<li class="item-content" data-id="' + this.fSubid + '">' +
                '<div class="item-inner">' +
                '<div class="item-title">' + this.fSubname + '</div>' +
                '</div>' +
                '</li>');
        });
        $("#listContainer").show();
        $("#listContainer .item-content").unbind().click(function () {
            clickSubid = $(this).attr("data-id");
            var clickName = $(this).find(".item-title").text();
            $("#search").val(clickName);
            $("#listContainer").empty();
            $("#listContainer").hide();
            //            $("#subname").text(clickName);
        });
    });
}

$('#search').bind('keydown', function (event) {
    if (event.keyCode == 13) {
        getSomeSubstation();
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

/*$('#search').on("focus",function(){
    if($("#search").val().length>0){
        $(".icon.icon-clear").show();
    }else{
        $(".icon.icon-clear").hide();
    }
});

$('#search').blur(function(){
    $(".icon.icon-clear").hide();
});*/

$(".icon.icon-clear").click(function () {
    $("#search").val("");
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

window.addEventListener(
    "pageshow",
    function (event) {
        if (localStorage.getItem("need-refresh") == "true") {
            location.reload();
            localStorage.removeItem("need-refresh");
        }
    },
    false
);

$.init();