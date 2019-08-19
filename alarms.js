var unreadCountSum = 0;
var bianweiCount = 5;
var yuexianCount = 37;
var platformCount = 2;

var string = '<span class="badge">' + bianweiCount + '</span>';
$("#bianwei").html(string);

var string = '<span class="badge">' + yuexianCount + '</span>';
$("#yuexian").html(string);

var string = '<span class="badge">' + platformCount + '</span>';
$("#platform").html(string);

unreadCountSum = bianweiCount + yuexianCount + platformCount;

//iOS回调未读数
var message = {
    'unreadCountSum': unreadCountSum
};
window.webkit.messageHandlers.jsToOcWithPrams.postMessage(message);

function fillData(parentId) {
    // var params = {
    //     fSubid: selectSubid,
    //     fParentId: parentId
    // }
    // var ul = $(".child-page .list-container");
    // if (parentId == 0) {
    //     ul = $(".parent-page .list-container");
    // }
    // ul.empty();
    // Substation.getDataByAjax("/appMenuSelectByPid", params, function (data) {
    //     if (data.hasOwnProperty("menuList")) {
    //         $(data.menuList).each(function () {
    //             var li = "";
    //             if (this.state == "true") {
    //                 li = "<li class=\"item-content item-link pId" + this.pId + "\" id=\"" + this.id + "\" value='" + this.fFunctionfield + "'>\n" +
    //                     "                        <div class=\"item-media\"><i class=\"icon icon-device\"></i></div>\n" +
    //                     "                        <div class=\"item-inner\">\n" +
    //                     "                            <div class=\"item-title\">" + this.name + "</div>\n" +
    //                     "                        </div>\n" +
    //                     "                    </li>";
    //             } else if (this.state == "false") {
    //                 li = "<li class=\"item-content item-dis pId" + this.PId + "\">\n" +
    //                     "                        <div class=\"item-media\"><i class=\"icon icon-nodevice\"></i></div>\n" +
    //                     "                        <div class=\"item-inner\">\n" +
    //                     "                            <div class=\"item-title\">" + this.name + "</div>\n" +
    //                     "                        </div>\n" +
    //                     "                    </li>";
    //             }
    //             ul.append(li);
    //         });
    //         if (showDisItem == 0) {
    //             $(".item-dis").css("display", "none");
    //         } else {
    //             $(".item-dis").css("display", "flex");
    //         }
    $(".item-link").unbind().click(function () {
        var fField = $(this).attr("value");
        var clickId = $(this).attr("id");
        // if (fField != "" && fField != null) {
        localStorage.setItem("fTempId", clickId);
        //localStorage.setItem("fFunctionfield",fField);
        localStorage.setItem("fPid", parentId);
        window.location.href = "alarmsDetail.html";
        // } else {
        //     clickNum++;
        //     var parentName = $(this).text();
        //     pids.push({
        //         pId: clickId,
        //         pName: parentName
        //     });
        //     $("#no-click").text(parentName);
        //     $(".parent-page").css("display", "none");
        //     $(".child-page").css("display", "block");
        //     fillData(clickId);
        // }
    });

    // }
    // });
}

fillData(0);

$.init();