//var selectSubid = localStorage.getItem("fSubid");
var selectSubid="";
var clickSubid="";
var loading = false;
var itemsPerLoad = 5;
var pageNum = 1;

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
    var params = {
        pageNum:pageNum,
        pageSize:number};
    if(selectSubid!=""){
        params['fSubid']=selectSubid;
    }
    var dateStartVal = $("#dateStart").val();
    var dateEndVal = $("#dateEnd").val();
    var stateVal = $("#fState").val();
    var dangerVal = $("#dangerType").val();
    if(dateStartVal!=""){
        params['ftimeStart']=dateStartVal+" 00:00:00";
    }
    if(dateEndVal!=""){
        params['ftimeEnd']=dateEndVal+" 23:59:59";
    }
    if(stateVal!=""){
        params['fState']=stateVal;
    }
    if(dangerVal!=""){
        params['fProblemlevel']=dangerVal;
    }
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        if (data.tDevDeviceproblemList.list.length > 0) {
            if (pageNum == 1) {
                $("#list-container").empty();
            }
            $(data.tDevDeviceproblemList.list).each(function () {
                var problemStr = "";
                if(this.fProblemlocation.indexOf(",")!=-1){
                    problemStr=this.fProblemlocation.split(",")[1]
                }
                var stateStr = "";
                switch(this.fState){
                    case "0":
                    stateStr="<span class=\"redColor\">未处理</span>";
                    break;
                    case "2":
                    stateStr="<span class=\"redColor\">待处理</span>";
                    break;
                    case "3":
                    stateStr="<span class=\"redColor\">待客户停电处理</span>";
                    break;
                    case "4":
                    stateStr="<span class=\"redColor\">待线路停电处理</span>";
                    break;
                    case "5":
                    stateStr="<span class=\"redColor\">其他</span>";
                    break;
                    case "1":
                    stateStr="<span class=\"button-success\">已处理</span>";
                    break;
                    default:
                    stateStr="<span class=\"redColor\">未处理</span>";
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
                html += "<div class=\"card\" id=\""+this.fDeviceproblemid+"\" value=\""+this.treePathName+"\">\n" +
                        "                    <div class=\"card-content\">\n" +
                        "                        <div class=\"card-content-inner row no-gutter\">\n" +
                        /*"                            <div class=\"col-10\">\n" +
                        "                                <i class=\"icon icon-alarm\"></i>\n" +
                        "                            </div>\n" +*/
                        "                            <div class=\"col-95\">\n" +
                        "<p class=\"subName limit-length\">"+this.fSubName+"</p>"+
                        "                                <p>设备名称:<span class=\"redColor\">"+this.treePathName+"</span>\n" +
                        "                                </p>\n" +
                        "                                <p>缺陷描述:<span class=\"redColor\">"+this.fDeviceproblemdes+"</span></p>\n" +
//                        "                                <p>危害:"+this.fProblemharm+"</p>\n" +
                        "                                <p>具体位置:"+problemStr+"</p>\n" +
                        "                                <p class=\"row\"><span class=\"col-50\">缺陷类别:"+this.fProblemtype+"</span><span class=\"col-50\">紧急程度:"+this.fProblemlevel+"</span></p>\n" +
//                        "                                <p>消缺期限:"+this.fTimelimit+"</p>\n" +
//                        "                                <p>处理建议:"+this.fResolution+"</p>\n" +
//                        "                                <p>客户意见:"+this.fClientadvice+"</p>\n" +
                        "                                <p>处理状态:"+stateStr+"</p>\n" +
                        "                                <p>发现时间:"+this.fCreatetime+"</p>\n" +
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
            $(".card").unbind().click(function(){
                var clickId = $(this).attr("id");
                var clickTree = $(this).attr("value");
                localStorage.setItem("clickTree",clickTree);
                localStorage.setItem("canClick",false);
                window.location.href="defectInfo.html?fDeviceproblemid="+clickId;
            });
            pageNum++;
        } else {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').html("--end--");
            return;
        }
        if (data.tDevDeviceproblemList.list.length < itemsPerLoad) {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').html("--end--");
            return;
        }
    });
}
$("#list-container").empty();

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
    $(".close-panel").click();
    if($("#search").val()==""){
        $("#subName").text("所有变电所");
        selectSubid="";
    }else if(clickSubid!=""){
        $("#subName").text($("#search").val());
        selectSubid=clickSubid;
        clickSubid="";
    }
    getFirstPage();
});

$("#dateStart").calendar();
$("#dateEnd").calendar();

function getSomeSubstation(){
    var url = "/getSubListByLetter";
    var searchKey = $("#search").val();
    var params = {
        key: searchKey
    }
    $("#listContainer").empty();
    Substation.getDataByAjaxNoLoading(url,params,function(data){
        $(data).each(function(){
            $("#listContainer").append('<li class="item-content" data-id="'+this.fSubid+'">'+
                                                                '<div class="item-inner">'+
                                                                    '<div class="item-title">'+this.fSubname+'</div>'+
                                                                '</div>'+
                                                            '</li>');
        });
        $("#listContainer .item-content").click(function(){
            clickSubid = $(this).attr("data-id");
            var clickName = $(this).find(".item-title").text();
            $("#search").val(clickName);
            $("#listContainer").empty();
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

$('#search').on("input",function(){
    if($("#search").val().length>0){
        $(".icon.icon-clear").show();
    }else{
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

$(".icon.icon-clear").click(function(){
    $("#search").val("");
    $(this).hide();
});

//时间快捷按钮
$(".buttons-row .button").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
});
$("#today").click(function(){
    var myDate = new Date();
    var todayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart").val(todayVal);
    $("#dateEnd").val(todayVal);
});
$("#yestoday").click(function(){
    var myDate = new Date();
    myDate.setTime(myDate.getTime()-24*60*60*1000);
    var yestodayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart").val(yestodayVal);
    $("#dateEnd").val(yestodayVal);
});
$("#thisMonth").click(function(){
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart").val(firstDayVal);
    $("#dateEnd").val(lastDayVal);
});
$("#lastMonth").click(function(){
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth()-1, 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart").val(firstDayVal);
    $("#dateEnd").val(lastDayVal);
});

Date.prototype.format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

$("#dateStart,#dateEnd").click(function(){
    $(".buttons-row").find($(".active")).removeClass("active");
});

//解决键盘遮挡问题
var h=$(window).height();
window.addEventListener("resize", function () {
    if($(window).height()<h){ $('.btnBar').hide(); }
    if($(window).height()>=h){ $('.btnBar').show(); }
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