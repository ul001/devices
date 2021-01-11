var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var allCommit = true;
var isUseTrace = "0";
//是否有轨迹功能传参
try {
    if (isIOS) {
        window.webkit.messageHandlers.iOS.postMessage("");
        var storage = localStorage.getItem("accessToken");
        storage = JSON.parse(storage);
        isUseTrace = storage.isOpenTrack;
        window.webkit.messageHandlers.isStartTrackFunc.postMessage("");
    } else if (isAndroid) {
        isUseTrace = android.getTrackUse();
    }
} catch (e) {
    isUseTrace = "0";
}

// //根据jQuery选择器找到需要加载ystep的容器
// //loadStep 方法可以初始化ystep
// $(".ystep1").loadStep({
//     //ystep的外观大小
//     //可选值：small,large
//     size: "large",
//     //ystep配色方案
//     //可选值：green,blue
//     color: "green",
//     //ystep中包含的步骤
//     steps: [{
//         //步骤名称
//         title: "发起",
//         //步骤内容(鼠标移动到本步骤节点时，会提示该内容)
//         content: "实名用户/公益组织发起项目"
//     }, {
//         title: "签到",
//         content: "乐捐平台工作人员审核项目"
//     }, {
//         title: "执行",
//         content: "乐捐项目上线接受公众募款"
//     }, {
//         title: "审核",
//         content: "项目执行者线下开展救护行动"
//     }, {
//         title: "结束",
//         content: "项目执行者公示善款使用报告"
//     }]
// });

// //跳转到下一个步骤
// //$(".ystep1").nextStep();
// //跳转到上一个步骤
// //$(".ystep1").prevStep();
// //跳转到指定步骤
// $(".ystep1").setStep(2);
// //获取当前在第几步
// //$(".ystep1").getStep();

var upLoadClicktag = true;
var targetload = 0;
//任务id
var taskID = localStorage.getItem("robTaskId");
var grabbedNum = localStorage.getItem("grabbed");
// var tasktypeid = localStorage.getItem("tasktypeid");
var jumpId = Substation.GetQueryString("jumpId");
var isPush = "0";
if (jumpId != undefined && jumpId != null && jumpId != "") {
    taskID = jumpId;
    isPush = "1";
}
//巡检单id
var placeCheckFormId;
var haveResult = true;
//巡检的变电所id
var missionsubid;
var missionsubname;
//任务类型 fTasktypeid
var missionTypeid;
var missionTypeName;
//任务负责人 fTaskchargerid
var taskchargerid;
//任务单号
var TaskNumber;

var taskCreatId;

var missionState;
//当前帐号userid
var loginUserid = Substation.loginUserid;

var subLon;
var subLat;
//是否执行人
var temp = false;
var fTaskandalarmeventid = "";
//判断后续
var isChangeReturnCount = 0;
var userList = [];
var userPhone = "";

function getNetData() {
    Substation.getDataByAjax(
        "/getWorkOrderDetail",
        "fWorkorderid=" + taskID,
        function (data) {
            var detail;
            if (data.hasOwnProperty("userInfo")) {
                userPhone = data.userInfo.userPhone;
            }
            if (data.hasOwnProperty("detail")) {
                detail = data.detail;
                placeCheckFormId = detail.fWorkorderid;
            }
            // if (data.hasOwnProperty("haveResult")) {
            //     haveResult = data.haveResult == true;
            // }
            taskInfo = detail;

            if (taskInfo != null && taskInfo != undefined) {
                // subLon = taskInfo.fLongitude;
                // subLat = taskInfo.fLatitude;
                userList = taskInfo.tDevWorkOrderDetails;
                missionsubid = taskInfo.fSubid;
                missionsubname = taskInfo.fSubName;
                localStorage.setItem("subName", missionsubname);
                // if (taskInfo.hasOwnProperty("fTaskandalarmeventid")) {
                //     fTaskandalarmeventid = taskInfo.fTaskandalarmeventid;
                // }
                // if (taskInfo.hasOwnProperty("fTaskandrushrepairid")) {
                //     fTaskandalarmeventid = taskInfo.fTaskandrushrepairid;
                // }
                $("#missionId").html(taskInfo.fWorkorderid);
                TaskNumber = taskInfo.fWorkorderid;
                $("#missionType").html(taskInfo.fTitle);
                missionTypeName = taskInfo.fTitle;
                localStorage.setItem("missionTypeName", missionTypeName);
                $("#missionName").html(taskInfo.fSubName);
                $("#createName").html(taskInfo.fPublishername);
                $("#createCall").attr(
                    "onclick",
                    "callPhone('" + taskInfo.fTaskcreateuserphone + "')"
                );
                $("#chargerName").html(taskInfo.fTaskchargername);
                $("#chargerCall").attr(
                    "onclick",
                    "callPhone('" + taskInfo.fTaskchargerphone + "')"
                );
                $("#postTime").html(taskInfo.fOrdercreatetime);
                $("#createTime").html(taskInfo.fPlantime);
                $("#finishTime").html(taskInfo.fDeadlinetime);
                //任务开始时间
                $("#ActStartTime").html(taskInfo.fTaskstartdate);
                //任务提交时间
                $("#ActFinishTime").html(taskInfo.fTaskfinishdate);
                var missionContent = taskInfo.fWorkcontent;
                $("#missionCont").html(missionContent);

                missionTypeid = taskInfo.fTasktypeid;
                taskchargerid = taskInfo.fTaskchargerid;
                taskCreatId = taskInfo.fTaskcreateuserid;
                missionState = taskInfo.fTaskstateid;
                var thisUser = {};

                //任务执行结果
                $("#TotalDefect").html(taskInfo.fOrderstateexplain);
                // if (taskInfo.taskResult == 3) {
                //     $("#TotalDefect").html(Operation["ui_plannedDone"]);
                //     $("#TotalDefect").css("color", "springgreen");
                // } else if (taskInfo.taskResult == 4) {
                //     $("#TotalDefect").html(Operation["ui_overLimitDone"]);
                //     $("#TotalDefect").css("color", "red");
                // } else if (taskInfo.taskResult == 5) {
                //     $("#TotalDefect").html(Operation["ui_unDone"]);
                //     $("#TotalDefect").css("color", "red");
                // } else {
                //     $("#TotalDefect").html("-");
                // }

                //限定抢单个数
                $("#TotalDefectNum").html(taskInfo.fLimitnumber);
                // if (taskInfo.deviceProblemSum > 0) {
                // $("#TotalDefectNum").css("color", "red");
                // $("#TotalDefectNum").click(function () {
                //     if (!upLoadClicktag) {
                //         return;
                //     }
                //     upLoadClicktag = false;
                //     setTimeout(function () {
                //         upLoadClicktag = true;
                //     }, 1000);
                //     //缺陷整改
                //     localStorage.setItem("missionTypeid", missionTypeid);
                //     localStorage.setItem("taskID", taskID);
                //     if (temp) {
                //         if ($("#startTask").css("display") != "none") {
                //             $.toast(Operation["ui_openTaskTip"]);
                //             return;
                //         }
                //         if ($("#taskIn").css("display") != "none") {
                //             $.toast(Operation["ui_signinTip"]);
                //             return;
                //         }
                //     }
                //     window.location.href = "defectRectification.html";
                // });
                // }
                //缺陷未处理数
                $("#Unprocessednumber").html(taskInfo.fTargetload + "kW");
                // if (taskInfo.deviceProblemUnresolved > 0) {
                //     $("#Unprocessednumber").css("color", "red");
                //     $("#Unprocessednumber").click(function () {
                //         if (!upLoadClicktag) {
                //             return;
                //         }
                //         upLoadClicktag = false;
                //         setTimeout(function () {
                //             upLoadClicktag = true;
                //         }, 1000);
                //         //缺陷整改
                //         localStorage.setItem("missionTypeid", missionTypeid);
                //         localStorage.setItem("taskID", taskID);
                //         if (temp) {
                //             if ($("#startTask").css("display") != "none") {
                //                 $.toast(Operation["ui_openTaskTip"]);
                //                 return;
                //             }
                //             if ($("#taskIn").css("display") != "none") {
                //                 $.toast(Operation["ui_signinTip"]);
                //                 return;
                //             }
                //         }
                //         window.location.href = "defectRectification.html?value=0";
                //     });
                // }
                //如果是消警5、抢单7、抢修6任务，则剔除
                // if (missionTypeid == 5 || missionTypeid == 6 || missionTypeid == 7) {
                //     $("#totaldefect1").remove();
                //     $("#defectUntreatNum").remove();
                // }
                //是发起人
                //按钮显隐判断
                // fOrderpublisher 判断按钮显隐
                if (userId == taskInfo.fOrderpublisher && taskInfo.fOrderstate != 3) {
                    $("#doDetail").show();
                    localStorage.setItem("canClick", "false");
                    temp = false;
                } else if (grabbedNum == 0) {
                    $("#clickManager").css("display", "none");
                    temp = true;
                    //抢单按钮
                    $("#startTask").show();
                } else if (
                    grabbedNum == 1 &&
                    userList != undefined &&
                    userList.length > 0
                ) {
                    $("#clickManager").css("display", "none");
                    //开始或结束任务
                    $(userList).each(function () {
                        if (this.fExecutor == userId) {
                            temp = true;
                            if (this.fOrderstate == 0) {
                                $("#taskIn").show();
                            } else if (this.fOrderstate == 1) {
                                $("#submitTask").show();
                            }
                        }
                    });
                } else {
                    //均不显示按钮
                    $("#clickManager").css("display", "none");
                    $(".buttonsEvent").css("display", "none");
                }
                $(userList).each(function () {
                    // if (this.fUserid == loginUserid) {
                    //     temp = true;
                    //     thisUser = this;
                    //     // missionState = this.fTaskstateid;
                    // }
                    var taskStateName = "";

                    // "kW </span'><span style='color:springgreen;'>" +
                    taskStateName =
                        "<span'>负荷:" +
                        this.fApplyload +
                        "kW </span'><span style='color:green;'>" +
                        this.fOrderstateexplain +
                        "</span>";
                    isChangeReturnCount++;
                    // if (isUseTrace == "1") {
                    //     taskStateName +=
                    //         '<a href="#" class="button" style="width:55%;display:inline-block;float:right;" onClick="gotoMissionTimeAxis(' +
                    //         this.fUserid +
                    //         ",'" +
                    //         this.fTaskstarttime +
                    //         "','" +
                    //         this.fCreatetime +
                    //         "')\">" +
                    //         Operation["ui_progress"] +
                    //         "</a>";
                    // } else {
                    //     taskStateName +=
                    //         '<a href="#" class="button" style="width:55%;display:inline-block;float:right;" onClick="gotoMissionTimeAxis(' +
                    //         this.fUserid +
                    //         ',"","")">' +
                    //         Operation["ui_progress"] +
                    //         "</a>";
                    // }

                    var text = "";
                    text += "<li>";
                    text +=
                        '                                <div class="item-content showDiv">';
                    text +=
                        '                                    <div class="item-inner">';
                    text +=
                        '                                        <div class="item-title label row no-gutter" style="display:flex;align-items:center;">' +
                        '<div class="limit-length" style="width:80%;">' +
                        this.fUsername +
                        "</div>" +
                        "<img class='callPhone' onclick=\"callPhone('" +
                        this.fUserphone +
                        "')\" style='margin-left:0.3rem;margin-right:0.5rem;width:1rem;' src='img/call.png'>" +
                        "</div>";
                    text +=
                        '                                        <div class="item-input">';
                    text +=
                        '                                            <div class = "item-label" id="input' +
                        this.fExecutor +
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
                // if (temp) {
                //     $("#addVarContain124").show();
                //     if (
                //         thisUser.fTaskstarttime == undefined &&
                //         thisUser.fTaskstateid == "1"
                //     ) {
                //         $("#startTask").show();
                //     } else if (thisUser.fTaskstateid == "2") {
                //         if (thisUser.fSignintime == undefined) {
                //             $("#taskIn").show();
                //         } else {
                //             if (thisUser.fCreatetime == undefined) {
                //                 $("#doTask").show();
                //                 $("#submitTask").show();
                //                 localStorage.setItem("canClick", "true");
                //             } else {
                //                 if (thisUser.fExesituation == 8) {
                //                     $("#doTask").show();
                //                     $("#submitTask").show();
                //                     localStorage.setItem("canClick", "true");
                //                 } else {
                //                     $("#textareaDetail").attr("placeholder", "");
                //                     $("#textareaDetail").attr("readonly", true);
                //                     $("#textareaDetail").val(thisUser.fExplain);
                //                     $("#doDetail").show();
                //                     localStorage.setItem("canClick", "false");
                //                 }
                //             }
                //         }
                //     } else {
                //         $("#textareaDetail").attr("placeholder", "");
                //         $("#textareaDetail").attr("readonly", true);
                //         $("#textareaDetail").val(thisUser.fExplain);
                //         $("#doDetail").show();
                //         localStorage.setItem("canClick", "false");
                //     }
                // } else {
                //     localStorage.setItem("canClick", "false");
                //     if (loginUserid == taskchargerid) {
                //         //负责人按钮
                //         if (taskInfo.fTaskfinishdate == undefined) {
                //             //根据提交数配置
                //             if (isChangeReturnCount == userList.length) {
                //                 $("#chargeTask").css("width", "28%");
                //                 $("#chargeSubmit").css("width", "28%");
                //                 $("#chargeTask span").text(Operation["ui_chargeTask"]);
                //                 $("#chargeSubmit span").text(Operation["ui_chargeSubmit"]);
                //                 $("#chargeTask").show();
                //                 $("#chargeReturn").show();
                //                 $("#chargeSubmit").show();
                //             } else {
                //                 $("#chargeTask").css("width", "40%");
                //                 $("#chargeSubmit").css("width", "40%");
                //                 $("#chargeTask span").text(Operation["ui_doingDetail"]);
                //                 $("#chargeSubmit span").text(Operation["ui_taskSubmit"]);
                //                 $("#chargeTask").show();
                //                 $("#chargeSubmit").show();
                //             }
                //         } else {
                //             $("#doDetail").show();
                //         }
                //     } else {
                //         $("#doDetail").show();
                //     }
                // }

                //执行人管理按钮
                // if (loginUserid != taskchargerid && loginUserid != taskCreatId) {
                //     $("#clickManager").css("display", "none");
                // }

            }
        }
    );
}

getNetData();

//抢单按钮
$("#startTask").click(function () {
    $.showPreloader(Operation["ui_loading"]);
    var sb = '                <div class="outContain" style="width: auto;">';
    sb += '                  <div class="codeDiv">';
    sb +=
        '                    <span class="codename">手机号</span><input id="phoneInput" type="text" class="sendInput" value="15151853872" style="width: 8rem;margin-left: 0rem;" disabled';
    sb += '                      autocomplete="off">';
    sb += '                    <span class="icon codePhoneImg"></span>';
    sb += '                    <label class="errorInfo"></label>';
    sb += "                  </div>";
    sb += '                  <div class="codeDiv">';
    sb +=
        '                    <span class="codename">负 荷 </span><input id="canvasInput" type="text" class="sendInput" placeholder="请输入负荷(kW)"';
    sb += '                      autocomplete="off" style="width:8rem;">';
    // sb += '                    <span class="icon codeCanvasImg"></span>';
    //   sb +=
    // '                    <canvas id="canvas" width="100" height="38"></canvas>';
    sb += "                  </div>";
    sb += "";
    sb += '                  <div class="codeDiv">';
    sb +=
        '                    <span class="codename">验证码</span><input id="code" class="sendInput" type="text" placeholder="请输入短信验证码" autocomplete="off" style="width:4.1rem;"/>';
    sb += '                    <span class="icon codeMsgImg"></span>';
    sb +=
        '                    <input id="btnSendCode" type="button" class="btn btn-default" disabled value="获取验证码" style="width:3.8rem;" />';
    sb += "                  </div>";
    // sb += '                  <button class="btn" id="checkBtn" disabled>验证</button>';
    sb += "                </div>";
    // sb += '      </div>';
    var modal = $.modal({
        title: "手机动态验证码",
        text: "*填写验证码即必须按通知内容执行",
        afterText: sb,
        buttons: [{
                text: "取消"
            },
            {
                text: "确定",
                bold: true,
                onClick: function () {
                    var code = $("#code").val();
                    Substation.getDataByAjaxNoLoading(
                        "/checkSMSValid", {
                            code: code,
                            msgId: msgId
                        },
                        function (data) {
                            console.log(data);
                            if (data == true) {
                                controlClick();
                            } else {
                                if (data.msg) {
                                    $.toast(data.msg);
                                } else {
                                    $.toast("验证失败");
                                }
                            }
                            // sendCommand();
                        }
                    );
                }
            }
        ]
    });
    showModel2(userPhone);
    // $.swiper($(modal).find('.swiper-container'), {
    //   pagination: '.swiper-pagination'
    // });
    //   }
    // });
    // Substation.getDataByAjax("/taskStart", "taskId=" + taskID, function (data) {
    //     if (temp && isUseTrace == "1") {

    //     }
    // });
});

function showModel2(userPhone) {
    $("#phoneInput").val(userPhone);
    //   $.codeDraw($("#canvas"), $("#canvasInput"), function() {
    $.countInterval($("#phoneInput"), $("#btnSendCode"), function () {
        Substation.getDataByAjaxNoLoading("/sendSMSValid", {}, function (data) {
            msgId = data;
            //负荷
            targetload = $("#canvasInput").val();
            // $("#checkBtn").removeAttr('disabled');
            // $("#checkBtn").unbind('click').on('click', function () {
            //   var code = $("#code").val();
            //   Substation.getDataByAjaxNoLoading("/checkSMSValid", {}, function (data) {
            //     // sendCommand();
            //   })
            // })
        });
    });
    //   });
}

//点击抢单
function controlClick() {
    $.showPreloader(Operation["ui_loading"]);
    Substation.getDataByAjaxNoLoading(
        "/grabWorkOrder", {
            fTargetload: targetload,
            fWorkorderid: TaskNumber
        },
        function (data) {
            $.hidePreloader();
            $.toast(Operation["ui_successfully"]);
            location.reload();
        }
    );
}

// function trailStart() {
//   Substation.getDataByAjax("/trailStart", "taskId=" + taskID, function(
//     data
//   ) {});
// }

//开始任务
$("#taskIn").click(function () {
    $.showPreloader(Operation["ui_loading"]);
    Substation.getDataByAjaxNoLoading(
        "/startWorkOrder", {
            fWorkorderid: TaskNumber
        },
        function (data) {
            $.hidePreloader();
            $.toast(Operation["ui_successfully"]);
            location.reload();
        }
    );
    // var loc = "";
    // if (isIOS) {
    //     window.webkit.messageHandlers.getLocation.postMessage("");
    //     loc = localStorage.getItem("locationStrJS");
    // } else {
    //     loc = android.getLocation();
    //     getLocAndCheckIn(loc);
    // }
});

//签到方法
function getLocAndCheckIn(loc) {
    var lat = "";
    var lon = "";
    var addr = "";
    if (loc == undefined || !loc.length) {
        $.hidePreloader();
        $.toast(Operation["ui_localErrorTip"]);
        return;
    } else if (loc == "-1") {
        $.hidePreloader();
        $.toast(Operation["ui_gpsTip"]);
        return;
    } else {
        $.hidePreloader();
    }
    if (loc != "" && loc != null) {
        var array = loc.split(";");
        lat = array[0];
        lon = array[1];
        addr = array[2];
        if (addr == null || addr == "null") {
            addr = "";
        }
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
        param["fDistance"] = fDistance;
    }
    //                            alert(""+taskID+","+lon+","+lat+","+addr);
    Substation.postDataByAjax("/taskSingIn", param, function (data) {
        $.toast(Operation["ui_signSuccessTip"]);
        localStorage.removeItem("locationStrJS");
        location.reload();
    });
}

//关闭工单按钮事件
$(".doDetail").click(function () {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    $.confirm(Operation["ui_closeTaskTip1"], function () {
        var textDetail = $("#textareaDetail").val();
        if (!textDetail) {
            textDetail = "";
        }
        var param = {
            fWorkorderid: TaskNumber
        };
        // fExplain 执行情况
        Substation.getDataByAjax("/closeWorkOrderByID", param, function (data) {
            $.toast(Operation["ui_closeOrderSuccess"]);
            if (isAndroid) {
                android.goBack();
            } else {
                window.history.back();
            }
        });
    });
});

//提交按钮事件 结束任务
$("#submitTask").click(function () {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    $.confirm(Operation["ui_endTaskTip"], function () {
        var textDetail = $("#textareaDetail").val();
        if (!textDetail) {
            textDetail = "";
        }
        var param = {
            fWorkorderid: TaskNumber
        };
        // fExplain 执行情况
        Substation.getDataByAjax("/endWorkOrder", param, function (data) {
            location.reload();
            $.toast(Operation["ui_uploadTaskSuccessTip"]);
        });
    });
});

//负责人驳回任务
$("#chargeReturn").click(function () {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    $.confirm(Operation["ui_chargeReturnTip"], function () {
        var param;
        param = {
            fTaskid: taskID
        };
        Substation.getDataByAjax("/rejectTasksubmit", param, function (data) {
            if (isAndroid) {
                try {
                    android.removeSPItem(taskID);
                } catch (e) {
                    localStorage.removeItem(taskID);
                }
                android.refresh();
            } else {
                localStorage.removeItem(taskID);
                localStorage.setItem("need-refresh", "true");
            }
            location.reload();
        });
    });
});

//负责人提交任务
$("#chargeSubmit").click(function () {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    var comfirmTip = "";
    if (allCommit) {
        comfirmTip = Operation["ui_submitTaskTip"];
    } else {
        comfirmTip = Operation["ui_noAllCommit"] + Operation["ui_submitTaskTip"];
    }
    $.confirm(comfirmTip, function () {
        var param;
        param = {
            fTaskid: taskID
        };
        Substation.getDataByAjax("/submitTask", param, function (data) {
            $.toast(Operation["ui_submitTaskSuccessTip"]);
            if (isAndroid) {
                try {
                    android.removeSPItem(taskID);
                } catch (e) {
                    localStorage.removeItem(taskID);
                }
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
    if (isPush == "1") {
        //推送详情点击返回事件
        if (isAndroid) {
            android.goBack();
        } else if (isIOS) {
            window.webkit.messageHandlers.goBackiOS.postMessage("");
            //            window.history.back();
        }
    } else {
        if (isAndroid) {
            android.goBack();
        } else {
            window.history.back();
        }
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
    /*    localStorage.setItem("fSubname", "执行情况");
              localStorage.setItem("missionSubid", missionsubid);
              localStorage.setItem("missionPlaceCheckFormId", placeCheckFormId);*/
    localStorage.setItem("taskID", taskID);
    if (missionState != "3") {
        localStorage.setItem("hiddenBtn", "NO");
    } else {
        localStorage.setItem("hiddenBtn", "YES");
    }
    window.location.href = "RobNotificManager.html";
});

//查询轨迹
function selectTrace(getUserid, startTime, endTime) {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    if (startTime != "undefined" && startTime != "") {
        startTime = startTime.replace(/-/g, "/");
        startTime = new Date(startTime).getTime() / 1000;
        if (endTime == "undefined" || endTime == "") {
            endTime = startTime + 86400;
        } else {
            endTime = endTime.replace(/-/g, "/");
            endTime = new Date(endTime).getTime() / 1000;
            if (endTime - startTime > 86400) {
                endTime = startTime + 86400;
            }
        }
        //查询轨迹
        if (isAndroid) {
            android.showThisTrace(getUserid, startTime, endTime);
        } else if (isIOS) {
            var yydic = {
                entityName: getUserid,
                startTime: startTime,
                endTime: endTime
            };
            window.webkit.messageHandlers.pushYYGJView.postMessage(yydic);
        }
    } else {
        $.alert(Operation["ui_noStartTimeTraceTip"]);
    }
}

$("#goMap").click(function () {
    if (
        subLat != undefined &&
        subLat != "" &&
        subLon != undefined &&
        subLon != ""
    ) {
        if (isAndroid) {
            android.goToMap(subLat, subLon, missionsubname);
        } else if (isIOS) {
            var locParam = {
                Latitude: subLat,
                Longitude: subLon,
                locName: missionsubname
            };
            window.webkit.messageHandlers.pushMapSelect.postMessage(locParam);
        }
    } else {
        $.toast(Operation["ui_nolocation"]);
    }
});

//跳转视频
$("#jumpVideo").click(function () {
    if (isAndroid) {
        android.videoWatch(missionsubid);
    } else if (isIOS) {
        var subParam = {
            Subid: missionsubid,
            Subname: missionsubname
        };
        window.webkit.messageHandlers.pushVideoListVC.postMessage(subParam);
    }
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
        $(".buttonsEvent").hide();
    }
    if ($(window).height() >= h) {
        $(".buttonsEvent").show();
    }
    if (
        document.activeElement.tagName == "INPUT" ||
        document.activeElement.tagName == "TEXTAREA"
    ) {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

function callPhone(phoneNum) {
    if (isAndroid) {
        android.callPhone(phoneNum);
    } else {
        var param = {
            phone: phoneNum
        };
        window.webkit.messageHandlers.takePhone.postMessage(param);
    }
}

function gotoMissionTimeAxis(userid, startTime, endTime) {
    //    var taskID = localStorage.getItem("taskID");
    // localStorage.setItem("subName", missionsubname);
    if (startTime != undefined && startTime != "") {
        startTime = startTime.replace(/-/g, "/");
        startTime = new Date(startTime).getTime() / 1000;
        if (endTime == "undefined" || endTime == "") {
            endTime = startTime + 86400;
        } else {
            endTime = endTime.replace(/-/g, "/");
            endTime = new Date(endTime).getTime() / 1000;
            if (endTime - startTime > 86400) {
                endTime = startTime + 86400;
            }
        }

        localStorage.setItem("timeUserId", userid);
        localStorage.setItem("subLat", subLat);
        localStorage.setItem("subLon", subLon);
        localStorage.setItem("YYUserId", userid);
        localStorage.setItem("YYStartTime", startTime);
        localStorage.setItem("YYEndTime", endTime);
        // if (isAndroid) {
        var chargePerson = 0;
        if (loginUserid == taskchargerid) {
            chargePerson = 1;
        }
        //     android.goToInAxis();
        // } else {
        window.location.href =
            "missionTimeAxis.html?ischargePerson=" + chargePerson;
    } else {
        // if (isAndroid) {
        var chargePerson = 0;
        if (loginUserid == taskchargerid) {
            chargePerson = 1;
        }
        //     android.goToInAxis();
        // } else {
        window.location.href =
            "missionTimeAxis.html?ischargePerson=" + chargePerson;
    }

    // }
}

$.init();