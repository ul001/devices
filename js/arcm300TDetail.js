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
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataName">' + Operation['ui_gateway'] + '</div>';
                sb += '                                    <div class="item-after dataName">' + (param.gatewayId ? param.gatewayId : "") + '</div>';
                sb += '                                </div>';
                sb += '                            </li>';
            }
            //串口号
            if (param.hasOwnProperty('updateTime')) {
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataName">' + Operation['ui_updateTime'] + '</div>';
                sb += '                                    <div class="item-after dataName">' + (param.updateTime ? param.updateTime : "") + '</div>';
                sb += '                                </div>';
                sb += '                            </li>';
            }
            //fResult
            // if (param.hasOwnProperty('meterStatus')) {
            //     sb += '                            <li class="item-content">';
            //     sb += '                                <div class="item-inner">';
            //     sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">设备状态:</div>';
            //     if (param.meterStatus == '0') {
            //         sb += '                                    <div class="item-after dataId">' + Operation['ui_normal'] + '</div>';
            //     } else if (param.meterStatus == '1') {
            //         sb += '                                    <div class="item-after dataId" style="color:red">报警</div>';
            //     } else {
            //         sb += '                                    <div class="item-after dataId"></div>';
            //     }
            //     sb += '                                </div>';
            //     sb += '                            </li>';
            // }
            //fResult
            if (param.hasOwnProperty('meterDetail')) {
                if (param.meterStatus == '1') {
                    var detailParam = JSON.parse(param.meterDetail);
                    // var detailParam = JSON.parse("{\"temp\":{\"tempA\":\"A相温度报警\",\"tempB\":\"B相温度报警\",\"tempC\":\"C相温度报警\",\"tempN\":\"N相温度报警\"},\"overvoltage\":{\"ua\":\"A相过压报警\",\"ub\":\"B相过压报警\",\"uc\":\"C相过压警\"},\"electricLeakage\":\"漏电报警\",\"undervoltage\":{\"ua\":\"A相欠压报警\",\"ub\":\"B相欠压报警\",\"uc\":\"C相欠压报警\"}}");
                    // var detailParam = JSON.parse("{\"temp\":{\"tempA\":\"A相温度报警\",\"tempB\":\"B相温度报警\",\"tempC\":\"C相温度报警\",\"tempN\":\"N相温度报警\"},\"overvoltage\":{\"ua\":\"A相过压报警\",\"ub\":\"B相过压报警\",\"uc\":\"C相过压报警\"},\"iLeakage\":\"漏电报警\",\"overCurrent\":{\"Ia\":\"A相过流报警\",　\"Ib\":\"B相过流报警\",\"Ic\":\"C相过流报警\"},\"switch\":\"开\",\"undervoltage\":{\"ua\":\"A相欠压报警\",\"ub\":\"B相欠压报警\",\"uc\":\"C相欠压报警\"}}");
                    if (detailParam.hasOwnProperty('temp')) {
                        var arr = [];
                        var temp = detailParam.temp;
                        if (temp.hasOwnProperty('tempA')) {
                            arr.push(temp.tempA);
                        }
                        if (temp.hasOwnProperty('tempB')) {
                            arr.push(temp.tempB);
                        }
                        if (temp.hasOwnProperty('tempC')) {
                            arr.push(temp.tempC);
                        }
                        if (temp.hasOwnProperty('tempN')) {
                            arr.push(temp.tempN);
                        }
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_temperature'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + arr.join('/') + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_temperature'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //过压
                    if (detailParam.hasOwnProperty('overvoltage')) {
                        var arr = [];
                        var overvoltage = detailParam.overvoltage;
                        if (overvoltage.hasOwnProperty('ua')) {
                            arr.push(overvoltage.ua);
                        }
                        if (overvoltage.hasOwnProperty('ub')) {
                            arr.push(overvoltage.ub);
                        }
                        if (overvoltage.hasOwnProperty('uc')) {
                            arr.push(overvoltage.uc);
                        }
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Overvoltage'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + arr.join('/') + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Overvoltage'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //漏电
                    if (detailParam.hasOwnProperty('iLeakage')) {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Electleakage'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + detailParam.iLeakage + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Electleakage'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //过流
                    if (detailParam.hasOwnProperty('overCurrent')) {
                        var arr = [];
                        var overCurrent = detailParam.overCurrent;
                        if (overCurrent.hasOwnProperty('Ia')) {
                            arr.push(overCurrent.Ia);
                        }
                        if (overCurrent.hasOwnProperty('Ib')) {
                            arr.push(overCurrent.Ib);
                        }
                        if (overCurrent.hasOwnProperty('Ic')) {
                            arr.push(overCurrent.Ic);
                        }
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Overcurrent'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + arr.join('/') + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Overcurrent'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //欠压
                    if (detailParam.hasOwnProperty('undervoltage')) {
                        var arr = [];
                        var undervoltage = detailParam.undervoltage;
                        if (undervoltage.hasOwnProperty('ua')) {
                            arr.push(undervoltage.ua);
                        }
                        if (undervoltage.hasOwnProperty('ub')) {
                            arr.push(undervoltage.ub);
                        }
                        if (undervoltage.hasOwnProperty('uc')) {
                            arr.push(undervoltage.uc);
                        }
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Undervoltage'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + arr.join('/') + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Undervoltage'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //开关量
                    if (detailParam.hasOwnProperty('switch')) {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Switching'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + detailParam.switch+'</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Switching'] + '</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">合闸</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                } else {
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_temperature'] + '</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Overvoltage'] + '</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Electleakage'] + '</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Overcurrent'] + '</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Undervoltage'] + '</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Switching'] + '</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">合闸</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                }
            } else {
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_temperature'] + '</div>';
                sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                sb += '                                </div>';
                sb += '                            </li>';
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Overvoltage'] + '</div>';
                sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                sb += '                                </div>';
                sb += '                            </li>';
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Electleakage'] + '</div>';
                sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                sb += '                                </div>';
                sb += '                            </li>';
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Overcurrent'] + '</div>';
                sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                sb += '                                </div>';
                sb += '                            </li>';
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Undervoltage'] + '</div>';
                sb += '                                    <div class="item-after dataId"><span class="normal">' + Operation['ui_normal'] + '</span></div>';
                sb += '                                </div>';
                sb += '                            </li>';
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">' + Operation['ui_Switching'] + '</div>';
                sb += '                                    <div class="item-after dataId"><span class="normal">合闸</span></div>';
                sb += '                                </div>';
                sb += '                            </li>';
            }
            $('.list-block').append(sb);
        }
    });
}

$("#record_btn").click(function () {
    window.location.href = "deviceControlLog.html?type=arcm300T&meterId=" + meterCode;
});

initContent();

$.init();