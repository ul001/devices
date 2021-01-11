// $(function () {
//iOS安卓基础传参
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var isAllCommit = true;
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
};

//任务id
var taskID = localStorage.getItem("taskID");
/*//巡检单id
var placeCheckFormId = localStorage.getItem("missionPlaceCheckFormId");
//巡检的变电所id
var missionsubid = localStorage.getItem("missionSubid");*/
//获得选取的重派任务人员
var selectPersons = localStorage.getItem("selectPersons");
// window.onpageshow = function (event) {
//     if (event.persisted) {

//         window.location.reload();
//     }
// }
var taskTobeSubmitArr = [];

var hiddenBtn = localStorage.getItem("hiddenBtn");
//if (hiddenBtn == "YES") {
//    $("#addVarContain126").css('display', 'none');
//} else {
//    $("#addVarContain126").css('display', 'block');
//}

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

// fCreatetime 提交时间
// fExplain 执行情况
function getNetData() {
    Substation.getDataByAjax("/getWorkOrderDetail", "fWorkorderid=" + taskID, function (
        data
    ) {
        if (data.hasOwnProperty("detail")) {
            var detaildata = data.detail;
            if (detaildata.hasOwnProperty("tDevWorkOrderDetails") && detaildata.tDevWorkOrderDetails.length > 0) {
                $(detaildata.tDevWorkOrderDetails).each(function () {
                    var creatTime = "-";
                    var explain = "-";
                    var userName = "-";
                    var signTime = "-";
                    var location = "-";
                    var distance = "-";
                    var thisUserId = "";
                    var orginName = "";
                    var fuhe = "";
                    var endTime = "";
                    //执行确认时间
                    if (this.hasOwnProperty("fStarttime")) {
                        creatTime = this.fStarttime;
                    }
                    //执行确认时间
                    if (this.hasOwnProperty("fEndtime")) {
                        endTime = this.fEndtime;
                    }
                    if (this.hasOwnProperty("fExplain")) {
                        explain = this.fExplain;
                    }
                    if (this.hasOwnProperty("fUsername")) {
                        userName = this.fUsername;
                    }
                    if (this.hasOwnProperty("fSignintime")) {
                        signTime = this.fSignintime;
                    }
                    if (this.hasOwnProperty("fLocation")) {
                        location = this.fLocation;
                    }
                    if (this.hasOwnProperty("fExecutor")) {
                        thisUserId = this.fExecutor;
                    }
                    if (this.hasOwnProperty("fConame")) {
                        orginName = this.fConame;
                    }
                    if (this.hasOwnProperty("fApplyload")) {
                        fuhe = this.fApplyload;
                    }
                    if (this.hasOwnProperty("fDistance")) {
                        if (this.fDistance > 300) {
                            distance = "<span style=\"color:red;\">" + this.fDistance + "</span>" + Operation['ui_meter'];
                        } else {
                            distance = this.fDistance + Operation['ui_meter'];
                        }
                    }

                    var taskStateName = "<span style=\"color:green;\">" + this.fOrderstateexplain + "</span>";
                    // if (this.fExesituation == 7) {
                    //     isAllCommit = false;
                    //     taskStateName = "<span style=\"color:gray;\">" + Operation['ui_notCheck'] + "</span>";
                    // } else if (this.fExesituation == 8) {
                    //     isAllCommit = false;
                    //     taskStateName = "<span style=\"color:blue;\">" + Operation['ui_checked'] + "</span>";
                    // } else if (this.fExesituation == 9) {
                    //     taskStateName = "<span style=\"color:springgreen;\">" + Operation['ui_submitted'] + "</span>";
                    // } else {

                    // }
                    var text = "";
                    text += "<ul>";
                    text += "                            <li>";
                    text +=
                        '                                <div class=" showDiv item-content">';
                    text +=
                        '                                    <div class="item-inner">';
                    text +=
                        '                                        <div class="item-title label">' + Operation['ui_Executor'] + '</div>';
                    text += '<div class="item-input row no-gutter" style="display:flex;">' +
                        '<div class="item-label col-85" id="chargerName">' + userName + '</div>' +
                        '<div class="col-15" style="display:flex;align-items:center;">' +
                        "<img style=\"width:1rem;\" src=\"img/call.png\" id=\"chargerCall\" class=\"callPhone\" onclick=\"callPhone('" + this.fUserphone + "')\"/>" +
                        '</div>' +
                        '</div>';
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
                        '                                        <div class="item-title label">' + Operation['ui_Executorsituation'] + '</div>';
                    text += '                                        <div class="item-label">';
                    text += taskStateName + '';
                    text += "                                        </div>";
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
                        '                                        <div class="item-title label">' + Operation['ui_organizations'] + '</div>';
                    text += '                                        <div class="item-label">';
                    text += orginName + '';
                    text += "                                        </div>";
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
                        '                                        <div class="item-title label">' + Operation['ui_Limitedsingleload3'] + '</div>';
                    text += '                                        <div class="item-label">';
                    text += fuhe + ' kW';
                    text += "                                        </div>";
                    text += "                                        </div>";
                    text += "                                    </div>";
                    text += "                                </div>";
                    text += "                            </li>";
                    text += "                            <li>";
                    // text +=
                    //     '                                <div class="showDiv item-content">';
                    // text +=
                    //     '                                    <div class="item-inner">';
                    // text +=
                    //     '                                        <div class="item-title label">' + Operation['ui_checkTime'] + '</div>';
                    // text +=
                    //     '                                        <div class="item-label">';
                    // text += signTime + '';
                    // text += "                                        </div>";
                    // text += "                                        </div>";
                    // text += "                                    </div>";
                    // text += "                                </div>";
                    // text += "                            </li>";
                    // text += "                            <li>";
                    // text +=
                    //     '                                <div class="showDiv item-content">';
                    // text +=
                    //     '                                    <div class="item-inner">';
                    // text +=
                    //     '                                        <div class="item-title label">' + Operation['ui_checkSite'] + '</div>';
                    // text +=
                    //     '                                        <div class="item-label"> ';
                    // text += location +
                    //     '';
                    // text += "                                        </div>";
                    // text += "                                        </div>";
                    // text += "                                    </div>";
                    // text += "                                </div>";
                    // text += "                            </li>";
                    // text += "                            <li>";
                    // text +=
                    //     '                                <div class="showDiv item-content">';
                    // text +=
                    //     '                                    <div class="item-inner">';
                    // text +=
                    //     '                                        <div class="item-title label">' + Operation['ui_OffsetDistance'] + '</div>';
                    // text +=
                    //     '                                        <div class="item-label">';
                    // text += distance + '';
                    // text += "                                        </div>";
                    // text += "                                        </div>";
                    // text += "                                    </div>";
                    // text += "                                </div>";
                    // text += "                            </li>";
                    // text += "                            <li>";
                    text +=
                        '                                <div class="showDiv item-content">';
                    text +=
                        '                                    <div class="item-inner">';
                    text +=
                        '                                        <div class="item-title label">' + Operation['ui_executeStarttime'] + '</div>';
                    text +=
                        '                                        <div class="item-label">';
                    text += creatTime + '';
                    text += "                                        </div>";
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
                        '                                        <div class="item-title label">' + Operation['ui_executeEndtime'] + '</div>';
                    text +=
                        '                                        <div class="item-label">';
                    text += endTime + '';
                    text += "                                        </div>";
                    text += "                                        </div>";
                    text += "                                    </div>";
                    text += "                                </div>";
                    text += "                            </li>";
                    // if (isUseTrace == "1") {
                    //     text += "                            <li>";
                    //     text +=
                    //         '                                <div class="showDiv item-content">';
                    //     text +=
                    //         '                                    <div class="item-inner">';
                    //     text +=
                    //         '                                        <div class="item-title label">' + Operation['ui_trajectory'] + '</div>';
                    //     text +=
                    //         '                                        <div class="item-label">';
                    //     text += "<a href=\"#\" class=\"button\" style=\"width:70%;\" onClick=\"selectTrace(" + thisUserId + ",'" + this.fTaskstarttime + "','" + this.fCreatetime + "')\">" + Operation['ui_Trackquery'] + '</a>';
                    //     text += "                                        </div>";
                    //     text += "                                        </div>";
                    //     text += "                                    </div>";
                    //     text += "                                </div>";
                    //     text += "                            </li>";
                    // }
                    text +=
                        "                            <!-- 除自己外 且状态在执行中的任务 -->";
                    // text += "                            <li>";
                    // text +=
                    //     '                                <div class="showDiv item-content">';
                    // text +=
                    //     '                                    <div class="item-inner">';
                    // text +=
                    //     '                                        <div class="item-title label getUserid">';
                    // text += "                                            代提交任务:";
                    // text += "                                        </div>";
                    // text +=
                    //     '                                        <div class="item-input">';
                    // text +=
                    //     '                                            <label class="label-switch">';
                    // text +=
                    //     '                                                <input type="checkbox" id="check' + this.fUserid + '" value="no" name="' +
                    //     this.fUserid +
                    //     '">';
                    // text +=
                    //     '                                                <div class="checkbox"></div>';
                    // text += "                                            </label>";
                    // text += "                                        </div>";
                    // text += "                                    </div>";
                    // text += "                                </div>";
                    // text += "                            </li>";
                    text += "                        </ul>";
                    $("#missionDetail").append(text);

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

var upLoadClicktag = true;
//46.总任务提交按钮事件
// userIds 1,2,3
$("#submitTo").click(function () {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    var comfirmTip = "";
    if (isAllCommit) {
        comfirmTip = Operation['ui_submitTaskTip'];
    } else {
        comfirmTip = Operation['ui_noAllCommit'] + Operation['ui_submitTaskTip'];
    }
    $.confirm(comfirmTip, function () {
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
            $.toast(Operation['ui_submitTaskSuccessTip']);
        });
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

function selectTrace(getUserid, startTime, endTime) {
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    if (startTime != "undefined" && startTime != "") {
        startTime = startTime.replace(/-/g, '/');
        startTime = new Date(startTime).getTime() / 1000;
        if (endTime == "undefined" || endTime == "") {
            endTime = startTime + 86400;
        } else {
            endTime = endTime.replace(/-/g, '/');
            endTime = new Date(endTime).getTime() / 1000;
            if ((endTime - startTime) > 86400) {
                endTime = startTime + 86400;
            }
        }
        //查询轨迹
        if (isAndroid) {
            android.showThisTrace(getUserid, startTime, endTime);
        } else if (isIOS) {
            var yydic = {
                "entityName": getUserid,
                "startTime": startTime,
                "endTime": endTime
            };
            window.webkit.messageHandlers.pushYYGJView.postMessage(yydic);
        }
    } else {
        $.alert(Operation['ui_noStartTimeTraceTip']);
    }
}