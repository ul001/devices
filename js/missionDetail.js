jQuery(document).ready(function () {
    // $(function () {
    var titlename = localStorage.getItem("fSubname");
    $("#titleContent").text(titlename);

    var showmissionBtn = localStorage.getItem("showType");


    if (showmissionBtn == "missionDoing") {
        localStorage.setItem("canClick", true);
        var missionType = localStorage.getItem("missionType");
        if (missionType == 0) {
            var showStr =
                '<div class="row buttonsEvent"> <div class = "col-33" id = "checkInCss"> <a href = "# " class = "button button-big button-fill bottom-btn" id = "checkIn">现场签到</a> </div> <div class = "col-33" id = "carryOutCss"> <a href = "# " class = "button button-big button-fill bottom-btn" id = "carryOut">执行任务</a> </div> <div class = "col-33" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> </div>';
            $("#addVarContain126").append(showStr);
            $("#carryOut").attr("name", "true");
        } else {
            localStorage.setItem("canClick", true);
            var showStr =
                '<div class="row buttonsEvent">  <div class = "col-50" id = "carryOutCss"> <a href = "# " class = "button button-big button-fill bottom-btn" id = "carryOut">执行任务</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> ';
            $("#addVarContain126").append(showStr);
            $("#carryOut").attr("name", "true");
        }
    } else if (showmissionBtn == "missionFinish") {
        localStorage.setItem("canClick", false);
        $("#clickManager").css("display", "none");
        var showstr =
            '<div class="row buttonsEvent"> <div class = "col-100" id = "checkInCss" > <a href = "# "class = "button button-big button-fill bottom-btn" id = "carryOut" >查看任务</a> </div> </div>';
        $("#addVarContain126").append(showstr);
        $("#carryOut").attr("name", "false");
    } else {
        localStorage.setItem("canClick", true);
        var showStr =
            '<div class="row buttonsEvent">  <div class = "col-50" id = "carryOutCss"> <a href = "# " class = "button button-big button-fill bottom-btn" id = "carryOut">执行任务</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> ';
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

    var missionDetail = "";

    function getNetData() {
        Substation.getDataByAjax(
            "/selectTaskByTaskId",
            "taskId=" + taskID,
            function (data) {
                if (data.hasOwnProperty("placeCheckFormId")) {
                    placeCheckFormId = data.placeCheckFormId;
//                    $("#checkIn").removeClass("col-33");
//                    $("#checkIn").hide();
//                    $("#carryOutCss").removeClass("col-33");
//                    $("#submitToCss").removeClass("col-33");
//                    $("#carryOutCss").toggleClass("col-50");
//                    $("#submitToCss").toggleClass("col-50");
//                    $("#carryOut").attr("name", "false");
//                    $("#submitTo").attr("name", "true");
                }
                var taskInfo = data.taskInfo;
                var userList = data.taskUserList;
                if (taskInfo) {
                    missionsubid = taskInfo.fSubid;
                    $("#missionId").html(taskInfo.fTaskid);
                    $("#missionType").html(taskInfo.fTasktypeexplain);
                    $("#missionName").html(taskInfo.fTaskname);
                    $("#createName").html(taskInfo.fTaskcreateusername);
                    $("#chargerName").html(taskInfo.fTaskchargername);
                    if (taskInfo.hasOwnProperty("fTaskcheckername")) {
                        if (taskInfo.fTaskcheckername != "" && taskInfo.fTaskcheckername != null) {
                            $("#checkerDiv").css("display", "flex");
                            $("#checkerName").html(taskInfo.fTaskcheckername);
                        }
                    }
                    $("#createTime").html(taskInfo.fStartdate);
                    $("#finishTime").html(taskInfo.fDeadlinedate);
                    var missionContent =
                        '<textarea readonly="readonly">' +
                        taskInfo.fTaskcontent +
                        "</textarea>";
                    $("#missionCont").append(missionContent);
                    missionTypeid = taskInfo.fTasktypeid;
                    taskchargerid = taskInfo.fTaskchargerid;
                    var temp = false;
                    $(userList).each(function () {
                        if (this.fUserid == Substation.loginUserid) {
                            temp = true;
                            return false;
                        }
                    });
                    if (taskchargerid != Substation.loginUserid) {
                        $("#clickManager").css("display", "none");
                    }
                    if (!temp) {
                        var showstr="";
                        if (missionTypeid == 1) {
                            showstr = '<div class="row buttonsEvent"> <div class = "col-100" id = "checkInCss" > <a href = "# "class = "button button-big button-fill bottom-btn" id = "carryOut" >查看巡检项</a> </div> </div>';
                            $("#addVarContain126").html(showstr);
                            $("#carryOut").attr("name", "false");
                            localStorage.setItem("canClick", false);
                        }
/*                        else{
                            showstr = '<div class="row buttonsEvent"> <div class = "col-100" id = "checkInCss" > <a href = "# "class = "button button-big button-fill bottom-btn" id = "carryOut" >查看缺陷项</a> </div> </div>';
                        }*/
                    }
                    if (showmissionBtn != "missionFinish") {
                        if (missionTypeid != 1) {
                            var showStr =
                                '<div class="row buttonsEvent">  <div class = "col-50" id = "carryOutCss"> <a href = "# " class = "button button-big button-fill bottom-btn" id = "carryOut">执行任务</a> </div> <div class = "col-50" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> ';
                            $("#addVarContain126").html(showStr);
                            $("#carryOut").attr("name", "false");
                            $("#submitTo").attr("name", "true");
                            localStorage.setItem("canClick", true);
                        }
                    }
                    //现场签到按钮事件
                    $("#checkIn").click(function () {
                        //iOS安卓基础传参
                        var u = navigator.userAgent,
                          app = navigator.appVersion;
                        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
                        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
                        var loc="";
                        if(isIOS){

                        }else{
                            loc = android.getLocation();
                        }
                        var lat = "";
                        var lon = "";
                        var addr = "";
                        if(loc!=""&&loc!=null){
                            var array = loc.split(";");
                            lat = array[0];
                            lon = array[1];
                            addr = array[2];
//                            alert(lat+"\n"+lon+"\n"+addr);
                        }
                        var param = {taskId:taskID,fLongitude:lon,fLatitude:lat,fLocation:addr};
//                        alert(""+taskID+","+lon+","+lat+","+addr);
                        Substation.postDataByAjax("/taskSingIn", param, function (data) {
//                                location.reload();
                            $.toast("签到成功！");
                            $("#checkIn").removeClass("col-33");
                            $("#checkIn").hide();
                            $("#carryOutCss").removeClass("col-33");
                            $("#submitToCss").removeClass("col-33");
                            $("#carryOutCss").toggleClass("col-50");
                            $("#submitToCss").toggleClass("col-50");
                            $("#carryOut").attr("name", "false");
                        });
                    });

                    //提交按钮事件
                    $("#submitTo").click(function () {
                        if (this.name != "true") {
                            $.toast("提交任务前，请先签到。");
                        } else {
                            var textDetail = $("#textareaDetail").val();
                            if (!textDetail) {
                                textDetail = "";
                            }
                            var param = {
                                fTaskid: taskID,
                                fExplain: textDetail
                            };
                            if (missionTypeid == 3) {
                                Substation.getDataByAjax("/submitTask", param, function (data) {
                                    /*localStorage.setItem("need-refresh", true);
                                    window.history.back();*/
                                    window.location.href = "todoItems.html";
                                });
                            } else {
                                // fExplain 执行情况
                                Substation.getDataByAjax("/submitUserTask", param, function (data) {
                                    /*localStorage.setItem("need-refresh", true);
                                    window.history.back();*/
                                    window.location.href = "todoItems.html";
                                });
                            }
                        }
                    });

                    //执行任务按钮事件
                    $("#carryOut").click(function () {
                        if (this.name == "true") {
                            $.toast("执行任务前，请先签到。");
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


    $(".pull-left.click_btn").click(function () {
        //localStorage.setItem("need-refresh", true);
        /*window.history.back();*/
        window.location.href = "todoItems.html";
    });

    //管理页面
    $("#clickManager").click(function () {
        localStorage.setItem("fSubname", "执行情况");
        localStorage.setItem("missionSubid", missionsubid);
        localStorage.setItem("missionPlaceCheckFormId", placeCheckFormId);
        localStorage.setItem("missiontaskID", taskID);
        window.location.href = "missionManager.html";
    });

    $.init();
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