jQuery(document).ready(function () {
    // $(function () {
    var titlename = localStorage.getItem("fSubname");
    $("#titleContent").text(titlename);

    //任务id
    var taskID = localStorage.getItem("taskID");
    //巡检单id
    var placeCheckFormId = localStorage.getItem("missionPlaceCheckFormId");
    //巡检的变电所id
    var missionsubid = localStorage.getItem("missionSubid");
    //获得选取的重派任务人员
    var selectPersons = localStorage.getItem("selectPersons");
    // window.onpageshow = function (event) {
    //     if (event.persisted) {

    //         window.location.reload();
    //     }
    // }
    var taskTobeSubmitArr = [];

    window.addEventListener(
        "pageshow",
        function (event) {
            if (localStorage.getItem("need-refresh")) {
                location.reload();
                localStorage.removeItem("need-refresh");
                selectPersons = localStorage.getItem("selectPersons");
                if (!selectPersons || selectPersons == undefined) {} else {
                    var selectp = JSON.parse(selectPersons);
                    if (selectp && selectp.length > 0) {
                        var nameStr;
                        var nameArr = [];
                        $(selectp).each(function (index, obj) {
                            nameArr.push(this.userName);
                        });
                        nameStr = nameArr.join(",");
                        $("#selectPep").html(nameStr);
                    }
                }
            }
        },
        false
    );

    // fCreateTime 提交时间
    // fExplain 执行情况
    function getNetData() {
        Substation.getDataByAjax("/managerTaskUser", "taskId=" + taskID, function (
            data
        ) {
            if (data.hasOwnProperty("taskUserList") && data.taskUserList.length > 0) {
                $(data.taskUserList).each(function () {
                    var creatTime = "";
                    var explain = "";
                    var userName = "";
                    if (this.hasOwnProperty("fCreateTime")) {
                        creatTime = this.fCreateTime;
                    }
                    if (this.hasOwnProperty("fExplain")) {
                        explain = this.fExplain;
                    }
                    if (this.hasOwnProperty("userName")) {
                        userName = this.userName;
                    }
                    var text = "";
                    text += "<ul>";
                    text += "                            <li>";
                    text +=
                        '                                <div class=" showDiv item-content">';
                    text +=
                        '                                    <div class="item-inner">';
                    text +=
                        '                                        <div class="item-title label">执行人:</div>';
                    text +=
                        '                                        <div class="item-input">';
                    text +=
                        '                                            <input type="text" readonly="readonly" class="valueInput" value="' +
                        userName +
                        '"';
                    text +=
                        '                                                name="number" validator="required">';
                    text += "                                        </div>";
                    text += "                                    </div>";
                    text += "                                </div>";
                    text += "                            </li>";
                    text += "                            <li>";
                    text +=
                        '                                <div class="showDiv item-content">';
                    text +=
                        '                                    <div class="item-inner">';
                    text +=
                        '                                        <div class="item-title label">状态:</div>';
                    text +=
                        '                                        <div class="item-input"><input type="text" readonly="readonly"';
                    text +=
                        '                                                class="valueInput" id="input' +
                        this.fUserid +
                        '" value="' +
                        this.taskState +
                        '" name="sender" validator="required"';
                    text +=
                        '                                                style="color:red">';
                    text += "                                        </div>";
                    text += "                                    </div>";
                    text += "                                </div>";
                    text += "                            </li>";
                    text += "                            <li>";
                    text +=
                        '                                <div class="showDiv item-content">';
                    text +=
                        '                                    <div class="item-inner">';
                    text +=
                        '                                        <div class="item-title label">提交时间:</div>';
                    text +=
                        '                                        <div class="item-input"><input type="text" readonly="readonly"';
                    text +=
                        '                                                class="valueInput" value="' +
                        creatTime +
                        '" name="number" validator="required">';
                    text += "                                        </div>";
                    text += "                                    </div>";
                    text += "                                </div>";
                    text += "                            </li>";
                    text += "                            <li>";
                    text +=
                        '                                <div class="showDiv item-content">';
                    text +=
                        '                                    <div class="item-inner">';
                    text +=
                        '                                        <div class="item-title label">执行情况:</div>';
                    text +=
                        '                                        <div class="item-input"><input type="text" readonly="readonly"';
                    text +=
                        '                                                class="valueInput" value="' +
                        explain +
                        '" name="number" validator="required">';
                    text += "                                        </div>";
                    text += "                                    </div>";
                    text += "                                </div>";
                    text += "                            </li>";
                    text +=
                        "                            <!-- 除自己外 且状态在执行中的任务 -->";
                    text += "                            <li>";
                    text +=
                        '                                <div class="showDiv item-content">';
                    text +=
                        '                                    <div class="item-inner">';
                    text +=
                        '                                        <div class="item-title label getUserid">';
                    text += "                                            代提交任务:";
                    text += "                                        </div>";
                    text +=
                        '                                        <div class="item-input">';
                    text +=
                        '                                            <label class="label-switch">';
                    text +=
                        '                                                <input type="checkbox" id="check' + this.fUserid + '" value="no" name="' +
                        this.fUserid +
                        '">';
                    text +=
                        '                                                <div class="checkbox"></div>';
                    text += "                                            </label>";
                    text += "                                        </div>";
                    text += "                                    </div>";
                    text += "                                </div>";
                    text += "                            </li>";
                    text += "                        </ul>";
                    $("#missionDetail").append(text);

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
                if (selectPersons && selectPersons.length > 0) {
                    var selectp = JSON.parse(selectPersons);
                    if (selectp && selectp.length > 0) {
                        var nameStr;
                        var nameArr = [];
                        $(selectp).each(function (index, obj) {
                            nameArr.push(this.userName);
                        });
                        nameStr = nameArr.join(",");
                        $("#selectPep").html(nameStr);
                    }
                }
                $(":checkbox").click(function () {
                    if ($(this).val() == "no") {
                        $(this).attr("checked", true);
                        // $("#" + this.name).attr("checked", true);
                        $(this).attr("value", "yes");
                        var user = this.name;
                        taskTobeSubmitArr.push(user);
                    } else {
                        $(this).attr("checked", false);
                        // $("#" + this.name).attr("checked", false);
                        $(this).attr("value", "no");
                        // var user = {
                        //     "userId": $(this).attr("id"),
                        //     "userName": this.name
                        // };
                        if (taskTobeSubmitArr.length > 0) {
                            var indexID;
                            var userID = this.name;
                            $(taskTobeSubmitArr).each(function (index, obj) {
                                if (this.userId == userID) {
                                    indexID = index;
                                }
                            });
                            taskTobeSubmitArr.splice(indexID, 1);
                        }
                    }
                });
            }
        });
    }

    getNetData();

    //执行任务按钮事件
    // $("#carryOut").click(function () {
    //     if (this.name == "true") {
    //         alert("执行任务前，请先签到。");
    //     } else {
    //         localStorage.setItem("missionSubid", missionsubid);
    //         localStorage.setItem("missionPlaceCheckFormId", placeCheckFormId);
    //         localStorage.setItem("missiontaskID", taskID);
    //         if (missionType == "patrol") {
    //             //巡检任务
    //             localStorage.setItem("fSubname", "执行情况");
    //             window.location.href = "patrolContent.html";
    //         } else if (missionType == "scene") {
    //             //现场交接任务
    //             localStorage.setItem("fSubname", "执行情况");
    //             window.location.href = "missionScene.html";
    //         } else if (missionType == "defect") {
    //             //缺陷整改
    //             localStorage.setItem("fSubname", "执行情况");
    //             window.location.href = "missionDefect.html";
    //         }
    //     }
    // });

    //46.总任务提交按钮事件
    // userIds 1,2,3
    $("#submitTo").click(function () {
        var param;
        if (taskTobeSubmitArr.length > 0) {
            var arrStr = taskTobeSubmitArr.join(',');
            param = {
                "fTaskid": taskID,
                "userIds": arrStr
            };
        } else {
            param = {
                "fTaskid": taskID
            };
        }

        Substation.getDataByAjax("/submitTask", param, function (
            data
        ) {
            localStorage.removeItem("selectPersons");
            window.history.go(-2);
        });
    });

    //52.重派任务
    $("#reassign").click(function () {
        var selectp = JSON.parse(selectPersons);
        if (selectp && selectp.length > 0) {
            var idStr;
            var idArr = [];
            $(selectp).each(function (index, obj) {
                idArr.push(this.userId);
            });
            idStr = idArr.join(",");
            param = {
                "fTaskid": taskID,
                "userIds": idStr
            };
            Substation.getDataByAjax("/reReleaseTask", param, function (
                data
            ) {
                localStorage.removeItem("selectPersons");
                window.history.go(-2);
            });
        }
    });

    //重派选人页面
    $("#selectPep").click(function () {
        window.location.href = "selectPerson.html";
    });

    $(".pull-left.click_btn").click(function () {
        localStorage.removeItem("selectPersons");
        window.history.back();
    });
    //管理页面
    // $("#clickManager").click(function () {
    //     localStorage.setItem("fSubname", "执行情况");
    //     localStorage.setItem("missionSubid", missionsubid);
    //     localStorage.setItem("missionPlaceCheckFormId", placeCheckFormId);
    //     localStorage.setItem("missiontaskID", taskID);
    //     window.location.href = "missionManager.html";
    // });
});