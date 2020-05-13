var imgNum1 = 0;
var imgNum = 0;
var fDeviceproblemid = Substation.GetQueryString("fDeviceproblemid");
var androidProblemid = localStorage.getItem("fDeviceproblemid");
localStorage.removeItem("fDeviceproblemid");
if (androidProblemid != null && androidProblemid != undefined) {
    fDeviceproblemid = androidProblemid;
    $(".back_btn").click(function () {
        android.goBack();
    });
} else {
    $(".back_btn").click(function () {
        window.history.back();
    });
}
var taskProblem = Substation.GetQueryString("taskProblem");
var selectSubid = localStorage.getItem("fSubid");
//var clickTree = localStorage.getItem("clickTree");
var canClick = localStorage.getItem("canClick");
var alarmeventlogid = localStorage.getItem("alarmeventlogid");
// var alarmeventlogid = Substation.GetQueryString("alarmeventlogid");
var alarmeventlogid = "20200512153410265227891";
var jumpId = Substation.GetQueryString("jumpId");
var isPush = "0";
if (jumpId != undefined && jumpId != null && jumpId != "") {
    alarmeventlogid = jumpId;
    isPush = "1";
}

// var param = JSON.parse(localStorage.getItem("DetailParam"));
// localStorage.removeItem("DetailParam");
// creatView(param);
loadMenu();

function loadMenu() {
    $("#form1").empty();
    if (!alarmeventlogid) {
        $.toast("数据异常，未获取到报警对应ID");
        return;
    }
    $.showPreloader(Operation["ui_loading"]);
    Substation.getDataByAjaxNoLoading(
        "/getTaskAndAlarmEventDetailById", {
            fTaskandalarmeventid: alarmeventlogid
            // fAlarmeventlogid: "2020050712100851951629671"
        },
        function (data) {
            if (data.hasOwnProperty("taskAndAlarmEventDetail") && data.taskAndAlarmEventDetail) {
                creatView(data);

            } else {
                $.toast("数据异常，未获取到报警对应详情");
            }
            $.hidePreloader();
        },
        function (errorcode) {
            $.hidePreloader();
        }
    );
}

$(".pull-left.click_btn").click(function () {
    if (isPush == "1") {
        //推送详情点击返回事件
        if (isAndroid) {
            android.goBack();
        } else if (isIOS) {
            //            window.history.back();
            window.webkit.messageHandlers.goBackiOS.postMessage("");
        }
    } else {
        window.history.back();
    }
});

function creatView(dataParam) {
    var html = "";
    if (dataParam) {
        var imgUrl = dataParam.ImgURL;
        var taskParam = dataParam.taskAndAlarmEventDetail;
        var picArr = dataParam.tDevTaskAndAlarmEventImgs;
        var param = JSON.parse(taskParam.fAlarmevnetlogcontent);
        var sb = "                        <ul>";
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb +=
            '                                    <div class="item-title label" data-i18n="ui_Subname">' +
            Operation["ui_taskNumber"] +
            "</div>";
        sb +=
            '                                    <div class="item-label subName">' +
            (taskParam.fTasknumber ? taskParam.fTasknumber : "") +
            "</div>";
        sb += "                                </div>";
        sb += "                            </li>";
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb +=
            '                                    <div class="item-title label" data-i18n="ui_Subname">' +
            Operation["ui_Subname"] +
            "</div>";
        sb +=
            '                                    <div class="item-label subName">' +
            (param.fSubname ? param.fSubname : "") +
            "</div>";
        sb += "                                </div>";
        sb += "                            </li>";
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb +=
            '                                    <div class="item-title label" data-i18n="ui_happenTime">' +
            Operation["ui_happenTime"] +
            "</div>";
        sb +=
            '                                    <div class="item-label startTime">' +
            (param.fAlarmtime ? param.fAlarmtime : "") +
            "</div>";
        sb += "                                </div>";
        sb += "                            </li>";
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb +=
            '                                    <div class="item-title label" data-i18n="ui_alarmMeterId">' +
            Operation["ui_alarmDeviceId"] +
            "</div>";
        sb +=
            '                                    <div class="item-label meterId">' +
            (param.fDevicecode != undefined ? param.fDevicecode : "") +
            "</div>";
        sb += "                                </div>";
        sb += "                            </li>";
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb +=
            '                                    <div class="item-title label" data-i18n="ui_alarmMeterName">' +
            Operation["ui_alarmDeviceName"] +
            "</div>";
        sb +=
            '                                    <div class="item-label meterName">' +
            (param.fDevicename ? param.fDevicename : "") +
            "</div>";
        sb += "                                </div>";
        sb += "                            </li>";
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb +=
            '                                    <div class="item-title label" data-i18n="ui_alarmType">' +
            Operation["ui_alarmType"] +
            "</div>";
        sb +=
            '                                    <div class="item-label alarmType">' +
            (param.fAlarmtype != undefined ? param.fAlarmtype : "") +
            "</div>";
        sb += "                                </div>";
        sb += "                            </li>";
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb +=
            '                                    <div class="item-title label" data-i18n="ui_alarmType">' +
            Operation["ui_alarmDetail"] +
            ":" +
            "</div>";
        sb +=
            '                                    <div class="item-label alarmType">' +
            (param.fAlarmdesc != undefined ? param.fAlarmdesc : "") +
            "</div>";
        sb += "                                </div>";
        sb += "                            </li>";
        //参数编号
        if (param.hasOwnProperty("fParamcode")) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb +=
                '                                    <div class="item-title label" data-i18n="ui_alarmParamId">' +
                Operation["ui_alarmParamId"] +
                "</div>";
            sb +=
                '                                    <div class="item-label paramId">' +
                (param.fParamcode != undefined ? param.fParamcode : "") +
                "</div>";
            sb += "                                </div>";
            sb += "                            </li>";
        }
        //参数名称
        if (param.hasOwnProperty("fParamname")) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb +=
                '                                    <div class="item-title label" data-i18n="ui_alarmParamName">' +
                Operation["ui_alarmParamName"] +
                "</div>";
            sb +=
                '                                    <div class="item-label paramName">' +
                (param.fParamname ? param.fParamname : "") +
                "</div>";
            sb += "                                </div>";
            sb += "                            </li>";
        }
        //参数说明
        if (param.hasOwnProperty("valueType")) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb +=
                '                                    <div class="item-title label" data-i18n="ui_alarmParamValueType">' +
                Operation["ui_alarmParamValueType"] +
                "</div>";
            sb +=
                '                                    <div class="item-label paramName">' +
                (param.valueType != undefined ? param.valueType : "") +
                "</div>";
            sb += "                                </div>";
            sb += "                            </li>";
        }
        //参数值
        if (param.hasOwnProperty("fValue")) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb +=
                '                                    <div class="item-title label" data-i18n="ui_alarmParamValue">' +
                Operation["ui_alarmParamValue"] +
                "</div>";
            sb +=
                '                                    <div class="item-label paramName">' +
                (param.fValue != undefined ? param.fValue : "") +
                "</div>";
            sb += "                                </div>";
            sb += "                            </li>";
        }
        //越限值 设定值
        if (param.hasOwnProperty("fLimitvalue")) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb +=
                '                                    <div class="item-title label" data-i18n="ui_Overshootvalue">' +
                Operation["ui_Overshootvalue"] +
                "</div>";
            sb +=
                '                                    <div class="item-label paramName">' +
                (param.fLimitvalue != undefined ? param.fLimitvalue : "") +
                "</div>";
            sb += "                                </div>";
            sb += "                            </li>";
        }
        //确认状态
        if (param.hasOwnProperty("fConfirmstatus")) {
            var value = "";
            param.fConfirmstatus ? (value = param.fConfirmstatus) : (value = "");
            value == true ? (value = "已确认") : (value = "未确认");
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb +=
                '                                    <div class="item-title label" data-i18n="ui_fConfirmstatus">' +
                Operation["ui_fConfirmstatus"] +
                "</div>";
            sb +=
                '                                    <div class="item-label paramName">' +
                value +
                "</div>";
            sb += "                                </div>";
            sb += "                            </li>";
        }
        //确认人
        if (param.hasOwnProperty("fConfirmusername")) {
            var value = "";
            param.fConfirmusername ? (value = param.fConfirmusername) : (value = "");
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb +=
                '                                    <div class="item-title label" data-i18n="ui_fConfirmuserid">' +
                Operation["ui_fConfirmuserid"] +
                "</div>";
            sb +=
                '                                    <div class="item-label paramName">' +
                value +
                "</div>";
            sb += "                                </div>";
            sb += "                            </li>";
        }
        //确认时间
        if (param.hasOwnProperty("fConfirmtime")) {
            var value = "";
            param.fConfirmtime ? (value = param.fConfirmtime) : (value = "");
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb +=
                '                                    <div class="item-title label" data-i18n="ui_fConfirmtime">' +
                Operation["ui_fConfirmtime"] +
                "</div>";
            sb +=
                '                                    <div class="item-label paramName">' +
                value +
                "</div>";
            sb += "                                </div>";
            sb += "                            </li>";
        }

        //照片
        sb += ' <li class="align-top">';
        sb += '                                <div class="item-content">';
        sb += '                                    <div class="item-inner">';
        sb +=
            '                                        <div class="item-title label"><span class="blueColor"';
        sb +=
            '                                                data-i18n="">' +
            Operation["ui_RectifyPhoto"] +
            "</span></div>";
        sb += '                                        <div class="item-input">';
        sb +=
            '                                            <div class="custom_img">';
        sb +=
            '                                                <div class="upload_img_wrap">';
        sb +=
            '                                                    <div id="imgBox"><img class="upload_img" src="img/upload_img.png" />';
        sb += "                                                    </div>";
        sb +=
            '                                                    <!--<img style="display:none" class="upload_img" data-id="3" src="image/upload_img.png" />-->';
        sb += "                                                </div>";
        sb += "                                                <div";
        sb +=
            '                                                    style="display: none;width: 100%;height: 100vh;position: relative;">';
        sb +=
            '                                                    <div style="display: none;" id="inputBox">';
        sb +=
            '                                                        <input type="file" name="myFiles" data-id="1" title="请选择图片"';
        sb +=
            '                                                            id="file1"';
        sb +=
            '                                                            accept="image/png,image/jpg,image/gif,image/JPEG" />';
        sb += "                                                        <!--";
        sb +=
            '                                            <input type="file" name="image[]" data-id="2" title="请选择图片" id="file2" accept="image/png,image/jpg,image/gif,image/JPEG" />';
        sb +=
            '                                            <input type="file" name="image[]" data-id="3" title="请选择图片" id="file3" accept="image/png,image/jpg,image/gif,image/JPEG" /> 点击选择图片-->';
        sb += "                                                    </div>";
        sb +=
            '                                                    <input style="display:none" type="submit" id="sub" />';
        sb += "                                                </div>";
        sb += "                                            </div>";
        sb += "                                        </div>";
        sb += "                                    </div>";
        sb += "                                </div>";
        sb += "                            </li>";
        sb += "<li>";
        sb += '                                <div class="item-content">';
        sb += '                                    <div class="item-inner">';
        sb +=
            '                                        <div class="item-title label blueColor"><span class="blueColor"';
        sb +=
            '                                                data-i18n="ui_suggestion">' +
            Operation["ui_processExplain"] +
            "</span></div>";
        sb += '                                        <div class="item-input">';
        sb +=
            '                                            <input type="text" id="fSolveresult" name="fSolveresult" value="">';
        sb += "                                        </div>";
        sb += "                                    </div>";
        sb += "                                </div>";
        sb += "                            </li>";
        sb += " <li>";
        sb += "                            <div class=\"item-content\">";
        sb += "                                <div class=\"item-inner\">";
        sb += "                                    <div class=\"item-title label blueColor\">处理情况：<\/div>";
        sb += "                                    <div class=\"item-input\">";
        sb += "                                        <select id=\"fState\" name=\"fState\">";
        sb += "                                            <option value=\"0\">未处理<\/option>";
        sb += "                                            <option value=\"2\">待处理<\/option>";
        sb += "                                            <option value=\"3\">待客户停电处理<\/option>";
        sb += "                                            <option value=\"4\">待线路停电处理<\/option>";
        sb += "                                            <option value=\"5\">其他<\/option>";
        sb += "                                            <option value=\"1\">已处理<\/option>";
        sb += "                                        <\/select>";
        sb += "                                    <\/div>";
        sb += "                                <\/div>";
        sb += "                            <\/div>";
        sb += "                        <\/li>";
        sb += "                        </ul>";
        $("#form1").append(sb);



        $("#fSolveresult").val(Substation.removeUnDefinedStr(taskParam.fSolveresult));
        $("#fState").val(Substation.removeUnDefinedStr(taskParam.fState));
        if (canClick == "false") {
            $(".upload_img_wrap .upload_img").unbind();
            $(".upload_img_wrap .upload_img").css("display", "none");
            $(".blueColor").removeClass("blueColor");
            $("#saveData").css("display", "none");
            $("#fClientadvice").val('');
            $("#fState").val('');
            $("#fSolveresult").attr("readonly", true);
            // $("#fState").attr("readonly", true);
        }

        if (picArr.length > 0) {
            $.each(picArr, function (i, value) {
                imgNum++;
                if (value.fImgnamemin == undefined) {
                    var imgDiv =
                        '<div class="imgContainer RectificationPIC" id=' +
                        value.fTaskandalarmeventid +
                        " data-index=" +
                        (i + 1) +
                        "><img   src=" +
                        (Substation.ipAddressFromAPP +
                            imgUrl +
                            "/" +
                            value.fImgname) +
                        " name=" +
                        (Substation.ipAddressFromAPP +
                            imgUrl +
                            "/" +
                            value.fImgname) +
                        '  onclick="imgDisplay(this)"></div>';
                } else {
                    var imgDiv =
                        '<div class="imgContainer RectificationPIC" id=' +
                        value.fTaskandalarmeventid +
                        " data-index=" +
                        (i + 1) +
                        "><img   src=" +
                        (Substation.ipAddressFromAPP +
                            imgUrl +
                            "/" +
                            value.fImgnamemin) +
                        " name=" +
                        (Substation.ipAddressFromAPP +
                            imgUrl +
                            "/" +
                            value.fImgname) +
                        '  onclick="imgDisplay(this)"></div>';
                }

                $("#imgBox").append(imgDiv);
            });
        }
        $.hidePreloader();
    } else {
        $.hidePreloader();
    }

    $("#inputBox").html("");
    $(".upload_img_wrap .upload_img").on("click", function () {
        //console.log(ev.currentTarget.dataset.id)
        var index = imgNum + 1;
        if ($("#file" + index).length < 1) {
            //        var ua = navigator.userAgent.toLowerCase(); //获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
            //        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1); //判断是否是苹果手机，是则是true
            //        if (isIos) {
            //            $("#inputBox").append("<input type=\"file\" name=\"cover\" data-id=\"" + index + "\" title=\"请选择图片\" id=\"file" + index + "\" accept=\"image/png,image/jpg,image/gif,image/JPEG\" />");
            //            // $("input:file").removeAttr("capture");
            //        }else{
            $("#inputBox").append(
                '<input type="file" class="fileInput" capture="camera" name="myFiles" data-id="' +
                index +
                '" title="请选择图片" id="file' +
                index +
                '" accept="image/png,image/jpg,image/gif,image/JPEG" />'
            );
            //        }
        }
        $("#file" + index).click();
        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
        if (isIOS) {
            $("#file" + index).click();
        }
        $("#file" + index)
            .unbind()
            .change(function (e) {
                var index = e.currentTarget.dataset.id;
                if ($("#file" + index).val() == "") {
                    $("#inputBox input")
                        .eq(index - 1)
                        .remove();
                    return false;
                }
                var filePath = $(this).val();
                changeImg(e, filePath, index);
                imgNum++;
                //$(".upload_img_length").html(imgNum);
                return;
            });
    });

}


function changeImg(e, filePath, index) {
    fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
    //检查后缀名
    if (!fileFormat.match(/.png|.jpg|.jpeg/)) {
        showError("文件格式必须为：png/jpg/jpeg");
        return;
    }
    //获取并记录图片的base64编码
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function () {
        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
        var dataURL = reader.result;
        // console.log(dataURL)
        // 显示图片
        $("#imgBox").append(
            '<div class="imgContainer" data-index=' +
            index +
            "><img   src=" +
            dataURL +
            " name=" +
            dataURL +
            ' onclick="imgDisplay(this)"><img onclick="removeImg(this,' +
            index +
            ')"  class="imgDelete" src="img/del_img.png" /></div>'
        );
    };
}

function removeImg(obj, index) {
    for (var i = 0; i < $(".imgContainer").length; i++) {
        if (
            $(".imgContainer")
            .eq(i)
            .attr("data-index") == index
        ) {
            var imgId = $(".imgContainer")
                .eq(i)
                .attr("id");
            if (imgId == undefined) {
                $(".imgContainer")
                    .eq(i)
                    .remove();
                $("#file" + index).remove();
                // $("#inputBox input")
                //   .eq(index)
                //   .remove();
            } else {
                //                if(confirm("确定要删除已保存的图片？")){
                /*$.confirm("确定要删除已保存的图片？", function () {
                                    $(".imgContainer").eq(i).remove();
                                    Substation.getDataByAjax("/deleteSubstationImg", {
                                        fId: imgId
                                    }, function () {

                                    });
                                });*/
                /*$(".imgContainer").eq(i).remove();
                                Substation.getDataByAjax("/deleteSubstationImg", {
                                    fId: imgId
                                }, function () {

                                });*/
                //                }
            }
            imgNum--;
        }
    }
    //$(".upload_img_length").html(imgNum);
}

function imgDisplay(obj) {
    var src = $(obj).attr("name");
    var imgHtml =
        '<div style="width: 100%;height: 100vh;overflow: auto;background: rgba(0,0,0,0.5);text-align: center;position: fixed;top: 0;left: 0;z-index: 2000;display: flex;justify-content: center;    align-items: center;"><img onclick="closePicture(this)" src=' +
        src +
        ' style="margin-top: 100px;width: 96%;margin-bottom: 100px;"/><p style="font-size: 50px;position: fixed;top: 30px;right: 30px;color: white;cursor: pointer;" onclick="closePicture(this)">×</p></div>';
    $("body").append(imgHtml);
}

function closePicture(obj) {
    $(obj)
        .parent("div")
        .remove();
}

/*function loadSavedPic() {
    Substation.getDataByAjax("/selectSubstationImg", {
        fSubid: selectSubid
    }, function (data) {
        if (data.hasOwnProperty("substationImgList") && data.substationImgList.length > 0) {
            var imgUrl = data.substationImgUrl;
            $.each(data.substationImgList, function (i, value) {
                imgNum++;
                var imgDiv = '<div class="imgContainer" id=' + value.fId + ' data-index=' + (i + 1) + '><img   src=' + (Substation.ipAddressFromAPP + imgUrl + "/" + value.fImagename) + ' onclick="imgDisplay(this)"><img onclick="removeImg(this,' + (i + 1) + ')"  class="imgDelete" src="img/del_img.png" /></div>';
                $("#imgBox").append(imgDiv);
            });
        }
    });
}*/

//loadSavedPic();

var upLoadClicktag = true;

function saveFormData() {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    $(".fileInput").each(function () {
        if ($(this).val() == "" || $(this).val() == null) {
            $(this).remove();
        }
    });
    if ($(".fileInput").length > 6) {
        $.toast(Operation['ui_uploadPicTip']);
        return;
    }
    if ($(".RectificationPIC").length + $(".fileInput").length > 6) {
        $.toast(Operation['ui_uploadPicTip']);
        return;
    }
    var params = new FormData($("#form1")[0]);
    var taskId = localStorage.getItem("taskID");
    // params.append("fDeviceproblemid", fDeviceproblemid);
    params.append("fTaskandalarmeventid", alarmeventlogid);
    Substation.postFormDataByAjax("/modifyTaskAndAlarmEventDetail", params, function (
        data
    ) {
        if (data.code == 200) {
            $.toast(Operation['ui_savesuccess']);
            localStorage.setItem("need-update", "true");
            window.history.back();
        }
    });
}

//解决键盘遮挡问题
window.addEventListener("resize", function () {
    if (
        document.activeElement.tagName == "INPUT" ||
        document.activeElement.tagName == "TEXTAREA"
    ) {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});
$.init();