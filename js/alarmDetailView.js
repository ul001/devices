var alarmType = 1;
if (alarmType == 1) {
    $("#yaoxin").siblings(".list-block").remove();
    $(".item-after").html("123");
}
// var urlinfo = window.location.href, //获取url 
//     value = urlinfo.split("?")[1].split("=")[1]; //
// var param = JSON.parse(value);

var param = JSON.parse(localStorage.getItem("DetailParam"));
localStorage.removeItem("DetailParam");
creatView(param);

function creatView(param) {
    var html = '';
    if (param) {
        if (param['fMessinfotypeid']) {

        } else {

        }
        // fAlarmeventlogid: 3
        // fAlarmtime: "2020-03-27 06:43:23"
        // fConfirmstatus: true
        // fConfirmtime: "2020-04-01 10:18:55"
        // fConfirmuserid: 312
        // fConfirmusername: "潘弘"
        // fDevicecode: "40400006000"
        // fDevicename: "1"
        // fMessInfoExplain: "网关离线"
        // fMessInfoTypeExplain: "通讯状态"
        // fMessinfocode: "gatewayOffline"
        // fMessinfotypeid: 2
        // fSubid: 40400006
        // fSubname: "测试变电所"

    } else {

    }
}