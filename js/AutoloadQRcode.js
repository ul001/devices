var subdeviceinfoid = Substation.GetQueryString("fSubdeviceinfoid");
var deviceName = localStorage.getItem("deviceName");
$("#titleContent2").html(decodeURIComponent(deviceName));

$("#goBackLd").click(function () {
    /*window.location.href =
          "deviceClass.html?pid=" + jumpPid + "&clickNum=" + lastClickNum;*/
    // localStorage.setItem("pid", jumpPid);
    // localStorage.setItem("clickNum", lastClickNum);
    if (isAndroid) {
        // android.refresh();
        android.goBack();
    } else {
        localStorage.setItem("need-refresh", "true");
        window.history.back();
    }
});

getPageInfo();

function getPageInfo() {
    //获取二维码
    Substation.getDataByAjax(
        "/getDeviceDetailById", {
            fSubdeviceinfoid: subdeviceinfoid
        },
        function (data) {
            $(".content-block").empty();
            // qrCodeFile: {
            //     fId: 1,
            //     fCodeid: "3hr2hAB4uL8BS",
            //     fQrcodefile: "3hr2hAB4uL8BS.png",
            //     fSubdeviceinfoid: 264,
            //     fCreatetime: "2020-12-21 16:18:54",
            //     …
            // }
            // qrCodeFilePath: "fileSystem/deviceImg"
            if (data.qrCodeFilePath && data.qrCodeFile.fQrcodefile) {
                var imgPath =
                    Substation.ipAddressFromAPP + data.qrCodeFilePath + "/" + data.qrCodeFile.fQrcodefile;
                var img =
                    '<img class="up-img pic" name="' + data.fileName + '" style="width:100%" onclick="imgDisplay(this)" src = "' +
                    imgPath +
                    '" > <p class="QRtime" style="text-align:center;">二维码生成时间: ' + data.qrCodeFile.fCreatetime + '</p>';
                $(".content-block").append(img);
                // $.toast(Operation["ui_successfully"]);
            }
        }
    );
}

//生成二维码
$("#Add2").click(function () {
    //接口获取二维码
    // $(".content-block").empty();
    Substation.getDataByAjax(
        "/generateQrCodeForCertainDevice", {
            fSubdeviceinfoid: subdeviceinfoid
        },
        function (data) {
            if (data.filePath && data.fileName) {
                var imgPath =
                    Substation.ipAddressFromAPP + data.filePath + "/" + data.fileName;
                var img =
                    '<img class="up-img pic" name="' + data.fileName + '" style="width:100%" onclick="imgDisplay(this)" src = "' +
                    imgPath +
                    '" > ';
                $(".content-block").append(img);
                $.toast(Operation["ui_successfully"]);
            }
        }
    );
});

//扫码绑定
$("#scanCodebind").click(function () {
    if (isIOS) {
        window.webkit.messageHandlers.scanQRcode.postMessage("");
    } else {
        android.pushToZXActivity();
    }
});

//原生回调
function getQRresultAndPush(param) {
    if (param && param.length > 0) {
        var strArr = param.split("_");
        if (param == "" || param == undefined) {
            return;
        }
        if (strArr[0] != "arcel") {
            $.toast("非本平台二维码");
            return;
        }
        // var codeid = strArr[1];
        $.confirm(
            "是否将设备绑定至二维码？",
            function () {
                Substation.getDataByAjax(
                    "/bindQrCodeWithDeivce", {
                        fSubdeviceinfoid: subdeviceinfoid,
                        fCodeid: param
                    },
                    function (data) {
                        $.toast(Operation["ui_delsuccess"]);
                        getPageInfo();
                        // if (data.filePath && data.fileName) {
                        //     $(".content-block").empty();
                        //     var imgPath =
                        //         Substation.ipAddressFromAPP + data.filePath + "/" + data.fileName;
                        //     var img =
                        //         '<img class="up-img pic" name="' + data.fileName + '" style="width:100%" onclick="imgDisplay(this)" src = "' +
                        //         imgPath +
                        //         '" > ';
                        //     $(".content-block").append(img);
                        //     $.toast(Operation["ui_successfully"]);
                        // }
                    }
                );
            },
            function () {
                $(":radio[name='" + radioName + "'][value='yes']").prop(
                    "checked",
                    true
                );
            }
        );

    }

}

//二维码解绑
$("#deleteQRcode").click(function () {
    Substation.getDataByAjax(
        "/unbindQrCodeWithDeivce", {
            fSubdeviceinfoid: subdeviceinfoid
        },
        function (data) {
            $(".content-block").empty();
            $.toast(Operation["ui_successfully"]);
        }
    );
});