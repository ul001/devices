var peopleType = "";
var subList = [];
var selectUserList = [];
var chargerUser = [];
var workerUser = [];
$(".peopleList").hide();
var qiangdan = Substation.GetQueryString("type");

var selectType;
if (qiangdan == "7") {
    selectType = 7;
    $("#selectType").val(7);
    $(".title_color").text(Operation['ui_postRobBill']);
    $(".qiang").hide();
    $("#postHistory").remove();
} else {
    $("#qiangOption").remove();
}

function listSubPeople(subId) {
    Substation.getDataByAjaxMain("/main/getDefaultInfoByfSubId", {
        fSubid: subId
    }, function (data) {
        if (data.substation.defaultChargenameList != undefined) {
            chargerUser = [];
            $.each(data.substation.defaultChargenameList, function () {
                chargerUser.push({
                    userId: this.fUserid,
                    userName: this.fUsername
                });
                listPeople("charger", chargerUser);
            });
        }
        if (data.substation.defaultUsernameList != undefined) {
            workerUser = [];
            $.each(data.substation.defaultUsernameList, function () {
                workerUser.push({
                    userId: this.fUserid,
                    userName: this.fUsername
                });
                listPeople("worker", workerUser);
            });
        }
    });
}

//mainPage
function listPeople(thisType, userList) {
    var html = "";
    if (userList.length > 0) {
        $(userList).each(function () {
            html += '<span class="common">' + Substation.removeUndefined(this.userName) + '<i data-type=\"' + thisType + '\" data-id=\"' + this.userId + '\" data-name=\"' + Substation.removeUndefined(this.userName) + '\" class="icon icon-close"></i></span>';
        });
        $(".peopleList." + thisType).html(html);
        $(".peopleList." + thisType).show();
        $(".icon.icon-close").off("click", addCloseFunction).on("click", addCloseFunction);
    }
}

//抢修 任务必要
$("#selectType").change(function () {
    addRedNeed();
});

function addRedNeed() {
    if ($("#selectType").val() == 6 || $("#selectType").val() == 7) {
        $(".rushContent").show();
    } else {
        $(".rushContent").hide();
    }
}

addRedNeed();

// $("#dateStart").calendar();
// $("#dateEnd").calendar();
var myDate = new Date;
var year = myDate.getFullYear(); //获取当前年
var mon = myDate.getMonth() + 1; //获取当前月
var date = myDate.getDate(); //获取当前日
var hours = myDate.getHours(); //获取当前小时
var mins = myDate.getMinutes(); //获取当分钟
var nowDate = year + "-" + format0(mon) + "-" + format0(date) + "T" + format0(hours) + ":" + format0(mins);
$("#dateStart").val(nowDate);
$("#dateEnd").val(nowDate);

function format0(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

$(".item-add").click(function () {
    peopleType = $(this).attr("id");
    $.router.loadPage("#page1");
    $("#page1 .content").scrollTop(0);
    if (peopleType == "charger") {
        $("#peopleType").text(Operation['ui_charger']);
        $("#searchUser").prop("placeholder", Operation['ui_selectUser']);
        selectUserList = chargerUser;
    } else if (peopleType == "worker") {
        $("#peopleType").text(Operation['ui_organizations']);
        $("#searchUser").prop("placeholder", Operation['ui_selectorganizations']);
        selectUserList = workerUser;
    } else if (peopleType == "substation") {
        $("#peopleType").text(Operation['ui_substation']);
        $("#searchUser").prop("placeholder", Operation['ui_selectSubTip']);
        selectUserList = subList;
    }
    if (peopleType == "substation") {
        $("#peopleClass").hide();
        $("#subClass").show();
        //组织机构
        Substation.getDataByAjax("/getCompanyListBypIdV2", {}, function (data) {
            $("#subClass .item-title").html('<span data-id="' + data.tBdCompany[0].fCoaccountno + '">' + Substation.removeUndefined(data.tBdCompany[0].fConame) + '</span>');
            thisGroupid = data.tBdCompany[0].fCoaccountno;
            getGroupClass(data.tBdCompany[0].fCoaccountno);
        });
    } else {
        $("#peopleClass").show();
        $("#subClass").hide();
        $("#peopleClass .item-title").html('<span data-id="-1">' + Operation['ui_organizations'] + '</span>');
        getGroupClass(-1);
    }
    if (selectUserList.length > 0) {
        $("#showSelected").html(Operation['ui_hasSelected'] + ":" + selectUserList.length + Operation['ui_personNum'] + "<i class='icon icon-up'></i>");
        $("#showSelected").off("click", goToSelectedPage).on("click", goToSelectedPage);
    } else {
        $("#showSelected").html(Operation['ui_hasSelected'] + ":");
        $("#showSelected").off("click", goToSelectedPage);
    }
});

function addCloseFunction() {
    $(this).parent("span").remove();
    var thisUserid = $(this).attr("data-id");
    var thisUsername = $(this).attr("data-name");
    var thisType = $(this).attr("data-type");
    if (thisType == "charger") {
        $(chargerUser).each(function (i, obj) {
            if (obj.userId == thisUserid) {
                chargerUser.splice(i, 1);
                return false;
            }
        });
        if (chargerUser.length == 0) {
            $(".peopleList.charger").hide();
        }
    } else if (thisType == "worker") {
        $(workerUser).each(function (i, obj) {
            if (obj.userId == thisUserid) {
                workerUser.splice(i, 1);
                return false;
            }
        });
        if (workerUser.length == 0) {
            $(".peopleList.worker").hide();
        }
    } else if (thisType == "substation") {
        $(subList).each(function (i, obj) {
            if (obj.userId == thisUserid) {
                subList.splice(i, 1);
                return false;
            }
        });
        if (subList.length == 0) {
            $(".peopleList.substation").hide();
        }
    }
}

//发布提交
function postTask() {
    var startTime = $("#dateStart").val();
    var completeTime = $("#dateEnd").val();
    var taskContent = $("#taskContent").val();
    var LimitNum = $("#LimitNum").val();
    var LimitLoad = $("#LimitLoad").val();
    // if ($("#selectType").val() != undefined) {
    selectType = $("#selectType").val();
    // }
    if (workerUser.length == 0) {
        $.toast(Operation['ui_substation'] + Operation['ui_notEmpty']);
        return;
    }
    if (startTime == "" || startTime == undefined) {
        $.toast(Operation['ui_startTime'] + Operation['ui_notEmpty']);
        return;
    }
    if (completeTime == "" || completeTime == undefined) {
        $.toast(Operation['ui_askFinishTime'] + Operation['ui_notEmpty']);
        return;
    }
    var timeMinus = new Date(completeTime.replace(/-/g, '/')).getTime() - new Date(startTime.replace(/-/g, '/')).getTime();
    if (timeMinus < 0) {
        $.toast(Operation['ui_timeSelectError']);
        return;
    }
    if ($("#selectType").val() == 6 || $("#selectType").val() == 7) {
        if (taskContent == "" || taskContent == undefined) {
            $.toast(Operation['ui_alarmTaskContent'] + Operation['ui_notEmpty']);
            return;
        }
    }
    var subIds = [];
    $(workerUser).each(function (i, obj) {
        subIds.push(obj.userId);
    });
    var subStr = subIds.join(",");
    var params = {};
    startTime = startTime.replace("T", " ");
    completeTime = completeTime.replace("T", " ");
    // if (qiangdan == "7") {
    params = {
        fTitle: selectType,
        fPlantime: startTime + ":00",
        fDeadlinetime: completeTime + ":00",
        fLimitnumber: LimitNum,
        fTargetload: LimitLoad,
        fWorkcontent: taskContent,
        fTargetcompany: subStr
    };
    Substation.postDataByAjax("/releaseWorkOrder", params, function (data) {
        if (data.code == "200") {
            $.alert(Operation['ui_postSuccess'], function () {
                if (isAndroid) {
                    android.refresh();
                    android.goBack();
                } else {
                    localStorage.setItem("need-refresh", "true");
                    window.history.back();
                }
            });
        }
    });
    // } else {
    //     if (chargerUser.length == 0) {
    //         $.toast(Operation['ui_charger'] + Operation['ui_notEmpty']);
    //         return;
    //     }
    //     if (workerUser.length == 0) {
    //         $.toast(Operation['ui_worker'] + Operation['ui_notEmpty']);
    //         return;
    //     }
    //     var chargerId = chargerUser[0].userId;
    //     var workerIdList = [];
    //     $(workerUser).each(function (i, obj) {
    //         workerIdList.push(obj.userId);
    //     });
    //     var workerIdStr = workerIdList.join(",");
    //     params = {
    //         userIds: workerIdStr,
    //         fTaskchargerid: chargerId,
    //         fTasktypeid: selectType,
    //         fStartdate: startTime + " 00:00:00",
    //         fDeadlinedate: completeTime + " 23:59:59",
    //         fTaskcontent: taskContent,
    //         subIds: subStr
    //     };
    //     Substation.postDataByAjax("/releaseTask", params, function (data) {
    //         if (data.code == "200") {
    //             $.alert(Operation['ui_postSuccess'], function () {
    //                 location.reload();
    //             });
    //         }
    //     });
    // }
}

//page1
var thisGroupid = -1;

function getGroupClass(pid) {
    $(".classUl").empty();
    $("#classList").show();
    // if (peopleType == "substation") {
    //     //组织机构
    Substation.getDataByAjax("/getCompanyListBypIdV2", {
        fCoaccountno: pid
    }, function (data) {
        if (data.hasOwnProperty("tBdCompany") && data.tBdCompany.length > 0) {
            $(".classUl").show();
            var html = "";
            $(data.tBdCompany).each(function () {
                html += "<li>\n" +
                    "    <div class=\"item-content\">\n" +
                    "        <div class=\"item-inner orgCheckbox\">\n" +
                    "        <input type=\"checkbox\" name=\"my-checkbox\" id=\"" + this.fCoaccountno + "\" data-name=\"" + Substation.removeUndefined(this.fConame) + "\">\n" +
                    "            <div class=\"item-title\">" + Substation.removeUndefined(this.fConame) + "</div>\n" +
                    "            <div class=\"item-after\">\n" +
                    "                <span class=\"nextClass\" data-id=\"" + this.fCoaccountno + "\" data-name=\"" + Substation.removeUndefined(this.fConame) + "\">\n" +
                    "                    <i class=\"icon icon-nextclass\"></i>" + Operation['ui_nextClass'] + "\n" +
                    "                </span>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </div>\n" +
                    "</li>";
            });
            $(".classUl").html(html);
            $(".nextClass").off("click", nextClassClick).on("click", nextClassClick);
        } else {
            $(".classUl").hide();
        }
        // checkSelectPeople();
        getPersonList(pid);
    });
    // } else {
    // Substation.getDataByAjax("/selectUserGroupByPid", {
    //     userGroupPid: pid
    // }, function (data) {
    //     if (data.hasOwnProperty("userGroupList") && data.userGroupList.length > 0) {
    //         $(".classUl").show();
    //         var html = "";
    //         $(data.userGroupList).each(function () {
    //             html += "<li>\n" +
    //                 "    <div class=\"item-content\">\n" +
    //                 "        <div class=\"item-inner orgCheckbox\">\n" +
    //                 "        <input type=\"checkbox\" name=\"my-checkbox\" id=\"" + this.fUsergroupid + "\" data-name=\"" + Substation.removeUndefined(this.fUsergroupname) + "\">\n" +
    //                 // "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
    //                 "            <div class=\"item-title\">" + Substation.removeUndefined(this.fUsergroupname) + "</div>\n" +
    //                 "            <div class=\"item-after\">\n" +
    //                 "                <span class=\"nextClass\" data-id=\"" + this.fUsergroupid + "\" data-name=\"" + Substation.removeUndefined(this.fUsergroupname) + "\">\n" +
    //                 "                    <i class=\"icon icon-nextclass\"></i>" + Operation['ui_nextClass'] + "\n" +
    //                 "                </span>\n" +
    //                 "            </div>\n" +
    //                 "        </div>\n" +
    //                 "    </div>\n" +
    //                 "</li>";
    //         });
    //         $(".classUl").html(html);
    //         $(".nextClass").off("click", nextClassClick).on("click", nextClassClick);
    //     } else {
    //         $(".classUl").hide();
    //     }
    //     getPersonList(pid);
    // });
    // }
}

function getPersonList(gid) {
    $("#personListUl").empty();

    // if (peopleType == "substation") {
    // Substation.postDataByAjax("/getSubstationListBySubGroupId", {
    //     fCoaccountno: gid
    // }, function (data) {
    //     if (data.data.hasOwnProperty("list") && data.data.list.length > 0) {
    //         $(".personUl").show();
    //         //修改单选
    //         $("#selectAll").hide();
    //         var html = "";
    //         $(data.data.list).each(function () {
    //             html += "<li>\n" +
    //                 "    <label class=\"label-checkbox item-content\">\n" +
    //                 "        <input type=\"checkbox\" name=\"my-checkbox\" id=\"" + this.fSubid + "\" data-name=\"" + Substation.removeUndefined(this.fSubname) + "\">\n" +
    //                 "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
    //                 "        <div class=\"item-inner\">\n" +
    //                 "            <div class=\"item-title\">" + Substation.removeUndefined(this.fSubname) + "</div>\n" +
    //                 "        </div>\n" +
    //                 "    </label>\n" +
    //                 "</li>"
    //         });
    //         $("#personListUl").html(html);
    $("input[name='my-checkbox']").off("change", addChangeListener).on("change", addChangeListener);
    checkSelectPeople();
    //     } else {
    //         $(".personUl").hide();
    //     }
    // });
    // } else {
    // Substation.getDataByAjax("/selectUserListByGroupId", {
    //     groupId: gid
    // }, function (data) {
    //     if (data.hasOwnProperty("userList") && data.userList.length > 0) {
    //         $(".personUl").show();
    //         if (peopleType == "charger") {
    //             $("#selectAll").hide();
    //         }
    //         var html = "";
    //         $(data.userList).each(function () {
    //             html += "<li>\n" +
    //                 "    <label class=\"label-checkbox item-content\">\n" +
    //                 "        <input type=\"checkbox\" name=\"my-checkbox\" id=\"" + this.fUserid + "\" data-name=\"" + Substation.removeUndefined(this.fUsername) + "\">\n" +
    //                 "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
    //                 "        <div class=\"item-inner\">\n" +
    //                 "            <div class=\"item-title\">" + Substation.removeUndefined(this.fUsername) + "</div>\n" +
    //                 "        </div>\n" +
    //                 "    </label>\n" +
    //                 "</li>"
    //         });
    //         $("#personListUl").html(html);
    //         $("input[name='my-checkbox']").off("change", addChangeListener).on("change", addChangeListener);
    //         checkSelectPeople();
    //     } else {
    //         $(".personUl").hide();
    //     }
    // });
    // }
}

//跳下级事件
function nextClassClick() {
    var clickPid = $(this).attr("data-id");
    thisGroupid = clickPid;
    $("#selectAll input[type='checkbox']").removeAttr("checked");
    var clickName = $(this).attr("data-name");
    $("#classList .item-title span").addClass("preClass");
    $(".preClass").off("click", preClick).on("click", preClick);
    $("#classList .item-title").append("<i class=\"icon icon-nextArrow\"></i><span data-id=\"" + clickPid + "\">" + clickName + "</span>")
    $("#classList .item-title").scrollLeft(10000);
    getGroupClass(clickPid);
}

//跳上级事件
function preClick() {
    var clickPid = $(this).attr("data-id");
    thisGroupid = clickPid;
    $("#selectAll input[type='checkbox']").removeAttr("checked");
    $(this).removeClass("preClass");
    $(this).nextAll().remove();
    getGroupClass(clickPid);
}

//选人状态变化监听
function addChangeListener() {
    var thisUserid = $(this).attr("id");
    var thisUsername = $(this).attr("data-name");
    if (thisUserid != undefined) {
        if (peopleType == "substation") {
            if ($(this).prop("checked")) {
                selectUserList = [{
                    userId: thisUserid,
                    userName: thisUsername
                }];
                $("input[name='my-checkbox']").attr("checked", false);
                $(this).prop("checked", true);
                listSubPeople(thisUserid);
            } else {
                selectUserList = [];
            }
        } else if (peopleType == "charger") {
            if ($(this).prop("checked")) {
                selectUserList = [{
                    userId: thisUserid,
                    userName: thisUsername
                }];
                $("input[name='my-checkbox']").attr("checked", false);
                $(this).prop("checked", true);
            } else {
                selectUserList = [];
            }
        } else if (peopleType == "worker") {
            if ($(this).prop("checked")) {
                selectUserList.push({
                    userId: thisUserid,
                    userName: thisUsername
                });
            } else {
                $(selectUserList).each(function (i, obj) {
                    if (obj.userId == thisUserid) {
                        selectUserList.splice(i, 1);
                        return false;
                    }
                });
                $("#selectAll input[type='checkbox']").removeAttr("checked");
            }
        }
        if (selectUserList.length > 0) {
            $("#showSelected").html(Operation['ui_hasSelected'] + ":" + selectUserList.length + Operation['ui_personNum'] + "<i class='icon icon-up'></i>");
            $("#showSelected").off("click", goToSelectedPage).on("click", goToSelectedPage);
        } else {
            $("#showSelected").html(Operation['ui_hasSelected'] + ":");
            $("#showSelected").off("click", goToSelectedPage);
        }
    }
}

$("#selectAll").change(function () {
    if ($("#selectAll input[type='checkbox']").prop("checked")) {
        $("#personListUl input[type='checkbox']:not(:checked)").click();
    } else {
        $("#personListUl input[type='checkbox']:checked").click();
    }
});

//选择的人员复选框选中
function checkSelectPeople() {
    $(selectUserList).each(function () {
        $("#" + this.userId).prop("checked", true);
    });
}

//跳转选择人列表
function goToSelectedPage() {
    $.router.loadPage("#page2");
    showPage2List();
}

function saveSelectedPeople() {
    $.router.back();
    if (peopleType == "charger") {
        chargerUser = selectUserList;
    } else if (peopleType == "worker") {
        workerUser = selectUserList;
    }
    // else if (peopleType == "substation") {
    //     subList = selectUserList;
    // }
    $("#searchUser").val("");
    listPeople(peopleType, selectUserList);
}

//模糊搜索
function getSearchUser() {
    $("#personListUl").empty();
    $(".personUl").show();
    $(".classUl").hide();
    $("#classList").hide();
    var typeStr = "";
    if (peopleType == "charger" || peopleType == "substation") {
        typeStr = "type=\"checkbox\"";
        $("#selectAll").hide();
    } else if (peopleType == "worker") {
        typeStr = "type=\"checkbox\"";
        $("#selectAll").show();
    }
    // if (peopleType == "substation") {
    Substation.postDataByAjax("/getSubstationListBySubGroupId", {
        search: $("#searchUser").val()
    }, function (data) {
        var html = "";
        $(data.data.list).each(function () {
            html += "<li>\n" +
                "    <label class=\"label-checkbox item-content\">\n" +
                "        <input " + typeStr + " name=\"my-checkbox\" id=\"" + this.fSubid + "\" data-name=\"" + Substation.removeUndefined(this.fSubname) + "\">\n" +
                "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                "        <div class=\"item-inner\">\n" +
                "            <div class=\"item-title\">" + Substation.removeUndefined(this.fSubname) + "(" + Substation.removeUndefined(this.fSubid) + ")</div>\n" +
                "        </div>\n" +
                "    </label>\n" +
                "</li>";
        });
        $("#personListUl").html(html);
        $("input[name='my-checkbox']").off("change", addChangeListener).on("change", addChangeListener);
        checkSelectPeople();
    });
    // } else {
    // Substation.postDataByAjax("/getUserListByCondition", {
    //     searchKey: $("#searchUser").val()
    // }, function (data) {
    //     var html = "";
    //     $(data.data).each(function () {
    //         html += "<li>\n" +
    //             "    <label class=\"label-checkbox item-content\">\n" +
    //             "        <input " + typeStr + " name=\"my-checkbox\" id=\"" + this.fUserid + "\" data-name=\"" + Substation.removeUndefined(this.userName) + "\">\n" +
    //             "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
    //             "        <div class=\"item-inner\">\n" +
    //             "            <div class=\"item-title\">" + Substation.removeUndefined(this.userName) + "(" + Substation.removeUndefined(this.fLoginname) + ")</div>\n" +
    //             "        </div>\n" +
    //             "    </label>\n" +
    //             "</li>";
    //     });
    //     $("#personListUl").html(html);
    //     $("input[name='my-checkbox']").off("change", addChangeListener).on("change", addChangeListener);
    //     checkSelectPeople();
    // });
    // }
}

$('#searchUser').bind('keydown', function (event) {
    if (event.keyCode == 13) {
        if ($("#searchUser").val() != "") {
            getSearchUser();
            document.activeElement.blur();
        }
    }
});

$(".searchbar-cancel").click(function () {
    $("#searchUser").val("");
    getGroupClass(thisGroupid);
});

//page2
function showPage2List() {
    $("#page2 .content").scrollTop(0);
    $("#selectedUl").empty();
    var html = '';
    $(selectUserList).each(function () {
        html += "<li data-remove=\"" + this.userId + "\">\n" +
            "    <div class=\"item-content\">\n" +
            "        <div class=\"item-inner\">\n" +
            "            <div class=\"item-title\">" + Substation.removeUndefined(this.userName) + "</div>\n" +
            "            <div class=\"item-after\">\n" +
            "                <span class=\"removeUser redColor\" data-id=\"" + this.userId + "\" data-name=\"" + Substation.removeUndefined(this.userName) + "\">" + Operation['ui_remove'] + "\n" +
            "                </span>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</li>";
    });
    $("#numberShow").html(selectUserList.length);
    $("#selectedUl").html(html);
    $(".removeUser").off("click", removeUser).on("click", removeUser);
}

function removeUser() {
    $("#selectAll input[type='checkbox']").removeAttr("checked");
    var thisUserid = $(this).attr("data-id");
    var thisUsername = $(this).attr("data-name");
    $("li[data-remove='" + thisUserid + "']").remove();
    $(selectUserList).each(function (i, obj) {
        if (obj.userId == thisUserid) {
            selectUserList.splice(i, 1);
            return false;
        }
    });
    $("#" + thisUserid).removeAttr("checked");
    if (selectUserList.length > 0) {
        $("#showSelected").html(Operation['ui_hasSelected'] + ":" + selectUserList.length + Operation['ui_personNum'] + "<i class='icon icon-up'></i>");
        $("#showSelected").off("click", goToSelectedPage).on("click", goToSelectedPage);
    } else {
        $("#showSelected").html(Operation['ui_hasSelected'] + ":");
        $("#showSelected").off("click", goToSelectedPage);
    }
    $("#numberShow").html(selectUserList.length);
}

$(".back_btn").click(function () {
    // $.router.back();
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓系统
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
    if (isIOS) {
        // window.webkit.messageHandlers.goBackiOS.postMessage("");
        $.router.back();
    } else {
        android.goBack();
    }
});

$("#postHistory").click(function () {
    window.location.href = "taskPostHistory.html";
});

//解决键盘遮挡问题
var h = $(window).height();
window.addEventListener("resize", function () {
    if ($(window).height() < h) {
        $(".bar.bar-footer").hide();
        $(".bar-footer~.content").css("bottom", "0");
    }
    if ($(window).height() >= h) {
        $(".bar.bar-footer").show();
        $(".bar-footer~.content").css("bottom", "2.2rem");
    }
    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

$.init();