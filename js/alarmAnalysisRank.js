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
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

var upLoadClicktag = true;

window.addEventListener("pageshow", function (e) {
    // ios系统 返回页面 不刷新的问题 Safari内核缓存机制导致 方案一 方案二：设置meta标签，清除页面缓存
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (e.persisted && isIOS) {
        var needUpdate = localStorage.getItem("need-update");
        if (needUpdate) {
            localStorage.removeItem("need-update");
            window.location.reload();
        }
        window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
    }
});

function goToLocation(subid) {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    localStorage.setItem("fSubid", subid);
    if (isAndroid) {
        android.goToIn3();
        return;
    }
    window.location.href = "location.html";
}

function goToDevice(subId, subname) {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    localStorage.setItem("fSubid", subId);
    localStorage.setItem("fSubname", subname);
    if (isAndroid) {
        android.goToIn();
        return;
    }
    window.location.href = "deviceClass.html";
}

function goToPhoto(subId) {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    localStorage.setItem("fSubid", subId);
    if (isAndroid) {
        android.goToIn2();
        return;
    }
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
                if (pageNum == 1) {
                    $(".list-container").empty();
                }
                $(data.list).each(function () {
                    html += "<div class=\"card\">\n" +
                        "                    <div class=\"card-content\">\n" +
                        "                        <div class=\"content-padded\">\n" +
                        "                            <div class=\"row  no-gutter sub_card\">\n" +
                        "                                <div class=\"col-90\"  onClick=\"goToDevice(" + this.fSubid + ",'" + this.fSubname + "')\">\n" +
                        "                                    <p class=\"subName limit-length\">" + this.fSubname + "</p>\n" +
                        //                    "                                    <p><i class=\"icon icon-contact\"></i>" + Substation.removeUndefined(this.fContacts) + "  <i class=\"icon icon-contactphone\"></i>" + Substation.removeUndefined(this.fContactsPhone) + "</p>\n" +
                        "                                        <div>报警处理率：" +
                        "                                            <div class=\"progress\">" +
                        "                                                <div class=\"progressbar\" style=\"width:40%;\"><\/div>" +
                        "                                            <\/div>" +
                        "                                            <span class=\"total\">40%<\/span>" +
                        "                                        <\/div>" +
                        "                                     <p style=\"margin: 0.4rem 0;\">告警数目：54<\/p>" +
                        "                                <\/div>" +
                        "                                <div class=\"col-10\">\n" +
                        "                                        <button class=\"external goPhoto\" type=\"button\">" +
                        "                                            <img class=\"upload_img\" src=\"img\/clear_alarm.png\" style=\"width:100%\" \/>" +
                        "                                            <!-- url(..\/img\/clear_alarm.png) -->" +
                        "                                        <\/button>" +
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
                $('.infinite-scroll-preloader').html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
                return;
            }
            if (data.list.length < itemsPerLoad) {
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
                return;
            }
        },
        function (errorCode) {
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
            $('.infinite-scroll-preloader').html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
            return;
        }

        addItems(itemsPerLoad, lastIndex);
        lastIndex = $('.list-container .card').length;
    }, 1000);
});

$('#search').bind('keydown', function (event) {
    if (event.keyCode == 13) {
        getFirstPage();
        document.activeElement.blur();
    }
});

$(".searchbar-cancel").click(function () {
    $("#search").val("");
    getFirstPage();
});

$(".back_btn").click(function () {
    if (isAndroid) {
        android.goBack();
    } else if (isIOS) {
        window.history.back();
        window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
    } else {
        window.history.back();
    }
});


//开启一个定时器
// function run() {
//     var bar = document.getElementById("bar");
//     var total = document.getElementById("total");
//     bar.style.width = 60 + "%";
//     total.innerHTML = bar.style.width;
// bar.style.width = parseInt(bar.style.width) + 1 + "%";
// total.innerHTML = bar.style.width;
// if (bar.style.width == "100%") {
//     window.clearTimeout(timeout);
//     return;
// }
// var timeout = window.setTimeout("run()", 100);
// }

// run();

$.init();