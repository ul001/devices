// var alarmType = 1;
// if (alarmType == 1) {
//     $("#yaoxin").siblings(".list-block").remove();
//     $(".item-after").html("123");
// }
// var urlinfo = window.location.href, //获取url 
//     value = urlinfo.split("?")[1].split("=")[1]; //
// var param = JSON.parse(value);

var paramDetail = JSON.parse(localStorage.getItem("lightingDetail"));
var subid = Substation.GetQueryString("fSubid");
var devicetype = Substation.GetQueryString("devicetype");
var titleName = localStorage.getItem("controlClassTitle");
$(".title.title_color").text(titleName);
//是否可点击1 等待0
var canClick = 1;
//开关灯
var closeLightName = localStorage.getItem("closeLightName");
var openLightName = localStorage.getItem("openLightName");
var closeOtherName = localStorage.getItem("closeOtherName");
var openOtherName = localStorage.getItem("openOtherName");

$("#open").text(closeLightName);
$("#close").text(openLightName);
$("#reset").text(closeLightName);
$("#DO").text(openLightName);
$("#silent").text(closeOtherName);
$("#check").text(openOtherName);

creatView(paramDetail);

if (devicetype == "05004") {
    //风机
    $("#AirCoolControl").css('display', 'none');
    $("#AirHotControl").css('display', 'none');
} else if (devicetype == "05003") {
    //空调
    $("#FanControl").css('display', 'none');
} else {
    $("#AirCoolControl").css('display', 'none');
    $("#AirHotControl").css('display', 'none');
    $("#FanControl").css('display', 'none');
}

function creatView(param) {
    var html = '';
    if (param) {
        // fMetercode: 仪表编号
        // fFuncid: 控制编码， 参数码
        // fGatewayid: 网关id
        // fComid:
        // fFuncname: 备用字段
        // fDevicetype: 设备类型， 暂时只有照明
        // fDeivcename: 设备名
        // fStatedesc: 状态解释， 1 代表什么， 0 代表什么
        // deviceValue: 对应仪表当前值， 当前状态
        // deviceValueExplain: 对应解释
        var sb = '                        <ul>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_Subname">' + Operation['ui_Subname'] + '</div>';
        sb += '                                    <div class="item-after subName">' + (param.fSubname != 'undefined' ? param.fSubname : '') + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_startTime">' + Operation['ui_alarmDeviceId'] + '</div>';
        sb += '                                    <div class="item-after startTime">' + (param.fMetercode != 'undefined' ? param.fMetercode : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_alarmMeterName">' + Operation['ui_alarmDeviceName'] + '</div>';
        sb += '                                    <div class="item-after meterName">' + (param.datafDeivcename != 'undefined' ? param.datafDeivcename : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        //fGatewayid
        if (param.hasOwnProperty('datagatewayid')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">' + Operation['ui_gateway'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.datagatewayid != 'undefined' ? param.datagatewayid : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //串口号
        if (param.hasOwnProperty('datacomid')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">' + Operation['ui_Serialnumber'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.datacomid != 'undefined' ? param.datacomid : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //datafDevicetype
        if (param.hasOwnProperty('datafDevicetype')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">' + Operation['ui_Equipmenttype'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.datafDevicetype != 'undefined' ? param.datafDevicetype : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //控制编码
        if (param.hasOwnProperty('datafuncid')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">' + Operation['ui_Controlencoding'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.datafuncid != 'undefined' ? param.datafuncid : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //fResult
        if (param.hasOwnProperty('deviceValue') && devicetype != "05003") {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamId">' + Operation['ui_currentstate'] + '</div>';
            if (param.deviceValue == '0') {
                sb += '                                    <div class="item-after paramId">' + Operation['ui_Opening'] + '</div>';
            } else if (param.deviceValue == '1') {
                sb += '                                    <div class="item-after paramId">' + Operation['ui_Closing'] + '</div>';
            } else {
                sb += '                                    <div class="item-after paramId">' + Operation['ui_nolightDevice'] + '</div>';
            }
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //越限值
        if (param.hasOwnProperty('fLimitvalue')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_Overshootvalue">' + Operation['ui_Overshootvalue'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.fLimitvalue ? param.fLimitvalue : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //确认状态
        if (param.hasOwnProperty('fConfirmstatus')) {
            var value = '';
            param.fConfirmstatus ? value = param.fConfirmstatus : value = "";
            value == true ? value = "已确认" : value = "未确认";
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_fConfirmstatus">' + Operation['ui_fConfirmstatus'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + value + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //确认人
        if (param.hasOwnProperty('fConfirmusername')) {
            var value = '';
            param.fConfirmusername ? value = param.fConfirmusername : value = "";
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_fConfirmuserid">' + Operation['ui_fConfirmuserid'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + value + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //确认时间
        if (param.hasOwnProperty('fConfirmtime')) {
            var value = '';
            param.fConfirmtime ? value = param.fConfirmtime : value = "";
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_fConfirmtime">' + Operation['ui_fConfirmtime'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + value + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        sb += '                        </ul>';

        $('#yaoxin').append(sb);
    } else {

    }
}

function smsOrSecPassword(val) {
    Substation.getDataByAjaxNoLoading("/getControlValidType", {}, function (data) {
        if (data) {
            if (data.validType == "sms") {
                var sb = '                <div class="outContain" style="width: auto;">';
                sb += '                  <div class="codeDiv">';
                sb += '                    <input id="phoneInput" type="text" class="sendInput" value="15151853872" disabled';
                sb += '                      autocomplete="off">';
                sb += '                    <span class="icon codePhoneImg"></span>';
                sb += '                    <label class="errorInfo"></label>';
                sb += '                  </div>';
                sb += '                  <div class="codeDiv">';
                sb += '                    <input id="canvasInput" type="text" class="sendInput" placeholder="请输入验证码"';
                sb += '                      autocomplete="off" style="width:6.2rem;">';
                // sb += '                    <span class="icon codeCanvasImg"></span>';
                sb += '                    <canvas id="canvas" width="100" height="38"></canvas>';
                sb += '                  </div>';
                sb += '';
                sb += '                  <div class="codeDiv">';
                sb += '                    <input id="code" class="sendInput" type="text" placeholder="请输入短信验证码" autocomplete="off" style="width:6.2rem;"/>';
                sb += '                    <span class="icon codeMsgImg"></span>';
                sb += '                    <input id="btnSendCode" type="button" class="btn btn-default" disabled value="获取验证码" />';
                sb += '                  </div>';
                // sb += '                  <button class="btn" id="checkBtn" disabled>验证</button>';
                sb += '                </div>';
                // sb += '      </div>';
                var modal = $.modal({
                    title: '手机动态验证码',
                    text: '需要通过手机动态验证码才能控制设备。',
                    afterText: sb,
                    buttons: [{
                            text: '取消'
                        },
                        {
                            text: '验证',
                            bold: true,
                            onClick: function () {
                                var code = $("#code").val();
                                Substation.getDataByAjaxNoLoading("/checkSMSValid", {
                                    code: code,
                                    msgId: msgId
                                }, function (data) {
                                    console.log(data);
                                    if (data == true) {
                                        controlClick(val);
                                    } else {
                                        if (data.msg) {
                                            $.toast(data.msg);
                                        } else {
                                            $.toast("验证失败");
                                        }
                                    }
                                })
                            }
                        },
                    ]
                })
                showModel2(data.userPhone);
            } else {
                showSecPasswordPrompt(val);
            }

        }
    });
}

function showModel2(userPhone) {
    $("#phoneInput").val(userPhone);
    $.codeDraw($('#canvas'), $('#canvasInput'), function () {
        $.countInterval($("#phoneInput"), $("#btnSendCode"), function () {
            Substation.getDataByAjaxNoLoading("/sendSMSValid", {}, function (data) {
                msgId = data;
                // $("#checkBtn").removeAttr('disabled');
                // $("#checkBtn").unbind('click').on('click', function () {
                //   var code = $("#code").val();
                //   Substation.getDataByAjaxNoLoading("/checkSMSValid", {}, function (data) {
                //     // sendCommand();
                //   })
                // })
            });
        })
    })
}

function controlClick(val) {
    if (canClick == 1) {
        var arr = [];
        var controlUrl = "/sendBulbControlDemandHTTP";
        var controlparam = {};
        var datagatewayid = paramDetail.datagatewayid != 'undefined' ? paramDetail.datagatewayid : "";
        var fMetercode = paramDetail.fMetercode != 'undefined' ? paramDetail.fMetercode : "";
        var datafuncid = paramDetail.datafuncid != 'undefined' ? paramDetail.datafuncid : "";
        var datacomid = paramDetail.datacomid != 'undefined' ? paramDetail.datacomid : "";

        if (devicetype == "05003") {
            controlparam = {
                fSubid: subid,
                fGatewayid: datagatewayid,
                fMetercode: fMetercode,
                fFuncid: 'airconditioner',
                fComid: datacomid,
                fValue: val
            };
        } else {
            controlparam = {
                fSubid: subid,
                fGatewayid: datagatewayid,
                fMetercode: fMetercode,
                fFuncid: datafuncid,
                fComid: datacomid,
                fValue: val
            };
        }

        arr.push(controlparam);
        // var param = {
        //   tEtControlDemandList: JSON.stringify(arr)
        // };
        if (arr.length == 0) {
            $.toast(Operation["ui_selectNo"]);
            return;
        }
        var param = JSON.stringify(arr);
        setTimeout(function () {
            canClick = 1;
            $(".footer_btn").removeClass("noclick");
        }, 15000);
        canClick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax(controlUrl, param, function (data) {
            if (data.code == 200) {
                if (data.data.a != undefined) {
                    $.alert(data.data.a);
                }
                $(this)
                    .addClass("active")
                    .siblings()
                    .removeClass("active");
                //返回
            }
        });
        // var logList = arr.join(','); //数组转成为字符串
        // confirmAlarmEvents(logList);
    } else {
        $.alert(Operation["ui_operateAllTip"]);
    }
}

//二级密码
function showSecPasswordPrompt(val) {
    $.prompt(Operation["ui_needInputPwd"], Operation["ui_pleaseInputPwd"], function (value) {
        var pwdstr = $.md5(value);
        Substation.postDataByAjax(
            "/verifySePassword", {
                sePassword: pwdstr
            },
            function (data) {
                controlClick(val);
            }
        );
    });
}


//通用第一按钮
$("#open").click(function () {
    smsOrSecPassword("0");
});

//通用第二按钮
$("#close").click(function () {
    smsOrSecPassword("1");

});

//空调第一按钮 制冷开机
$("#reset").click(function () {
    smsOrSecPassword("0");
});

//空调第二按钮 制冷关机
$("#DO").click(function () {
    smsOrSecPassword("1");
});


//空调第三按钮 制热开机
$("#silent").click(function () {
    smsOrSecPassword("2");

});

//空调第四按钮 制热关机
$("#check").click(function () {
    smsOrSecPassword("3");
});

$("#record_btn").click(function () {
    if (devicetype != undefined && devicetype != "") {
        window.location.href = 'deviceControlLog.html?type=' + devicetype + '&meterId=' + paramDetail.fMetercode + '&funcid=' + paramDetail.datafuncid + '';
    } else {
        window.location.href = 'deviceControlLog.html?type=light&meterId=' + paramDetail.fMetercode + '&funcid=' + paramDetail.datafuncid + '';
    }
});



$.init();