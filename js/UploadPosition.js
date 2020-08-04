$(".showlist").empty();
//var isEnglish = 0;
//if (languageOption == "en") {
//isEnglish = 1;
//} else {
//isEnglish = 0;
//}
var isOpenBoxInApp = localStorage.getItem("alwaysUploadPosition");
try {
    if (isAndroid) {
        isOpenBoxInApp = android.getSPItem("alwaysUploadPosition");
    }
} catch (e) {
    isOpenBoxInApp = "false";
}
$("#isAlwaysUploadPosition").removeAttr("checked");
if (isOpenBoxInApp == "true") {
    $("#isAlwaysUploadPosition").prop("checked", true);
}

// Substation.getDataByAjax(
//     "/getMessInfoType", {
//         //"english": isEnglish
//     },
//     function (data) {
//         if (
//             data.hasOwnProperty("tDtMessInfoType") &&
//             data.tDtMessInfoType.length > 0
//         ) {
//             var strVar = "";
//             $(data.tDtMessInfoType).each(function () {
//                 strVar +=
//                     '<li onclick="goToNext(' +
//                     this.fMessinfotypeid +
//                     ",'" +
//                     this.fMessinfotypeexplain +
//                     "')\">" +
//                     '<div class="item-content item-link">' +
//                     '<div class="item-inner">' +
//                     '<div class="item-title label">' +
//                     this.fMessinfotypeexplain +
//                     "</div>" +
//                     "</div>" +
//                     "</div>" +
//                     "</li>";
//             });
//             $(".showlist").append(strVar);
//         }
//     }
// );

function changeShowInApp() {
    var params = {};
    var checkValue = $("#isAlwaysUploadPosition").prop("checked");
    if (checkValue) {
        params["alwaysUploadPosition"] = "1";
    } else {
        params["alwaysUploadPosition"] = "0";
    }
    //传原生配置
    if (isAndroid) {
        if (checkValue) {
            android.setSPItem("alwaysUploadPosition", "true");
        } else {
            android.setSPItem("alwaysUploadPosition", "false");
        }
    } else {
        window.webkit.messageHandlers.alwaysUploadPosition.postMessage(params);
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