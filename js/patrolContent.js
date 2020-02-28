var clickRadioName = "";
var selectSubid = localStorage.getItem("fSubid");
var fPlacecheckformid = localStorage.getItem("fPlacecheckformid");
var missiontaskID = localStorage.getItem("missiontaskID");
var canClick = localStorage.getItem("canClick");
var defectPosition = "";
var defectPositionVal = "";
var deadline = "";
var clickDeviceInfoId = -1;
var itemCode = "";
var tempNum = -1;
var imgNum = 0;
var pids = [{
    pid: -1,
    pname: ""
}];
var thisGroupid = -1;
var clickGroupTree = "";
var hasSave = false;
//iOS安卓基础传参
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

if (canClick == "false") {
    $("#saveBtn").css("display", "none");
}
var getSaveList = localStorage.getItem(missiontaskID);
//android持久化储存
/*if(isAndroid){
    getSaveList = android.getSPItem(missiontaskID);
}*/
var allGroupList = [];
if (getSaveList != null && getSaveList != "") {
    allGroupList = JSON.parse(getSaveList);
}
if (allGroupList != null && allGroupList != "" && allGroupList.length > 0) {
    loadPage();
} else {
    Substation.getDataByAjax("/subDeviceTreeSelectHideOrShow", {
        fSubid: selectSubid
    }, function (data) {
        allGroupList = data.subDeviceGroupList;
        loadPage();
    });
}


function loadPage() {
    var clickNum = 0;
    var showState = 0;
    //主页内容
    function fillRightData() {
        Substation.getDataByAjax("/getDeviceInspectionTemplate", {
            fSubdevicegroupid: thisGroupid,
            fSubid: selectSubid,
            fPlacecheckformid: fPlacecheckformid
        }, function (data) {
            $(".content-block .tabs").empty();
            $(".buttons-tab").empty();
            var tempJson = "";
            if (data.hasOwnProperty("template")) {
                tempJson = data.template;
                tempJson = JSON.parse(tempJson);
                tempNum = tempJson.checkInfo.length;
            }
            if (tempNum == 0) {
                $.alert("可前往网页端设备管理->设备定义->选择(" + $('#subName').text() + ")分组->巡检信息添加巡检项");
                $("#saveBtn").hide();
                hasSave = true;
            }
            if (data.list.length > 0) {
                var itemNum = 0;
                $(data.list).each(function (index, obj) {
                    itemNum++;
                    var thisValueJson = [];
                    if (this.hasOwnProperty("fInspectionslipjson")) {
                        if (this.fInspectionslipjson != "" && this.fInspectionslipjson != null) {
                            thisValueJson = JSON.parse(this.fInspectionslipjson);
                        }
                    }
                    var tempStr = "";
                    var num = 0;
                    $(tempJson.checkInfo).each(function () {
                        num++;
                        if (this.type == "radio") {
                            inputStr = "<div class=\"card\">\n" +
                                "                                <div class=\"card-content\">\n" +
                                "                                    <div class=\"card-content-inner\">\n" +
                                "                                        " + decodeURIComponent(this.name) + "\n" +
                                "                                        <div class=\"pull-right\">\n" +
                                "                                            <label class=\"label-checkbox item-content\">\n" +
                                "                                                <input type=\"radio\" data-name=\"" + decodeURIComponent(this.name) + "\" data-code=\"" + this.code + "\" data-json='" + JSON.stringify(this) + "' name=\"" + (obj.fSubdeviceinfoid + "" + this.code) + "\" value=\"yes\">\n" +
                                "                                                <div class=\"item-media\"><i\n" +
                                "                                                        class=\"icon icon-form-checkbox\"></i></div>\n" +
                                "                                                <div class=\"item-inner\">\n" +
                                "                                                    是\n" +
                                "                                                </div>\n" +
                                "                                            </label>\n" +
                                "                                            &nbsp;\n" +
                                "                                            <label class=\"label-checkbox item-content\">\n" +
                                "                                                <input type=\"radio\" data-name=\"" + decodeURIComponent(this.name) + "\" data-code=\"" + this.code + "\" name=\"" + (obj.fSubdeviceinfoid + "" + this.code) + "\" value=\"no\" checked>\n" +
                                "                                                <div class=\"item-media\"><i\n" +
                                "                                                        class=\"icon icon-form-checkbox\"></i></div>\n" +
                                "                                                <div class=\"item-inner\">\n" +
                                "                                                    否\n" +
                                "                                                </div>\n" +
                                "                                            </label>\n" +
                                "                                            <i data-popover='.popover-links' class='icon icon-tips open-popover' data-value=\"" + decodeURIComponent(this.identification) + "\"></i>\n" +
                                "                                        </div>\n" +
                                "                                    </div>\n" +
                                "                                </div>\n" +
                                "                            </div>\n";
                        } else if (this.type == "input") {
                            var thisInputName = decodeURIComponent(this.name);
                            if (this.value == "true") {
                                thisInputName = "<span class=\"redColor\">*</span>" + thisInputName;
                            }
                            inputStr = "<div class=\"card\">\n" +
                                "                                <div class=\"card-content\">\n" +
                                "                                    <div class=\"card-content-inner\">\n" +
                                "                                        " + thisInputName + "\n" +
                                "                                        <div class=\"pull-right\">\n" +
                                "                                            <input type=\"text\" data-name=\"" + decodeURIComponent(this.name) + "\" data-code=\"" + this.code + "\" data-state=\"" + this.value + "\">\n" +
                                "                                            <i data-popover='.popover-links' class='icon icon-tips open-popover' data-value=\"" + decodeURIComponent(this.identification) + "\"></i>\n" +
                                "                                        </div>\n" +
                                "                                    </div>\n" +
                                "                                </div>\n" +
                                "                            </div>";
                        }
                        tempStr += inputStr;
                    });
                    if (canClick == "false") {
                        if (thisValueJson.length > 0) {
                            $(".buttons-tab").append("<a href=\"#" + obj.fSubdeviceinfoid + "\" id=\"" + itemNum + "\" class=\"tab-link button\">" + obj.fDevicename + "</a>");
                            $(".content-block .tabs").append("<div id=\"" + obj.fSubdeviceinfoid + "\" class=\"tab pull-to-refresh-content\">\n" +
                                "<div class=\"pull-to-refresh-layer\"></div>\n" +
                                "<div class=\"content-block\">\n" + tempStr +
                                "</div>\n" +
                                "</div>");
                        }
                        $(".icon.icon-tips").hide();
                    } else {
                        $(".buttons-tab").append("<a href=\"#" + obj.fSubdeviceinfoid + "\" id=\"" + itemNum + "\" class=\"tab-link button\">" + obj.fDevicename + "</a>");
                        $(".content-block .tabs").append("<div id=\"" + obj.fSubdeviceinfoid + "\" class=\"tab pull-to-refresh-content\">\n" +
                            "<div class=\"pull-to-refresh-layer\"></div>\n" +
                            "<div class=\"content-block\">\n" + tempStr +
                            "</div>\n" +
                            "</div>");
                        if (tempStr != "") {
                            $("#saveBtn").show();
                        }
                    }
                    //给模板赋值
                    if (thisValueJson.length > 0) {
                        $(thisValueJson).each(function () {
                            if (this.type == "radio") {
                                $("input[name='" + (obj.fSubdeviceinfoid + "" + this.code) + "'][value='" + this.value + "']").attr("checked", true);
                            } else {
                                $("#" + obj.fSubdeviceinfoid + " input[data-code='" + this.code + "']").val(this.value);
                            }
                        });
                    }
                    $(".tab-link.button").unbind().click(function () {
                        var clickItemNum = $(this).attr("id");
                        clickGroupTree += "-" + $(this).text();
                        localStorage.setItem("itemNum", clickItemNum);
                        localStorage.setItem("clickTree", clickGroupTree);
                    });
                    $(".icon-tips").unbind().click(function () {
                        var tipStr = $(this).attr("data-value");
                        $("#popShow").text("辨识标准：" + tipStr);
                        //                        $(".open-popover").click();
                    });
                });
            } else {
                $("#saveBtn").css("display", "none");
                $.alert("此分组下无设备！");
                hasSave = true;
            }
            addRadioClick();
            goToInfo();
            getGroupidContent();
            $(".tab-link").eq(0).click();
            if (canClick == "false") {
                $($("input")).each(function () {
                    $(this).attr("readonly", true);
                });
                $($(":radio")).each(function () {
                    $(this).attr("disabled", true);
                });
                $($("select")).each(function () {
                    $(this).attr("disabled", true);
                });
                $(".upload_img_wrap .upload_img").unbind();
            }
        });
    }

    function getGroupidContent() {
        if (thisGroupid == -1) {
            $(".content").css("display", "none");
        } else {
            $(".content").css("display", "block");
        }
    }

    getGroupidContent();

    //左侧菜单
    function addBackClick() {
        $(".back-parent").unbind().click(function () {
            if (pids[clickNum + 1] != null) {
                pids.splice(-1, 1);
            }
            clickNum--;
            var lastPId = pids[clickNum];
            pids.splice(-1, 1);
            fillData(lastPId.pid);
        });
    }

    function fillData(parentId) {
        /*        var params = {
                    fSubid: selectSubid,
                    fParentId: parentId
                }
                Substation.getDataByAjax("/selectSubDeviceGroupListByPid", params, function (data) {
                    if (data.hasOwnProperty("menuList")) {
                        if (data.menuList.length > 0) {
                            fillH5(parentId, data.menuList);
                        }
                    }
                });*/
        var someList = getSubDeviceListByPid(allGroupList, parentId);
        fillH5(parentId, someList);
    }

    //根据pid获取分组
    function getSubDeviceListByPid(allList, pid) {
        return allList.filter(function (obj) {
            return obj.pId == pid;
        });
    }

    function fillH5(parentId, thisList) {
        var ul;
        if (parentId == -1) {
            ul = $(".list-block .list-container");
            ul.empty();
        } else {
            ul = $(".list-block .list-container");
            ul.html("<li class=\"item-content back-parent\">\n" +
                "                        <div class=\"item-inner\">\n" +
                "                            <div class=\"item-title\"><i class=\"icon icon-goprev\"></i>" + Operation['ui_upperlevel'] + "</div>\n" +
                "                        </div>\n" +
                "                    </li>");
        }
        $(thisList).each(function () {
            var li = "";
            var linkStr = "<li class=\"item-content item-link";
            if (this.displayOrHideState == false) {
                linkStr = "<li class=\"item-content item-link item-dis";
            }
            var thisCList = selectChildrenList(allGroupList, this.fSubdevicegroupid);
            var num = thisCList.length;
            if (num > 0) {
                getChildNum(thisCList);
            }

            function getChildNum(allList) {
                $.each(allList, function (i, obj) {
                    var thisCList = selectChildrenList(allList, obj.id);
                    if (thisCList.length > 0) {
                        num += thisCList.length;
                        getChildNum(thisCList);
                    } else {
                        return false;
                    }
                });
            }
            var classCss = "";
            if (num == 0) {
                if (this.taskFinishFlag == "0") {

                } else {
                    classCss = " finished";
                }
            } else {
                var finishRadio = (Number(this.taskFinishFlag)) / num;
                if (finishRadio < 1 && finishRadio > 0) {
                    classCss = " halfFinished";
                } else if (finishRadio == 1) {
                    classCss = " finished";
                } else {
                    //                    classCss = " halfFinished";
                }
            }
            li = linkStr + "\" id=\"" + this.fSubdevicegroupid + "\">\n" +
                "                        <div class=\"item-inner" + classCss + "\">\n" +
                "                            <div class=\"item-title\">" + this.fSubdevicegroupname + "</div>\n" +
                "                        </div>\n" +
                "                    </li>";
            ul.append(li);
        });

        function selectChildrenList(allList, thisid) {
            var thisList = allList.filter(function (obj) {
                return obj.pId == thisid && obj.displayOrHideState;
            });
            return thisList;
        }
        if (showState == 0) {
            $("#showOrHide").text(Operation['ui_showalldevice']);
            $(".item-dis").css("display", "none");
        } else {
            $("#showOrHide").text(Operation['ui_showOnlydevice']);
            $(".item-dis").css("display", "flex");
        }
        $("#showOrHide").unbind().click(function () {
            if (showState == 0) {
                showState = 1;
                $("#showOrHide").text(Operation['ui_showOnlydevice']);
                $(".item-dis").css("display", "flex");
            } else {
                showState = 0;
                $("#showOrHide").text(Operation['ui_showalldevice']);
                $(".item-dis").css("display", "none");
            }
        });
        linkClick(parentId);
        addBackClick();
    }

    function linkClick(parentId) {
        $(".list-block .item-link").unbind().click(function (event) {
            var clickId = $(this).attr("id");
            //            var params = {
            //                fSubid: selectSubid,
            //                fParentId: clickId
            //            }
            //            Substation.getDataByAjax("/selectSubDeviceGroupListByPid", params, function (data) {
            var someList = getSubDeviceListByPid(allGroupList, clickId);
            if (someList.length > 0) {
                //                    if (data.menuList.length > 0) {
                $(".selectLi").removeClass("selectLi");
                var clickName = $("#" + clickId + " .item-title").text();
                if (clickNum == 0) {
                    if (pids[clickNum + 1] != null) {
                        pids.splice(-1, 1);
                    }
                }
                clickNum++;
                pids.push({
                    pid: clickId,
                    pname: clickName
                });
                $(".parent-page").css("display", "none");
                $(".child-page").css("display", "block");
                fillData(clickId);
                return;
                //                    }
            }
            thisGroupid = clickId;
            $("#" + clickId).addClass("selectLi").siblings().removeClass("selectLi");
            hasSave = false;
            var thisId = clickId;
            var clickName = $("#" + thisId + " .item-title").text();
            if (pids[clickNum + 1] == null) {
                pids.push({
                    pid: thisId,
                    pname: clickName
                });
            } else {
                pids[clickNum + 1] = {
                    pid: thisId,
                    pname: clickName
                };
            }
            var titleTree = "";
            clickGroupTree = "";
            $(pids).each(function () {
                titleTree += this.pname + ">";
                clickGroupTree += this.pname + "-";
            });
            clickGroupTree = clickGroupTree.substring(1, clickGroupTree.length - 1);
            var titleTreeName = titleTree.substring(1, titleTree.length - 1);
            $("#subName").text(titleTreeName);
            $(".content-block .close-panel").click();
            fillRightData();
            //            });
            event.stopPropagation();
        });
    };

    function addRadioClick() {
        $(":radio").change(function () {
            var clickDeviceId = $(".tab.active").attr("id");
            var radioName = $(this).attr("name");
            var deviceItemCode = $(this).attr("data-code");
            if ($(this).val() == "yes") {
                localStorage.setItem("defectJson", $(this).attr("data-json"));
                //                window.location.href="defectPage.html?fSubdeviceinfoid="+clickDeviceId;
                clickDeviceInfoId = clickDeviceId;
                clickRadioName = radioName;
                itemCode = deviceItemCode;
                $(":radio[name='" + clickRadioName + "'][value='no']").prop("checked", true);
                $.router.loadPage("#page2");
                loadPage2();
            } else {
                $.confirm("确定要删除已登记的缺陷？", function () {
                    var params = {
                        fSubdeviceinfoid: clickDeviceId,
                        fPlacecheckformid: fPlacecheckformid,
                        fDeviceitem: deviceItemCode
                    };
                    Substation.getDataByAjax("/deleteCheckItemProblems", params, function () {
                        $.toast("删除成功");
                        saveThisPage();
                    });
                }, function () {
                    $(":radio[name='" + radioName + "'][value='yes']").prop("checked", true);
                });
            }
        });
    }

    function addLeftClick() {
        $(".icon-select").click(function () {
            if (canClick != "false" && !hasSave) {
                var str = Operation['ui_hasnosave'];
                $.confirm(str, function () {
                    $(".open-panel").click();
                });
            } else {
                $(".open-panel").click();
            }
        });
    }
    addLeftClick();

    $("#saveBtn").click(function () {
        hasSave = true;
        saveThisPage();
    });

    fillData(-1);

    //    $(".open-panel").click();

    //保存状态
    var savePids = JSON.parse(localStorage.getItem("clickPids"));
    localStorage.removeItem("clickPids");
    if (savePids == null) {
        $(".open-panel").click();
    }
    var clickItemNum = localStorage.getItem("itemNum");
    localStorage.removeItem("itemNum");
    if (savePids != "" && savePids != null) {
        pids = savePids;
        thisGroupid = pids[pids.length - 1].pid;
        var titleTree = "";
        clickGroupTree = "";
        $(pids).each(function () {
            titleTree += this.pname + ">";
            clickGroupTree += this.pname + "-";
        });
        clickGroupTree = clickGroupTree.substring(1, clickGroupTree.length - 1);
        var titleTreeName = titleTree.substring(1, titleTree.length - 1);
        $("#subName").text(titleTreeName);
        fillRightData();
        //        $(".close-panel").click();
        $("#" + clickItemNum).click();
    }
}

function loadPage2() {
    var defectJson = JSON.parse(localStorage.getItem("defectJson"));
    var code = defectJson.code;
    var name = decodeURIComponent(defectJson.name);
    defectPosition = decodeURIComponent(defectJson.defectPosition);
    var identification = decodeURIComponent(defectJson.identification);
    deadline = decodeURIComponent(defectJson.deadline);
    var dangerous = defectJson.dangerous;
    $("#defectDiscribe").val(name);
    $("#defectPosition").empty();
    if (defectPosition != "" && defectPosition != null) {
        $(".redColor").show();
        var defectPositionArray = defectPosition.split(";");
        $(defectPositionArray).each(function (index, obj) {
            $("#defectPosition").append('<input type="checkbox" value="' + obj + '" id="' + index + '"><label for="' + index + '">' + obj + '</label><br>');
        });
    } else {
        $(".redColor").hide();
    }
    $("#dangerCategory").val(defectJson.dangerCategory);
    $("#dangerType").val(defectJson.dangerType);
    $("#dangerous").val(dangerous);
    $("#suggest").val(defectJson.suggest);
    $("#deadline").val(deadline);
    defectPositionVal = defectPosition;
    var fSubdeviceinfoid = clickDeviceInfoId;

    $("#inputBox").html("");
    $("#imgBox").html('<img class="upload_img" src="img/upload_img.png"/>');
    $(".upload_img_wrap .upload_img").on("click", function () {
        //console.log(ev.currentTarget.dataset.id)
        var index = imgNum + 1;
        if ($("#file" + index).length < 1) {
            //        var ua = navigator.userAgent.toLowerCase(); //获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
            //        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1); //判断是否是苹果手机，是则是true
            //        if (isIos) {
            //            $("#inputBox").append("<input type=\"file\" name=\"cover\" data-id=\"" + index + "\" title=\"请选择图片\" id=\"file" + index + "\" accept=\"image/png,image/jpg,image/gif,image/JPEG\" />");
            //            // $("input:file").removeAttr("capture");
            //        }else{
            $("#inputBox").append("<input type=\"file\" class=\"fileInput\"  capture=\"camera\" name=\"file\" data-id=\"" + index + "\" title=\"请选择图片\" id=\"file" + index + "\" accept=\"image/png,image/jpg,image/gif,image/JPEG\" />");
            //        }
        }
        $("#file" + index).click();
        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
        if (isIOS) {
            $("#file" + index).click();
        }
        $("#file" + index).unbind().change(function (e) {
            var index = e.currentTarget.dataset.id;
            if ($('#file' + index).val() == '') {
                $("#inputBox input").eq(index - 1).remove();
                return false;
            }
            var filePath = $(this).val();
            changeImg(e, filePath, index);
            imgNum++;
            //$(".upload_img_length").html(imgNum);
            return;
        });
    });

}

function saveThisPage() {
    var changeJson = [];
    if ($("input[data-state='true']")) {
        var thisTemp = false;
        $("input[data-state='true']").each(function () {
            if ($(this).val() == "") {
                $.toast("请填入必填项");
                thisTemp = true;
                return;
            }
        });
        if (thisTemp) {
            return;
        }
    }
    $(".tabs .tab").each(function () {
        var deviceJson = {};
        var deviceId = $(this).attr("id");
        var inputArray = [];
        $("#" + deviceId + " .card").each(function (index, obj) {
            var thisInput = $(obj).find($("input[type='radio']:checked"))[0];
            var thisObj = {};
            if (thisInput) {
                thisObj['code'] = $(thisInput).attr("data-code");
                thisObj['name'] = $(thisInput).attr("data-name");
                thisObj['value'] = $(thisInput).attr("value");
                thisObj['type'] = "radio";
            } else {
                thisObj['code'] = $(obj).find($("input")).attr("data-code");
                thisObj['name'] = $(obj).find($("input")).attr("data-name");
                thisObj['value'] = $(obj).find($("input")).val();
                thisObj['type'] = "input";
            }
            inputArray.push(thisObj);
        });
        deviceJson['fInspectionslipjson'] = inputArray;
        deviceJson['fSubdeviceinfoid'] = deviceId;
        deviceJson['fPlacecheckformid'] = fPlacecheckformid;
        deviceJson['fItemnum'] = tempNum;
        changeJson.push(deviceJson);
    });
    var jsonStr = JSON.stringify(changeJson);
    Substation.postDataByAjax("/updateInspectionDetail", {
        fPlacecheckformid: fPlacecheckformid,
        deviceList: jsonStr
    }, function (data) {
        if (data.code == 200) {
            $.toast("保存成功");
            var thisGroupid = pids[pids.length - 1].pid;
            var needChange = true;
            $.each(allGroupList, function (i, obj) {
                if (thisGroupid == obj.id) {
                    if (obj.taskFinishFlag == "0") {
                        needChange = true;
                    } else {
                        needChange = false;
                    }
                    return false;
                }
            });
            if (needChange) {
                $(pids).each(function () {
                    changeListVal(this.pid);
                });
                //                fillData(thisGroupid);
                //android持久化储存
                //                if(isAndroid){
                //                    android.setSPItem(missiontaskID,JSON.stringify(allGroupList));
                //                }else{
                localStorage.setItem(missiontaskID, JSON.stringify(allGroupList));
                //                }
                $("#" + thisGroupid + " .item-inner").addClass("finished");
            }
            localStorage.setItem("need-update", "true");
        }
    });

}

function changeListVal(thisId) {
    $.each(allGroupList, function (i, obj) {
        if (obj.id == thisId) {
            allGroupList[i].taskFinishFlag = (Number(obj.taskFinishFlag) + 1) + "";
            return false;
        }
    });
}

//function returnClick(){
//    $(":radio[name='"+clickRadioName+"'][value='no']").prop("checked",true);
//}

function changeImg(e, filePath, index) {
    fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
    //检查后缀名
    if (!fileFormat.match(/.png|.jpg|.jpeg/)) {
        showError('文件格式必须为：png/jpg/jpeg');
        return;
    }
    //获取并记录图片的base64编码
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    //    var timeStr = e.target.files[0].lastModified;
    reader.onloadend = function () {
        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
        var dataURL = reader.result;
        //        if(isAndroid){
        // 显示图片
        $("#imgBox").append('<div class="imgContainer" data-index=' + index + '><img   src=' + dataURL + ' onclick="imgDisplay(this)"><img onclick="removeImg(this,' + index + ')"  class="imgDelete" src="img/del_img.png" /></div>');
        //        }else{
        //            shuiyin(dataURL,timeStr,index);
        //        }
        // console.log(dataURL)
    };
}

//function shuiyin(imgurl, addtext, index) {
//    var img = new Image();
//    img.src = imgurl;
//    var url = "";
//    img.onload = function () {
//        // 创建 canvas 用来绘制图片和水印
//        let canvas = document.createElement('canvas')
//        // var canvas = document.getElementById(canvasid);
//        // 在 canvas 上绘制原图
//        canvas.width = img.width;
//        canvas.height = img.height;
//        var ctx = canvas.getContext("2d");
//        ctx.drawImage(img, 0, 0);
//        ctx.font = "14px 微软雅黑";
//        ctx.fillStyle = "rgba(252,255,255,0.8)";
//        ctx.fillText(addtext, img.width - 100-20, img.height -20,100); //选择位置
//        url = canvas.toDataURL("image/png", 0.5);
//        $("#imgBox").append('<div class="imgContainer" data-index=' + index + '><img src=' + url + ' onclick="imgDisplay(this)"><img onclick="removeImg(this,' + index + ')"  class="imgDelete" src="img/del_img.png" /></div>');
//    }
//}

function removeImg(obj, index) {
    for (var i = 0; i < $(".imgContainer").length; i++) {
        if ($(".imgContainer").eq(i).attr("data-index") == index) {
            var imgId = $(".imgContainer").eq(i).attr("id");
            if (imgId == undefined) {
                $(".imgContainer").eq(i).remove();
                $("#file" + (i + 1)).remove();
            } else {
                //                if(confirm("确定要删除已保存的图片？")){
                $.confirm("确定要删除已保存的图片？", function () {
                    $(".imgContainer").eq(i).remove();
                    Substation.getDataByAjax("/deleteSubstationImg", {
                        fId: imgId
                    }, function () {

                    });
                });
                /*$(".imgContainer").eq(i).remove();
                Substation.getDataByAjax("/deleteSubstationImg", {
                    fId: imgId
                }, function () {

                });*/
                //                }
            }
            imgNum--;
            break;
        }
    }
    //$(".upload_img_length").html(imgNum);
}


function imgDisplay(obj) {
    var src = $(obj).attr("src");
    var imgHtml = '<div style="width: 100%;height: 100vh;overflow: auto;background: rgba(0,0,0,0.5);text-align: center;position: fixed;top: 0;left: 0;z-index: 2000;display: flex;justify-content: center;    align-items: center;"><img onclick="closePicture(this)" src=' + src + ' style="margin-top: 100px;width: 96%;margin-bottom: 100px;"/><p style="font-size: 50px;position: fixed;top: 30px;right: 30px;color: white;cursor: pointer;" onclick="closePicture(this)">×</p></div>'
    $('body').append(imgHtml);
}

function closePicture(obj) {
    $(obj).parent("div").remove();
}

/*function loadSavedPic() {
    Substation.getDataByAjax("/selectSubstationImg", {
        fSubid: selectSubid
    }, function (data) {
        if (data.hasOwnProperty("substationImgList") && data.substationImgList.length > 0) {
            var imgUrl = data.substationImgUrl;
            $.each(data.substationImgList, function (i, value) {
                imgNum++;
                var imgDiv = '<div class="imgContainer" id=' + value.fId + ' data-index=' + (i + 1) + '><img   src=' + (Substation.ipAddressFromAPP + imgUrl + "/" + value.fImagename) + ' onclick="imgDisplay(this)"><img onclick="removeImg(this,' + (i + 1) + ')"  class="imgDelete" src="img/del_img.png" /></div>';
                $("#imgBox").append(imgDiv);
            });
        }
    });
}

loadSavedPic();*/

function saveFormData() {
    $(".fileInput").each(function () {
        if ($(this).val() == "" || $(this).val() == null) {
            $(this).remove();
        }
    });
    if ($(".fileInput").length > 6) {
        $.toast("最多上传6张图片");
        return;
    }
    if ($(".imgContainer").length + $(".fileInput").length > 6) {
        $.toast("最多上传6张图片");
        return;
    }
    if ($("input:checkbox").length > 0) {
        if ($("input:checkbox:checked").length == 0) {
            $.toast("请选择缺陷位置！");
            return;
        } else {
            var checkedVal = ",";
            $("input:checkbox:checked").each(function () {
                checkedVal += $(this).val() + ";";
            });
            checkedVal = checkedVal.substring(0, checkedVal.length - 1);
            defectPositionVal = defectPosition + checkedVal;
        }
    }
    /*    if($(".fileInput")&&$(".fileInput").length==0){
            $.toast("请上传现场照！");
            return;
        }*/
    var params = new FormData($('#form1')[0]);
    params.append("fTimelimit", deadline);
    params.append("fProblemlocation", defectPositionVal);
    params.append("fPlacecheckformid", fPlacecheckformid);
    params.append("fSubdeviceinfoid", clickDeviceInfoId);
    params.append("fDeviceitem", itemCode);
    Substation.postFormDataByAjax("/saveCheckItemProblem", params, function (data) {
        if (data.code == 200) {
            $.toast("上传成功");
            $(":radio[name='" + clickRadioName + "'][value='yes']").prop("checked", true);
            localStorage.setItem("need-refresh", "true");
            setTimeout($.router.back(), 1000);
        }
    });
}

//巡检记录点击是跳转
function goToInfo() {
    if (canClick == "false") {
        $(".card-content").unbind().click(function () {
            var thisRadio = $(this).find(":radio:checked");
            if (thisRadio.val() == "yes") {
                var clickDeviceId = $(".tab.active").attr("id");
                var deviceItemCode = thisRadio.attr("data-code");
                var params = {
                    fPlacecheckformid: fPlacecheckformid,
                    fSubdeviceinfoid: clickDeviceId,
                    fDeviceitem: deviceItemCode
                };
                Substation.getDataByAjax("/getDeviceProblemIDOnClickingYes", params, function (data) {
                    if (data != "" && data != null) {
                        localStorage.setItem("clickPids", JSON.stringify(pids));
                        window.location.href = "defectInfo.html?fDeviceproblemid=" + data;
                    } else {
                        $.toast("没有该缺陷详情记录！");
                    }
                });
            }
        });
    }
}

//返回按钮
$("#backBtn").click(function () {
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && !hasSave && canClick != "false") {
        //ios
        var r = confirm("消息尚未保存，确定退出吗？")
        if (r == true) {
            window.history.back();
        } else {
            return;
        }
    } else {
        window.history.back();
    }
});

//解决键盘遮挡问题
window.addEventListener("resize", function () {
    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

$(window).bind('beforeunload', function () {
    if (canClick != "false") {
        if (!hasSave) {
            return '您输入的内容尚未保存，确定离开此页面吗？';
        }
    }
});

$.init();