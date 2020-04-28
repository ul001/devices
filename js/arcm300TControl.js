var subObj = JSON.parse(localStorage.getItem("subObj"));
var titleName = localStorage.getItem("controlClassTitle");
$(".title.title_color").text(titleName);
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
                var thisStatus = "<span class='normalStatus'>"+Operation['ui_normal']+"</span>";
                var imgStr= "<img src=\"img/arcm300t.png\">";
                if(this.meterStatus=="1"){
                    thisStatus = "<span class='alarmStatus'>"+Operation['ui_Alarm']+"</span>";
                    imgStr= "<img src=\"img/arcm300Talarm.png\">"
                }
                strArr += "<label class=\"list-item label-checkbox light_opening\" data-id=\"" + this.meterCode + "\">\n" +
                    "                        <div class=\"row\">\n" +
                    "                            <input class=\"selectBox\" type=\"checkbox\" name=\"my-checkbox\" data-id=\"" + this.meterCode + "\">\n" +
                    "                            <div class=\"item-media col-15\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                    "                            <span class=\"label-title col-85\">" + Substation.removeUndefined(this.meterName) + "</span>\n" +
                    // "                            <a href=\"#\" class=\"view_detail col-25 button\">详情</a>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"row no-gutter\">\n" +
                    "                        <div class=\"col-40\">\n" +
                    "                            "+imgStr+"\n" +
                    "                        </div>\n" +
                    "                        <div class=\"col-60\">\n" +
                          "                            <p class='right-float limit-length' style='margin-top:.3rem;'>"+Operation['ui_deviceId']+"："+this.meterCode+"</p>\n" +
                          "                            <p class='right-float'>"+thisStatus+"</p>\n" +
                    "                        </div>\n" +
                    "                        </div>\n" +
                    "                    </label>";
            });
            $(".content-list").html(strArr);
            if (isControl == 0) {
                $(".item-media").hide();
                $(".label-title").removeClass("col-85").addClass("col-100");
                $(".list-item").on("click",goToDetail);
            } else {
                $(".label-title").removeClass("col-100").addClass("col-85");
            }
        }
    });
}

initContent();

function controlClick() {
    $("input:checkbox").removeAttr("checked");
    if (!$(".footer_btn").length || $(".footer_btn").is(":hidden")) {
        isControl = 1;
        $("#back_btn").text(Operation['ui_SelectAll']);
        $("#back_btn").off("click").on("click", selectAll);
        $("#control_btn").text(Operation['ui_cancel']);
        $("#record_btn").toggle();
        $("#light_opening").click();
        $(".label-title").removeClass("col-100").addClass("col-85");
        $(".item-media").toggle();
        $(".button_bar").toggle();
        $(".footer_btn").toggle();
        $("input:checkbox").removeAttr("disabled");
        $(".list-item").off("click",goToDetail);
    } else {
        isControl = 0;
        $("#back_btn").html('<span class="icon icon-left"></span>' + '<span>' + Operation['ui_back'] + '</span>');
        $("#back_btn").off("click").on("click", goBack);
        $("#control_btn").text(Operation['ui_control']);
        $("#record_btn").toggle();
        $(".label-title").removeClass("col-85").addClass("col-100");
        $(".item-media").toggle();
        $(".list-item").show();
        $(".button_bar").toggle();
        $(".footer_btn").toggle();
        $("input:checkbox").prop("disabled", "disabled");
        $("input:checkbox").removeAttr("checked");
        $(".list-item").on("click",goToDetail);
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

function selectAll() {
    if ($("#back_btn").text() == Operation['ui_selectAll']) {
        $("#back_btn").text(Operation['ui_UnselectAll']);
        $(".list-item:visible input:checkbox").prop("checked", "checked");
    } else {
        $("#back_btn").text(Operation['ui_selectAll']);
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

var canclick = 1;
//复位
$("#reset").click(function () {
    if(canclick==1){
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                "meterCode": metercode,
                "substationId":subObj.subId,
                "type": "reset",
                "value": "1"
            });
        });
        if(controlJson.length && controlJson.length==0){
            $.toast(Operation['ui_selectNo']);
            return;
        }
        setTimeout(function(){
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        },15000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax("/sendMeterControlDemandHTTP", JSON.stringify(controlJson), function (data) {
            if(data.data.a!=undefined){
                $.alert(data.data.a);
            }
        });
    }else{
        $.alert(Operation['ui_operateAllTip']);
    }
});

//分闸
$("#DO").click(function () {
    if(canclick==1){
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                "meterCode": metercode,
                "substationId":subObj.subId,
                "type": "DO",
                "value": "1"
            });
        });
        if(controlJson.length && controlJson.length==0){
            $.toast(Operation['ui_selectNo']);
            return;
        }
        setTimeout(function(){
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        },15000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax("/sendMeterControlDemandHTTP", JSON.stringify(controlJson), function (data) {
            if(data.data.a!=undefined){
                $.alert(data.data.a);
            }
        });
    }else{
        $.alert(Operation['ui_operateAllTip']);
    }
});

//消音
$("#silent").click(function () {
    if(canclick==1){
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                "meterCode": metercode,
                "substationId":subObj.subId,
                "type": "silent",
                "value": "1"
            });
        });
        if(controlJson.length && controlJson.length==0){
            $.toast(Operation['ui_selectNo']);
            return;
        }
        setTimeout(function(){
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        },15000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax("/sendMeterControlDemandHTTP", JSON.stringify(controlJson), function (data) {
            if(data.data.a!=undefined){
                $.alert(data.data.a);
            }
        });
    }else{
        $.alert(Operation['ui_operateAllTip']);
    }
});

//自检
$("#check").click(function () {
    if(canclick==1){
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                "meterCode": metercode,
                "substationId":subObj.subId,
                "type": "check",
                "value": "1"
            });
        });
        if(controlJson.length && controlJson.length==0){
            $.toast(Operation['ui_selectNo']);
            return;
        }
        setTimeout(function(){
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        },15000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax("/sendMeterControlDemandHTTP", JSON.stringify(controlJson), function (data) {
            if(data.data.a!=undefined){
                $.alert(data.data.a);
            }
        });
    }else{
        $.alert(Operation['ui_operateAllTip']);
    }
});

function goToDetail() {
    var meterCode = $(this).attr("data-id");
    localStorage.setItem("meterCode", meterCode);
    window.location.href = "arcm300TDetail.html";
}

$("#controlLog").click(function () {
    window.location.href = "deviceControlLog.html?type=arcm300T";
});

$.init();