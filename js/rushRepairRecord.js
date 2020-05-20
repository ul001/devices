//var selectSubid = localStorage.getItem("fSubid");
var selectSubid = "";
var clickSubid = "";
var loading = false;
var itemsPerLoad = 10;
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
    addItems(itemsPerLoad);
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
    var html = '';
    var url = "/getTaskAndRushRepairList";
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
        pageNo: pageNum,
        pageSize: number
    };
    if (selectSubid != "") {
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
        params['fState'] = stateVal;
    }
    //    }
    Substation.postDataByAjaxNoLoading(url, params, function (data) {
            if (data.taskAndRushRepairList.list.length > 0) {
                if (pageNum == 1) {
                    $("#list-container").empty();
                }
                $(data.taskAndRushRepairList.list).each(function () {
                    var stateStr = "";
                    switch (this.fState+"") {
                        case "0":
                            stateStr = "<span class=\"redColor\">"+Operation['ui_defectState0']+"</span>";
                            break;
                        case "2":
                            stateStr = "<span class=\"redColor\">"+Operation['ui_defectState2']+"</span>";
                            break;
                        case "3":
                            stateStr = "<span class=\"redColor\">"+Operation['ui_defectState3']+"</span>";
                            break;
                        case "4":
                            stateStr = "<span class=\"redColor\">"+Operation['ui_defectState4']+"</span>";
                            break;
                        case "5":
                            stateStr = "<span class=\"redColor\">"+Operation['ui_defectState5']+"</span>";
                            break;
                        case "1":
                            stateStr = "<span class=\"button-success\">"+Operation['ui_defectState1']+"</span>";
                            break;
                        default:
                            stateStr = "<span class=\"redColor\">"+Operation['ui_defectState0']+"</span>";
                            break;
                    }
                    html += "<div class=\"card\" id=\""+this.fTaskandrushrepairid+"\">\n" +
                            "    <div class=\"item-content item-link\">\n" +
                            "        <div class=\"item-inner row no-gutter\">\n" +
                            "            <div>\n" +
                            "                <p class=\"subName limit-length\"><i class=\"icon icon-subIcon\"></i>"+Substation.removeUndefined(this.fSubname)+"\n" +
                            "                </p>\n" +
                            "                <p>"+Operation['ui_TaskContent']+Substation.removeUndefined(this.fTaskcontent)+"</p>\n" +
                            "                <p>"+Operation['ui_dealState']+stateStr+"</p>\n" +
                            "                <p>"+Operation['ui_createTime']+Substation.removeUndefined(this.fCreatetime)+"</p>\n" +
                            "            </div>\n" +
//                            "            <div class=\"col-30\">\n" +
////                            "                <p class=\"text-right\">发生时间:</p>\n" +
//                            "                <p class=\"text-right\">"+Substation.removeUndefined(this.fCreatetime)+"</p>\n" +
//                            "            </div>\n" +
                            "        </div>\n" +
                            "    </div>\n" +
                            "</div>";
                });
                $('#list-container').append(html);
                //声明一个控制点击的变量
                var upLoadClicktag = true;
                $(".card").unbind().click(function () {
                    if(!upLoadClicktag){
                        return;
                    }
                    upLoadClicktag = false;
                    setTimeout(function() {
                        upLoadClicktag = true;
                    }, 200);
                    var clickId = $(this).attr("id");
//                    var clickTree = $(this).attr("value");
//                    localStorage.setItem("clickTree", clickTree);
                    /*params['subName']=$("#search").val();
                    localStorage.setItem("saveParam",JSON.stringify(params));*/
                    localStorage.setItem("canClick", false);
                    if (isAndroid) {
                        localStorage.setItem("repairId", clickId);
                        android.goToIn();
                    } else {
                        window.location.href = "rushRepairInfo.html?repairId="+clickId;
                    }
                });
                pageNum++;
            } else {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("<span class='bottomTip'>--"+Operation['ui_nomoredata']+"--</span>");
                return;
            }
            if (data.taskAndRushRepairList.list.length < itemsPerLoad) {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("<span class='bottomTip'>--"+Operation['ui_nomoredata']+"--</span>");
                return;
            }
        },
        function (errorCode) {
            if (errorCode == 0) {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").html("--"+Operation['ui_neterror']+"--");
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

$(document).on('infinite', '.infinite-scroll', function () {

    // 如果正在加载，则退出
    if (loading) return;

    // 设置flag
    loading = true;

    setTimeout(function () {
        loading = false;
        addItems(itemsPerLoad);
    }, 1000);
});

$('#searchBtn').click(function () {
    var start = new Date($("#dateStart").val().replace(/-/g,'/'));
    var end = new Date($("#dateEnd").val().replace(/-/g,'/'));
    if(start>end){
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
    if(isAll==1){
        url = "/getSubstationListByUser";
    }
    var listObj=[];
    var searchKey = $("#search").val();
    var params = {
        key: searchKey
    }
    $("#listContainer").empty();
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        if(isAll == 1){
            listObj = data.list;
        }else{
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

$('#search').on("focus",function(){
    if($("#search").val().length>0){
        $(".icon.icon-clear").show();
    }else{
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

$.init();