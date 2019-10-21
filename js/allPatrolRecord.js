var selectSubid = "";
//分页
var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;

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
    var params = {
        pageNum: pageNum,
        pageSize: number
    };
    if(selectSubid!=""&&selectSubid!=null){
        params['fSubid']=selectSubid;
    }
    var dateStartVal = $("#dateStart").val();
    var dateEndVal = $("#dateEnd").val();
    var stateVal = $("#fState").val();
    if(dateStartVal!=""){
        params['ftimeStart']=dateStartVal+" 00:00:00";
    }
    if(dateEndVal!=""){
        params['ftimeEnd']=dateEndVal+" 23:59:59";
    }
    if(stateVal!=""){
        params['fTaskstateid']=stateVal;
    }
    Substation.getDataByAjaxNoLoading("/getPlaceCheckFormList",params,function(data){
            if(data.placecheckformAllList.list.length>0){
                if (pageNum == 1) {
                    $("#list-container").empty();
                }
                $(data.placecheckformAllList.list).each(function(){
                    var iconStr = "";
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
                    }
                    $("#list-container").append("<div class=\"card\" id=\""+this.fPlacecheckformid+"\">\n" +
                                               "                    <div class=\"card-content\">\n" +
                                               "                        <div class=\"card-content-inner row no-gutter\">\n" +
/*                                               "                            <div class=\"col-10\">\n" +
                                                iconStr +
                                               "                            </div>\n" +*/
                                               "                            <div class=\"col-95\">\n" +
                                               "                                <p class=\"subName limit-length\">"+this.fTaskName+"<span class=\"blueColor\">("+this.fStateExplain+")</span></p>\n" +
//                                               "                                <p>巡检人：<span class=\"blueColor\">"+this.fCreatebyuserid+"</span></p>\n" +
                                               "                                <p>巡检开始时间：<span class=\"blueColor\">"+this.fCreatetime+"</span></p>\n" +
                                               "                                <p>本次已发现缺陷：<span class=\"redColor\">"+this.fproblemTotal+" </span>个  未处理：<span class=\"redColor\">"+this.funsolvedTotal+" </span>个</p>\n" +
                                               "                            </div>\n" +
                                               "                            <div class=\"col-5\">\n" +
                                               "                                <i class=\"icon icon-right\"></i>\n" +
                                               "                            </div>\n" +
                                               "                        </div>\n" +
                                               "                    </div>\n" +
                                               "                </div>");
                });
                $(".card").unbind().click(function(){
                    var fPlacecheckformid = $(this).attr("id");
                    localStorage.setItem("fPlacecheckformid",fPlacecheckformid);
                    localStorage.setItem("canClick",false);
                    window.location.href="patrolContent.html";
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
    if($("#search").val()==""){
        $("#subname").text("所有变电所");
        selectSubid="";
    }
    getFirstPage();
});

$("#dateStart").calendar();
$("#dateEnd").calendar();

function getSomeSubstation(){
    var url = "/getSubstationListByUser";
    var searchKey = $("#search").val();
    var params = {
        pageNo: 1,
        pageSize: 5,
        key: searchKey
    }
    $("#listContainer").html('<li class="item-content" data-id="">'+
                                 '<div class="item-inner">'+
                                     '<div class="item-title">所有变电所</div>'+
                                 '</div>'+
                             '</li>');
    Substation.getDataByAjaxNoLoading(url,params,function(data){
        $(data.list).each(function(){
            $("#listContainer").append('<li class="item-content" data-id="'+this.fSubid+'">'+
                                                                '<div class="item-inner">'+
                                                                    '<div class="item-title">'+this.fSubname+'</div>'+
                                                                '</div>'+
                                                            '</li>');
        });
        $("#listContainer .item-content").click(function(){
            selectSubid = $(this).attr("data-id");
            var clickName = $(this).find(".item-title").text();
            $("#search").val(clickName);
            $("#subname").text(clickName);
        });
    });
}

$('#search').bind('keydown', function (event) {
    if (event.keyCode == 13) {
        getSomeSubstation();
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