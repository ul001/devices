$(".showlist").empty();
//var isEnglish = 0;
//if (languageOption == "en") {
//isEnglish = 1;
//} else {
//isEnglish = 0;
//}
var isOpenBoxInApp = localStorage.getItem("isOpenBoxInApp");
try{
    if(isAndroid){
        isOpenBoxInApp = android.getSPItem("showMsgInApp");
    }
}catch(e){
    isOpenBoxInApp = "true";
};
$("#isShowInApp").prop("checked",true);
if (isOpenBoxInApp == 'false') {
    $("#isShowInApp").removeAttr("checked");
}

Substation.getDataByAjax(
    "/getMessInfoType", {
        //"english": isEnglish
    },
    function (data) {
        if (
            data.hasOwnProperty("tDtMessInfoType") &&
            data.tDtMessInfoType.length > 0
        ) {
            var strVar = "";
            $(data.tDtMessInfoType).each(function () {
                strVar +=
                    '<li onclick="goToNext(' +
                    this.fMessinfotypeid +
                    ",'" +
                    this.fMessinfotypeexplain +
                    "')\">" +
                    '<div class="item-content item-link">' +
                    '<div class="item-inner">' +
                    '<div class="item-title label">' +
                    this.fMessinfotypeexplain +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</li>";
            });
            $(".showlist").append(strVar);
        }
    }
);

function changeShowInApp() {
    var params = {};
    var checkValue = $("#isShowInApp").prop("checked");
    if (checkValue) {
        params["showBoxInApp"] = "1";
    } else {
        params["showBoxInApp"] = "0";
    }
    //传原生配置
    if (isAndroid) {
        if (checkValue) {
            android.setSPItem("showMsgInApp","true");
        } else {
            android.setSPItem("showMsgInApp","false");
        }
    } else {
        window.webkit.messageHandlers.showBoxInApp.postMessage(params);
    }
}

function goToNext(typeid, typename) {
    localStorage.setItem("titleName", typename);
    localStorage.setItem("typeId", typeid);
    window.location.href = "notifyClassView.html";
}

function goBack() {
    if (isAndroid) {
        android.goBack();
    } else {
        window.history.back();
        window.webkit.messageHandlers.goBackiOS.postMessage("");
    }
}

function manageSelect() {
    if (!$("#bar-footer").length || $("#bar-footer").is(":hidden")) {}
}