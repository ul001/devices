var selectSubid = localStorage.getItem("fSubid");
var taskId = localStorage.getItem("missiontaskID");
var needUpdate = localStorage.getItem("need-update");
if(needUpdate){
    localStorage.removeItem("need-update");
    location.reload();
}
var fTaskcheckerid = Substation.GetQueryString("fTaskcheckerid");
var loginUserid = Substation.loginUserid;
Substation.getDataByAjax("/getListByTaskidAndfSubid",{fTaskid:taskId},function(data){
    var imgUrl = data.imgUrl;
    $(".card-content").empty();
    $(".card-footer").empty();
    $("#subName").text(data.subName);
    $(".title_color").text(data.subName);
    if(data.tDevDeviceproblemList.list.length>0){
        $(data.tDevDeviceproblemList.list).each(function(){
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
            $(".card-content").append("<div class=\"card-content-inner row no-gutter\" data-tree=\""+this.treePathName+"\" id=\""+this.fDeviceproblemid+"\">\n" +
                  "                        <div class=\"col-10\">\n" +
                  "                            <i class=\"icon icon-alarm\"></i>\n" +
                  "                        </div>\n" +
                  "                        <div class=\"col-85\">\n" +
                  "                            <p class=\"boldText\">设备路径："+this.treePathName+"</p>\n" +
                  "                            <p>描述："+this.fDeviceproblemdes+"</p>\n" +
                  "                            <p>危害："+this.fProblemharm+"</p>\n" +
                  "                            <p>具体位置："+this.fProblemlocation.split(",")[1]+"</p>\n" +
                  "                            <p>缺陷类别："+this.fProblemtype+"</p>\n" +
                  "                            <p>紧急程度："+this.fProblemlevel+"</p>\n" +
                  "                            <p>消缺期限："+this.fTimelimit+"</p>\n" +
                  "                            <p>处理状态：<span class=\"redColor\">"+stateStr+"</span></p>\n" +
                  "                            <p>发现时间："+this.fCreatetime+"</p>\n" +
                  "                        </div>\n" +
                  "                        <div class=\"col-5\">\n" +
                  "                            <i class=\"icon icon-right\"></i>\n" +
                  "                        </div>\n" +
                  "                    </div>");
        });
        $(".card-content-inner").click(function(){
            var proId = $(this).attr("id");
            var dataTree = $(this).attr("data-tree");
            localStorage.setItem("clickTree",dataTree);
            window.location.href="defectInfo.html?fDeviceproblemid="+proId;
        });
        if(data.imgName==null||data.imgName==""){
            $(".card-footer").html('<p style="width:100%;"><a href="#" id="goToWrite" class="button button-fill" style="height:1.6rem;line-height:1.6rem;">客户签名</a></p>');
            $("#goToWrite").click(function(){
                if(loginUserid==fTaskcheckerid){
                    window.location.href="draw.html";
                }else{
                    $.toast("您没有此权限");
                }
            });
        }else{
            $(".card-footer").html('<img src="'+(Substation.ipAddressFromAPP + imgUrl + "/" + data.imgName)+'" style="width:100%;">');
        }
    }else{
        $(".content").html("无匹配数据");
    }

});