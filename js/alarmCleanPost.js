//读取本地传参
var selectSubId = localStorage.getItem("alarmSubid");
var selectAlarmId = localStorage.getItem("alarmEventlogid");
localStorage.removeItem("alarmSubid");
localStorage.removeItem("alarmEventlogid");

var peopleType = "";
var selectUserList = [];
var chargerUser = [];
var workerUser = [];
$(".peopleList").hide();

//mainPage
function listPeople(thisType,userList){
    var html = "";
    if(userList.length>0){
        $(userList).each(function(){
            html += '<span class="common">'+Substation.removeUndefined(this.userName)+'<i data-type=\"'+thisType+'\" data-id=\"'+this.userId+'\" data-name=\"'+Substation.removeUndefined(this.userName)+'\" class="icon icon-close"></i></span>';
        });
        $(".peopleList."+thisType).html(html);
        $(".peopleList."+thisType).show();
        $(".icon.icon-close").off("click",addCloseFunction).on("click",addCloseFunction);
    }
}

$("#dateStart").calendar();
$("#dateEnd").calendar();

$(".item-add").click(function(){
    peopleType = $(this).attr("id");
    $.router.loadPage("#page1");
    if(peopleType == "charger"){
        $("#peopleType").text(Operation['ui_charger']);
        selectUserList = chargerUser;
    }else if(peopleType == "worker"){
        $("#peopleType").text(Operation['ui_worker']);
        selectUserList = workerUser;
    }
    $("#classList .item-title").html('<span data-id="-1">'+Operation['ui_organization']+'</span>');
    if(selectUserList.length>0){
        $("#showSelected").html(Operation['ui_hasSelected']+":"+selectUserList.length+Operation['ui_personNum']+"<i class='icon icon-up'></i>");
        $("#showSelected").off("click",goToSelectedPage).on("click",goToSelectedPage);
    }else{
        $("#showSelected").html(Operation['ui_hasSelected']+":");
        $("#showSelected").off("click",goToSelectedPage);
    }
    getGroupClass(-1);
});

function addCloseFunction(){
    $(this).parent("span").remove();
    var thisUserid = $(this).attr("data-id");
    var thisUsername = $(this).attr("data-name");
    var thisType = $(this).attr("data-type");
    if(thisType == "charger"){
        $(chargerUser).each(function(i,obj){
            if(obj.userId == thisUserid){
                chargerUser.splice(i,1);
                return false;
            }
        });
        if(chargerUser.length==0){
            $(".peopleList.charger").hide();
        }
    }else if(thisType == "worker"){
        $(workerUser).each(function(i,obj){
            if(obj.userId == thisUserid){
                workerUser.splice(i,1);
                return false;
            }
        });
        if(workerUser.length==0){
            $(".peopleList.worker").hide();
        }
    }
}

//发布
function postTask(){
    var startTime = $("#dateStart").val();
    var completeTime = $("#dateEnd").val();
    var taskContent = $("#taskContent").val();
    if(startTime=="" || startTime==undefined){
        $.toast(Operation['ui_startTime']+Operation['ui_notEmpty']);
        return;
    }
    if(completeTime=="" || completeTime==undefined){
        $.toast(Operation['ui_askFinishTime']+Operation['ui_notEmpty']);
        return;
    }
    var timeMinus = new Date(completeTime.replace(/-/g, '/')).getTime() -  new Date(startTime.replace(/-/g, '/')).getTime();
    if(timeMinus<0){
        $.toast(Operation['ui_timeSelectError']);
        return;
    }
    if(chargerUser.length==0){
        $.toast(Operation['ui_charger']+Operation['ui_notEmpty']);
        return;
    }
    if(workerUser.length==0){
        $.toast(Operation['ui_worker']+Operation['ui_notEmpty']);
        return;
    }
    var chargerId = chargerUser[0].userId;
    var workerIdList = [];
    $(workerUser).each(function(i,obj){
        workerIdList.push(obj.userId);
    });
    var workerIdStr = workerIdList.join(",");
    var params = {userIds:workerIdStr,fTaskchargerid:chargerId,fTasktypeid:5,fStartdate:startTime+" 00:00:00",fDeadlinedate:completeTime+" 23:59:59",
        fTaskcontent:taskContent,subIds:selectSubId,fAlarmeventlogid:selectAlarmId};
    Substation.postDataByAjax("/releaseTask",params,function(data){
        if(data.code=="200"){
            $.alert(Operation['ui_postSuccess'],function(){
                window.history.back();
            });
        }
    });
}

//page1
var thisGroupid = -1;

function getGroupClass(pid){
    $(".classUl").empty();
    $(".classUl").show();
    $(".personUl").hide();
    Substation.getDataByAjax("/selectUserGroupByPid",{userGroupPid: pid},function(data){
        if (data.hasOwnProperty("userGroupList") && data.userGroupList.length > 0) {
            var html = "";
            $(data.userGroupList).each(function(){
                html += "<li>\n" +
                        "    <div class=\"item-content\">\n" +
                        "        <div class=\"item-inner\">\n" +
                        "            <div class=\"item-title\">"+Substation.removeUndefined(this.fUsergroupname)+"</div>\n" +
                        "            <div class=\"item-after\">\n" +
                        "                <span class=\"nextClass\" data-id=\""+this.fUsergroupid+"\" data-name=\""+Substation.removeUndefined(this.fUsergroupname)+"\">\n" +
                        "                    <i class=\"icon icon-nextclass\"></i>"+Operation['ui_nextClass']+"\n" +
                        "                </span>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</li>";
            });
            $(".classUl").append(html);
            $(".nextClass").off("click",nextClassClick).on("click",nextClassClick);
        }else{
            getPersonList(pid);
        }
    });
}

function getPersonList(gid){
        $("#personListUl").empty();
        $(".personUl").show();
        $(".classUl").hide();
        var typeStr = "";
        if(peopleType == "charger"){
            typeStr = "type=\"radio\"";
            $("#selectAll").hide();
        }else if(peopleType == "worker"){
            typeStr = "type=\"checkbox\"";
            $("#selectAll").show();
        }
        Substation.getDataByAjax("/selectUserListByGroupId",{groupId: gid},function(data){
            if (data.hasOwnProperty("userList") && data.userList.length > 0) {
                var html = "";
                $(data.userList).each(function(){
                    html += "<li>\n" +
                            "    <label class=\"label-checkbox item-content\">\n" +
                            "        <input "+typeStr+" name=\"my-checkbox\" id=\""+this.fUserid+"\" data-name=\""+Substation.removeUndefined(this.fUsername)+"\">\n" +
                            "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                            "        <div class=\"item-inner\">\n" +
                            "            <div class=\"item-title\">"+Substation.removeUndefined(this.fUsername)+"</div>\n" +
                            "        </div>\n" +
                            "    </label>\n" +
                            "</li>"
                });
                $("#personListUl").append(html);
                $("input[name='my-checkbox']").off("change",addChangeListener).on("change",addChangeListener);
                checkSelectPeople();
            }else{
                $(".personUl").hide();
            }
        });
}

//跳下级事件
function nextClassClick(){
    var clickPid = $(this).attr("data-id");
    thisGroupid = clickPid;
    $("#selectAll input[type='checkbox']").removeAttr("checked");
    var clickName = $(this).attr("data-name");
    $("#classList .item-title span").addClass("preClass");
    $(".preClass").off("click",preClick).on("click",preClick);
    $("#classList .item-title").append("<i class=\"icon icon-nextArrow\"></i><span data-id=\""+clickPid+"\">"+clickName+"</span>")
    $("#classList").scrollLeft(10000);
    getGroupClass(clickPid);
}

//跳上级事件
function preClick(){
    var clickPid = $(this).attr("data-id");
    thisGroupid = clickPid;
    $("#selectAll input[type='checkbox']").removeAttr("checked");
    $(this).removeClass("preClass");
    $(this).nextAll().remove();
    getGroupClass(clickPid);
}

//选人状态变化监听
function addChangeListener(){
    var thisUserid = $(this).attr("id");
    var thisUsername = $(this).attr("data-name");
    if(thisUserid!=undefined){
        if(peopleType == "charger"){
            if($(this).prop("checked")){
                selectUserList = [{userId:thisUserid,userName:thisUsername}];
            }else{
                selectUserList = [];
            }
        }else if(peopleType == "worker"){
            if($(this).prop("checked")){
                selectUserList.push({userId:thisUserid,userName:thisUsername});
            }else{
                $(selectUserList).each(function(i,obj){
                    if(obj.userId == thisUserid){
                        selectUserList.splice(i,1);
                        return false;
                    }
                });
                $("#selectAll input[type='checkbox']").removeAttr("checked");
            }
        }
        if(selectUserList.length>0){
            $("#showSelected").html(Operation['ui_hasSelected']+":"+selectUserList.length+Operation['ui_personNum']+"<i class='icon icon-up'></i>");
            $("#showSelected").off("click",goToSelectedPage).on("click",goToSelectedPage);
        }else{
            $("#showSelected").html(Operation['ui_hasSelected']+":");
            $("#showSelected").off("click",goToSelectedPage);
        }
    }
}

$("#selectAll").change(function(){
    if($("#selectAll input[type='checkbox']").prop("checked")){
        $("#personListUl input[type='checkbox']:not(:checked)").click();
    }else{
        $("#personListUl input[type='checkbox']:checked").click();
    }
});

//选择的人员复选框选中
function checkSelectPeople(){
    $(selectUserList).each(function(){
        $("#"+this.userId).prop("checked",true);
    });
}

//跳转选择人列表
function goToSelectedPage(){
    $.router.loadPage("#page2");
    showPage2List();
}

function saveSelectedPeople(){
    $.router.back();
    if(peopleType == "charger"){
        chargerUser = selectUserList;
    }else if(peopleType == "worker"){
        workerUser = selectUserList;
    }
    listPeople(peopleType,selectUserList);
}

//page2
function showPage2List(){
    $("#selectedUl").empty();
    var html = '';
    $(selectUserList).each(function(){
        html += "<li data-remove=\""+this.userId+"\">\n" +
                "    <div class=\"item-content\">\n" +
                "        <div class=\"item-inner\">\n" +
                "            <div class=\"item-title\">"+Substation.removeUndefined(this.userName)+"</div>\n" +
                "            <div class=\"item-after\">\n" +
                "                <span class=\"removeUser redColor\" data-id=\""+this.userId+"\" data-name=\""+Substation.removeUndefined(this.userName)+"\">"+Operation['ui_remove']+"\n" +
                "                </span>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</li>";
    });
    $("#numberShow").html(selectUserList.length);
    $("#selectedUl").append(html);
    $(".removeUser").off("click",removeUser).on("click",removeUser);
}

function removeUser(){
    $("#selectAll input[type='checkbox']").removeAttr("checked");
    var thisUserid = $(this).attr("data-id");
    var thisUsername = $(this).attr("data-name");
    $("li[data-remove='"+thisUserid+"']").remove();
    $(selectUserList).each(function(i,obj){
        if(obj.userId == thisUserid){
            selectUserList.splice(i,1);
            return false;
        }
    });
    $("#"+thisUserid).removeAttr("checked");
    if(selectUserList.length>0){
        $("#showSelected").html(Operation['ui_hasSelected']+":"+selectUserList.length+Operation['ui_personNum']+"<i class='icon icon-up'></i>");
        $("#showSelected").off("click",goToSelectedPage).on("click",goToSelectedPage);
    }else{
        $("#showSelected").html(Operation['ui_hasSelected']+":");
        $("#showSelected").off("click",goToSelectedPage);
    }
    $("#numberShow").html(selectUserList.length);
}

$.init();