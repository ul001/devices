//var selectSubid = localStorage.getItem("fSubid");
var selectSubid="";
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
        params['fProblemLevel']=dangerVal;
    }
    Substation.postDataByAjax(url, params, function (data) {
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
                var solveUser = "";
                if(this.fSolvedUserName!=undefined){
                    solveUser="<p>处理人员："+this.fSolvedUserName+"</p>";
                }
                var solveTime = "";
                if(this.fUpdateDate!=undefined){
                    solveTime="<p>处理时间："+this.fUpdateDate+"</p>";
                }
                html += "<div class=\"card\" id=\""+this.fDeviceproblemid+"\" value=\""+this.treePathName+"\">\n" +
                        "                    <div class=\"card-content\">\n" +
                        "                        <div class=\"card-content-inner row no-gutter\">\n" +
                        "                            <div class=\"col-10\">\n" +
                        "                                <i class=\"icon icon-alarm\"></i>\n" +
                        "                            </div>\n" +
                        "                            <div class=\"col-85\">\n" +
                        "<p class=\"subName limit-length\">"+this.fSubName+"</p>"+
                        "                                <p><span\n" +
                        "                                        class=\"redColor\">(设备名称:"+this.treePathName+")"+this.fDeviceproblemdes+"</span>\n" +
                        "                                </p>\n" +
                        "                                <p>危害:"+this.fProblemharm+"</p>\n" +
                        "                                <p>具体位置:"+problemStr+"</p>\n" +
                        "                                <p>缺陷类别:"+this.fProblemtype+"</p>\n" +
                        "                                <p>紧急程度:"+this.fProblemlevel+"</p>\n" +
                        "                                <p>消缺期限:"+this.fTimelimit+"</p>\n" +
                        "                                <p>处理建议:"+this.fResolution+"</p>\n" +
                        "                                <p>客户意见:"+this.fClientadvice+"</p>\n" +
                        "                                <p>处理状态:"+stateStr+"</p>\n" +
                        "                                <p>发现时间:"+this.fCreatetime+"</p>\n" +
                        solveUser+solveTime+
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
    getFirstPage();
});

$("#dateStart").calendar();
$("#dateEnd").calendar();

$('#search').bind('keydown', function (event) {
    if (event.keyCode == 13) {
        $.toast("你好");
        document.activeElement.blur();
    }
});

//解决键盘遮挡问题
window.addEventListener("resize", function () {
    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

$.init();