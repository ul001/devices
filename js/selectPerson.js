function loadPage() {
    var pids = [{
        pid: -1,
        pname: ""
    }];
    var clickNum = 0;
    var selectSubid = 10100001;
    var showState = 1;
    var thisGroupid = -1;
    //var selectSubid = localStorage.getItem("fSubid");
    var showArrayUser = [];

    //主页内容
    function fillRightData() {
        Substation.getDataByAjax(
            "/selectUserListByGroupId", {
                groupId: thisGroupid,
            },
            function (data) {
                //
                $(".content-block.showCard").empty();
                if (data.hasOwnProperty("userList") && data.userList.length > 0) {
                    $(data.userList).each(function (index, obj) {
                        var num = 0;
                        var text = "";
                        text += "<div class=\"card\">";
                        text += "                        <div class=\"card-content\">";
                        text += "                            <div class=\"card-content-inner\">";
                        text += this.fUsername;
                        text += "                                <div class=\"pull-right\">";
                        text += "                                    <label class=\"label-checkbox item-content\">";
                        text += "                                        <input type=\"checkbox\"id=\"" + this.fUserid + "\" name=\"" + this.fUsername + "\" value=\"no\">";
                        text += "                                        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\" ></i>";
                        text += "                                        </div>";
                        text += "                                    </label>";
                        text += "                                </div>";
                        text += "                            </div>";
                        text += "                        </div>";
                        text += "                    </div>";
                        $(".content-block.showCard").append(text);
                        //给历史赋值
                        if (showArrayUser.length > 0) {
                            var fuserid = this.fUserid;
                            $(showArrayUser).each(function (index, obj) {
                                if (fuserid == this.userId) {
                                    $("#" + this.userId).attr("checked", true);
                                    $("#" + this.userId).attr("value", "yes");
                                }
                            });
                        }
                    });
                    addCheckClick();
                    getGroupidContent();
                    // $(".tab-link")
                    //     .eq(0)
                    //     .click();
                }

            }
        );
    }

    function getGroupidContent() {
        if (thisGroupid == -1) {
            $(".content").css("display", "none");
        } else {
            $(".content").css("display", "block");
        }
    }

    getGroupidContent();

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
                    thisObj["code"] = $(thisInput).attr("data-code");
                    thisObj["value"] = $(thisInput).attr("value");
                    thisObj["type"] = "radio";
                } else {
                    thisObj["code"] = $(obj)
                        .find($("input"))
                        .attr("data-code");
                    thisObj["value"] = $(obj)
                        .find($("input"))
                        .val();
                    thisObj["type"] = "input";
                }
                inputArray.push(thisObj);
            });
            deviceJson["fInspectionslipjson"] = inputArray;
            deviceJson["fSubdeviceinfoid"] = deviceId;
            deviceJson["fPlacecheckformid"] = 4;
            changeJson.push(deviceJson);
        });
        var jsonStr = JSON.stringify(changeJson);
        Substation.postDataByAjax(
            "/updateInspectionDetail", {
                deviceList: jsonStr
            },
            function (data) {
                if (data.code == 200) {
                    $.toast("保存成功");
                } else {
                    $.toast("操作失败");
                }
            }
        );
    }

    //左侧菜单
    function addBackClick() {
        $(".back-parent")
            .unbind()
            .click(function () {
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
        var params = {
            // fSubid: selectSubid,
            userGroupPid: parentId
        };
        Substation.getDataByAjax("/selectUserGroupByPid", params, function (
            data
        ) {
            if (data.hasOwnProperty("userGroupList")) {
                if (data.userGroupList.length > 0) {
                    fillH5(parentId, data.userGroupList);
                }
            }
        });
    }

    function fillH5(parentId, thisList) {
        var ul;
        if (parentId == -1) {
            ul = $(".list-block .list-container");
            ul.empty();

        } else {
            ul = $(".list-block .list-container");
            ul.html(
                '<li class="item-content back-parent">\n' +
                '                        <div class="item-inner">\n' +
                '                            <div class="item-title"><i class="icon icon-goprev"></i>上一级</div>\n' +
                "                        </div>\n" +
                "                    </li>"
            );
        }
        $(thisList).each(function () {
            var li = "";
            var linkStr = '<li class="item-content item-link';
            // if (this.displayOrHideState == false) {
            //     linkStr = '<li class="item-content item-link item-dis';
            // }
            li =
                linkStr +
                '" id="' +
                this.fUsergroupid +
                '">\n' +
                '                        <div class="item-inner">\n' +
                '                            <div class="item-title">' +
                this.fUsergroupname +
                "</div>\n" +
                "                        </div>\n" +
                "                    </li>";
            ul.append(li);
        });
        // if (showState == 0) {
        //     $(".item-dis").css("display", "none");
        // } else {
        $(".item-dis").css("display", "flex");
        // }
        // $("#showOrHide")
        //     .unbind()
        //     .click(function () {
        //         if (showState == 0) {
        //             showState = 1;
        //             $("#showOrHide").text("仅显示有设备分类");
        //             $(".item-dis").css("display", "flex");
        //         } else {
        //             showState = 0;
        //             $("#showOrHide").text("显示全部分类");
        //             $(".item-dis").css("display", "none");
        //         }
        //     });
        linkClick(parentId);
        addBackClick();
    }

    function linkClick(parentId) {
        $(".list-block .item-link")
            .unbind()
            .click(function (event) {
                var clickId = $(this).attr("id");
                var params = {
                    // fSubid: selectSubid,
                    userGroupPid: clickId
                };
                Substation.getDataByAjax(
                    "/selectUserGroupByPid",
                    params,
                    function (data) {
                        if (data.hasOwnProperty("userGroupList")) {
                            if (data.userGroupList.length > 0) {
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
                                fillH5(clickId, data.userGroupList);
                                return;
                            }
                        }
                        thisGroupid = clickId;
                        $("#" + clickId)
                            .addClass("selectLi")
                            .siblings()
                            .removeClass("selectLi");
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
                        $(pids).each(function () {
                            titleTree += this.pname + ">";
                        });
                        var titleTreeName = titleTree.substring(1, titleTree.length - 1);
                        $("#subName").text(titleTreeName);
                        $(".close-panel").click();
                        fillRightData();
                    }
                );
                event.stopPropagation();
            });
    }

    function addCheckClick() {
        $(":checkbox").click(function () {
            $("#inputNameId").empty();
            if ($(this).val() == "no") {
                $(this).attr("checked", true);
                // $("#" + this.name).attr("checked", true);
                $(this).attr("value", "yes");
                var user = {
                    "userId": $(this).attr("id"),
                    "userName": this.name
                };
                showArrayUser.push(user);
            } else {
                $(this).attr("checked", false);
                // $("#" + this.name).attr("checked", false);
                $(this).attr("value", "no");
                // var user = {
                //     "userId": $(this).attr("id"),
                //     "userName": this.name
                // };
                if (showArrayUser.length > 0) {
                    var indexID;
                    var userID = $(this).attr("id");
                    $(showArrayUser).each(function (index, obj) {
                        if (this.userId == userID) {
                            indexID = index;
                        }
                    });
                    showArrayUser.splice(indexID, 1);
                }
            }
            // showArrayUser();
            // var nameStr = showArrayUser.userName.join(",");
            var nameStr;
            var nameArr = [];
            $(showArrayUser).each(function (index, obj) {
                nameArr.push(this.userName);
            });
            nameStr = nameArr.join(',');
            $("#inputNameId").val(nameStr);
        });
    }

    $("#saveBtn").click(function () {
        saveThisPage();
    });

    fillData(-1);

    $(".open-panel").click();
}

loadPage();

$.init();