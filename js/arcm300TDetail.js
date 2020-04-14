var meterCode = localStorage.getItem("meterCode");
var subObj = JSON.parse(localStorage.getItem("subObj"));

function initContent() {
    Substation.getDataByAjax("/selectOne", {
        meterCode: meterCode
    }, function (data) {
        // buildId: "1234"

        // gatewayId: "10100001001"

        // meterCode: "100101"

        // meterId: "100101"

        // meterName: "测试2"

        // stationId: "10100001"
        console.log(data);
        var param = data.meterInfo;
        if (param) {

            var sb = '                        <ul>';
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_Subname">' + Operation['ui_Subname'] + '</div>';
            sb += '                                    <div class="item-after subName">' + (subObj.subName ? subObj.subName : '') + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_startTime">' + Operation['ui_alarmDeviceId'] + '</div>';
            sb += '                                    <div class="item-after startTime">' + (param.meterCode ? param.meterCode : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
            sb += '                            <li class="item-content">';
            sb += '                                <div class="item-inner">';
            sb += '                                    <div class="item-title" data-i18n="ui_alarmMeterName">' + Operation['ui_alarmDeviceName'] + '</div>';
            sb += '                                    <div class="item-after meterName">' + (param.meterName ? param.meterName : "") + '</div>';
            sb += '                                </div>';
            sb += '                            </li>';
            //网关
            if (param.hasOwnProperty('gatewayId')) {
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataName">网关:</div>';
                sb += '                                    <div class="item-after dataName">' + (param.gatewayId ? param.gatewayId : "") + '</div>';
                sb += '                                </div>';
                sb += '                            </li>';
            }
            //串口号
            if (param.hasOwnProperty('buildId')) {
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataName">串口号:</div>';
                sb += '                                    <div class="item-after dataName">' + (param.buildId ? param.buildId : "") + '</div>';
                sb += '                                </div>';
                sb += '                            </li>';
            }
            //fResult
            if (param.hasOwnProperty('deviceValue')) {
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">当前状态:</div>';
                if (param.deviceValue == '0') {
                    sb += '                                    <div class="item-after dataId">分闸</div>';
                } else if (param.deviceValue == '1') {
                    sb += '                                    <div class="item-after dataId">合闸</div>';
                } else {
                    sb += '                                    <div class="item-after dataId">无设备</div>';
                }
                sb += '                                </div>';
                sb += '                            </li>';
            }
            $('.list-block').append(sb);
        }
    });
}

initContent();