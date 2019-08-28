var pids = [{
    pId: 0
}];
var jumpPid = Substation.GetQueryString("pid");
var lastClickNum = Substation.GetQueryString("clickNum");
var selectSubid = localStorage.getItem("fSubid");
var clickNum = 0;

function addBackClick(){
    $(".back-parent").unbind().click(function () {
        var obj = pids[clickNum];
        clickNum--;
        var lastPId = pids[clickNum].pId;
        pids.splice(jQuery.inArray(obj, pids), 1);
        if (lastPId == 0) {
            $(".child-page").css("display", "none");
            $(".parent-page").css("display", "block");
        }
        fillData(lastPId);
    });
}

function fillData(parentId) {
    var params = {
        fSubid: selectSubid,
        fParentId: parentId
    }
    var ul;
    if (parentId == 0) {
        ul = $(".parent-page .list-container");
        ul.empty();
    }else{
        ul = $(".child-page .list-container");
        ul.html("<li class=\"item-content back-parent\">\n" +
                "                        <div class=\"item-inner\">\n" +
                "                            <div class=\"item-title\"><i class=\"icon icon-goprev\"></i>上一级</div>\n" +
                "                        </div>\n" +
                "                    </li>");
    }
    Substation.getDataByAjax("/appMenuSelectByPid", params, function (data) {
        if (data.hasOwnProperty("menuList")) {
            $(data.menuList).each(function () {
                var li = "";
                var linkStr = "";
                if (this.state == "true"&&this.fFunctionfield=="") {
                    linkStr = "<li class=\"item-content item-link pId";
                } else if (this.state == "false") {
                    linkStr = "<li class=\"item-content item-dis pId";
                }else if(this.state=="true"&&this.fFunctionfield!=""){
                    linkStr = "<li class=\"item-content item-dis pId";
                }
                li = linkStr + this.pId + "\" id=\"" + this.id + "\">\n" +
                    "                        <div class=\"item-inner row no-gutter\">\n" +
                    "                            <div class=\"item-title\"><i class=\"icon icon-round\"></i>" + this.name + "</div>\n" +
                    "                        </div>\n" +
                    "                    </li>";
                ul.append(li);
            });
            $(".item-content").click(function(){
                $(this).addClass("selectLi").siblings().removeClass("selectLi");
            });
            addBackClick();
            linkClick(parentId);
        }
    });
}

function linkClick(parentId) {
    thisPid = parentId;
    $(".item-link").unbind().click(function(event){
        $(".selectLi").removeClass("selectLi");
        var clickId = $(this).attr("id");
        clickNum++;
        pids.push({
            pId: clickId
        });
        $(".parent-page").css("display", "none");
        $(".child-page").css("display", "block");
        fillData(clickId);
    });
    event.stopPropagation();
};

function addDevice(){
    if($(".selectLi").length>0){
        var idVal = $(".selectLi").attr("id");
        Substation.postDataByAjax("/subDeviceTreeAdd",{pid:jumpPid,modelId:idVal,fSubid:selectSubid},function(data){
            window.location.href = "deviceClass.html?pid="+jumpPid+"&editState=1&clickNum="+lastClickNum;
        });
    }
}

fillData(0);

$.init();