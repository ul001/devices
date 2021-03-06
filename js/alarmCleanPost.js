//读取本地传参
var selectSubId = localStorage.getItem("fSubid");
var selectAlarmId = localStorage.getItem("alarmEventlogid");
var selectProblemId = localStorage.getItem("problemId");
var isProblem = 0;
if(selectProblemId!=undefined && selectProblemId!=null){
    isProblem = 1;
    $(".title.title_color").text(Operation['ui_defectPost']);
}else if(selectAlarmId!=undefined && selectAlarmId!=null){
    isProblem = 0;
    $(".title.title_color").text(Operation['ui_alarmCleanPost']);
}
localStorage.removeItem("alarmSubid");
localStorage.removeItem("alarmEventlogid");
localStorage.removeItem("problemId");

var peopleType = "";
var selectUserList = [];
var chargerUser = [];
var workerUser = [];
$(".peopleList").hide();

listSubPeople();

function listSubPeople(){
    Substation.getDataByAjaxMain("/main/getDefaultInfoByfSubId",{fSubid:selectSubId},function(data){
        if(data.substation.defaultChargenameList!=undefined){
            $.each(data.substation.defaultChargenameList,function(){
                chargerUser.push({userId:this.fUserid,userName:this.fUsername});
                listPeople("charger",chargerUser);
            });
        }
        if(data.substation.defaultUsernameList!=undefined){
            $.each(data.substation.defaultUsernameList,function(){
                workerUser.push({userId:this.fUserid,userName:this.fUsername});
                listPeople("worker",workerUser);
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
        $(".icon.icon-close").off("click", addCloseFunction);
        $(".icon.icon-close").on("click", addCloseFunction);
    }
}

$("#dateStart").calendar();
$("#dateEnd").calendar();
var myDate = new Date;
var year = myDate.getFullYear(); //获取当前年
var mon = myDate.getMonth() + 1; //获取当前月
var date = myDate.getDate(); //获取当前日
var nowDate = year+"-"+format0(mon)+"-"+format0(date);
$("#dateStart").val(nowDate);
$("#dateEnd").val(nowDate);

function format0(num){
    if(num<10){
        return "0"+num;
    }else{
        return num;
    }
}

//选人状态变化监听
function addChangeListener() {
    var thisUserid = $(this).attr("id");
    var thisUsername = $(this).attr("data-name");
    if (thisUserid != undefined) {
        if (peopleType == "charger") {
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
            $("#showSelected").off("click", goToSelectedPage);
            $("#showSelected").on("click", goToSelectedPage);
        } else {
            $("#showSelected").html(Operation['ui_hasSelected'] + ":");
            $("#showSelected").off("click", goToSelectedPage);
        }
    }
}

$(".item-add").click(function () {
    peopleType = $(this).attr("id");
    $.router.loadPage("#page1");
    if (peopleType == "charger") {
        $("#peopleType").text(Operation['ui_charger']);
        selectUserList = chargerUser;
    } else if (peopleType == "worker") {
        $("#peopleType").text(Operation['ui_worker']);
        selectUserList = workerUser;
    }
    $("#classList .item-title").html('<span data-id="-1">' + Operation['ui_organization'] + '</span>');
    if (selectUserList.length > 0) {
        $("#showSelected").html(Operation['ui_hasSelected'] + ":" + selectUserList.length + Operation['ui_personNum'] + "<i class='icon icon-up'></i>");
        $("#showSelected").off("click", goToSelectedPage);
        $("#showSelected").on("click", goToSelectedPage);
    } else {
        $("#showSelected").html(Operation['ui_hasSelected'] + ":");
        $("#showSelected").off("click", goToSelectedPage);
    }
    getGroupClass(-1);
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
    }
}

//发布
function postTask() {
    var startTime = $("#dateStart").val();
    var completeTime = $("#dateEnd").val();
    var taskContent = $("#taskContent").val();
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
    if (chargerUser.length == 0) {
        $.toast(Operation['ui_charger'] + Operation['ui_notEmpty']);
        return;
    }
    if (workerUser.length == 0) {
        $.toast(Operation['ui_worker'] + Operation['ui_notEmpty']);
        return;
    }
    var chargerId = chargerUser[0].userId;
    var workerIdList = [];
    $(workerUser).each(function (i, obj) {
        workerIdList.push(obj.userId);
    });
    var workerIdStr = workerIdList.join(",");
    var params = {
        userIds: workerIdStr,
        fTaskchargerid: chargerId,
//        fTasktypeid: 5,
        fStartdate: startTime + " 00:00:00",
        fDeadlinedate: completeTime + " 23:59:59",
        fTaskcontent: taskContent,
        subIds: selectSubId,
//        fAlarmeventlogid: selectAlarmId
    };
    if(isProblem == 1){
        params['fTasktypeid'] = 3;
        params['fDeviceproblemid'] = selectProblemId;
    }else{
        params['fTasktypeid'] = 5;
        params['fAlarmeventlogid'] = selectAlarmId;
    }
    Substation.postDataByAjax("/releaseTask", params, function (data) {
        if (data.code == "200") {
            $.alert(Operation['ui_postSuccess'], function () {
                window.history.back();
            });
        }
    });
}

//page1
var thisGroupid = -1;

function getGroupClass(pid) {
    $(".classUl").empty();
    $("#classList").show();
    Substation.getDataByAjax("/selectUserGroupByPid", {
        userGroupPid: pid
    }, function (data) {
        if (data.hasOwnProperty("userGroupList") && data.userGroupList.length > 0) {
            $(".classUl").show();
            var html = "";
            $(data.userGroupList).each(function () {
                html += "<li>\n" +
                    "    <div class=\"item-content\">\n" +
                    "        <div class=\"item-inner\">\n" +
                    "            <div class=\"item-title\">" + Substation.removeUndefined(this.fUsergroupname) + "</div>\n" +
                    "            <div class=\"item-after\">\n" +
                    "                <span class=\"nextClass\" data-id=\"" + this.fUsergroupid + "\" data-name=\"" + Substation.removeUndefined(this.fUsergroupname) + "\">\n" +
                    "                    <i class=\"icon icon-nextclass\"></i>" + Operation['ui_nextClass'] + "\n" +
                    "                </span>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </div>\n" +
                    "</li>";
            });
            $(".classUl").html(html);
            $(".nextClass").off("click", nextClassClick);
            $(".nextClass").on("click", nextClassClick);
        } else {
            $(".classUl").hide();
        }
        getPersonList(pid);
    });
}

function getPersonList(gid) {
    $("#personListUl").empty();
    Substation.getDataByAjax("/selectUserListByGroupId", {
        groupId: gid
    }, function (data) {
        if (data.hasOwnProperty("userList") && data.userList.length > 0) {
            $(".personUl").show();
            if(peopleType == "charger"){
                $("#selectAll").hide();
            }
            var html = "";
            $(data.userList).each(function () {
                html += "<li>\n" +
                    "    <label class=\"label-checkbox item-content\">\n" +
                    "        <input type=\"checkbox\" onchange=\"addChangeListener()\" name=\"my-checkbox\" id=\"" + this.fUserid + "\" data-name=\"" + Substation.removeUndefined(this.fUsername) + "\">\n" +
                    "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                    "        <div class=\"item-inner\">\n" +
                    "            <div class=\"item-title\">" + Substation.removeUndefined(this.fUsername) + "</div>\n" +
                    "        </div>\n" +
                    "    </label>\n" +
                    "</li>"
            });
            $("#personListUl").html(html);
            // var $events = $("input[name='my-checkbox']").data("events");
            // if ($events && $events["change"]) {
            //     $("input[name='my-checkbox']").on("change", addChangeListener);
            //     //your code here
            // }
            // var event = $._data($('#1').get(0)).events;
            $("input[name='my-checkbox']").unbind("change", addChangeListener);
            $("input[name='my-checkbox']").bind("change", addChangeListener);
            // $("input[name='my-checkbox']").off("change", addChangeListener);
            checkSelectPeople();
        } else {
            $(".personUl").hide();
        }
    });
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
    $("#classList").scrollLeft(10000);
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
    listPeople(peopleType, selectUserList);
}

//模糊搜索
function getSearchUser() {
    $("#personListUl").empty();
    $(".personUl").show();
    $(".classUl").hide();
    $("#classList").hide();
    var typeStr = "";
    if (peopleType == "charger") {
        typeStr = "type=\"checkbox\"";
        $("#selectAll").hide();
    } else if (peopleType == "worker") {
        typeStr = "type=\"checkbox\"";
        $("#selectAll").show();
    }
    Substation.postDataByAjax("/getUserListByCondition", {
        searchKey: $("#searchUser").val()
    }, function (data) {
        var html = "";
        $(data.data).each(function () {
            html += "<li>\n" +
                "    <label class=\"label-checkbox item-content\">\n" +
                "        <input " + typeStr + " onchange=\"addChangeListener()\" name=\"my-checkbox\" id=\"" + this.fUserid + "\" data-name=\"" + Substation.removeUndefined(this.userName) + "\">\n" +
                "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                "        <div class=\"item-inner\">\n" +
                "            <div class=\"item-title\">" + Substation.removeUndefined(this.userName) + "(" + Substation.removeUndefined(this.fLoginname) + ")</div>\n" +
                "        </div>\n" +
                "    </label>\n" +
                "</li>"
        });
        $("#personListUl").append(html);
        // var event = $._data($('#1').get(0)).events;
        $("input[name='my-checkbox']").unbind("change", addChangeListener);
        $("input[name='my-checkbox']").bind("change", addChangeListener);
        // $("input[name='my-checkbox']").on("change", addChangeListener);
        checkSelectPeople();
    });
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
    $("#selectedUl").append(html);
    $(".removeUser").off("click", removeUser);
    $(".removeUser").on("click", removeUser);
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
        $("#showSelected").off("click", goToSelectedPage);
        $("#showSelected").on("click", goToSelectedPage);
    } else {
        $("#showSelected").html(Operation['ui_hasSelected'] + ":");
        $("#showSelected").off("click", goToSelectedPage);
    }
    $("#numberShow").html(selectUserList.length);
}

//解决键盘遮挡问题
var h = $(window).height();
window.addEventListener("resize", function () {
    if ($(window).height() < h) {
        $(".bar.bar-footer").hide();
        $(".bar-footer~.content").css("bottom","0");
    }
    if ($(window).height() >= h) {
        $(".bar.bar-footer").show();
        $(".bar-footer~.content").css("bottom","2.2rem");
    }
    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

$.init();