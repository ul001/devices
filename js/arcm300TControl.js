var subObj = JSON.parse(localStorage.getItem("subObj"));
var isControl = 0;
$(".item-media").hide();
$("input:checkbox").prop("disabled", "disabled");

function initContent() {
    Substation.getDataByAjax("/selectByStationId", {
        stationId: subObj.subId
    }, function (data) {
        $(".content-list").empty();
        var strArr = "";
        if (data.list != undefined && data.list.length && data.list.length > 0) {
            $(data.list).each(function () {
                strArr += "<label class=\"list-item label-checkbox light_opening\" onclick=\"goToDetail(" + this.meterCode + ")\">\n" +
                    "                        <div class=\"row\">\n" +
                    "                            <input class=\"selectBox\" type=\"checkbox\" name=\"my-checkbox\" data-id=\"" + this.meterCode + "\">\n" +
                    "                            <div class=\"item-media col-15\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                    "                            <span class=\"label-title col-75\">" + this.meterName + "</span>\n" +
                    // "                            <a href=\"#\" class=\"view_detail col-25 button\">详情</a>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"img_text\">\n" +
                    "                            <img src=\"img/arcm300t.png\">\n" +
                    //      "                            <span class=\"right-bottom\">合闸</span>\n" +
                    "                        </div>\n" +
                    "                    </label>";
            });
            $(".content-list").html(strArr);
            if (isControl == 0) {
                $(".item-media").hide();
                $(".label-title").removeClass("col-60").addClass("col-75");
            } else {
                $(".label-title").removeClass("col-75").addClass("col-60");
            }
        }
    });
}

initContent();

function controlClick() {
    if (!$(".footer_btn").length || $(".footer_btn").is(":hidden")) {
        isControl = 1;
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
        isControl = 0;
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
        initContent();
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

//复位
$("#reset").click(function () {
    var controlJson = [];
    $(".selectBox:checked").each(function (i, obj) {
        var metercode = $(obj).attr("data-id");
        controlJson.push({
            "meterCode": metercode,
            "type": "reset",
            "value": "1"
        });
    });
    Substation.postDataWithRawByAjax("/sendMeterControlDemandHTTP", JSON.stringify(controlJson), function (data) {

    });
});

//分闸
$("#DO").click(function () {
    var controlJson = [];
    $(".selectBox:checked").each(function (i, obj) {
        var metercode = $(obj).attr("data-id");
        controlJson.push({
            "meterCode": metercode,
            "type": "DO",
            "value": "1"
        });
    });
    Substation.postDataWithRawByAjax("/sendMeterControlDemandHTTP", JSON.stringify(controlJson), function (data) {

    });
});

//消音
$("#silent").click(function () {
    var controlJson = [];
    $(".selectBox:checked").each(function (i, obj) {
        var metercode = $(obj).attr("data-id");
        controlJson.push({
            "meterCode": metercode,
            "type": "silent",
            "value": "1"
        });
    });
    Substation.postDataWithRawByAjax("/sendMeterControlDemandHTTP", JSON.stringify(controlJson), function (data) {

    });
});

//自检
$("#check").click(function () {
    var controlJson = [];
    $(".selectBox:checked").each(function (i, obj) {
        var metercode = $(obj).attr("data-id");
        controlJson.push({
            "meterCode": metercode,
            "type": "check",
            "value": "1"
        });
    });
    Substation.postDataWithRawByAjax("/sendMeterControlDemandHTTP", JSON.stringify(controlJson), function (data) {

    });
});

function goToDetail(meterCode) {
    localStorage.setItem("meterCode", meterCode);
    window.location.href = "arcm300TDetail.html";
}

$("#controlLog").click(function () {
    window.location.href = "arcm300TControlLog.html";
});

$.init();