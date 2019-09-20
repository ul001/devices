jQuery(document).ready(function () {
    // $(function () {
    var titlename = localStorage.getItem("fSubname");
    $("#titleContent").text(titlename);

    var showmissionBtn = localStorage.getItem("showType");
    // var missionType = localStorage.getItem("missionType");

    if (showmissionBtn == "missionDoing") {
        var showStr =
            '<div class="row buttonsEvent"> <div class = "col-33" id = "checkInCss"> <a href = "# " class = "button button-big button-fill bottom-btn" id = "checkIn">现场签到</a> </div> <div class = "col-33" id = "carryOutCss"> <a href = "# " class = "button button-big button-fill bottom-btn" id = "carryOut">执行任务</a> </div> <div class = "col-33" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> </div>';
        $("#addVarContain126").append(showStr);
        $("#carryOut").attr("name", "true");
    } else if (showmissionBtn == "missionFinish") {
        var showstr =
            '<div class="row buttonsEvent"> <div class = "col-100" id = "checkInCss" > <a href = "# "class = "button button-big button-fill bottom-btn" id = "carryOut" >查看任务</a> </div> </div>';
        $("#addVarContain126").append(showstr);
        $("#carryOut").attr("name", "false");
    }

    //任务id
    var taskID = localStorage.getItem("taskID");
    //巡检单id
    var placeCheckFormId;
    //巡检的变电所id
    var missionsubid;
    //任务类型 fTasktypeid
    var missionTypeid;

    var missionDetail = "";

    function getNetData() {
        Substation.getDataByAjax(
            "/selectTaskByTaskId",
            "taskId=" + taskID,
            function (data) {
                if (data.hasOwnProperty("placeCheckFormId")) {
                    placeCheckFormId = data.placeCheckFormId;
                    $("#checkIn").removeClass("col-33");
                    $("#checkIn").hide();
                    $("#carryOutCss").removeClass("col-33");
                    $("#submitToCss").removeClass("col-33");
                    $("#carryOutCss").toggleClass("col-50");
                    $("#submitToCss").toggleClass("col-50");
                    $("#carryOut").attr("name", "false");
                }
                var taskInfo = data.taskInfo;
                if (taskInfo) {
                    missionsubid = taskInfo.fSubid;
                    $("#missionId").html(taskInfo.fTaskid);
                    $("#missionType").html(taskInfo.fTasktypeexplain);
                    $("#missionName").html(taskInfo.fTaskname);
                    $("#createName").html(taskInfo.fTaskcreateusername);
                    $("#createTime").html(taskInfo.fStartdate);
                    $("#finishTime").html(taskInfo.fDeadlinedate);
                    var missionContent =
                        '<textarea readonly="readonly">' +
                        taskInfo.fTaskcontent +
                        "</textarea>";
                    $("#missionCont").append(missionContent);
                    missionTypeid = taskInfo.fTasktypeid;

                    //执行任务按钮事件
                    $("#carryOut").click(function () {
                        if (this.name == "true") {
                            alert("执行任务前，请先签到。");
                        } else {
                            localStorage.setItem("fSubid", missionsubid);
                            localStorage.setItem("fPlacecheckformid", placeCheckFormId);
                            localStorage.setItem("missiontaskID", taskID);
                            if (missionTypeid == 1) {
                                //巡检任务
                                localStorage.setItem("fSubname", "执行情况");
                                window.location.href = "patrolContent.html";
                            } else if (missionTypeid == 2) {
                                //现场交接任务
                                localStorage.setItem("fSubname", "执行情况");
                                window.location.href = "missionScene.html";
                            } else if (missionTypeid == 3) {
                                //缺陷整改
                                localStorage.setItem("fSubname", "执行情况");
                                window.location.href = "defectRectification.html";
                            } else {
                                alert("fTasktypeid=null，未知任务类型");
                            }
                        }
                    });
                }
                if (
                    data.hasOwnProperty("taskUserList") &&
                    data.taskUserList.length > 0
                ) {
                    $(data.taskUserList).each(function () {
                        var text = "";
                        text += "<li>";
                        text +=
                            '                                <div class="item-content showDiv">';
                        text +=
                            '                                    <div class="item-inner">';
                        text +=
                            '                                        <div class="item-title label">' +
                            this.userName +
                            "</div>";
                        text +=
                            '                                        <div class="item-input">';
                        text +=
                            '                                            <div class = "item-label" id="input' +
                            this.fUserid +
                            '" ';
                        text +=
                            '                                                name="number" >' +
                            this.taskState +
                            "</div>";
                        text += "                                        </div>";
                        text += "                                    </div>";
                        text += "                                </div>";
                        text += "                            </li>";
                        $("#missionState").append(text);
                        if (this.fTaskstateid == 1) {
                            $("#input" + this.fUserid).css("color", "gray");
                        } else if (this.fTaskstateid == 2) {
                            $("#input" + this.fUserid).css("color", "blue");
                        } else if (this.fTaskstateid == 3 || this.fTaskstateid == 4) {
                            $("#input" + this.fUserid).css("color", "springgreen");
                        } else {
                            $("#input" + this.fUserid).css("color", "red");
                        }
                    });
                }
            }
        );
    }

    getNetData();

    //现场签到按钮事件
    $("#checkIn").click(function () {
        Substation.getDataByAjax("/taskSingIn", "taskId=" + taskID, function (data) {
            if (data.placeCheckFormId) {
                placeCheckFormId = data.placeCheckFormId;
                $("#checkIn").removeClass("col-33");
                $("#checkIn").hide();
                $("#carryOutCss").removeClass("col-33");
                $("#submitToCss").removeClass("col-33");
                $("#carryOutCss").toggleClass("col-50");
                $("#submitToCss").toggleClass("col-50");
                $("#carryOut").attr("name", "false");
            }
        });
    });

    //提交按钮事件
    $("#submitTo").click(function () {
        var textDetail = $("#textareaDetail").val();
        if (!textDetail) {
            textDetail = "";
        }
        var param = {
            fTaskid: taskID,
            fExplain: textDetail
        };
        // fExplain 执行情况
        Substation.getDataByAjax("/submitUserTask", param, function (data) {
            localStorage.setItem("need-refresh", true);
            window.history.back();
        });
    });

    $(".pull-left.click_btn").click(function () {
        localStorage.setItem("need-refresh", true);
        window.history.back();
    });

    //管理页面
    $("#clickManager").click(function () {
        localStorage.setItem("fSubname", "执行情况");
        localStorage.setItem("missionSubid", missionsubid);
        localStorage.setItem("missionPlaceCheckFormId", placeCheckFormId);
        localStorage.setItem("missiontaskID", taskID);
        window.location.href = "missionManager.html";
    });
});

//  function alinkClick() {
//      localStorage.setItem("fSubname", "执行情况");
//      window.location.href = "missionManager.html";
//  }

//  $.init();