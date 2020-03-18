jQuery(document).ready(function () {
    // $(function () {
    var titlename = localStorage.getItem("fSubname");
    $("#titleContent").text(titlename);
    //alert("1");
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

    var showmissionBtn = localStorage.getItem("showType");
    var missionType = localStorage.getItem("missionType");
    if (showmissionBtn == "missionDoing") {
        localStorage.setItem("canClick", true);
        if (missionType == 0) {
            var showStr =
                '<div class="row buttonsEvent"> <div class = "col-33" id = "checkInCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "checkIn2"><i class="icon icon-checkIn"></i>' + Operation['ui_register'] + '</a></div> <div class = "col-33" id = "carryOutCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut"><i class="icon icon-missionAction"></i>' + Operation['ui_Implement'] + '</a> </div> <div class = "col-33" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo"><i class="icon icon-upload"></i>' + Operation['ui_submit'] + '</a> </div></div>';
            $("#addVarContain126").html(showStr);
            $("#carryOut").attr("name", "true");
            $("#submitTo").attr("name", "true");
        } else {
            localStorage.setItem("canClick", true);
            var showStr =
                '<div class="row buttonsEvent"> <div class = "col-50" id = "carryOutCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut"><i class="icon icon-missionAction"></i>' + Operation['ui_Implement'] + '</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo"><i class="icon icon-upload"></i>' + Operation['ui_submit'] + '</a> </div>  ';
            $("#addVarContain126").append(showStr);
            $("#carryOut").attr("name", "false");
        }
    } else if (showmissionBtn == "missionFinish") {
        localStorage.setItem("canClick", false);
        // if (missionType != 3) {
        //     $("#clickManager").css("display", "none");
        // }
        var showstr =
            '<div class="row buttonsEvent"> <div class = "col-80" id = "checkFinishInCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut" ><i class="icon icon-missionDetail"></i>' + Operation['ui_ImplementDetail'] + '</a> </div> </div>';
        $("#addVarContain126").append(showstr);
        $("#carryOut").attr("name", "false");
    } else {
        localStorage.setItem("canClick", true);
        var showStr =
            '<div class="row buttonsEvent"> <div class = "col-50" id = "carryOutCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut"><i class="icon icon-missionAction"></i>' + Operation['ui_Implement'] + '</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo"><i class="icon icon-upload"></i>' + Operation['ui_submit'] + '</a> </div>  ';
        $("#addVarContain126").append(showStr);
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
    //任务负责人 fTaskchargerid
    var taskchargerid;

    var taskCreatId;

    var missionDetail = "";

    function getNetData() {
        Substation.getDataByAjax(
            "/selectTaskByTaskId",
            "taskId=" + taskID,
            function (data) {
                if (data.hasOwnProperty("placeCheckFormId")) {
                    placeCheckFormId = data.placeCheckFormId;
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
                var taskInfo = data.taskInfo;
                var userList = data.taskUserList;
                var subLon = taskInfo.fLongitude;
                var subLat = taskInfo.fLatitude;
                if (taskInfo) {
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
                    var thisTempState = 0;

                    //缺陷总数
                    $("#TotalDefectNum").html(taskInfo.deviceProblemSum);
                    if (taskInfo.deviceProblemSum > 0) {
                        $("#TotalDefectNum").css("color", "red");
                        var upLoadClicktag = true;
                        $("#TotalDefectNum").click(function () {
                            if(!upLoadClicktag){
                                return;
                            }
                            upLoadClicktag = false;
                            setTimeout(function() {
                                upLoadClicktag = true;
                            }, 1000);
                            //缺陷整改
                            localStorage.setItem("taskID", taskID);
                            localStorage.setItem("missionTypeid", missionTypeid);
                            if (missionTypeid == 3) {
                                if ($("#carryOut").attr("name") == "true") {
                                    $.toast("请先签到。");
                                    return;
                                } else {
                                    localStorage.setItem("canClick", true);
                                }
                            } else {
                                localStorage.setItem("canClick", false);
                            }
                            window.location.href = "defectRectification.html";
                        });
                    }
                    //缺陷未处理数
                    $("#Unprocessednumber").html(taskInfo.deviceProblemUnresolved);
                    if (taskInfo.deviceProblemUnresolved > 0) {
                        $("#Unprocessednumber").css("color", "red");
                        var upLoadClicktag = true;
                        $("#Unprocessednumber").click(function () {
                            if(!upLoadClicktag){
                                return;
                            }
                            upLoadClicktag = false;
                            setTimeout(function() {
                                upLoadClicktag = true;
                            }, 1000);
                            //缺陷整改
                            localStorage.setItem("taskID", taskID);
                            localStorage.setItem("missionTypeid", missionTypeid);
                            if (missionTypeid == 3) {
                                if ($("#carryOut").attr("name") == "true") {
                                    $.toast("请先签到。");
                                    return;
                                } else {
                                    localStorage.setItem("canClick", true);
                                }
                            } else {
                                localStorage.setItem("canClick", false);
                            }
                            window.location.href = encodeURI("defectRectification.html" + "?value=0");;
                        });
                    }
                    //任务执行结果
                    if (taskInfo.taskResult == 3) {
                        $("#TotalDefect").html("按时完成");
                        $("#TotalDefect").css("color", "springgreen");
                    } else if (taskInfo.taskResult == 4) {
                        $("#TotalDefect").html("超时完成");
                        $("#TotalDefect").css("color", "red");
                    } else if (taskInfo.taskResult == 5) {
                        $("#TotalDefect").html("未完成");
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
                    //                    if (taskchargerid != Substation.loginUserid && taskCreatId != Substation.loginUserid) {
                    //                        $("#clickManager").css("display", "none");
                    //                    } else {
                    //                        $("#addVarContain124").css("display", "none");
                    //                    }


                    /*                    if (missionTypeid != 1) {
                                  $("#addVarContain125").css("display", "none");
                              }*/
                    if (showmissionBtn != "missionFinish") {
                        if (!temp) {
                            var showstr = "";
                            if (taskchargerid != Substation.loginUserid) {
                                showstr =
                                    '<div class="row buttonsEvent"> <div class = "col-80" id = "checkFinishInCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut" ><i class="icon icon-missionDetail"></i>' + Operation['ui_ImplementDetail'] + '</a> </div> </div>';
                                $("#addVarContain126").html(showstr);
                                $("#carryOut").attr("name", "false");
                                localStorage.setItem("canClick", false);
                            } else {
                                showstr =
                                    '<div class="row buttonsEvent"> <div class = "col-50" id = "checkInCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut" ><i class="icon icon-missionDetail"></i>' + Operation['ui_ImplementDetail'] + '</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo"><i class="icon icon-upload"></i>' + Operation['ui_submitTask'] + '</a> </div>';
                                $("#addVarContain126").html(showstr);
                                $("#carryOut").attr("name", "false");
                                localStorage.setItem("canClick", false);
                            }
                            /*                        else{
                                                                      showstr = '<div class="row buttonsEvent"> <div class = "col-80" id = "checkFinishInCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut" >查看缺陷项</a> </div> </div>';
                                                                  }*/
                        } else {
                            if (thisTempState == 1) {
                                localStorage.setItem("canClick", true);
                                var showStr =
                                    '<div class="row buttonsEvent"> <div class = "col-33" id = "checkInCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "checkIn2"><i class="icon icon-checkIn"></i>' + Operation['ui_register'] + '</a></div> <div class = "col-33" id = "carryOutCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut"><i class="icon icon-missionAction"></i>' + Operation['ui_Implement'] + '</a> </div> <div class = "col-33" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo"><i class="icon icon-upload"></i>' + Operation['ui_submit'] + '</a></div></div>';
                                $("#addVarContain126").html(showStr);
                                $("#carryOut").attr("name", "true");
                                $("#submitTo").attr("name", "true");
                            } else {
                                localStorage.setItem("canClick", true);
                                var showStr =
                                    '<div class="row buttonsEvent"> <div class = "col-50" id = "carryOutCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut"><i class="icon icon-missionAction"></i>' + Operation['ui_Implement'] + '</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo"><i class="icon icon-upload"></i>' + Operation['ui_submit'] + '</a> </div>  ';
                                $("#addVarContain126").html(showStr);
                                $("#carryOut").attr("name", "false");
                            }
                        }
                        /*                        if (missionTypeid != 1) {
                                                                var showStr =
                                                                    '<div class="row buttonsEvent">  <div class = "col-50" id = "carryOutCss"> <a href = "#" class = "button button-big button-fill bottom-btn" id = "carryOut">执行任务</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> ';
                                                                $("#addVarContain126").html(showStr);
                                                                $("#carryOut").attr("name", "false");
                                                                $("#submitTo").attr("name", "false");
                                                                localStorage.setItem("canClick", true);
                                                            }*/
                    }

                    if (taskchargerid != Substation.loginUserid && taskCreatId != Substation.loginUserid) {
                        $("#clickManager").css("display", "none");
                    } else {
                        $("#addVarContain124").css("display", "none");
                    }
                    if (missionType == 3) {
                        //办毕处理
                        $(data.taskUserList).each(function () {
                            if (Substation.loginUserid == this.fUserid) {
                                var explain = this.fExplain;
                                if (explain != undefined) {
                                    $("#textareaDetail").html(explain);
                                }
                            }
                        });
                        $("#textareaDetail").attr("placeholder", "");
                        $("#textareaDetail").attr("readonly", true);
                        // $("#addVarContain124").css("display", "none");
                    }
                    //现场签到按钮事件
                    $("#checkIn2").click(function () {
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
                            //                            alert(lat+"\n"+lon+"\n"+addr);
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
                            if (isAndroid) {
                                android.refresh();
                            } else {
                                localStorage.setItem("need-refresh", "true");
                            }
                            location.reload();
                            $.toast("签到成功！");
                            localStorage.removeItem("locationStrJS");
                            //                            $("#checkIn").removeClass("col-33");
                            //                            $("#checkIn").hide();
                            //                            $("#carryOutCss").removeClass("col-33");
                            //                            $("#submitToCss").removeClass("col-33");
                            //                            $("#carryOutCss").toggleClass("col-50");
                            //                            $("#submitToCss").toggleClass("col-50");
                            //                            $("#carryOut").attr("name", "false");
                        });
                    });

                    //提交按钮事件
                    $("#submitTo").click(function () {
                        if (taskchargerid != Substation.loginUserid) {
                            if (this.name == "true") {
                                $.toast("提交任务前，请先签到。");
                            } else {
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
                                        localStorage.removeItem(taskID);
                                        if (isAndroid) {
                                            //                                            android.removeSPItem(taskID);
                                            android.refresh();
                                            android.goBack();
                                        } else {
                                            localStorage.setItem("need-refresh", "true");
                                            window.history.back();
                                        }
                                    });
                                });
                            }
                        } else {
                            $.confirm("确定要提交并结束任务吗？", function () {
                                var param;
                                param = {
                                    fTaskid: taskID
                                };
                                Substation.getDataByAjax("/submitTask", param, function (data) {
                                    localStorage.removeItem(taskID);
                                    if (isAndroid) {
                                        //                                        android.removeSPItem(taskID);
                                        android.refresh();
                                        android.goBack();
                                    } else {
                                        localStorage.setItem("need-refresh", "true");
                                        window.history.back();
                                    }
                                });
                            });
                        }
                    });

                    var upLoadClicktag = true;
                    //执行任务按钮事件
                    $("#carryOut").click(function () {
                        if(!upLoadClicktag){
                            return;
                        }
                        upLoadClicktag = false;
                        setTimeout(function() {
                            upLoadClicktag = true;
                        }, 1000);
                        if (this.name == "true") {
                            $.toast("执行任务前，请先签到。");
                        } else {
                            localStorage.setItem("fSubid", missionsubid);
                            localStorage.setItem("fPlacecheckformid", placeCheckFormId);
                            localStorage.setItem("taskID", taskID);
                            if (missionTypeid == 1) {
                                //巡检任务
                                localStorage.setItem("fSubname", "执行情况");
                                if ($("#carryOut").text() == "执行明细") {
                                    window.location.href = "patrolContent.html";
                                } else {
                                    var attion = Operation['ui_attention'];
                                    var attiondetail = Operation['ui_executionprompt'];
                                    $.confirm(
                                        attiondetail,
                                        attion,
                                        function () {
                                            window.location.href = "patrolContent.html";
                                        }
                                    );
                                }
                            } else if (missionTypeid == 2) {
                                //现场交接任务
                                localStorage.setItem("fSubname", "执行情况");
                                window.location.href = "missionScene.html";
                            } else if (missionTypeid == 3) {
                                //缺陷整改
                                localStorage.setItem("missionTypeid", missionTypeid);
                                localStorage.setItem("fSubname", "执行情况");
                                window.location.href = "defectRectification.html";
                            } else {
                                $.toast("fTasktypeid=null，未知任务类型");
                            }
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
                            taskStateName = "未签到";
                        } else if (this.fExesituation == 8) {
                            taskStateName = "已签到";
                        } else if (this.fExesituation == 9) {
                            taskStateName = "已提交";
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
                        if (this.fTaskstateid == 1) {
                            $("#input" + this.fUserid).css("color", "gray");
                        } else if (this.fTaskstateid == 2) {
                            $("#input" + this.fUserid).css("color", "blue");
                        } else if (this.fTaskstateid == 3 || this.fTaskstateid == 4) {
                            if (this.fExesituation == 7) {
                                $("#input" + this.fUserid).css("color", "gray");
                            } else if (this.fExesituation == 8) {
                                $("#input" + this.fUserid).css("color", "blue");
                            } else if (this.fExesituation == 9) {
                                $("#input" + this.fUserid).css("color", "springgreen");
                            } else {
                                $("#input" + this.fUserid).css("color", "red");
                            }
                        } else {
                            $("#input" + this.fUserid).css("color", "red");
                        }
                    });
                }
            }
        );
    }

    getNetData();

    $(".pull-left.click_btn").click(function () {
        //        localStorage.setItem("need-refresh", "true");
        if (isIOS) {
            window.history.back();
        } else {
            android.goBack();
        }
        //        window.location.href = "todoItems.html";
    });

    var upLoadClicktag = true;
    //管理页面
    $("#clickManager").click(function () {
        if(!upLoadClicktag){
            return;
        }
        upLoadClicktag = false;
        setTimeout(function() {
            upLoadClicktag = true;
        }, 1000);
        localStorage.setItem("fSubname", "执行情况");
        localStorage.setItem("missionSubid", missionsubid);
        localStorage.setItem("missionPlaceCheckFormId", placeCheckFormId);
        localStorage.setItem("taskID", taskID);
        if (taskCreatId != Substation.loginUserid && missionType != 3) {
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

    $.init();
});

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

//  function alinkClick() {
//      localStorage.setItem("fSubname", "执行情况");
//      window.location.href = "missionManager.html";
//  }

/*var geolocation = new BMap.Geolocation();
// 开启辅助定位
//android.openSDKLocation();
geolocation.enableSDKLocation();
geolocation.getCurrentPosition(function(r){
    if (this.getStatus() === BMAP_STATUS_SUCCESS) {
        alert('您的位置：'+r.point.lng+','+r.point.lat);
        geolocation.disableSDKLocation();
//        android.closeSDKLocation();
    }else {
        alert('failed'+this.getStatus());
    }
},{enableHighAccuracy:true});*/