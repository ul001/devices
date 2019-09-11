var selectSubid = localStorage.getItem("fSubid");
var selectSubname = localStorage.getItem("fSubname");
$("#subName").text(selectSubname);

var selectedSubstaion = 10100001;

function fillData(){
    $("#listContainer").empty();
    Substation.getDataByAjax("/getPlaceCheckFormList",{fSubid:selectedSubstaion},function(data){
        if(data.length>0){
            $(data).each(function(){
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
                }
                $("#listContainer").append("<div class=\"card\" id=\""+this.fPlacecheckformid+"\">\n" +
                                           "                    <div class=\"card-content\">\n" +
                                           "                        <div class=\"card-content-inner row no-gutter\">\n" +
                                           "                            <div class=\"col-10\">\n" +
                                            iconStr +
                                           "                            </div>\n" +
                                           "                            <div class=\"col-85\">\n" +
                                           "                                <p class=\"subName\">"+this.fTaskName+"<span class=\"blueColor\">("+this.fStateExplain+")</span></p>\n" +
                                           "                                <p>巡检人：<span class=\"blueColor\">"+this.fCreatebyuserid+"</span></p>\n" +
                                           "                                <p>最新一次巡检时间：<span class=\"blueColor\">"+this.fCreatetime+"</span></p>\n" +
                                           "                                <p>本次已发现缺陷：<span class=\"redColor\">"+this.fproblemTotal+" </span>个  未处理：<span class=\"redColor\">"+this.funsolvedTotal+" </span>个</p>\n" +
                                           "                            </div>\n" +
                                           "                            <div class=\"col-5\">\n" +
                                           "                                <i class=\"icon icon-right\"></i>\n" +
                                           "                            </div>\n" +
                                           "                        </div>\n" +
                                           "                    </div>\n" +
                                           "                </div>");
            });
        }
    });
}

fillData();

$.init();