// var alarmType = 1;
// if (alarmType == 1) {
//     $("#yaoxin").siblings(".list-block").remove();
//     $(".item-after").html("123");
// }
// var urlinfo = window.location.href, //获取url 
//     value = urlinfo.split("?")[1].split("=")[1]; //
// var param = JSON.parse(value);

var param = JSON.parse(localStorage.getItem("lightingDetail"));
localStorage.removeItem("lightingDetail");
creatView(param);

function creatView(param) {
    var html = '';
    if (param) {
        // fMetercode: 仪表编号
        // fFuncid: 控制编码， 参数码
        // fGatewayid: 网关id
        // fComid:
        //     fFuncname: 备用字段
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
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">网关:</div>';
            sb += '                                    <div class="item-after paramName">' + (param.datagatewayid != 'undefined' ? param.datagatewayid : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //串口号
        if (param.hasOwnProperty('datacomid')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">串口号:</div>';
            sb += '                                    <div class="item-after paramName">' + (param.datacomid != 'undefined' ? param.datacomid : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //datafDevicetype
        if (param.hasOwnProperty('datafDevicetype')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">设备类型:</div>';
            sb += '                                    <div class="item-after paramName">' + (param.datafDevicetype != 'undefined' ? param.datafDevicetype : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //控制编码
        if (param.hasOwnProperty('datafuncid')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">控制编码:</div>';
            sb += '                                    <div class="item-after paramName">' + (param.datafuncid != 'undefined' ? param.datafuncid : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //fResult
        if (param.hasOwnProperty('deviceValue')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamId">当前状态:</div>';
            if (param.deviceValue == '0') {
                sb += '                                    <div class="item-after paramId">分闸</div>';
            } else if (param.deviceValue == '1') {
                sb += '                                    <div class="item-after paramId">合闸</div>';
            } else {
                sb += '                                    <div class="item-after paramId">无设备</div>';
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

$("#record_btn").click(function () {
    window.location.href = 'deviceControlLog.html?type=light&meterId=' + param.fMetercode + '&funcid=' + param.datafuncid + '';
});

$.init();