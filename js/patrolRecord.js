var selectSubid = localStorage.getItem("fSubid");
var selectSubname = localStorage.getItem("fSubname");
var subAddress = localStorage.getItem("subAddress");
var needUpdate = localStorage.getItem("need-update");
if(needUpdate){
    location.reload();
    localStorage.removeItem("need-update");
}
$("#subName").text(selectSubname);

Substation.getDataByAjax("/getLatestThreePlaceCheckForm",{fSubid:selectSubid},function(data){
    var inspectionTotal = data.inspectionTotal;
    var threeList = data.ThreeList;
    $(".subName").text(selectSubname);
    $("#address").text(subAddress);
    if(inspectionTotal!=null){
        $("#daily").text("("+(inspectionTotal.weekSum+inspectionTotal.yearSum)+")项");
        $("#monthly").text("("+inspectionTotal.monSum+")项");
        $("#total").text("("+(inspectionTotal.weekSum+inspectionTotal.monSum+inspectionTotal.yearSum)+")项");
    }
    $(".list-container").empty();
    if(threeList.length>0){
        var html='';
        $(threeList).each(function(){
            var iconStr = "";
            switch(this.fPeriodType){
                case "周巡":
                    iconStr="<i class=\"icon icon-week\"></i>\n";
                    break;
                case "月巡":
                    iconStr="<i class=\"icon icon-month\"></i>\n";
                    break;
                case "年巡":
                    iconStr="<i class=\"icon icon-year\"></i>\n";
                    break;
                default:
                    iconStr="<i class=\"icon icon-day\"></i>\n";
                    break;
            }
            html+="<div class=\"item-footer row no-gutter\" data-id=\""+this.fPlacecheckformid+"\">\n" +
"                                <div class=\"col-10\">"+iconStr+"</div>\n" +
"                                <div class=\"col-85\"><span class=\"blueColor\">"+this.fTaskName+"</span>("+this.fStateExplain+")<br>\n" +
//"                                    巡检人："+this.fCreatebyuserid+"<br>\n" +
"                                    本次已发现缺陷：<span class=\"redColor\">"+this.fproblemTotal+" </span>个，未处理：<span class=\"redColor\">"+this.funsolvedTotal+" </span>个\n" +
"                                </div>\n" +
"                                <div class=\"col-5\">\n" +
"                                    <i class=\"icon icon-right\"></i>\n" +
"                                </div>\n" +
"                            </div>";
        });
        $(".list-container").append(html);
        $(".list-container .item-footer").unbind().click(function(){
            var fPlacecheckformid = $(this).attr("data-id");
            localStorage.setItem("fPlacecheckformid",fPlacecheckformid);
            localStorage.setItem("canClick",false);
            window.location.href="patrolContent.html";
        });
    }
});

$("#allPatrol").click(function(){
    window.location.href="allPatrolRecord.html";
});

$.init();