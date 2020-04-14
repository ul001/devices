var loading = false;
var itemsPerLoad = 10;
var pageNum = 1;
var deviceSerial = Substation.GetQueryString("deviceSerial");
var meterCode = Substation.getQueryString("meterCode");
var deviceType = Substation.GetQueryString("type");
var loadUrl = "/getARCMControlLogList";
var subObj = JSON.parse(localStorage.getItem("subObj"));
try {
    if (isAndroid) {
        subObj = JSON.parse(android.getSpItem("subObj"));
    }
} catch (e) {}
var selectSubid = subObj.subId;
if(deviceType == "arcm300T"){
    loadUrl = "/getARCMControlLogList";
}else if(deviceType == "light"){
    loadUrl = "/getControlLogList";
}
var params = {};

function getFirstPage() {
    $(".list-container").empty();
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

function addItems(number){
    params['pageNo']=pageNum;
    params['pageSize']=number;
    if(selectSubid!=""){
        params['fSubid'] = selectSubid;
    }
    var dateStartVal = $("#dateStart").val();
    var dateEndVal = $("#dateEnd").val();
    var controlPerson = $("#search").val();
    if(deviceType == "arcm300T"){
        if (dateStartVal != "") {
            params['startTime'] = dateStartVal + " 00:00:00";
        }
        if (dateEndVal != "") {
            params['entTime'] = dateEndVal + " 23:59:59";
        }
        if(controlPerson != ""){
            params['userName'] = controlPerson;
        }
        if(deviceSerial != "" && deviceSerial !=undefined){
            params['SerialNumber'] = deviceSerial;
        }
    }else if(deviceType == "light"){
        if (dateStartVal != "") {
            params['fStarttime'] = dateStartVal + " 00:00:00";
        }
        if (dateEndVal != "") {
            params['fEndtime'] = dateEndVal + " 23:59:59";
        }
        if(controlPerson != ""){
            params['userName'] = controlPerson;
        }
        if(deviceSerial != "" && deviceSerial !=undefined){
            params['fMeterCode'] = meterCode;
        }
    }
    Substation.getDataByAjaxNoLoading(loadUrl,params,function(data){
        var dataSrc = data.pageInfo;
        if (pageNum == 1) {
            $(".list-container").empty();
        }
        if(dataSrc.list!=undefined && dataSrc.list.length>0){
            $(dataSrc.list).each(function(){
                var controlStr = "";
                switch(this.fControltype){
                    case "reset":
                        controlStr = "复位";
                        break;
                    case "DO":
                        controlStr = "分闸";
                        break;
                    case "silent":
                        controlStr = "消音";
                        break;
                    case "check":
                        controlStr = "自检";
                        break;
                }
                var askTime = "-";
                if(this.fAcktime!=undefined && this.fAcktime!=""){
                    askTime = formatDate(this.fAcktime);
                }
                var askResult = "暂无结果";
                if(this.fResult!=undefined && this.fResult!=""){
                    askResult = this.fResult;
                }
                $(".list-container").append('<div class="card-log">'+
                                                 '<div class="card-top">'+
                                                     '<div class="lightGrayColor">操作（时间：'+formatDate(this.fSendtime)+'）</div>'+
                                                     '<div class="blackColor">'+this.fUsername+'对'+this.meterInfoname+'（'+this.fMeterserialnumber+'）进行'+controlStr+'操作</div>'+
                                                 '</div>'+
                                                 '<div class="card-bottom">'+
                                                     '<div class="lightGrayColor">结果（时间：'+askTime+'）</div>'+
                                                     '<div class="blackColor">'+askResult+'</div>'+
                                                 '</div>'+
                                             '</div>');
            });
            pageNum++;
        } else {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').html("--end--");
            return;
        }
        if (dataSrc.list.length < itemsPerLoad) {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').html("--end--");
            return;
        }
    },function (errorCode) {
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

addItems(itemsPerLoad);

$('#searchBtn').click(function () {
    var start = new Date($("#dateStart").val().replace(/-/g, '/'));
    var end = new Date($("#dateEnd").val().replace(/-/g, '/'));
    if (start > end) {
        $.toast(Operation['ui_dateselecttip']);
        return;
    }
    $(".close-panel").click();
    getFirstPage();
});

function add0(m){return m<10?'0'+m:m }
function formatDate(timestamp){
  //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
	var time = new Date(timestamp);
	var year = time.getFullYear();
	var month = time.getMonth()+1;
	var date = time.getDate();
	var hours = time.getHours();
	var minutes = time.getMinutes();
	var seconds = time.getSeconds();
	return year+'-'+add0(month)+'-'+add0(date)+' '+add0(hours)+':'+add0(minutes)+':'+add0(seconds);
}

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