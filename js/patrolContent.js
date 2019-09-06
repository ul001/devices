var pids = [{pid:-1,pname:""}];
var clickNum = 0;
var selectSubid = 10100001;
var showState = 1;
//var selectSubid = localStorage.getItem("fSubid");

function addBackClick(){
    $(".back-parent").unbind().click(function () {
        if(pids[clickNum+1]!=null){
            pids.splice(-1, 1);
        }
        clickNum--;
        var lastPId = pids[clickNum];
        pids.splice(-1, 1);
        fillData(lastPId.pid);
    });
}

function fillData(parentId){
    var params = {
        fSubid: selectSubid,
        fParentId: parentId
    }
    Substation.getDataByAjax("/selectSubDeviceGroupListByPid", params, function (data) {
        if(data.hasOwnProperty("menuList")){
            if(data.menuList.length>0){
                fillH5(parentId,data.menuList);
            }
        }
    });
}

function fillH5(parentId,thisList) {
    var ul;
    if (parentId == -1) {
        ul = $(".list-block .list-container");
        ul.empty();
    }else{
        ul = $(".list-block .list-container");
        ul.html("<li class=\"item-content back-parent\">\n" +
                "                        <div class=\"item-inner\">\n" +
                "                            <div class=\"item-title\"><i class=\"icon icon-goprev\"></i>上一级</div>\n" +
                "                        </div>\n" +
                "                    </li>");
    }
    $(thisList).each(function () {
        var li = "";
        var linkStr = "<li class=\"item-content item-link";
        if (this.displayOrHideState == false) {
                linkStr = "<li class=\"item-content item-link item-dis";
        }
        li = linkStr + "\" id=\"" + this.fSubdevicegroupid + "\">\n" +
            "                        <div class=\"item-inner\">\n" +
            "                            <div class=\"item-title\">" + this.fSubdevicegroupname + "</div>\n" +
            "                        </div>\n" +
            "                    </li>";
        ul.append(li);
    });
    if (showState == 0) {
        $(".item-dis").css("display", "none");
    } else {
        $(".item-dis").css("display", "flex");
    }
    $("#showOrHide").unbind().click(function () {
        if (showState == 0) {
            showState = 1;
            $("#showOrHide").text("仅显示有设备分类");
            $(".item-dis").css("display", "flex");
        } else {
            showState = 0;
            $("#showOrHide").text("显示全部分类");
            $(".item-dis").css("display", "none");
        }
    });
    linkClick(parentId);
    addBackClick();
}

function linkClick(parentId) {
    $(".list-block .item-link").unbind().click(function(event){
        var clickId = $(this).attr("id");
        var params = {
            fSubid: selectSubid,
            fParentId: clickId
        }
        Substation.getDataByAjax("/selectSubDeviceGroupListByPid", params, function (data) {
            if(data.hasOwnProperty("menuList")){
                if(data.menuList.length>0){
                   $(".selectLi").removeClass("selectLi");
                   var clickName = $("#"+clickId+" .item-title").text();
                   if(clickNum==0){
                       if(pids[clickNum+1]!=null){
                           pids.splice(-1, 1);
                       }
                   }
                   clickNum++;
                   pids.push({pid:clickId,pname:clickName});
                   $(".parent-page").css("display", "none");
                   $(".child-page").css("display", "block");
                   fillH5(clickId,data.menuList);
                   return;
                }
            }
            $("#"+clickId).addClass("selectLi").siblings().removeClass("selectLi");
            var thisId = clickId;
            var clickName = $("#"+thisId+" .item-title").text();
            if(pids[clickNum+1]==null){
             pids.push({pid:thisId,pname:clickName});
            }else{
             pids[clickNum+1] = {pid:thisId,pname:clickName};
            }
            var titleTree="";
            $(pids).each(function(){
             titleTree+=this.pname+">";
            });
            var titleTreeName=titleTree.substring(1,titleTree.length-1);
            $("#subName").text(titleTreeName);
            $(".close-panel").click();
        });
        event.stopPropagation();
    });
};

function addRadioClick(){
    $(":radio").click(function(){
        if($(this).val()==1){
            window.location.href="defectPage.html";
        }
    });
}

addRadioClick();

fillData(-1);

$(".open-panel").click();

$.init();