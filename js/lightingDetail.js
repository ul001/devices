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
        sb += '                                    <div class="item-after subName">' + (param.fSubname ? param.fSubname : '') + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_startTime">仪表编号:</div>';
        sb += '                                    <div class="item-after startTime">' + (param.fMetercode ? param.fMetercode : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_alarmMeterId">' + Operation['ui_alarmDeviceId'] + '</div>';
        sb += '                                    <div class="item-after meterId">' + (param.fDevicecode ? param.fDevicecode : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_alarmMeterName">' + Operation['ui_alarmDeviceName'] + '</div>';
        sb += '                                    <div class="item-after meterName">' + (param.fDevicename ? param.fDevicename : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_alarmType">' + Operation['ui_alarmType'] + '</div>';
        sb += '                                    <div class="item-after alarmType">' + (param.fAlarmtype ? param.fAlarmtype : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_alarmType">' + Operation['ui_alarmDetail'] + ':' + '</div>';
        sb += '                                    <div class="item-after alarmType">' + (param.fAlarmdesc ? param.fAlarmdesc : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        //参数编号
        if (param.hasOwnProperty('fParamcode')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamId">' + Operation['ui_alarmParamId'] + '</div>';
            sb += '                                    <div class="item-after paramId">' + (param.fParamcode ? param.fParamcode : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //参数名称
        if (param.hasOwnProperty('fValue')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">' + Operation['ui_alarmParamName'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.fValue ? param.fValue : "") + '</div>';
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