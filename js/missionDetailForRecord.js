var showmissionBtn = localStorage.getItem("showType");
var upLoadClicktag = true;
// if (showmissionBtn == "missionDoing") {
//     localStorage.setItem("canClick", true);
//     var missionType = localStorage.getItem("missionType");
//     if (missionType == 0) {
//         var showStr =
//             '<div class="row buttonsEvent"> <div class = "col-33" id = "checkInCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "checkIn2">现场签到</a> </div> <div class = "col-33" id = "carryOutCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut">执行任务</a> </div> <div class = "col-33" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> </div>';
//         $("#addVarContain126").html(showStr);
//         $("#carryOut").attr("name", "true");
//         $("#submitTo").attr("name", "true");
//     } else {
//         localStorage.setItem("canClick", true);
//         var showStr =
//             '<div class="row buttonsEvent">  <div class = "col-50" id = "carryOutCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut">执行任务</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> ';
//         $("#addVarContain126").append(showStr);
//         $("#carryOut").attr("name", "false");
//     }
// } else if (showmissionBtn == "missionFinish") {
//     localStorage.setItem("canClick", false);
//     $("#clickManager").css("display", "none");
var showstr =
    '<div class="row no-gutter buttonsEvent"><a href = "#" class = "col-66 button button-big button-fill bottom-btn" id = "carryOut" ><i class="icon icon-missionDetail"></i>' + Operation['ui_ImplementDetail'] + '</a></div>';
$("#addVarContain126").append(showstr);
$("#carryOut").attr("name", "false");
// } else {
//     localStorage.setItem("canClick", true);
//     var showStr =
//         '<div class="row buttonsEvent">  <div class = "col-50" id = "carryOutCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut">执行任务</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> ';
//     $("#addVarContain126").append(showStr);
//     $("#carryOut").attr("name", "false");
// }

//任务id
var taskID = localStorage.getItem("taskID");
//巡检单id
var placeCheckFormId;
var haveResult = true;
//巡检的变电所id
var missionsubid;
//任务类型 fTasktypeid
var missionTypeid;
//任务负责人 fTaskchargerid
var taskchargerid;

var taskCreatId;

var missionDetail = "";
var taskInfo;

function getNetData() {
    Substation.getDataByAjax(
        "/selectTaskByTaskId",
        "taskId=" + taskID,
        function (data) {
            if (data.hasOwnProperty("placeCheckFormId")) {
                placeCheckFormId = data.placeCheckFormId;
            }
            if(data.hasOwnProperty("haveResult")){
                haveResult = data.haveResult==true;
            }
            /*                if(data.taskInfo.fTaskstateid==2){
                                        $("#checkIn").removeClass("col-33");
                                        $("#checkIn").hide();
                                        $("#carryOutCss").removeClass("col-33");
                                        $("#submitToCss").removeClass("col-33");
                                        $("#carryOutCss").addClass("col-50");
                                        $("#submitToCss").addClass("col-50");
                                        $("#carryOut").attr("name", "false");
                                        $("#submitTo").attr("name", "false");
                                    }*/
            var userList = data.taskUserList;
            if (data.taskInfo) {
                taskInfo = data.taskInfo;
                missionsubid = taskInfo.fSubid;
                $("#missionId").html(taskInfo.fTasknumber);
                $("#missionType").html(taskInfo.fTasktypeexplain);
                $("#missionName").html(taskInfo.fTaskname);
                $("#createName").html(taskInfo.fTaskcreateusername);
                $("#createCall").attr("onclick","callPhone('"+taskInfo.fTaskcreateuserphone+"')");
                $("#chargerName").html(taskInfo.fTaskchargername);
                $("#chargerCall").attr("onclick","callPhone('"+taskInfo.fTaskchargerphone+"')");
                $("#createTime").html(taskInfo.fStartdate.substring(0, 11));
                $("#finishTime").html(taskInfo.fDeadlinedate.substring(0, 11));

                //任务开始时间
                $("#ActStartTime").html(taskInfo.fTaskstartdate);
                //任务提交时间
                $("#ActFinishTime").html(taskInfo.fTaskfinishdate);

                var missionContent = taskInfo.fTaskcontent;
                $("#missionCont").html(missionContent);
                missionTypeid = taskInfo.fTasktypeid;
                taskchargerid = taskInfo.fTaskchargerid;
                taskCreatId = taskInfo.fTaskcreateuserid;
                var temp = false;
                var thisTempState = 0;

                //缺陷总数
                $("#TotalDefectNum").html(taskInfo.deviceProblemSum);
                if (taskInfo.deviceProblemSum > 0) {
                    $("#TotalDefectNum").css("color", "red");
                    $("#TotalDefectNum").click(function () {
                        //缺陷整改
                        if (!upLoadClicktag) {
                            return;
                        }
                        upLoadClicktag = false;
                        setTimeout(function () {
                            upLoadClicktag = true;
                        }, 1000);
                        localStorage.setItem("taskID", taskID);
                        localStorage.setItem("missionTypeid", missionTypeid);
                        localStorage.setItem("goBackToList", "1");
                        localStorage.setItem("canClick", false);
                        window.location.href = "defectRectification.html";
                    });
                }
                //缺陷未处理数
                $("#Unprocessednumber").html(taskInfo.deviceProblemUnresolved);
                if (taskInfo.deviceProblemUnresolved > 0) {
                    $("#Unprocessednumber").css("color", "red");
                    $("#Unprocessednumber").click(function () {
                        if (!upLoadClicktag) {
                            return;
                        }
                        upLoadClicktag = false;
                        setTimeout(function () {
                            upLoadClicktag = true;
                        }, 1000);
                        //缺陷整改
                        localStorage.setItem("taskID", taskID);
                        localStorage.setItem("missionTypeid", missionTypeid);
                        localStorage.setItem("goBackToList", "1");
                        localStorage.setItem("canClick", false);
                        window.location.href = encodeURI("defectRectification.html" + "?value=0");
                    });
                }
                //任务执行结果
                if (taskInfo.taskResult == 3) {
                    $("#TotalDefect").html(Operation['ui_plannedDone']);
                    $("#TotalDefect").css("color", "springgreen");
                } else if (taskInfo.taskResult == 4) {
                    $("#TotalDefect").html(Operation['ui_overLimitDone']);
                    $("#TotalDefect").css("color", "red");
                } else if (taskInfo.taskResult == 5) {
                    $("#TotalDefect").html(Operation['ui_unDone']);
                    $("#TotalDefect").css("color", "red");
                } else {
                    $("#TotalDefect").html("-");
                }
                //判断后续
                $(userList).each(function () {
                    if (this.fUserid == Substation.loginUserid) {
                        temp = true;
                        thisTempState = this.fTaskstateid;
                        return false;
                    }
                });
                if (missionType == 3) {
                    //办毕处理
                    $(data.taskUserList).each(function () {
                        if (Substation.loginUserid == this.fUserid) {
                            var explain = this.fExplain;
                            if (explain.length > 0) {
                                $("#textareaDetail").html(explain);
                            }
                        }
                    });
                    $("#textareaDetail").attr("readonly", true);
                    // $("#addVarContain124").css("display", "none");
                }
                //                    if (taskchargerid != Substation.loginUserid) {
                //                        $("#clickManager").css("display", "none");
                //                    } else {
                //                        $("#addVarContain124").css("display", "none");
                //                    }
                /*                    if (missionTypeid != 1) {
                              $("#addVarContain125").css("display", "none");
                          }*/
                if (showmissionBtn != "missionFinish") {

                }

                //管理页面
                if (taskchargerid != Substation.loginUserid && taskCreatId != Substation.loginUserid) {
                    $("#clickManager").css("display", "none");
                    $("#addVarContain124").css("display", "none");
                } else {
                    $("#addVarContain124").css("display", "none");
                }

                //执行任务按钮事件
                $("#carryOut").click(function () {
                    if (!upLoadClicktag) {
                        return;
                    }
                    upLoadClicktag = false;
                    setTimeout(function () {
                        upLoadClicktag = true;
                    }, 1000);
                    localStorage.setItem("fSubid", missionsubid);
                    localStorage.setItem("fPlacecheckformid", placeCheckFormId);
                    localStorage.setItem("taskID", taskID);
                    if (missionTypeid == 1) {
                        //巡检任务
                        if(haveResult){
                            window.location.href = "patrolContent.html";
                        }else{
                            $.toast(Operation['ui_noFormResult']);
                        }
                    } else if (missionTypeid == 2) {
                        //现场交接任务
                        window.location.href = "missionScene.html";
                    } else if (missionTypeid == 3) {
                        //缺陷整改
                        localStorage.setItem("missionTypeid", missionTypeid);
                        window.location.href = "defectRectification.html";
                    } else {
                        //                            $.toast("fTasktypeid=null，未知任务类型");
                    }

                });
            }



            if (
                data.hasOwnProperty("taskUserList") &&
                data.taskUserList.length > 0
            ) {
                $(data.taskUserList).each(function () {
                    var taskStateName = "";
                    if (this.fExesituation == 7) {
                        taskStateName = "<span style='color:gray;'>" + Operation['ui_notCheck'] + "</span>";
                    } else if (this.fExesituation == 8) {
                        taskStateName = "<span style='color:blue;'>" + Operation['ui_checked'] + "</span>";
                    } else if (this.fExesituation == 9) {
                        taskStateName = "<span style='color:springgreen;'>" + Operation['ui_submitted'] + "</span>";
                    }
                    var text = "";
                    text += "<li>";
                    text +=
                        '                                <div class="item-content showDiv">';
                    text +=
                        '                                    <div class="item-inner">';
                    text +=
                        '<div class="item-title label row no-gutter" style="display:flex;align-items:center;">' +
                        '<div class="limit-length" style="max-width:80%;">'+this.userName +'</div>'+
                        "<img class='callPhone' onclick=\"callPhone('"+this.fUserphone+"')\" style='margin-left:0.3rem;width:1rem;' src='img/call.png'>" +
                        "</div>";
                    text +=
                        '                                        <div class="item-input">';
                    text +=
                        '                                            <div class = "item-label" id="input' +
                        this.fUserid +
                        '" ';
                    text +=
                        '                                                name="number" >' +
                        taskStateName +
                        "</div>";
                    text += "                                        </div>";
                    text += "                                    </div>";
                    text += "                                </div>";
                    text += "                            </li>";
                    $("#missionState").append(text);
                });
            }
        }
    );
}

getNetData();

$(".pull-left.click_btn").click(function () {
    localStorage.setItem("need-refresh", "true");
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
    if (isIOS) {
        window.history.back();
    } else {
        android.goBack();
    }
    //        window.location.href = "allPatrolRecord.html";
});

$("#goMap").click(function () {
    var lat = taskInfo.fLatitude;
    var lon = taskInfo.fLongitude;
    if (lat != undefined && lat != "" && lon != undefined && lon != "") {
        if (isAndroid) {
            android.goToMap(lat, lon, taskInfo.fSubName);
        } else if (isIOS) {
            var locParam = {
                Latitude: lat,
                Longitude: lon,
                locName: taskInfo.fSubName
            };
            window.webkit.messageHandlers.pushMapSelect.postMessage(locParam);
        }
    } else {
        $.toast(Operation['ui_nolocation']);
    }
});

//跳转视频
$("#jumpVideo").click(function () {
    if (isAndroid) {
        android.videoWatch(taskInfo.fSubid);
    } else if (isIOS) {
        var subParam = {
            Subid: taskInfo.fSubid,
            Subname: taskInfo.fSubName
        };
        window.webkit.messageHandlers.pushVideoListVC.postMessage(subParam);
    }
});

//管理页面
$("#clickManager").click(function () {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    //        localStorage.setItem("missionSubid", missionsubid);
    //        localStorage.setItem("missionPlaceCheckFormId", placeCheckFormId);
    localStorage.setItem("taskID", taskID);
    //        if (taskCreatId != Substation.loginUserid && missionType != "3") {
    //            localStorage.setItem("hiddenBtn", "NO");
    //        } else {
    //            localStorage.setItem("hiddenBtn", "YES");
    //        }
    localStorage.setItem("hiddenBtn", "YES");
    window.location.href = "missionManager.html";
});

function callPhone(phoneNum) {
    if (isAndroid) {
        android.callPhone(phoneNum);
    } else {
        var param = {
            "phone": phoneNum
        };
        window.webkit.messageHandlers.takePhone.postMessage(param);
    }
}

$.init();