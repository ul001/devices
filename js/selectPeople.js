var thisGroupid = -1;
var selectUserList = [];
var thisType = localStorage.getItem("peopleType");
if(thisType == "charger"){
    $("#peopleType").text(Operation['ui_charger']);
}else if(thisType == "worker"){
    $("#peopleType").text(Operation['ui_worker']);
}

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
                        "                    <i class=\"icon icon-nextclass\"></i>下级\n" +
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
        Substation.getDataByAjax("/selectUserListByGroupId",{groupId: gid},function(data){
            if (data.hasOwnProperty("userList") && data.userList.length > 0) {
                var html = "";
                $(data.userList).each(function(){
                    html += "<li>\n" +
                            "    <label class=\"label-checkbox item-content\">\n" +
                            "        <input type=\"checkbox\" name=\"my-checkbox\" id=\""+this.fUserid+"\" data-name=\""+Substation.removeUndefined(this.fUsername)+"\">\n" +
                            "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                            "        <div class=\"item-inner\">\n" +
                            "            <div class=\"item-title\">"+Substation.removeUndefined(this.fUsername)+"</div>\n" +
                            "        </div>\n" +
                            "    </label>\n" +
                            "</li>"
                });
                $("#personListUl").append(html);
                $("input[type='checkbox']").off("change",addChangeListener).on("change",addChangeListener);
                checkSelectPeople();
            }else{
                $(".personUl").hide();
            }
        });
}

getGroupClass(thisGroupid);

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
        if(selectUserList.length>0){
            $("#showSelected").html("已选择:"+selectUserList.length+"人<i class='icon icon-up'></i>");
            $("#showSelected").off("click",goToSelectedPage).on("click",goToSelectedPage);
        }else{
            $("#showSelected").html("已选择:");
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
    localStorage.setItem("userList",JSON.stringify(selectUserList));
    window.history.back();
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
                "                <span class=\"removeUser redColor\" data-id=\""+this.userId+"\" data-name=\""+Substation.removeUndefined(this.userName)+"\">移除\n" +
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
        $("#showSelected").html("已选择:"+selectUserList.length+"人<i class='icon icon-up'></i>");
        $("#showSelected").off("click",goToSelectedPage).on("click",goToSelectedPage);
    }else{
        $("#showSelected").html("已选择:");
        $("#showSelected").off("click",goToSelectedPage);
    }
    $("#numberShow").html(selectUserList.length);
}

$.init();