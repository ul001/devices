var pids = [-1];
var clickNum = 0;
var selectSubid = 10100001;
//var selectSubid = localStorage.getItem("fSubid");

function addBackClick(){
    $(".back-parent").unbind().click(function () {
        clickNum--;
        var lastPId = pids[clickNum];
        pids.splice(-1, 1);
        fillData(lastPId);
    });
}

function fillData(parentId) {
    var params = {
        fSubid: selectSubid,
        fParentId: parentId
    }
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
    Substation.getDataByAjax("/selectSubDeviceGroupListByPid", params, function (data) {
        if (data.hasOwnProperty("menuList")) {
            $(data.menuList).each(function () {
                var li = "";
                var linkStr = "<li class=\"item-content item-dis";
                if (this.displayOrHideState == true&&!this.hasOwnProperty("fPagedesigntemplateid")) {
                    linkStr = "<li class=\"item-content item-link";
                }
                li = linkStr + "\" id=\"" + this.fSubdevicegroupid + "\">\n" +
                    "                        <div class=\"item-inner\">\n" +
                    "                            <div class=\"item-title\">" + this.fSubdevicegroupname + "</div>\n" +
                    "                        </div>\n" +
                    "                    </li>";
                ul.append(li);
            });
            $(".list-block .item-content").click(function(){
                $(this).addClass("selectLi").siblings().removeClass("selectLi");
                var thisId = $(this).attr("id");
                $(".close-panel").click();
            });
            addBackClick();
            linkClick(parentId);
        }
    });
}

function linkClick(parentId) {
    $(".list-block .item-link").unbind().click(function(event){
        $(".selectLi").removeClass("selectLi");
        var clickId = $(this).attr("id");
        clickNum++;
        pids.push(clickId);
        $(".parent-page").css("display", "none");
        $(".child-page").css("display", "block");
        fillData(clickId);
    });
    event.stopPropagation();
};

fillData(-1);

$.init();