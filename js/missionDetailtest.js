var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

var isUseTrace = "0";
//是否有轨迹功能传参
try{
    if (isIOS) {
        window.webkit.messageHandlers.iOS.postMessage("");
        var storage = localStorage.getItem("accessToken");
        storage = JSON.parse(storage);
        isUseTrace = storage.isOpenTrack;
    } else if (isAndroid) {
        isUseTrace = android.getTrackUse();
    }
}catch(e){};

//任务id
var taskID = localStorage.getItem("taskID");
//巡检单id
var placeCheckFormId;
//巡检的变电所id
var missionsubid;
//任务类型 fTasktypeid
var missionTypeid;
//任务负责人 fTaskchargerid
var taskchargerid;

var taskCreatId;

var missionType = localStorage.getItem("missionType");
//当前帐号userid
var loginUserid = Substation.loginUserid;

var subLon;
var subLat;

function getNetData() {
    Substation.getDataByAjax(
        "/selectTaskByTaskId",
        "taskId=" + taskID,
        function (data) {
            if (data.hasOwnProperty("placeCheckFormId")) {
                placeCheckFormId = data.placeCheckFormId;
            }
            var taskInfo = data.taskInfo;
            var userList = data.taskUserList;
            subLon = taskInfo.fLongitude;
            subLat = taskInfo.fLatitude;
            if (taskInfo != null && taskInfo != undefined) {
                missionsubid = taskInfo.fSubid;
                $("#missionId").html(taskInfo.fTasknumber);
                $("#missionType").html(taskInfo.fTasktypeexplain);
                $("#missionName").html(taskInfo.fTaskname);
                $("#createName").html(taskInfo.fTaskcreateusername);
                $("#chargerName").html(taskInfo.fTaskchargername);
                $("#createTime").html(taskInfo.fStartdate.substring(0, 10));
                $("#finishTime").html(taskInfo.fDeadlinedate.substring(0, 10));
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
                var thisUser = {};
                //判断后续
                if (userList != undefined && userList.length > 0) {
                    $(userList).each(function () {
                        if (this.fUserid == loginUserid) {
                            temp = true;
                            thisUser = this;
                        }

                        var taskStateName = "";
                        if (this.fExesituation == 7) {
                            taskStateName = "<span style='color:gray;'>未签到</span>";
                        } else if (this.fExesituation == 8) {
                            taskStateName = "<span style='color:blue;'>已签到</span>";
                        } else if (this.fExesituation == 9) {
                            taskStateName = "<span style='color:springgreen;'>已提交</span>";
                        } else {

                        }

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
                            taskStateName +
                            "</div>";
                        text += "                                        </div>";
                        text += "                                    </div>";
                        text += "                                </div>";
                        text += "                            </li>";
                        $("#missionState").append(text);
                    });
                }

                //是执行人
                //按钮显隐判断
                if (temp) {
                    $("#addVarContain124").show();
                    if (thisUser.fTaskstarttime == undefined && missionType == "1") {
                        $("#startTask").show();
                    } else {
                        if (thisUser.fSignintime == undefined) {
                            $("#taskIn").show();
                        } else {
                            if (thisUser.fCreatetime == undefined) {
                                $("#doTask").show();
                                $("#submitTask").show();
                                localStorage.setItem("canClick", "true");
                            } else {
                                $("#textareaDetail").attr("placeholder", "");
                                $("#textareaDetail").attr("readonly", true);
                                $("#textareaDetail").val(thisUser.fExplain);
                                $("#doDetail").show();
                                localStorage.setItem("canClick", "false");
                            }
                        }
                    }
                } else {
                    localStorage.setItem("canClick", "false");
                    if (loginUserid == taskchargerid) {
                        //负责人按钮
                        if (taskInfo.fTaskfinishdate == undefined) {
                            $("#chargeTask").show();
                            $("#chargeSubmit").show();
                        } else {
                            $("#doDetail").show();
                        }
                    } else {
                        $("#doDetail").show();
                    }
                }

                //执行人管理按钮
                if (loginUserid != taskchargerid && loginUserid != taskCreatId) {
                    $("#clickManager").css("display", "none");
                }

                //缺陷总数
                $("#TotalDefectNum").html(taskInfo.deviceProblemSum);
                if (taskInfo.deviceProblemSum > 0) {
                    $("#TotalDefectNum").css("color", "red");
                    $("#TotalDefectNum").click(function () {
                        //缺陷整改
                        localStorage.setItem("missionTypeid", missionTypeid);
                        localStorage.setItem("taskID", taskID);
                        if (temp) {
                            if ($("#startTask").css("display") != "none") {
                                $.toast("请先开启该任务！");
                                return;
                            }
                            if ($("#taskIn").css("display") != "none") {
                                $.toast("请先现场签到！");
                                return;
                            }
                        }
                        window.location.href = "defectRectification.html";
                    });
                }
                //缺陷未处理数
                $("#Unprocessednumber").html(taskInfo.deviceProblemUnresolved);
                if (taskInfo.deviceProblemUnresolved > 0) {
                    $("#Unprocessednumber").css("color", "red");
                    $("#Unprocessednumber").click(function () {
                        //缺陷整改
                        localStorage.setItem("missionTypeid", missionTypeid);
                        localStorage.setItem("taskID", taskID);
                        if (temp) {
                            if ($("#startTask").css("display") != "none") {
                                $.toast("请先开启该任务！");
                                return;
                            }
                            if ($("#taskIn").css("display") != "none") {
                                $.toast("请先现场签到！");
                                return;
                            }
                        }
                        window.location.href = "defectRectification.html?value=0";
                    });
                }
            }
        }
    );
}

getNetData();

//开启任务
$("#startTask").click(function () {
    $.showPreloader(Operation['ui_loading']);
    Substation.getDataByAjax("/taskStart", "taskId=" + taskID, function (data) {
        if (isAndroid) {
            android.refresh();
        } else {
            localStorage.setItem("need-refresh", "true");
        }
        if (isUseTrace == "1") {
            $.confirm("是否要开启轨迹记录功能？", function () {
                //开启轨迹
                if (isIOS) {
                    window.webkit.messageHandlers.openTrackFunc.postMessage(null);
                } else if (isAndroid) {
                    android.startTrace();
                }
                location.reload();
            }, function () {
                location.reload();
            });
        } else {
            location.reload();
        }
    });
});

//现场签到
$("#taskIn").click(function () {
    $.showPreloader(Operation['ui_loading']);
    var loc = "";
    if (isIOS) {
        window.webkit.messageHandlers.getLocation.postMessage("");
        loc = localStorage.getItem("locationStrJS");
    } else {
        loc = android.getLocation();
    }
    var lat = "";
    var lon = "";
    var addr = "";
    if (loc == undefined || !loc.length) {
        $.hidePreloader();
        $.toast("无法获取位置，请检查网络并确保定位授权");
        return;
    } else if (loc == "-1") {
        $.hidePreloader();
        $.toast("获取位置超时,建议打开GPS定位服务。");
        return;
    } else {
        $.hidePreloader();
    }
    if (loc != "" && loc != null) {
        var array = loc.split(";");
        lat = array[0];
        lon = array[1];
        addr = array[2];
        //                                    alert(lat+"\n"+lon+"\n"+addr);
    }
    var fDistance = -1;
    if (subLat != undefined && subLon != undefined) {
        var map = new BMap.Map("allmap");
        var point1 = new BMap.Point(subLon, subLat);
        var point2 = new BMap.Point(lon, lat);
        fDistance = map.getDistance(point1, point2);
    }
    var param = {
        taskId: taskID,
        fLongitude: lon,
        fLatitude: lat,
        fLocation: addr
    };
    fDistance = parseInt(fDistance);
    if (fDistance > 0 && fDistance < 2147483647) {
        param['fDistance'] = fDistance;
    }
    //                            alert(""+taskID+","+lon+","+lat+","+addr);
    Substation.postDataByAjax("/taskSingIn", param, function (data) {
        $.toast("签到成功！");
        localStorage.removeItem("locationStrJS");
        location.reload();
    });
});

//执行任务按钮事件
$(".doDetail").click(function () {
    localStorage.setItem("fSubid", missionsubid);
    localStorage.setItem("taskID", taskID);
    if ($(this).attr("id") == "doTask") {
        localStorage.setItem("canClick", "true");
    } else {
        localStorage.setItem("canClick", "false");
    }
    if (missionTypeid == 1) {
        localStorage.setItem("fPlacecheckformid", placeCheckFormId);
        if ($(this).attr("id") == "doTask") {
            var attion = Operation['ui_attention'];
            var attiondetail = Operation['ui_executionprompt'];
            $.confirm(
                attiondetail,
                attion,
                function () {
                    window.location.href = "patrolContent.html";
                }
            );
        } else {
            window.location.href = "patrolContent.html";
        }
    } else if (missionTypeid == 2) {
        //现场交接任务
        window.location.href = "missionScene.html";
    } else if (missionTypeid == 3) {
        //缺陷整改
        window.location.href = "defectRectification.html";
    } else {
        $.toast("未知任务类型");
    }
});

//提交按钮事件
$("#submitTask").click(function () {
    $.confirm("确定要提交任务吗？", function () {
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
            $.toast("任务提交成功！");
            $("#doTask").hide();
            $("#submitTask").hide();
            $("#doDetail").show();
            if (isAndroid) {
                try{
                    android.removeSPItem(taskID);
                }catch(e){
                    localStorage.removeItem(taskID);
                };
                android.refresh();
            } else {
                localStorage.removeItem(taskID);
                localStorage.setItem("need-refresh", "true");
            }
        });
    });
});

//负责人提交任务
$("#chargeSubmit").click(function () {
    $.confirm("确定要提交并结束任务吗？", function () {
        var param;
        param = {
            fTaskid: taskID
        };
        Substation.getDataByAjax("/submitTask", param, function (data) {
            $.toast("提交成功，该任务已结束！");
            if (isAndroid) {
                try{
                    android.removeSPItem(taskID);
                }catch(e){
                    localStorage.removeItem(taskID);
                };
                android.refresh();
            } else {
                localStorage.removeItem(taskID);
                localStorage.setItem("need-refresh", "true");
            }
            location.reload();
        });
    });
});

$(".pull-left.click_btn").click(function () {
    if (isAndroid) {
        android.goBack();
    } else {
        window.history.back();
    }
});

//管理页面
$("#clickManager").click(function () {
    /*    localStorage.setItem("fSubname", "执行情况");
        localStorage.setItem("missionSubid", missionsubid);
        localStorage.setItem("missionPlaceCheckFormId", placeCheckFormId);*/
    localStorage.setItem("taskID", taskID);
    if (taskCreatId != loginUserid && missionType != "3") {
        localStorage.setItem("hiddenBtn", "NO");
    } else {
        localStorage.setItem("hiddenBtn", "YES");
    }
    window.location.href = "missionManager.html";
});

window.addEventListener(
    "pageshow",
    function (event) {
        if (localStorage.getItem("need-refresh") == "true") {
            localStorage.removeItem("need-refresh");
            location.reload();
        }
    },
    false
);

//解决键盘遮挡问题
var h = $(window).height();
window.addEventListener("resize", function () {
    if ($(window).height() < h) {
        $('.buttonsEvent').hide();
    }
    if ($(window).height() >= h) {
        $('.buttonsEvent').show();
    }
    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

$.init();