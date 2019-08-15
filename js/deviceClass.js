var showDisItem = 1;

$(".back-parent").click(function() {
    $(".child-page").css("display", "none");
    $(".parent-page").css("display", "block");
    $("#show-class").unbind().click(function() {
        if (showDisItem == 0) {
            showDisItem = 1;
            $("#show-class").text("隐藏无设备分类");
            $(".parent-page .item-dis").css("display", "flex");
        } else {
            showDisItem = 0;
            $("#show-class").text("显示无设备分类");
            $(".parent-page .item-dis").css("display", "none");
        }
    });
});

$("#show-class").unbind().click(function() {
    if (showDisItem == 0) {
        showDisItem = 1;
        $("#show-class").text("隐藏无设备分类");
        $(".parent-page .item-dis").css("display", "flex");
    } else {
        showDisItem = 0;
        $("#show-class").text("显示无设备分类");
        $(".parent-page .item-dis").css("display", "none");
    }
});

var baseUrlFromAPP = "http://116.236.149.162:8090/SubstationWEBV2/v1";
var tokenFromAPP = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjYwNzE4OTIsInVzZXJuYW1lIjoiYWRtaW4ifQ.FnbqIDX9ojAcpRzwLaHvY-wYc-FWoH6VG7LabSSETnw";

function getDataByAjax(url, params, successCallback) {
    $.ajax({
        type: "GET",
        url: baseUrlFromAPP + url,
        data: params,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", tokenFromAPP);
        },
        success: function(data) {
            if (data == undefined) {
                console.log("信息错误");
                return;
            } else {
                if (data.code == "200") {
                    successCallback(data.data);
                }
            }
        },
        error: function() {
            alert("操作失败请重试！")
        }
    });
}

function fillData() {
    var params = {
        fSubid: 10100001
    }
    getDataByAjax("/appMenuSelectHideOrShow", params, function(data) {
        if (data.hasOwnProperty("treeList")) {
            $(".parent-page .list-container").empty();
            $(".child-page .list-container").empty();
            getTreeData(data.treeList, $(".parent-page .list-container"), 0);
            $(".item-link").click(function(){
                var classId = $(this).attr("id");
                var parentName = $(this).text();
                $("#no-click").text(parentName);
                $(".child-page .item-content").css("display","none");
                $(".child-page .clickId"+classId).css("display","flex");
                $(".parent-page").css("display", "none");
                $(".child-page").css("display", "block");
                $("#show-class").unbind().click(function() {
                    if (showDisItem == 0) {
                        showDisItem = 1;
                        $("#show-class").text("隐藏无设备分类");
                        $(".child-page .item-dis.clickId"+classId).css("display", "flex");
                    } else {
                        showDisItem = 0;
                        $("#show-class").text("显示无设备分类");
                        $(".child-page .item-dis").css("display", "none");
                    }
                });
            });
        }
    });
}

function getTreeData(treeData, ul, clickId) {
    $(treeData).each(function() {
        var li = "";
        if (this.state=="true") {
            li = "<li class=\"item-content item-link clickId" + clickId + "\" id=\"" + this.id + "\" value=\"" + this.fFunctionfield + "\">\n" +
                "                        <div class=\"item-media\"><i class=\"icon icon-device\"></i></div>\n" +
                "                        <div class=\"item-inner\">\n" +
                "                            <div class=\"item-title\">" + this.name + "</div>\n" +
                "                        </div>\n" +
                "                    </li>";
        } else if (this.state=="false") {
            li = "<li class=\"item-content item-dis clickId" + clickId + "\">\n" +
                "                        <div class=\"item-media\"><i class=\"icon icon-f7\"></i></div>\n" +
                "                        <div class=\"item-inner\">\n" +
                "                            <div class=\"item-title\">" + this.name + "</div>\n" +
                "                        </div>\n" +
                "                    </li>";
        }
        ul.append(li);
        if (this.nodes && this.nodes.length) {
            getTreeData(this.nodes, $(".child-page .list-container"), this.id);
        }
    });
}

fillData();

$.init();