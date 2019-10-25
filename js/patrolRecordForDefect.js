var selectSubid = localStorage.getItem("fSubid");
var selectSubname = localStorage.getItem("fSubname");
var subAddress = localStorage.getItem("subAddress");
$("#subName").text(selectSubname);

Substation.getDataByAjax("/getLatestThreeDeviceProblem",{fSubid:selectSubid},function(data){
    var InspectionNum = data.InspectionNum;
    var threeList = data.LatestThree;
    $(".subName").text(selectSubname);
    $("#address").text(subAddress);
    if(InspectionNum!=undefined){
        $("#total").text("("+(InspectionNum)+")项");
    }
    $(".list-container").empty();
    if(threeList.length>0){
        var html='';
        $(threeList).each(function(){
            var problemStr = "";
            if(this.fProblemlocation.indexOf(",")!=-1){
                problemStr=this.fProblemlocation.split(",")[1]
            }
            var stateStr = "";
            switch(this.fState){
                case "0":
                stateStr="未处理";
                break;
                case "2":
                stateStr="待处理";
                break;
                case "3":
                stateStr="待客户停电处理";
                break;
                case "4":
                stateStr="待线路停电处理";
                break;
                case "5":
                stateStr="其他";
                break;
                case "1":
                stateStr="已处理";
                break;
            }
            html+="<div class=\"item-footer row no-gutter\" data-id=\""+this.fDeviceproblemid+"\" value=\""+(this.treePathName==undefined?"":this.treePathName)+"\">\n" +
"                            <div class=\"col-10\"><i class=\"icon icon-alarm\"></i></div>\n" +
"                            <div class=\"col-85\"><span class=\"redColor\">(设备名称:"+(this.treePathName==undefined?"":this.treePathName)+")"+this.fDeviceproblemdes+"</span><br>\n" +
"                                位置："+problemStr+" 状态："+stateStr+"<br>发现时间："+this.fCreatetime+"\n" +
"                            </div>\n" +
"                            <div class=\"col-5\">\n" +
"                                <i class=\"icon icon-right\"></i>\n" +
"                            </div>\n" +
"                        </div>";
        });
        $(".list-container").append(html);
        $(".list-container .item-footer").unbind().click(function(){
            var problemId = $(this).attr("data-id");
            var clickTree = $(this).attr("value");
            localStorage.setItem("clickTree",clickTree);
            localStorage.setItem("canClick",false);
            window.location.href="defectInfo.html?fDeviceproblemid="+problemId;
        });
    }
});

$("#allPatrol").click(function(){
    window.location.href="allDefectPage.html";
});
$.init();