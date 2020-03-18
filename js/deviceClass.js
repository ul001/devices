var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
$(".pull-left.click_btn").click(function () {
    if (isIOS) {
        window.history.back();
    } else {
        android.goBack();
    }
});
var showDisItem = 1;
var editState = 0;
var pids = [{
    pId: -1,
    pName: "",
    tempId: -1
}];
var changeArr = [];
var clickNum = 0;
var thisPid = -1;
var editID = -1;
var changeTemp = false;
var getClickNum = localStorage.getItem("clickNum");
var getUrlPid = localStorage.getItem("pid");
var getUrlState = localStorage.getItem("editState");
var thisTempid = -1;
if (getUrlPid != "" && getUrlPid != null) {
    thisPid = getUrlPid;
    localStorage.removeItem("pid");
}
if (getUrlState != "" && getUrlState != null) {
    editState = getUrlState;
    localStorage.removeItem("editState");
}
if (getClickNum != "" && getClickNum != null) {
    clickNum = getClickNum;
    pids = JSON.parse(localStorage.getItem("pids"));
    thisTempid = pids[clickNum].tempId;
    localStorage.removeItem("clickNum");
}
var selectSubid = localStorage.getItem("fSubid");
var selectSubname = localStorage.getItem("fSubname");
$("#titleContent").text(selectSubname);
var thisMenuList = [];
var upLoadClicktag = true;

if (localStorage.getItem("need-refresh") == "true") {
    localStorage.removeItem("need-refresh");
    if (isAndroid) {
        android.refresh();
        //        return;
    } else {
        location.reload();
    }
}

function addBack() {
    $(".back-parent").unbind().click(function () {
        var obj = pids[clickNum];
        clickNum--;
        var lastPId = pids[clickNum].pId;
        thisTempid = pids[clickNum].tempId;
        pids.splice(jQuery.inArray(obj, pids), 1);
        if (lastPId == -1) {
            $(".child-page").css("display", "none");
            $(".parent-page").css("display", "block");
        }
        //$("#no-click").text(pids[clickNum].pName);
        thisMenuList = [];
        fillData(lastPId);
    });
}

function fillData(parentId) {
    if (thisMenuList.length == 0) {
        Substation.getDataByAjax("/selectSubDeviceGroupListByPid", {
            fSubid: selectSubid,
            fParentId: parentId
        }, function (data) {
            if (data.hasOwnProperty("menuList")) {
                if (data.menuList.length > 0) {
                    thisMenuList = data.menuList;
                    changeArr = data.menuList;
                    fillH5(parentId);
                }
            }
        });
    } else {
        fillH5(parentId);
    }
}

function fillH5(parentId) {
    changeTemp = false;
    thisPid = parentId;
    $(".child-page").css("display", "none");
    $(".parent-page").css("display", "block");
    var ul = $(".parent-page .list-container");
    if (parentId != -1) {
        ul = $(".child-page .list-container");
        $(".parent-page").css("display", "none");
        $(".child-page").css("display", "block");
        $("#no-click").text(pids[clickNum].pName);
    }
    ul.empty();
    if (editState == 0) {
        addBack();
    }
    $(thisMenuList).each(function () {
        var li = "";
        var linkStr = "<li class=\"item-content item-link item-dis\"";
        var linkIcon = "<div class=\"item-media\"><i class=\"icon icon-nodevice\"></i></div>\n";
        var valueStr = "";
        if (this.displayOrHideState == true) {
            linkStr = "<li class=\"item-content item-link\"";
            linkIcon = "<div class=\"item-media\"><i class=\"icon icon-device\"></i></div>\n";
        }
        if (this.hasOwnProperty("fPagedesigntemplateid")) {
            valueStr = this.fPagedesigntemplateid;
        }
        li = linkStr + " id=\"" + this.fSubdevicegroupid + "\" data-num=\"" + this.fSortnum + "\" value=\"" + valueStr + "\">\n" +
            linkIcon +
            "                        <div class=\"item-inner row no-gutter\">\n" +
            "                            <div class=\"item-title\">" + this.fSubdevicegroupname + "</div>\n" +
            "                                <div class=\"col-58\"><button class='button bg-primary' type=\"button\" onclick=\"renameLi()\">" + Operation['ui_rename'] + "</button>\n" +
            "                                <button class='button bg-primary' type=\"button\" onclick=\"cloneLi()\">" + Operation['ui_copy'] + "</button>\n" +
            "                                <button class='button bg-primary' type=\"button\" onclick=\"deleteLi()\">" + Operation['ui_delete'] + "</button></div>\n" +
            "                        </div>\n" +
            "                    </li>";
        ul.append(li);
    });
    if (showDisItem == 0) {
        $(".item-dis").css("display", "none");
    } else {
        $(".item-dis").css("display", "flex");
    }
    linkClick(parentId);
    $("#show-class").unbind().click(function () {
        if (showDisItem == 0) {
            showDisItem = 1;
            $("#show-class").text(Operation['ui_hidenodevice']);
            $(".item-dis").css("display", "flex");
        } else {
            showDisItem = 0;
            $("#show-class").text(Operation['ui_showalldevice']);
            $(".item-dis").css("display", "none");
        }
    });
    if (editState == 1) {
        $(".back-parent").unbind();
        $("#editBtn").text(Operation['ui_quit']);
        $("#add-class").css("display", "inline-block");
        $(".bar-header-secondary").after("            <nav class=\"bar bar-footer row\">\n" +
            "                <a href=\"#\" class=\"button bg-primary col-33\" onclick=\"changeUp()\"><i\n" +
            "                        class=\"icon icon-upChange\"></i>" + Operation['ui_up'] + "</a>\n" +
            "                <a href=\"#\" class=\"button bg-primary col-33\" onclick=\"confirmSort()\"><i\n" +
            "                        class=\"icon icon-yes\"></i>" + Operation['ui_suresort'] + "</a>\n" +
            "                <a href=\"#\" class=\"button bg-primary col-33\" onclick=\"changeDown()\"><i\n" +
            "                        class=\"icon icon-downChange\"></i> " + Operation['ui_down'] + "</a>\n" +
            "            </nav>");
        $(".item-content").unbind().click(function () {
            $(".item-edit").removeClass("item-edit");
            $(".col-40").removeClass("col-40");
            $(this).addClass("item-edit").siblings().removeClass("item-edit");
            $(this).find(".item-title").addClass("col-40");
            editID = $(this).attr("id");
        });
    }
    if (editID != -1) {
        $("#" + editID).addClass("item-edit").siblings().removeClass("item-edit");
        $("#" + editID).find(".item-title").addClass("col-40");
        $(".item-content").unbind().click(function () {
            $(".item-edit").removeClass("item-edit");
            $(".col-40").removeClass("col-40");
            $(this).addClass("item-edit").siblings().removeClass("item-edit");
            $(this).find(".item-title").addClass("col-40");
            editID = $(this).attr("id");
        });
    }
}

function linkClick(parentId) {
    $(".item-content").click(function (event) {
        if(!upLoadClicktag){
          return;
        }
        upLoadClicktag = false;
        setTimeout(function() {
          upLoadClicktag = true;
        }, 1000);
        var fField = $(this).attr("value");
        thisTempid = fField;
        var clickId = $(this).attr("id");
        var clickName = $(this).find(".item-title").text();
        Substation.getDataByAjax("/selectSubDeviceGroupListByPid", {
            fSubid: selectSubid,
            fParentId: clickId
        }, function (data) {
            if (data.hasOwnProperty("menuList")) {
                if (data.menuList.length > 0) {
                    thisMenuList = data.menuList;
                    changeArr = data.menuList;
                    clickNum++;
                    var parentName = $("#" + clickId).find(".item-title").text();
                    pids.push({
                        pId: clickId,
                        pName: parentName,
                        tempId: fField
                    });
                    //$("#no-click").text(parentName);
                    $(".parent-page").css("display", "none");
                    $(".child-page").css("display", "block");
                    fillData(clickId);
                    return;
                }
            }
            var clickTree = [];
            $(pids).each(function () {
                if (this.pName != "") {
                    clickTree.push(this.pName);
                }
            });
            clickTree.push(clickName);
            var clickTreeStr = clickTree.join("-");
            localStorage.setItem("clickGroupTree", clickTreeStr);
            localStorage.setItem("pids", JSON.stringify(pids));
            localStorage.setItem("pid", thisPid);
            localStorage.setItem("clickNum", clickNum);
            localStorage.setItem("fDeviceGroupId", clickId);
            localStorage.setItem("fTempid", thisTempid);
            if (isAndroid) {
                android.goToIn();
            } else {
                window.location.href = "AutoloadDetail.html";
            }
            /* if (fField != "" && fField != null) {
//            localStorage.setItem("fDeviceGroupId", clickId);
            //localStorage.setItem("fFunctionfield",fField);
//            localStorage.setItem("fPid", parentId);

        } */
        });
        event.stopPropagation();
    });
}

function editContent() {
    if (editState == 0) {
        editState = 1;
        $(".back-parent").unbind();
        $("#editBtn").text(Operation['ui_quit']);
        $("#add-class").css("display", "inline-block");
        $(".bar-header-secondary").after("            <nav class=\"bar bar-footer row\">\n" +
            "                <a href=\"#\" class=\"button bg-primary col-33\" onclick=\"changeUp()\"><i\n" +
            "                        class=\"icon icon-upChange\"></i>" + Operation['ui_up'] + "</a>\n" +
            "                <a href=\"#\" class=\"button bg-primary col-33\" onclick=\"confirmSort()\"><i\n" +
            "                        class=\"icon icon-yes\"></i>" + Operation['ui_suresort'] + "</a>\n" +
            "                <a href=\"#\" class=\"button bg-primary col-33\" onclick=\"changeDown()\"><i\n" +
            "                        class=\"icon icon-downChange\"></i>" + Operation['ui_down'] + "</a>\n" +
            "            </nav>");
        $(".item-content").unbind().click(function () {
            $(".item-edit").removeClass("item-edit");
            $(".col-40").removeClass("col-40");
            $(this).addClass("item-edit").siblings().removeClass("item-edit");
            $(this).find(".item-title").addClass("col-40");
            editID = $(this).attr("id");
        });
    } else if (editState == 1) {
        editState = 0;
        editID = -1;
        addBack();
        $("#editBtn").text(Operation['ui_edit']);
        $(".bar-footer").remove();
        $(".col-40").removeClass("col-40");
        $("#add-class").css("display", "none");
        $(".item-content").removeClass("item-edit");
        $(".item-content").unbind();
        if (changeTemp == true) {
            fillData(thisPid);
        } else {
            linkClick(thisPid);
        }
    }
}

function renameLi() {
    var idVal = $(".item-edit").attr("id");
    $.prompt(Operation['ui_rename'], function (value) {
        Substation.postDataByAjax("/updateSubDeviceGroup", {
            fSubdevicegroupname: value,
            fSubdevicegroupid: idVal
        }, function (data) {
            if (data.code == 200) {
                $.toast(Operation['ui_renamesuccess']);
                $("#" + idVal).find(".item-title").text(value);
            }
        });
    });
    $(".modal-text-input").val($("#" + idVal).find(".item-title").text());
    $(".modal-text-input").select();
}

function cloneLi() {
    var idVal = $(".item-edit").attr("id");
    Substation.postDataByAjax("/copySubDeviceGroup", {
        copyId: idVal
    }, function (data) {
        if (data.code == 200) {
            thisMenuList = [];
            fillData(thisPid);
        }
    });
}

function deleteLi() {
    var idVal = $(".item-edit").attr("id");
    $.confirm(Operation['ui_suretodel'], function () {
        Substation.getDataByAjax("/deleteSubDeviceGroup", {
            deleteId: idVal,
            fSubid: selectSubid
        }, function () {
            $("#" + idVal).remove();
        });
    });
}

function changeUp() {
    changeTemp = true;
    if ($(".item-edit").length > 0) {
        var index = $(".item-edit");
        var idVal = $(".item-edit").attr("id");
        if (index.index() != 0) {
            var secordId = index.prev().attr("id");
            getChangeArr(changeArr, idVal, secordId);
            index.prev().before(index);
        }
    }
}

function changeDown() {
    changeTemp = true;
    if ($(".item-edit").length > 0) {
        var index = $(".item-edit");
        var idVal = $(".item-edit").attr("id");
        var list = $(".item-edit").siblings();
        if (index.index() != list.length) {
            var secordId = index.next().attr("id");
            getChangeArr(changeArr, idVal, secordId);
            index.next().after(index);
        }
    }
}

function confirmSort() {
    if (changeTemp) {
        var jsonStr = JSON.stringify(changeArr);
        changeTemp = false;
        Substation.postDataByAjax("/updateBatchDeviceGroup", {
            groupList: jsonStr
        }, function (data) {
            if (data.code == 200) {
                $.toast(Operation['ui_sortsuccess']);
            }
        });
    }
}

function addDeviceClass() {
    if(!upLoadClicktag){
      return;
    }
    upLoadClicktag = false;
    setTimeout(function() {
      upLoadClicktag = true;
    }, 1000);
    localStorage.setItem("pids", JSON.stringify(pids));
    localStorage.setItem("pid", thisPid);
    localStorage.setItem("clickNum", clickNum);
    localStorage.setItem("tempId", thisTempid);
    if (isAndroid) {
        android.goToIn2();
    } else {
        window.location.href = "addDeviceClass.html";
    }
}

function getChangeArr(arr, firstId, secordId) {
    var index1, index2;
    var sort1 = -1;
    var sort2 = -1;
    $(arr).each(function (index, obj) {
        if (obj.fSubdevicegroupid == firstId) {
            index1 = index;
            sort1 = obj.fSortnum;
            return true;
        } else if (this.fSubdevicegroupid == secordId) {
            index2 = index;
            sort2 = obj.fSortnum;
            return true;
        }
        if (sort1 != -1 && sort2 != -1) {
            return false;
        }
    });
    arr[index1].fSortnum = sort2;
    arr[index2].fSortnum = sort1;
}

//离线缓存
/*Substation.getDataByAjax("/selectSubDeviceGroupList", {fSubid:selectSubid}, function (data) {
    var thisTemids = [];
    var thisList = data.subdevicegroupList;
    $(thisList).each(function(){
        if(this.hasOwnProperty("fPagedesigntemplateid")){
            thisTemids.push(this);
        }
    });
    var devicelist = [];
    $(data.deviceList).each(function(index,obj){
        $(thisTemids).each(function(){
            if(this.fSubdevicegroupid==obj.fSubdevicegroupid){
                devicelist.push(this);
                return false;
            }
        });
    });
    Substation.addState(devicelist,thisList,'fSubdevicegroupid','fParentid');
    localStorage.setItem("subDeviceGroupTree",JSON.stringify(thisList));
});*/
fillData(thisPid);

$.init();