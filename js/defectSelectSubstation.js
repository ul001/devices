/*    function addClick(){
        $(".card").click(function(){
            localStorage.setItem("fSubid",10100001);
            window.location.href="deviceClass.html";
        });

        $(".goPhoto").click(function(e) {
            e.stopPropagation();
            window.location.href = "selectPhoto.html";
        });

        $(".goLocation").click(function(e) {
            e.stopPropagation();
            window.location.href = "location.html";
        });
    }*/

function goToLocation(lat, lon, subid, subname) {
    var locationItem = {
        fLat: lat,
        fLon: lon,
        fSubid: subid,
        fSubName: subname
    };
    localStorage.setItem("locationItem", JSON.stringify(locationItem));
    window.location.href = "location.html";
}

function goToRecord(subId, subname) {
    localStorage.setItem("fSubid", subId);
    localStorage.setItem("fSubname", subname);
    window.location.href = "patrolRecordForDefect.html";
}

function goToPhoto(subId) {
    localStorage.setItem("fSubid", subId);
    window.location.href = "selectPhoto.html";
}

var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;

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
    var url = "/getSubstationListByUser";
    var searchKey = $("#search").val();
    var params = {
        pageNo: pageNum,
        pageSize: number,
        key: searchKey
    }
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        if (data.hasOwnProperty("list") && data.list.length > 0) {
            $(data.list).each(function () {
                html += "<div class=\"card\">\n" +
                    "                    <div class=\"card-content\">\n" +
                    "                        <div class=\"content-padded\">\n" +
                    "                            <div class=\"row  no-gutter sub_card\">\n" +
                    "                                <div class=\"col-80\"  onClick=\"goToRecord(" + this.fSubid + ",'" + this.fSubname + "')\">\n" +
                    "                                    <p class=\"subName limit-length\">" + this.fSubname + "</p>\n" +
                    "                                    <p><i class=\"icon icon-contact\"></i>" + Substation.removeUndefined(this.fContacts) + "  <i class=\"icon icon-contactphone\"></i>" + Substation.removeUndefined(this.fContactsPhone) + "</p>\n" +
                    "                                    <p class=\"limit-length\">地址：" + Substation.removeUndefined(this.fAddress) + "</p>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"col-20\">\n" +
                    "                                    <button class='bg-primary external goPhoto' type=\"button\" onclick=\"goToPhoto(" + this.fSubid + ")\">照片\n" +
                    "                                    </button>\n" +
                    "                                    <br>\n" +
                    "                                    <button class='bg-primary external goLocation' onclick=\"goToLocation(" + this.fLatitude + "," + this.fLongitude + "," + this.fSubid + ",'" + this.fSubname + "')\" type=\"button\">位置\n" +
                    "                                    </button>\n" +
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
        if (data.list.length < itemsPerLoad) {
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