var pids = [{
    pId: -1
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
        if (lastPId == -1) {
            $(".child-page").css("display", "none");
            $(".parent-page").css("display", "block");
        }
        fillData(lastPId);
    });
}

function fillData(parentId) {
    var ul;
    if (parentId == -1) {
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
    Substation.getTemplateListByPid(parentId, function (tempList) {
        if (tempList.length>0) {
            $(tempList).each(function () {
                var li = "";
                var linkStr = "<li class=\"item-content item-dis pId";
                var valueStr="";
                if (this.state == "true"&&!this.hasOwnProperty("fFunctionfield")) {
                    linkStr = "<li class=\"item-content item-link\"";
                }
/*                if(this.hasOwnProperty("fFunctionfield")){
                    valueStr = this.fFunctionfield;
                }*/
                li = linkStr + " id=\"" + this.fPagedesigntemplateid + "\" value=\""+valueStr+"\">\n" +
                    "                        <div class=\"item-inner row no-gutter\">\n" +
                    "                            <div class=\"item-title\"><i class=\"icon icon-round\"></i>" + this.fDesigntemplatename + "</div>\n" +
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
        Substation.postDataByAjax("/addSubDeviceGroup",{parentId:jumpPid,templateId:idVal,fSubid:selectSubid},function(data){
            goBackLastPid();
        });
    }
}

function goBackLastPid(){
        window.location.href = "deviceClass.html?pid="+jumpPid+"&editState=1&clickNum="+lastClickNum;
}

Substation.getDataByAjax("/selectTemplateList",{},function(data){
    var thisList = data.subdevicegroupList;
    var haveList = [];
    $(thisList).each(function(){
        if(this.hasOwnProperty("fFunctionfield")){
            haveList.push(this);
        }
    });
    Substation.addState(haveList,thisList,'fPagedesigntemplateid','fParentid');
    localStorage.setItem("templateTree",JSON.stringify(thisList));
    fillData(-1);
});

$.init();