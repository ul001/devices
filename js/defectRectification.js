var selectSubid = localStorage.getItem("fSubid");
var taskId = localStorage.getItem("taskID");
var goTemp = localStorage.getItem("goBackToList");
localStorage.removeItem("goBackToList");
var needUpdate = localStorage.getItem("need-update");
if (needUpdate == "true") {
    localStorage.removeItem("need-update");
    location.reload();
}
var scrollYM = localStorage.getItem("scrollY");
localStorage.setItem("need-refresh", "true");

/*window.addEventListener('pageshow', function (e) {
    //ios系统 返回页面 不刷新的问题 Safari内核缓存机制导致 方案一 方案二：设置meta标签，清除页面缓存
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (e.persisted && isIOS) {
        // var needUpdate = localStorage.getItem("need-update");
        // if (needUpdate) {
        //     localStorage.removeItem("need-update");
        window.location.reload();
        // }
    }
});*/

var param;
var urlinfo = window.location.href; //获取url 
var urlArray = urlinfo.split("?");
if (urlArray.length > 1) {
    var fstate = decodeURI(urlArray[1].split("=")[1]);
    param = {
        fTaskid: taskId,
        fState: fstate
    };
} else {
    param = {
        fTaskid: taskId
    };
};

$(".back_btn").click(function () {
    if (goTemp == "1") {
        window.history.back();
    } else {
        //        window.location.href = "missionDetail.html";
        localStorage.setItem("need-refresh", "true");
        window.history.back();
    }
});

var loginUserid = Substation.loginUserid;
Substation.getDataByAjax("/getListByTaskidAndfSubid", param, function (data) {
    var imgUrl = data.imgUrl;
    $(".card-content").empty();
    $(".card-footer").empty();
    $("#subName").text(data.subName);
    //    $(".title_color").text(data.subName);
    if (data.tDevDeviceproblemList.hasOwnProperty("list")) {
        if (data.tDevDeviceproblemList.list.length > 0) {
            $(data.tDevDeviceproblemList.list).each(function () {
                var problemStr = "-";
                if (this.fProblemlocation != undefined) {
                    if (this.fProblemlocation.indexOf(",") != -1) {
                        problemStr = this.fProblemlocation.split(",")[1]
                    }
                }
                var stateStr = "-";
                switch (this.fState) {
                    case "0":
                        stateStr = "<span class=\"redColor\">"+Operation['ui_defectState0']+"</span>";
                        break;
                    case "2":
                        stateStr = "<span class=\"redColor\">"+Operation['ui_defectState2']+"</span>";
                        break;
                    case "3":
                        stateStr = "<span class=\"redColor\">"+Operation['ui_defectState3']+"</span>";
                        break;
                    case "4":
                        stateStr = "<span class=\"redColor\">"+Operation['ui_defectState4']+"</span>";
                        break;
                    case "5":
                        stateStr = "<span class=\"redColor\">"+Operation['ui_defectState5']+"</span>";
                        break;
                    case "1":
                        stateStr = "<span class=\"button-success\">"+Operation['ui_defectState1']+"</span>";
                        break;
                    default:
                        stateStr = "<span class=\"redColor\">"+Operation['ui_defectState0']+"</span>";
                        break;
                }
                var solveUser = "";
                if (this.fSolvedUserName != undefined) {
                    solveUser = "<p>"+Operation['ui_solvePerson'] + this.fSolvedUserName + "</p>";
                }
                var solveTime = "";
                if (this.fUpdateDate != undefined) {
                    solveTime = "<p>"+Operation['ui_solvedTime'] + this.fUpdateDate + "</p>";
                }
                $(".card-content").append("<div class=\"card-content-inner row no-gutter\" id=\"" + this.fDeviceproblemid + "\">\n" +
                    "                        <div class=\"col-10\">\n" +
                    "                            <i class=\"icon icon-alarm\"></i>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"col-85\">\n" +
                    "                            <p class=\"boldText\">" + Operation['ui_Devname'] + (this.fdeviceinfoName == undefined ? "-" : this.fdeviceinfoName) + "</p>\n" +
//                    "                            <p>" + Operation['ui_classPath'] + (this.fDeviceNamePath == undefined ? "-" : this.fDeviceNamePath) + "</p>\n" +
                    "                            <p>" + Operation['ui_Description'] + (this.fDeviceproblemdes == undefined ? "-" : this.fDeviceproblemdes) + "</p>\n" +
                    "                            <p>" + Operation['ui_detriment'] + (this.fProblemharm == undefined ? " - " : this.fProblemharm) + " </p>\n" +
                    "                            <p>" + Operation['ui_Specificlocation'] + problemStr + "</p>\n" +
                    "                            <p>" + Operation['ui_categorie'] + (this.fProblemtype == undefined ? "-" : this.fProblemtype) + "</p>\n" +
                    "                            <p>" + Operation['ui_Urgency'] + (this.fProblemlevel == undefined ? "-" : this.fProblemlevel) + "</p>\n" +
                    "                            <p>" + Operation['ui_EliminationPeriod'] + (this.fTimelimit == undefined ? "-" : this.fTimelimit) + "</p>\n" +
                    "                            <p>" + Operation['ui_DealStateForDefect'] + stateStr + "</p>\n" +
                    "                            <p>" + Operation['ui_FindTimeForDefect'] + (this.fCreatetime == undefined ? "-" : this.fCreatetime) + "</p>\n" +
                    solveUser + solveTime +
                    "                        </div>\n" +
                    "                        <div class=\"col-5\">\n" +
                    "                            <i class=\"icon icon-right\"></i>\n" +
                    "                        </div>\n" +
                    "                    </div>");
            });
            //声明一个控制点击的变量
            var upLoadClicktag = true;
            $(".card-content-inner").click(function () {
                if(!upLoadClicktag){
                    return;
                }
                upLoadClicktag = false;
                setTimeout(function() {
                    upLoadClicktag = true;
                }, 1000);
                var proId = $(this).attr("id");
//                var dataTree = $(this).attr("data-tree");
                //                var target_roll_height = $(this).offset().top-$(".content").offset().top+$(".content").scrollTop();
                var target_roll_height = $(".content").scrollTop();
                //记录滚动位置
                localStorage.setItem("scrollY", target_roll_height);
//                localStorage.setItem("clickTree", dataTree);
                window.location.href = "defectInfo.html?fDeviceproblemid=" + proId + "&taskProblem=1";
            });
            var missionTypeId = localStorage.getItem("missionTypeid");
            if (goTemp == "1") {
                $(".card-footer").remove();
            } else {
                if (data.imgName == null || data.imgName == "") {
                    //消缺任务 无签名
                    $(".card-footer").html('<p style="width:100%;"><a href="#" id="goToWrite" class="button button-fill" style="height:1.6rem;line-height:1.6rem;">'+Operation['ui_customerSign']+'</a></p>');
                    $("#goToWrite").click(function () {
                        window.location.href = "draw.html";
                    });
                } else {
                    $(".card-footer").html('<img src="' + (Substation.ipAddressFromAPP + imgUrl + "/" + data.imgName) + '" style="width:100%;">');
                }
                if (missionTypeId != "3") {
                    $(".card-footer").remove();
                    localStorage.setItem("canClick", "false");
                }
            }
        } else {
            $(".content").html('');
            $.toast(Operation['ui_nodata']);
        }
    } else {
        $(".content").html('');
        $.toast(Operation['ui_nodata']);
    }
    $(".content").scrollTop(Number(scrollYM));
    localStorage.removeItem("scrollY");
});