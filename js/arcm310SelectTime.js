var meterCode = localStorage.getItem("meterCode");
var cJson = localStorage.getItem("controlJsonArr");
var controlJson = JSON.parse(cJson);

var d = new Date();
var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
    "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":00";
var timeString = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":00";

$("#dateTimeOpen1").val(datestring);
$("#dateTimeClose1").val(datestring);
$("#dateTimeOpen2").val(timeString);
$("#dateTimeClose2").val(timeString);

$("#submitBtn").click(function () {
    if ($('#closeTime').hasClass('active')) {
        $(controlJson).each(function (i, obj) {
            obj.value = "2";
        });
        sendControlTimeEvent(controlJson)
    } else {
        if ($('#once').hasClass('active')) {
            //单次 分闸
            var openTime = $("#onceOpen").prop("checked");
            var opendate = $("#dateTimeOpen1").val().replace("T", " ");
            var opendateToStamp = opendate.replace(/-/g, '/');
            var timeOpenStamp = new Date(opendateToStamp).getTime();
            //单次 合闸
            var closeTime = $("#onceClose").prop("checked");
            var closedate = $("#dateTimeClose1").val().replace("T", " ");
            var closedateToStamp = closedate.replace(/-/g, '/');
            var timeCloseStamp = new Date(closedateToStamp).getTime();

            if (!openTime && !closeTime) {
                $.toast("未勾选任何设定时间");
                return;
            }
            if (timeOpenStamp == timeCloseStamp) {
                $.toast("分闸与合闸时间不能相同");
                return;
            }

            if (openTime) {
                $(controlJson).each(function (i, obj) {
                    obj.openTime = opendate;
                    obj.value = "3";
                });
            } else {
                $(controlJson).each(function (i, obj) {
                    obj.openTime = "";
                    obj.value = "3";
                });
            }

            if (closeTime) {
                $(controlJson).each(function (i, obj) {
                    obj.closeTime = closedate;
                    obj.value = "3";
                });
            } else {
                $(controlJson).each(function (i, obj) {
                    obj.closeTime = "";
                    obj.value = "3";
                });
            }
            sendControlTimeEvent(controlJson);
        } else {
            //每次 分闸
            var openTime = $("#anywayOpen").prop("checked");
            var opendate = $("#dateTimeOpen2").val().replace("T", " ");
            var opendateToStamp = opendate.replace(/-/g, '/');
            var timeOpenStamp = new Date(opendateToStamp).getTime();
            //每次 合闸
            var closeTime = $("#anywayClose").prop("checked");
            var closedate = $("#dateTimeClose2").val().replace("T", " ");
            var closedateToStamp = closedate.replace(/-/g, '/');
            var timeCloseStamp = new Date(closedateToStamp).getTime();

            if (!openTime && !closeTime) {
                $.toast("未勾选任何设定时间");
                return;
            }
            if (timeOpenStamp == timeCloseStamp) {
                $.toast("分闸与合闸时间不能相同");
                return;
            }

            //每次 分闸
            var openTime = $("#anywayOpen").prop("checked");
            if (openTime) {
                $(controlJson).each(function (i, obj) {
                    obj.openTime = opendate;
                    obj.value = "4";
                });
            } else {
                $(controlJson).each(function (i, obj) {
                    obj.openTime = "";
                    obj.value = "4";
                });
            }
            //每次 合闸
            if (closeTime) {
                $(controlJson).each(function (i, obj) {
                    obj.closeTime = closedate;
                    obj.value = "4";
                });
            } else {
                $(controlJson).each(function (i, obj) {
                    obj.closeTime = "";
                    obj.value = "4";
                });
            }
            sendControlTimeEvent(controlJson);
        }
    }
});

function sendControlTimeEvent(param) {
    Substation.postDataWithRawByAjax(
        "/send310ControlDemandHTTP",
        JSON.stringify(param),
        function (data) {
            if (data.data.a != undefined) {
                $.alert(data.data.a);
            }
        }
    );
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

$.init();