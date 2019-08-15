var showDisItem = 1;
var pids = [{pId:0,pName:""}];
var clickNum = 0;
var selectSubid = localStorage.getItem("fSubid");

$(".back-parent").click(function() {
    var obj = pids[clickNum];
    clickNum--;
    var lastPId = pids[clickNum].pId;
    pids.splice(jQuery.inArray(obj,pids),1);
    if(lastPId==0){
        $(".child-page").css("display", "none");
        $(".parent-page").css("display", "block");
    }
    $("#no-click").text(pids[clickNum].pName);
    fillData(lastPId);
});

function fillData(parentId) {
    var params = {
        fSubid: selectSubid,
        fParentId:parentId
    }
    var ul = $(".child-page .list-container");
    if(parentId==0){
        ul = $(".parent-page .list-container");
    }
    ul.empty();
    Substation.getDataByAjax("/appMenuSelectByPid", params, function(data) {
        if (data.hasOwnProperty("menuList")) {
            $(data.menuList).each(function(){
                var li = "";
                if (this.state=="true") {
                    li = "<li class=\"item-content item-link pId" + this.pId + "\" id=\"" + this.id + "\" value='" + this.fFunctionfield + "'>\n" +
                        "                        <div class=\"item-media\"><i class=\"icon icon-device\"></i></div>\n" +
                        "                        <div class=\"item-inner\">\n" +
                        "                            <div class=\"item-title\">" + this.name + "</div>\n" +
                        "                        </div>\n" +
                        "                    </li>";
                } else if (this.state=="false") {
                    li = "<li class=\"item-content item-dis pId" + this.PId + "\">\n" +
                        "                        <div class=\"item-media\"><i class=\"icon icon-f7\"></i></div>\n" +
                        "                        <div class=\"item-inner\">\n" +
                        "                            <div class=\"item-title\">" + this.name + "</div>\n" +
                        "                        </div>\n" +
                        "                    </li>";
                }
                ul.append(li);
            });
            if(showDisItem==0){
                $(".item-dis").css("display", "none");
            }else{
                $(".item-dis").css("display", "flex");
            }
            $(".item-link").unbind().click(function(){
                var fField = $(this).attr("value");
                var clickId = $(this).attr("id");
                if(fField!="" && fField!=null){
                    localStorage.setItem("fTempId",clickId);
                    localStorage.setItem("fFunctionfield",fField);
                    window.location.href="AutoloadDetail.html";
                }else{
                    clickNum++;
                    var parentName = $(this).text();
                    pids.push({pId:clickId,pName:parentName});
                    $("#no-click").text(parentName);
                    $(".parent-page").css("display","none");
                    $(".child-page").css("display", "block");
                    fillData(clickId);
                }
            });
            $("#show-class").unbind().click(function() {
                if (showDisItem == 0) {
                    showDisItem = 1;
                    $("#show-class").text("隐藏无设备分类");
                    $(".item-dis").css("display", "flex");
                } else {
                    showDisItem = 0;
                    $("#show-class").text("显示无设备分类");
                    $(".item-dis").css("display", "none");
                }
            });
        }
    });
}

fillData(0);

$.init();