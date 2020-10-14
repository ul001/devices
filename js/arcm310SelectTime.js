var meterCode = localStorage.getItem("meterCode");
var controlJson = localStorage.getItem("controlJsonArr");

var d = new Date();
var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
    "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
var timeString = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":00";

$("#dateTimeOpen1").val(datestring);
$("#dateTimeClose1").val(datestring);
$("#dateTimeOpen2").val(timeString);
$("#dateTimeClose2").val(timeString);


// $("#submitBtn")

function goBack() {
    //    if (isAndroid) {
    //        android.goBack();
    //    } else if (isIOS) {
    //        window.history.back();
    //        window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
    //    } else {
    window.history.back();
    //    }
}

$.init();