// var alarmType = 1;
// if (alarmType == 1) {
//     $("#yaoxin").siblings(".list-block").remove();
//     $(".item-after").html("123");
// }
// var urlinfo = window.location.href, //获取url 
//     value = urlinfo.split("?")[1].split("=")[1]; //
// var param = JSON.parse(value);
var alarmeventlogid = Substation.GetQueryString("alarmeventlogid");
var jumpId = Substation.GetQueryString("jumpId");
var isPush = "0";
if(jumpId!=undefined && jumpId!=null && jumpId!=""){
    alarmeventlogid = jumpId;
    isPush = "1";
}

var param = JSON.parse(localStorage.getItem("DetailParam"));
localStorage.removeItem("DetailParam");
// creatView(param);
loadMenu();

function loadMenu() {
    $(".list-container").empty();
    if (!alarmeventlogid) {
        $.toast("数据异常，未获取到报警对应ID");
        return;
    }
    $.showPreloader(Operation['ui_loading']);
    Substation.getDataByAjaxNoLoading("/getAlarmEventLogById", {
        fAlarmeventlogid: alarmeventlogid
    }, function (data) {
        if (data.hasOwnProperty("alarmEventLogById") && data.alarmEventLogById) {
            creatView(data.alarmEventLogById);
        }
    },function(errorcode){});
}

$(".pull-left.click_btn").click(function () {
    if(isPush == "1"){
        //推送详情点击返回事件
        if (isAndroid) {
            android.goBack();
        } else if(isIOS){
//            window.history.back();
        }
    }else{
        window.history.back();
    }
});

function creatView(param) {
    var html = '';
    if (param) {
        // fAlarmeventlogid: 事件id(必有)
        // fSubid: 变电所id（ 必有）
        // fMessinfocode: 消息类型（ 用于分类， 报警页面应该不用显示）（ 维护了对应的messinfocode才会有）
        // fMessinfotypeid: 消息种类（ 用于分类， 报警页面应该不用显示）（ 维护了code对应的type才会有）
        // fDevicecode: 设备编号（ 必有）
        // fParamcode: 参数编码(仪表报警有， 网关没有，)（ 不一定）
        // fValue: 参数对应值(仪表报警有， 网关没有)（ 不一定）
        // fLimitvalue: 越限值(仪表报警下的越限报警有， 普通仪表报警没有， 如开关门报警没有， A相相电压越限就有)（ 不一定）
        // fAlarmType报警情况（ 必有）
        // fAlarmDesc: 报警详情（ 必有）
        // fAlarmTime: 报警时间（ 必有）
        // fConfirmstatus: 确认状态
        // fConfirmuserid: 确认人id
        // fConfirmtime: 确认时间
        var sb = '                        <ul>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_Subname">' + Operation['ui_Subname'] + '</div>';
        sb += '                                    <div class="item-after subName">' + (param.fSubname ? param.fSubname : '') + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_happenTime">' + Operation['ui_happenTime'] + '</div>';
        sb += '                                    <div class="item-after startTime">' + (param.fAlarmtime ? param.fAlarmtime : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_alarmMeterId">' + Operation['ui_alarmDeviceId'] + '</div>';
        sb += '                                    <div class="item-after meterId">' + (param.fDevicecode != undefined ? param.fDevicecode : "") + '</div>';
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
        sb += '                                    <div class="item-after alarmType">' + (param.fAlarmtype != undefined ? param.fAlarmtype : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        sb += '                            <li class="item-content">';
        sb += '                                <div class="item-inner">';
        sb += '                                    <div class="item-title" data-i18n="ui_alarmType">' + Operation['ui_alarmDetail'] + ':' + '</div>';
        sb += '                                    <div class="item-after alarmType">' + (param.fAlarmdesc != undefined ? param.fAlarmdesc : "") + '</div>';
        sb += '                                </div>';
        sb += '                            </li>';
        //参数编号
        if (param.hasOwnProperty('fParamcode')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamId">' + Operation['ui_alarmParamId'] + '</div>';
            sb += '                                    <div class="item-after paramId">' + (param.fParamcode != undefined ? param.fParamcode : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //参数名称
        if (param.hasOwnProperty('fParamname')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamName">' + Operation['ui_alarmParamName'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.fParamname ? param.fParamname : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //参数说明
        if (param.hasOwnProperty('valueType')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamValueType">' + Operation['ui_alarmParamValueType'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.valueType != undefined ? param.valueType : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //参数值
        if (param.hasOwnProperty('fValue')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmParamValue">' + Operation['ui_alarmParamValue'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.fValue != undefined ? param.fValue : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
        }
        //越限值 设定值
        if (param.hasOwnProperty('fLimitvalue')) {
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_Overshootvalue">' + Operation['ui_Overshootvalue'] + '</div>';
            sb += '                                    <div class="item-after paramName">' + (param.fLimitvalue != undefined ? param.fLimitvalue : "") + '</div>';
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
        $.hidePreloader();
    } else {
        $.hidePreloader();
    }
}