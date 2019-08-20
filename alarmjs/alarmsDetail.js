function goToLocation(lat, lon, subid, subname) {
    // var locationItem = {
    //     fLat: lat,
    //     fLon: lon,
    //     fSubid: subid,
    //     fSubName: subname
    // };
    // localStorage.setItem("locationItem", JSON.stringify(locationItem));
    // window.location.href = "location.html";
}

function goToDevice(subId, subname) {
    // localStorage.setItem("fSubid", subId);
    // localStorage.setItem("fSubname", subname);
    // window.location.href = "deviceClass.html";
}

function goToPhoto(subId) {
    // localStorage.setItem("fSubid", subId);
    // window.location.href = "selectPhoto.html";
}

var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;
var clickID = localStorage.getItem("clickId");

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
    if (clickID == "1") {
        url = "/getWarningMessageSignalEvents";
        $("title").html("遥信变位报警");
    } else if (clickID == "2") {
        url = "/getWarningMessageOverLimitEvents";
        $("title").html("遥测越限报警");
    } else {
        url = "/getWarningMessagePlatformRunEvents";
        $("title").html("平台运行报警");
    }
    // var searchKey = $("#search").val();
    var params = {
        pageNo: pageNum,
        pageSize: number
        // key: searchKey
    }
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        var datadic = data.WarningMessage;
        if (datadic.hasOwnProperty("list") && datadic.list.length > 0) {
            $(datadic.list).each(function () {
                html += "<div class=\"card\">\n" +
                    "                    <div class=\"card-content\">\n" +
                    "                        <div class=\"content-padded\">\n" +
                    "                            <div class=\"row  no-gutter sub_card\">\n" +
                    "                                <div class=\"col-80\"  onClick=\"goToDevice(" + this.fSubid + ",'" + this.fSubname + "')\">\n" +
                    "                                    <p class=\"subName\">" + "<img src=\"img/jiancedian.png\">" + this.fSubname + "</p>\n" +
                    "                                    <P>仪表名称：" + Substation.removeUndefined(this.fMetername) + "</P>\n" +
                    "                                    <p>事件类型：" + this.fAlarmtype + "</p>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"col-30\">\n" +
                    "                                    <p><span>" + this.fStarttime + "</span></p>\n" +
                    "                                    <br>\n" +
                    "                                     <img src=\"img/alarmp.png\" width=\"44\">\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                </div>";
            });
            $('.list-container').append(html);
            //addClick();
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

$('#search').bind('keydown', function (event) {
    if (event.keyCode == 13) {
        getFirstPage();
    }
});

$(".searchbar-cancel").click(function () {
    $("#search").val("");
    getFirstPage();
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