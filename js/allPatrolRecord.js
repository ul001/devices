var selectSubid = localStorage.getItem("fSubid");
var selectSubname = localStorage.getItem("fSubname");
$("#subName").text(selectSubname);
//分页
var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;

function getFirstPage() {
    $("#listContainer").empty();
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
        pageSize: number,
        fSubid:selectSubid
    };
    Substation.getDataByAjaxNoLoading("/getPlaceCheckFormList",params,function(data){
            if(data.placecheckformAllList.list.length>0){
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
                    }
                    $("#listContainer").append("<div class=\"card\" id=\""+this.fPlacecheckformid+"\">\n" +
                                               "                    <div class=\"card-content\">\n" +
                                               "                        <div class=\"card-content-inner row no-gutter\">\n" +
                                               "                            <div class=\"col-10\">\n" +
                                                iconStr +
                                               "                            </div>\n" +
                                               "                            <div class=\"col-85\">\n" +
                                               "                                <p class=\"subName\">"+this.fTaskName+"<span class=\"blueColor\">("+this.fStateExplain+")</span></p>\n" +
                                               "                                <p>巡检人：<span class=\"blueColor\">"+this.fCreatebyuserid+"</span></p>\n" +
                                               "                                <p>最新一次巡检时间：<span class=\"blueColor\">"+this.fCreatetime+"</span></p>\n" +
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
$("#listContainer").empty();
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
        lastIndex = $('#listContainer .card').length;
    }, 1000);
});

$.init();