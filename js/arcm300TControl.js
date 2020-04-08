var subObj = JSON.parse(localStorage.getItem("subObj"));
try {
    if (isAndroid) {
        subObj = JSON.parse(android.getSpItem("subObj"));
    }
} catch (e) {}

$(".item-media").hide();
$("input:checkbox").prop("disabled", "disabled");

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

//下拉刷新
$(document).on('refresh', '.pull-to-refresh-content', function (e) {
    setTimeout(function () {

        // done
        $.pullToRefreshDone('.pull-to-refresh-content');
    }, 2000);
});

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