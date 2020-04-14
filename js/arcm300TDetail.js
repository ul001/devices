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
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataName">网关:</div>';
                sb += '                                    <div class="item-after dataName">' + (param.gatewayId ? param.gatewayId : "") + '</div>';
                sb += '                                </div>';
                sb += '                            </li>';
            }
            //串口号
            if (param.hasOwnProperty('updateTime')) {
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataName">更新时间:</div>';
                sb += '                                    <div class="item-after dataName">' + (param.updateTime ? param.updateTime : "") + '</div>';
                sb += '                                </div>';
                sb += '                            </li>';
            }
            //fResult
            if (param.hasOwnProperty('meterStatus')) {
                sb += '                            <li class="item-content">';
                sb += '                                <div class="item-inner">';
                sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">设备状态:</div>';
                if (param.meterStatus == '0') {
                    sb += '                                    <div class="item-after dataId">正常</div>';
                } else if (param.meterStatus == '1') {
                    sb += '                                    <div class="item-after dataId" style="color:red">报警</div>';
                } else {
                    sb += '                                    <div class="item-after dataId"></div>';
                }
                sb += '                                </div>';
                sb += '                            </li>';
            }
            //fResult
            if (param.hasOwnProperty('meterDetail')) {
                if (param.meterStatus == '1') {
                    var detailParam = JSON.parse(param.meterDetail);
                    // var detailParam = JSON.parse("{\"temp\":{\"tempA\":\"A相温度报警\",\"tempB\":\"B相温度报警\",\"tempC\":\"C相温度报警\",\"tempN\":\"N相温度报警\"},\"overvoltage\":{\"ua\":\"A相过压报警\",\"ub\":\"B相过压报警\",\"uc\":\"C相过压报警\"},\"iLeakage\":\"漏电报警\",\"overCurrent\":{\"Ia\":\"A相过流报警\",　\"Ib\":\"B相过流报警\",\"Ic\":\"C相过流报警\"},\"switch\":\"开\",\"undervoltage\":{\"ua\":\"A相欠压报警\",\"ub\":\"B相欠压报警\",\"uc\":\"C相欠压报警\"}}");
                    if (detailParam.hasOwnProperty('temp')) {
                        var arr = [];
                        if (detailParam.temp.hasOwnProperty('tempA')) {
                            arr.push(detailParam.temp.tempA);
                        }
                        if (detailParam.temp.hasOwnProperty('tempB')) {
                            arr.push(detailParam.temp.tempB);
                        }
                        if (detailParam.temp.hasOwnProperty('tempC')) {
                            arr.push(detailParam.temp.tempC);
                        }
                        if (detailParam.temp.hasOwnProperty('tempN')) {
                            arr.push(detailParam.temp.tempN);
                        }
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">温度:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + arr.join('/') + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">温度:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //过压
                    if (detailParam.hasOwnProperty('overvoltage')) {
                        var arr = [];
                        if (detailParam.temp.hasOwnProperty('ua')) {
                            arr.push(detailParam.overvoltage.ua);
                        }
                        if (detailParam.temp.hasOwnProperty('ub')) {
                            arr.push(detailParam.overvoltage.ub);
                        }
                        if (detailParam.temp.hasOwnProperty('uc')) {
                            arr.push(detailParam.overvoltage.uc);
                        }
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">过压:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + arr.join('/') + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">过压:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //漏电
                    if (detailParam.hasOwnProperty('iLeakage')) {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">漏电:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + detailParam.iLeakage + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">漏电:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //过流
                    if (detailParam.hasOwnProperty('overCurrent')) {
                        var arr = [];
                        if (detailParam.temp.hasOwnProperty('Ia')) {
                            arr.push(detailParam.overCurrent.Ia);
                        }
                        if (detailParam.temp.hasOwnProperty('Ib')) {
                            arr.push(detailParam.overCurrent.Ib);
                        }
                        if (detailParam.temp.hasOwnProperty('Ic')) {
                            arr.push(detailParam.overCurrent.Ic);
                        }
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">过流:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + arr.join('/') + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">过流:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //欠压
                    if (detailParam.hasOwnProperty('undervoltage')) {
                        var arr = [];
                        if (detailParam.temp.hasOwnProperty('ua')) {
                            arr.push(detailParam.undervoltage.ua);
                        }
                        if (detailParam.temp.hasOwnProperty('ub')) {
                            arr.push(detailParam.undervoltage.ub);
                        }
                        if (detailParam.temp.hasOwnProperty('uc')) {
                            arr.push(detailParam.undervoltage.uc);
                        }
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">欠压:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + arr.join('/') + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">欠压:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                    //开关量
                    if (detailParam.hasOwnProperty('switch')) {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">开关量:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="veryDanger">' + detailParam.iLeakage + '</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    } else {
                        sb += '                            <li class="item-content">';
                        sb += '                                <div class="item-inner">';
                        sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">开关量:</div>';
                        sb += '                                    <div class="item-after dataId"><span class="normal">合闸</span></div>';
                        sb += '                                </div>';
                        sb += '                            </li>';
                    }
                } else {
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">温度:</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">过压:</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">漏电:</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">过流:</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">欠压:</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">正常</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                    sb += '                            <li class="item-content">';
                    sb += '                                <div class="item-inner">';
                    sb += '                                    <div class="item-title" data-i18n="ui_alarmdataId">开关量:</div>';
                    sb += '                                    <div class="item-after dataId"><span class="normal">合闸</span></div>';
                    sb += '                                </div>';
                    sb += '                            </li>';
                }
            }
            $('.list-block').append(sb);
        }
    });
}

initContent();