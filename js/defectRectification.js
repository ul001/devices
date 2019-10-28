var selectSubid = localStorage.getItem("fSubid");
var taskId = localStorage.getItem("taskID");
var goTemp = localStorage.getItem("goBackToList");
localStorage.removeItem("goBackToList");

window.addEventListener('pageshow', function (e) {
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
})



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
                var problemStr = "";
                if (this.fProblemlocation.indexOf(",") != -1) {
                    problemStr = this.fProblemlocation.split(",")[1]
                }
                var stateStr = "";
                switch (this.fState) {
                    case "0":
                        stateStr = "<span class=\"redColor\">未处理</span>";
                        break;
                    case "2":
                        stateStr = "<span class=\"redColor\">待处理</span>";
                        break;
                    case "3":
                        stateStr = "<span class=\"redColor\">待客户停电处理</span>";
                        break;
                    case "4":
                        stateStr = "<span class=\"redColor\">待线路停电处理</span>";
                        break;
                    case "5":
                        stateStr = "<span class=\"redColor\">其他</span>";
                        break;
                    case "1":
                        stateStr = "<span class=\"button-success\">已处理</span>";
                        break;
                    default:
                        stateStr = "<span class=\"redColor\">未处理</span>";
                        break;
                }
                var solveUser = "";
                if (this.fSolvedUserName != undefined) {
                    solveUser = "<p>消缺人员：" + this.fSolvedUserName + "</p>";
                }
                var solveTime = "";
                if (this.fUpdateDate != undefined) {
                    solveTime = "<p>消缺时间：" + this.fUpdateDate + "</p>";
                }
                $(".card-content").append("<div class=\"card-content-inner row no-gutter\" data-tree=\"" + (this.treePathName==undefined?"":this.treePathName) + "\" id=\"" + this.fDeviceproblemid + "\">\n" +
                    "                        <div class=\"col-10\">\n" +
                    "                            <i class=\"icon icon-alarm\"></i>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"col-85\">\n" +
                    "                            <p class=\"boldText\">设备名称：" + (this.treePathName==undefined?"":this.treePathName) + "</p>\n" +
                    "                            <p>描述：" + this.fDeviceproblemdes + "</p>\n" +
                    "                            <p>危害：" + this.fProblemharm + "</p>\n" +
                    "                            <p>具体位置：" + problemStr + "</p>\n" +
                    "                            <p>缺陷类别：" + this.fProblemtype + "</p>\n" +
                    "                            <p>紧急程度：" + this.fProblemlevel + "</p>\n" +
                    "                            <p>消缺期限：" + this.fTimelimit + "</p>\n" +
                    "                            <p>处理状态：" + stateStr + "</p>\n" +
                    "                            <p>发现时间：" + this.fCreatetime + "</p>\n" +
                    solveUser + solveTime +
                    "                        </div>\n" +
                    "                        <div class=\"col-5\">\n" +
                    "                            <i class=\"icon icon-right\"></i>\n" +
                    "                        </div>\n" +
                    "                    </div>");
            });
            $(".card-content-inner").click(function () {
                var proId = $(this).attr("id");
                var dataTree = $(this).attr("data-tree");
                localStorage.setItem("clickTree", dataTree);
                window.location.href = "defectInfo.html?fDeviceproblemid=" + proId + "&taskProblem=1";
            });
            var missionTypeId = localStorage.getItem("missionTypeid");
            if (goTemp == "1") {
                $(".card-footer").remove();
            } else {
                if ((data.imgName == null || data.imgName == "") && missionTypeId == 3) {
                    //消缺任务 无签名
                    $(".card-footer").html('<p style="width:100%;"><a href="#" id="goToWrite" class="button button-fill" style="height:1.6rem;line-height:1.6rem;">客户签名</a></p>');
                    $("#goToWrite").click(function () {
                        window.location.href = "draw.html";
                    });
                    if (localStorage.getItem("canClick") == "false") {
                        $(".card-footer").remove();
                    }
                } else if (missionTypeId == 1) {
                    //巡视任务 点击红色数字
                    $(".card-footer").remove();
                } else {
                    $(".card-footer").html('<img src="' + (Substation.ipAddressFromAPP + imgUrl + "/" + data.imgName) + '" style="width:100%;">');
                }
            }
        } else {
            $(".content").html("无匹配数据");
        }
    } else {
        $(".content").html("无匹配数据");
    }
});