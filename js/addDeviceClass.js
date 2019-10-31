var pids = [{
    pId: -1
}];
var jumpPid = localStorage.getItem("pid");
var lastClickNum = localStorage.getItem("clickNum");
var tempId = localStorage.getItem("tempId");
var selectSubid = localStorage.getItem("fSubid");
var clickNum = 0;

//function addBackClick(){
//    $(".back-parent").unbind().click(function () {
//        var obj = pids[clickNum];
//        clickNum--;
//        var lastPId = pids[clickNum].pId;
//        pids.splice(jQuery.inArray(obj, pids), 1);
//        if (lastPId == -1) {
//            $(".child-page").css("display", "none");
//            $(".parent-page").css("display", "block");
//        }
//        fillData(lastPId);
//    });
//}

var u = navigator.userAgent,
  app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

function fillData(parentId) {
    var ul;
        ul = $(".parent-page .list-container");
        ul.empty();
//    if (parentId == -1) {
//    }else{
//        ul = $(".child-page .list-container");
//        ul.html("<li class=\"item-content back-parent\">\n" +
//                "                        <div class=\"item-inner\">\n" +
//                "                            <div class=\"item-title\"><i class=\"icon icon-goprev\"></i>上一级</div>\n" +
//                "                        </div>\n" +
//                "                    </li>");
//    }
    Substation.getDataByAjax("/selectPageTemplateByPid",{parentId:tempId},function(data){
        if(data.hasOwnProperty("menuList")){
            if(data.menuList.length>0){
                $(data.menuList).each(function () {
                    var li = "";
                    var linkStr = "<li class=\"item-content item-dis\"";
//                    var valueStr="";
    /*                if(this.hasOwnProperty("fFunctionfield")){
                        valueStr = this.fFunctionfield;
                    }*/
    //                <i class=\"icon icon-round\"></i>
                    li = linkStr + " id=\"" + this.fPagedesigntemplateid + "\">\n" +
                        "                        <div class=\"item-inner row no-gutter\">\n" +
                        "                            <div class=\"item-title\">" + this.fDesigntemplatename + "</div>\n" +
                        "                        </div>\n" +
                        "                    </li>";
                    ul.append(li);
                });
                $(".item-content").click(function(){
                    $(this).addClass("selectLi").siblings().removeClass("selectLi");
                });
//                addBackClick();
//                linkClick(parentId);
            }
        }
    });
//    Substation.getTemplateListByPid(parentId, function (tempList) {
//        if (tempList.length>0) {
//            $(tempList).each(function () {
//                var li = "";
//                var linkStr = "<li class=\"item-content item-dis\"";
//                var valueStr="";
//                if (this.state == "true"&&!this.hasOwnProperty("fFunctionfield")) {
//                    linkStr = "<li class=\"item-content item-link\"";
//                }
///*                if(this.hasOwnProperty("fFunctionfield")){
//                    valueStr = this.fFunctionfield;
//                }*/
////                <i class=\"icon icon-round\"></i>
//                li = linkStr + " id=\"" + this.fPagedesigntemplateid + "\">\n" +
//                    "                        <div class=\"item-inner row no-gutter\">\n" +
//                    "                            <div class=\"item-title\">" + this.fDesigntemplatename + "</div>\n" +
//                    "                        </div>\n" +
//                    "                    </li>";
//                ul.append(li);
//            });
//            $(".item-content").click(function(){
//                $(this).addClass("selectLi").siblings().removeClass("selectLi");
//            });
//            addBackClick();
//            linkClick(parentId);
//        }
//    });
}

//function linkClick(parentId) {
//    $(".item-link").unbind().click(function(event){
//        $(".selectLi").removeClass("selectLi");
//        var clickId = $(this).attr("id");
//        clickNum++;
//        pids.push({
//            pId: clickId
//        });
//        $(".parent-page").css("display", "none");
//        $(".child-page").css("display", "block");
//        fillData(clickId);
//    });
//    event.stopPropagation();
//};

function addDevice(){
    if($(".selectLi").length>0){
        var idVal = $(".selectLi").attr("id");
        Substation.postDataByAjax("/addSubDeviceGroup",{parentId:jumpPid,templateId:idVal,fSubid:selectSubid},function(data){
            if(isIOS){
                localStorage.setItem("need-refresh","true");
            }else{
                android.refresh();
            }
            goBackLastPid();
        });
    }
}

function goBackLastPid(){
//        window.location.href = "deviceClass.html?pid="+jumpPid+"&editState=1&clickNum="+lastClickNum+"&tempId="+tempId;
    localStorage.setItem("pid",jumpPid);
    localStorage.setItem("clickNum",lastClickNum);
    localStorage.setItem("editState",1);
    if(isIOS){
        window.history.back();
    }else{
        android.goBack();
    }
}

//Substation.getDataByAjax("/selectTemplateList",{},function(data){
//    var thisList = data.subdevicegroupList;
//    var haveList = [];
//    $(thisList).each(function(){
//        if(this.hasOwnProperty("fFunctionfield")){
//            haveList.push(this);
//        }
//    });
//    Substation.addState(haveList,thisList,'fPagedesigntemplateid','fParentid');
//    localStorage.setItem("templateTree",JSON.stringify(thisList));
//});
fillData(-1);

$.init();