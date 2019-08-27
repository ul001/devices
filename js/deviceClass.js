var showDisItem = 1;
var editState = 0;
var pids = [{
    pId: 0,
    pName: ""
}];
var clickNum = 0;
var thisPid = 0;
var editID = -1;
var selectSubid = localStorage.getItem("fSubid");
var selectSubname = localStorage.getItem("fSubname");
$("#titleContent").text(selectSubname);

$(".back-parent").click(function () {
    var obj = pids[clickNum];
    clickNum--;
    var lastPId = pids[clickNum].pId;
    pids.splice(jQuery.inArray(obj, pids), 1);
    if (lastPId == 0) {
        $(".child-page").css("display", "none");
        $(".parent-page").css("display", "block");
    }
    $("#no-click").text(pids[clickNum].pName);
    fillData(lastPId);
});

function fillData(parentId) {
    var params = {
        fSubid: selectSubid,
        fParentId: parentId
    }
    var ul = $(".child-page .list-container");
    if (parentId == 0) {
        ul = $(".parent-page .list-container");
    }
    ul.empty();
    Substation.getDataByAjax("/appMenuSelectByPid", params, function (data) {
        if (data.hasOwnProperty("menuList")) {
            $(data.menuList).each(function () {
                var li = "";
                var linkStr = "";
                var linkIcon = "";
                if (this.state == "true") {
                    linkStr = "<li class=\"item-content item-link pId";
                    linkIcon = "<div class=\"item-media\"><i class=\"icon icon-device\"></i></div>\n";
                } else if (this.state == "false") {
                    linkStr = "<li class=\"item-content item-dis pId";
                    linkIcon = "<div class=\"item-media\"><i class=\"icon icon-nodevice\"></i></div>\n";
                }
                li = linkStr + this.pId + "\" id=\"" + this.id + "\" value='" + this.fFunctionfield + "'>\n" +
                    linkIcon +
                    "                        <div class=\"item-inner row no-gutter\">\n" +
                    "                            <div class=\"item-title\">" + this.name + "</div>\n" +
                    "                                <div class=\"col-58\"><button class='button bg-primary' type=\"button\" onclick=\"renameLi("+this.id+")\">重命名</button>\n" +
                    "                                <button class='button bg-primary' type=\"button\" onclick=\"cloneLi("+this.id+")\">复制</button>\n" +
                    "                                <button class='button bg-primary' type=\"button\" onclick=\"deleteLi("+this.id+")\">删除</button></div>\n"+
                    "                        </div>\n" +
                    "                    </li>";
                ul.append(li);
            });
            if (showDisItem == 0) {
                $(".item-dis").css("display", "none");
            } else {
                $(".item-dis").css("display", "flex");
            }
            linkClick(parentId);
            $("#show-class").unbind().click(function () {
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
        if(editState==1){
            $(".item-content").unbind().click(function(){
                $(this).addClass("item-edit").siblings().removeClass("item-edit");
            });
        }
        if(editID!=-1){
            $("#"+editID).addClass("item-edit").siblings().removeClass("item-edit");
            $("#"+editID).find(".item-title").addClass("col-40");
            $(".item-content").unbind().click(function(){
                $(".item-edit").removeClass("item-edit");
                $(".col-40").removeClass("col-40");
                $(this).addClass("item-edit").siblings().removeClass("item-edit");
                $(this).find(".item-title").addClass("col-40");
                editID = $(this).attr("id");
            });
        }
    });
}

function linkClick(parentId) {
    thisPid = parentId;
    $(".item-link").click(function(event){
        var fField = $(this).attr("value");
        var clickId = $(this).attr("id");
        if (fField != "" && fField != null) {
            localStorage.setItem("fTempId", clickId);
            //localStorage.setItem("fFunctionfield",fField);
            localStorage.setItem("fPid", parentId);
            window.location.href = "AutoloadDetail.html";
        } else {
            clickNum++;
            var parentName = $(this).find(".item-title").text();
            pids.push({
                pId: clickId,
                pName: parentName
            });
            $("#no-click").text(parentName);
            $(".parent-page").css("display", "none");
            $(".child-page").css("display", "block");
            fillData(clickId);
        }
        event.stopPropagation();
    });
}

function editContent(){
    if(editState==0){
        editState = 1;
        $("#editBtn").text("退出");
        $("#add-class").css("display","inline-block");
        $(".item-content").unbind().click(function(){
            $(".item-edit").removeClass("item-edit");
            $(".col-40").removeClass("col-40");
            $(this).addClass("item-edit").siblings().removeClass("item-edit");
            $(this).find(".item-title").addClass("col-40");
            editID = $(this).attr("id");
        });
    }else if(editState == 1){
        editState = 0;
        editID = -1;
        $("#editBtn").text("编辑");
        $(".col-40").removeClass("col-40");
        $("#add-class").css("display","none");
        $(".item-content").removeClass("item-edit");
        $(".item-content").unbind();
        linkClick();
    }
}

function renameLi(dataId){
    $.prompt('重命名', function (value) {
          Substation.postDataByAjax("/subDeviceTreeUpdate",{fMenuname:value,fMenuid:dataId},function(data){
            if(data.code==200){
                $.toast("重命名成功");
                $("#"+dataId).find(".item-title").text(value);
            }else{
                $.toast("操作失败");
            }
          });
    });
    $(".modal-text-input").val($("#"+dataId).find(".item-title").text());
    $(".modal-text-input").select();
}

function cloneLi(dataId){
    Substation.postDataByAjax("/subDeviceTreeCopy",{copyId:dataId},function(data){
        if(data.code==200){
            fillData(thisPid);
        }else{
            $.toast("操作失败");
        }
    });
}

function deleteLi(dataId){
    $.confirm('确定要删除吗?', function () {
        Substation.getDataByAjax("/subDeviceTreeDelete",{deleteMenuId:dataId},function(){
            $("#"+dataId).remove();
        });
    });
}

function changeUp(){
    var index = $(".item-edit");
    var idVal = $(".item-edit").attr("id");
    if(index.index() != 0){
        Substation.getDataByAjax("/moveAppMenu",{id:idVal,flag:"up"},function(){
            index.prev().before(index);
        });
    }
}

function changeDown(){
    var index = $(".item-edit");
    var idVal = $(".item-edit").attr("id");
    var list = $(".item-edit").siblings();
    if(index.index()!=list.length){
        Substation.getDataByAjax("/moveAppMenu",{id:idVal,flag:"down"},function(){
            index.next().after(index);
        });
    }
}

function addDeviceClass(){
    window.location.href = "addDeviceClass.html";
}

fillData(thisPid);

$.init();