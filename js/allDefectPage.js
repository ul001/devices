//var selectSubid = localStorage.getItem("fSubid");
var selectSubid = "";
var clickSubid = "";
var loading = false;
var itemsPerLoad = 5;
var pageNum = 1;
/*var saveParam= JSON.parse(localStorage.getItem("saveParam"));
localStorage.removeItem("saveParam");*/
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
//判断数组中是否包含某字符串

function getFirstPage() {
    $("#list-container").empty();
    pageNum = 1;
    addItems(itemsPerLoad, 0);
    lastIndex = 5;
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
    var url = "/getDeviceProblemList";
    var params = {};
    /*if(saveParam!=null&&saveParam!=""){
        params=saveParam;
        params['pageNum']=pageNum;
        params['pageSize']=number;
        var startTime = params['ftimeStart'];
        var endTime = params['ftimeEnd'];
        if(startTime!=""&&startTime!=null){
            $("#dateStart").val(startTime.substring(0,10));
        }
        if(endTime!=""&&endTime!=null){
            $("#dateEnd").val(endTime.substring(0,10));
        }
        if(params['fTaskstateid']!=undefined){
            $("#fState").val(params['fTaskstateid']);
        }
        if(params['fProblemlevel']!=undefined){
            $("#dangerType").val(params['fProblemlevel']);
        }
        $("#search").val(params['subName']);
    }else{*/
    params = {
        pageNum: pageNum,
        pageSize: number
    };
    if (selectSubid != "") {
        params['fSubid'] = selectSubid;
    }
    var dateStartVal = $("#dateStart").val();
    var dateEndVal = $("#dateEnd").val();
    var stateVal = $("#fState").val();
    var dangerVal = $("#dangerType").val();
    if (dateStartVal != "") {
        params['ftimeStart'] = dateStartVal + " 00:00:00";
    }
    if (dateEndVal != "") {
        params['ftimeEnd'] = dateEndVal + " 23:59:59";
    }
    if (stateVal != "") {
        params['fState'] = stateVal;
    }
    if (dangerVal != "") {
        params['fProblemlevel'] = dangerVal;
    }
    //    }
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
            if (data.tDevDeviceproblemList.list.length > 0) {
                if (pageNum == 1) {
                    $("#list-container").empty();
                }
                $(data.tDevDeviceproblemList.list).each(function () {
                    var problemStr = "-";
                    if (this.hasOwnProperty("fProblemlocation")) {
                        if (this.fProblemlocation.indexOf(",") != -1) {
                            problemStr = this.fProblemlocation.split(",")[1]
                        }
                    }
                    var stateStr = "-";
                    switch (this.fState) {
                        case "0":
                            stateStr = "<span class=\"redColor\">" + Operation['ui_defectState0'] + "</span>";
                            break;
                        case "2":
                            stateStr = "<span class=\"redColor\">" + Operation['ui_defectState2'] + "</span>";
                            break;
                        case "3":
                            stateStr = "<span class=\"redColor\">" + Operation['ui_defectState3'] + "</span>";
                            break;
                        case "4":
                            stateStr = "<span class=\"redColor\">" + Operation['ui_defectState4'] + "</span>";
                            break;
                        case "5":
                            stateStr = "<span class=\"redColor\">" + Operation['ui_defectState5'] + "</span>";
                            break;
                        case "1":
                            stateStr = "<span class=\"button-success\">" + Operation['ui_defectState1'] + "</span>";
                            break;
                        default:
                            stateStr = "<span class=\"redColor\">" + Operation['ui_defectState0'] + "</span>";
                            break;
                    }
                    /*var solveUser = "";
                    if(this.fSolvedUserName!=undefined){
                        solveUser="<p>处理人员："+this.fSolvedUserName+"</p>";
                    }
                    var solveTime = "";
                    if(this.fUpdateDate!=undefined){
                        solveTime="<p>处理时间："+this.fUpdateDate+"</p>";
                    }*/
                    var deviceName = this.fdeviceinfoName;
                    if (deviceName == undefined) {
                        deviceName = this.treePathName;
                    }
                    html += "<div class=\"card\" id=\"" + this.fDeviceproblemid + "\" data-id=\"" + this.fSubid + "\">\n" +
                        "                    <div class=\"card-content\">\n" +
                        "                        <div class=\"card-content-inner row no-gutter\">\n" +
                        /*"                            <div class=\"col-10\">\n" +
                        "                                <i class=\"icon icon-alarm\"></i>\n" +
                        "                            </div>\n" +*/
                        "                            <div class=\"col-95\">\n" +
                        "<p class=\"subName limit-length\">" + Substation.removeUnDefinedStr(this.fSubName) + "</p>" +
                        "                                <p>" + Operation['ui_Devname'] + "<span class=\"redColor\">" + Substation.removeUnDefinedStr(deviceName) + "</span>\n" +
                        "                                </p>\n" +
                        "                                <p>" + Operation['ui_DefectExplain'] + "<span class=\"redColor\">" + Substation.removeUnDefinedStr(this.fDeviceproblemdes) + "</span></p>\n" +
                        //                        "                                <p>危害:"+this.fProblemharm+"</p>\n" +
                        "                                <p>" + Operation['ui_SpecificLoc'] + problemStr + "</p>\n" +
                        "                                <p class=\"row\"><span class=\"col-50\">" + Operation['ui_categories'] + Substation.removeUnDefinedStr(this.fProblemtype) + "</span><span class=\"col-50\">" + Operation['ui_Emergenylevel'] + Substation.removeUnDefinedStr(this.fProblemlevel) + "</span></p>\n" +
                        //                        "                                <p>消缺期限:"+this.fTimelimit+"</p>\n" +
                        //                        "                                <p>处理建议:"+this.fResolution+"</p>\n" +
                        //                        "                                <p>客户意见:"+this.fClientadvice+"</p>\n" +
                        "                                <p>" + Operation['ui_dealState'] + stateStr + "</p>\n" +
                        "                                <p>" + Operation['ui_findTime'] + Substation.removeUnDefinedStr(this.fCreatetime) + "</p>\n" +
                        //                        solveUser+solveTime+
                        "                            </div>\n" +
                        "                            <div class=\"col-5\">\n" +
                        "                                <i class=\"icon icon-right\"></i>\n" +
                        "                            </div>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                </div>";
                });
                $('#list-container').append(html);
                //声明一个控制点击的变量
                var upLoadClicktag = true;
                $(".card").unbind().click(function () {
                    if (!upLoadClicktag) {
                        return;
                    }
                    upLoadClicktag = false;
                    setTimeout(function () {
                        upLoadClicktag = true;
                    }, 1000);
                    var clickId = $(this).attr("id");
                    var subId = $(this).attr("data-id");
                    //                    var clickTree = $(this).attr("value");
                    //                    localStorage.setItem("clickTree", clickTree);
                    /*params['subName']=$("#search").val();
                    localStorage.setItem("saveParam",JSON.stringify(params));*/
                    localStorage.setItem("canClick", false);
                    localStorage.setItem("fSubid", subId);
                    if (isAndroid) {
                        localStorage.setItem("fDeviceproblemid", clickId);
                        android.goToIn();
                    } else {
                        window.location.href = "defectInfo.html?fDeviceproblemid=" + clickId;
                    }
                });
                pageNum++;
            } else {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
                return;
            }
            if (data.tDevDeviceproblemList.list.length < itemsPerLoad) {
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
$("#list-container").empty();

function getUnDefined(str) {
    if (str == undefined || str == null) {
        return "-";
    } else {
        return str;
    }
}

addItems(itemsPerLoad, 0);

var lastIndex = 5;


$(document).on('infinite', '.infinite-scroll', function () {

    // 如果正在加载，则退出
    if (loading) return;

    // 设置flag
    loading = true;

    setTimeout(function () {
        loading = false;
        addItems(itemsPerLoad, lastIndex);
        lastIndex = $('#list-container .card').length;
    }, 1000);
});

$('#searchBtn').click(function () {
    var start = new Date($("#dateStart").val().replace(/-/g, '/'));
    var end = new Date($("#dateEnd").val().replace(/-/g, '/'));
    if (start > end) {
        $.toast(Operation['ui_dateselecttip']);
        return;
    }
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
        clickSubid = "";
    }
    getFirstPage();
});

$("#dateStart").calendar();
$("#dateEnd").calendar();
$("#listContainer").hide();

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
            //            $("#subName").text(clickName);
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

//时间快捷按钮
$(".buttons-row .button").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
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

$.init();