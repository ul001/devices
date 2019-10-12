var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;
var clickID = Substation.GetQueryString("clickID");

function getFirstPage() {
    $(".list-container").empty();
    pageNum = 1;
    addItems(itemsPerLoad, 0);
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

function addItems(number, lastIndex) {
    var html = '';
    var url = "";
    if (clickID == "bianwei") {
        url = "/getWarningMessageSignalEvents";
        //$(".title").html("遥信变位报警");
    } else if (clickID == "yuexian") {
        url = "/getWarningMessageOverLimitEvents";
        //$(".title").html("遥测越限报警");
    } else if (clickID == "platform") {
        url = "/getWarningMessagePlatformRunEvents";
        //$(".title").html("平台运行报警");
    }
    // var searchKey = $("#search").val();
    var params = {
        pageNo: pageNum,
        pageSize: number
        // key: searchKey
    };
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        var datadic = data.WarningMessage;
        if (datadic.hasOwnProperty("list") && datadic.list.length > 0) {
            if (pageNum == 1) {
                $(".list-container").empty();
            }
            $(datadic.list).each(function () {
                html += "<div class=\"card\">\n" +
                    "                    <div class=\"card-content\">\n" +
                    "                        <div class=\"content-padded\">\n" +
                    "                            <div class=\"row  no-gutter sub_card" + (this.fIsread == true ? "" : " unRead") + "\">\n" +
                    "                                <div class=\"col-75\">\n" +
                    "                                    <p class=\"subName\"><i class=\"icon icon-subIcon\"></i>" + this.fSubname + "</p>\n" +
                    "                                    <P>仪表名称：" + (clickID == "platform" ? (this.fDevicename) : (this.fMetername)) + "</P>\n" +
                    "                                    <p>事件类型：" + this.fAlarmtype + "</p>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"col-25\">\n" +
                    "                                    <p><i class=\"icon icon-alarm\"></i></p>\n" +
                    "                                    <p><span class=\"cardtime\">" + this.fStarttime + "</span></p>" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                </div>";
            });
            $('.list-container').append(html);
            //addClick();
            Substation.getDataByAjaxNoLoading("/close");
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
    });
}

addItems(itemsPerLoad, 0);

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

        addItems(itemsPerLoad, lastIndex);
        lastIndex = $('.list-container .card').length;
    }, 1000);
});

$.init();