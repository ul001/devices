//var loading = false;
//var itemsPerLoad = 10;
//var pageNum = 1;
//var loadUrl = "/getARCMControlLogList";
//
//function getFirstPage() {
//    $(".list-container").empty();
//    pageNum = 1;
//    addItems(itemsPerLoad);
//    $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
//    loading = false;
//    $.attachInfiniteScroll($('.infinite-scroll'));
//}

$(document).on('refresh', '.pull-to-refresh-content',function(e) {
    setTimeout(function() {
        var cardHTML = '<div class="card">' +
                          '<div class="card-header">New Card</div>' +
                          '<div class="card-content">' +
                            '<div class="card-content-inner">' +
                                'Hello! I am the new card!'+(Math.random()*1000000)+
                            '</div>' +
                          '</div>' +
                      '</div>';

        $(e.target).find('.card').replaceWith(cardHTML);
        // done
        $.pullToRefreshDone('.pull-to-refresh-content');
    }, 2000);
});

//$(document).on('refresh', '.pull-to-refresh-content', function (e) {
//    setTimeout(function () {
////        getFirstPage();
//        // done
//        $.pullToRefreshDone('.pull-to-refresh-content');
//    }, 2000);
//});
//
//$(document).on('infinite', '.infinite-scroll', function () {
//
//    // 如果正在加载，则退出
//    if (loading) return;
//
//    // 设置flag
//    loading = true;
//
//    setTimeout(function () {
//        loading = false;
////        addItems(itemsPerLoad);
//    }, 1000);
//});

//function addItems(number){
//    Substation.getDataByAjaxNoLoading(loadUrl,{pageNo:pageNum,pageSize:number},function(data){
//        var dataSrc = data.pageInfo;
//        if (pageNum == 1) {
//            $(".list-container").empty();
//        }
//        if(dataSrc.list!=undefined && dataSrc.list.length>0){
//            $(dataSrc.list).each(function(){
//                $(".list-container").append('<div class="card">'+
//                                                 '<div class="card-content">'+
//                                                     '<div class="card-content-inner">'+
//                                                         '<div>操作（时间：2020-04-14 09:56:00）</div>'+
//                                                         '<div>张三对三楼北（20301804）进行合闸操作</div>'+
//                                                         '<div>结果（时间：）</div>'+
//                                                         '<div>暂无结果</div>'+
//                                                     '</div>'+
//                                                 '</div>'+
//                                             '</div>');
//            });
//            pageNum++;
//        } else {
//            $.detachInfiniteScroll($('.infinite-scroll'));
//            $('.infinite-scroll-preloader').html("--end--");
//            return;
//        }
//        if (dataSrc.list.length < itemsPerLoad) {
//            $.detachInfiniteScroll($('.infinite-scroll'));
//            $('.infinite-scroll-preloader').html("--end--");
//            return;
//        }
//    },function (errorCode) {
//        if (errorCode == 0) {
//          $.detachInfiniteScroll($(".infinite-scroll"));
//          $(".infinite-scroll-preloader").html("--" + Operation['ui_neterror'] + "--");
//        } else {
//          $.detachInfiniteScroll($(".infinite-scroll"));
//          $(".infinite-scroll-preloader").html("");
//        }
//        return;
//    });
//}
//
//addItems(itemsPerLoad);