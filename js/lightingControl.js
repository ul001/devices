$(".item-media").hide();
$("input:checkbox").prop("disabled", "disabled");
var subid = Substation.GetQueryString("fSubid");
var itemsPerLoad = 10;
var pageNum = 1;

function controlClick() {
    if (!$(".footer_btn").length || $(".footer_btn").is(":hidden")) {
        $("#back_btn").text("全选");
        $("#back_btn").off("click").on("click", selectAll);
        $("#control_btn").text("取消");
        $("#record_btn").toggle();
        $("#light_opening").click();
        $(".label-title").removeClass("col-75").addClass("col-60");
        $(".item-media").toggle();
        $(".button_bar").toggle();
        $(".footer_btn").toggle();
        $("input:checkbox").removeAttr("disabled");
    } else {
        $("#back_btn").html('<span class="icon icon-left"></span>' + '<span>' + Operation['ui_back'] + '</span>');
        $("#back_btn").off("click").on("click", goBack);
        $("#control_btn").text("控制");
        $("#record_btn").toggle();
        $(".label-title").removeClass("col-60").addClass("col-75");
        $(".item-media").toggle();
        $(".list-item").show();
        $(".button_bar").toggle();
        $(".footer_btn").toggle();
        $("input:checkbox").prop("disabled", "disabled");
        $("input:checkbox").removeAttr("checked");
    }
}

function getFirstPage() {
    $(".content-list").empty();
    pageNum = 1;
    lastIndex = 10;
    addItems(itemsPerLoad);
    $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
    loading = false;
    $.attachInfiniteScroll($('.infinite-scroll'));
}

//下拉刷新
$(document).on('refresh', '.pull-to-refresh-content', function (e) {
    setTimeout(function () {
        // done
        $.pullToRefreshDone('.pull-to-refresh-content');
    }, 2000);
});

function addItems(number, lastIndex) {
    var html = '';
    var url = "/selectMeterValue";
    var params = {};

    params = {
        fSubid: subid,
        pageNo: pageNum,
        pageSize: number
    };
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
            // var datadic = data.alarmEventLogList;
            if (data.hasOwnProperty("list") && data.list.length > 0) {
                if (pageNum == 1) {
                    $(".content-list").empty();
                }
                $(data.list).each(function () {
                    var deviceValue = this.deviceValue;
                    html = '<label class="list-item label-checkbox light_opening" data-id="' + this.fMetercode + '">';
                    html += '                            <div class="row">';
                    html += '                                <input type="checkbox" name="my-checkbox">';
                    html += '                                <div class="item-media col-15"><i class="icon icon-form-checkbox"></i></div>';
                    html += '                                <span class="label-title col-100">' + this.fDevicename + '</span>';
                    html += '                            </div>';
                    html += '                            <div class="img_text">';
                    if (deviceValue == "0") {
                        html += '                                <img src="img/lightClose.png">';
                    } else if (deviceValue == "1") {
                        html += '                                <img src="img/lightClose.png">';
                    } else {
                        html += '                                <img src="img/lightClose.png">';
                    }
                    html += '                                <span class="right-bottom">' + (this.deviceValueExplain ? this.deviceValueExplain : "无设备") + '</span>';
                    html += '                            </div>';
                    html += '                        </label>';
                    $('.content-list').append(html);
                    // alarmDetailList.push(this);
                });


                addCardLongClick();
                //addClick();
                $(".item-media").hide();
                //保存记录
                //                params['subName'] = $("#search").val();
                //                localStorage.setItem("saveAlarmParam", JSON.stringify(params));
                //                Substation.getDataByAjaxNoLoading("/close", {}, function () {});
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
            //复选框初始化
            $(".selectAlarms").toggle();
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

$("#control_btn").click(function () {
    controlClick();
});

$(".button_bar .button").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    var showClass = $(this).attr("id");
    $(".list-item").hide();
    $("." + showClass).show();
    if (showClass == "light_opening") {
        $(".footer_btn").text("关闭灯光");
    } else if (showClass == "light_closed") {
        $(".footer_btn").text("开启灯光");
    }
});

function selectAll() {
    if ($("#back_btn").text() == "全选") {
        $("#back_btn").text("全不选");
        $(".list-item:visible input:checkbox").prop("checked", "checked");
    } else {
        $("#back_btn").text("全选");
        $(".list-item:visible input:checkbox").removeAttr("checked");
    }
}

function goBack() {
    //    if (isAndroid) {
    //        android.goBack();
    //    } else if (isIOS) {
    //        window.history.back();
    //        window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
    //    } else {
    window.history.back();
    //    }
}

$("#back_btn").on("click", goBack);

$.init();