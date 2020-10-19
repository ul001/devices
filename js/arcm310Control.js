var subObj = JSON.parse(localStorage.getItem("subObj"));
var titleName = localStorage.getItem("controlClassTitle");
//仪表点位ID
var positionID = "";
$("#mainTitle").text(titleName);
var isControl = 0;
$(".item-media").hide();
$("input:checkbox").prop("disabled", "disabled");

function initContent() {
    var param;
    if (positionID.length > 0) {
        param = {
            stationId: subObj.subId,
            fPositionId: positionID,
            meterType: '3'
        }
    } else {
        param = {
            stationId: subObj.subId,
            meterType: '3'
        }
    }
    Substation.getDataByAjax(
        "/selectByStationId", param,
        function (data) {
            $(".content-list").empty();
            var strArr = "";
            if (data.list != undefined && data.list.length && data.list.length > 0) {
                // meterCurrentValue: "{\"status\":\"0\",\"receiveTime\":\"2020-10-13 09:02:00\",\"timerStatus\":\"0\",\"switchStatus\":\"1\"}"
                $(data.list).each(function () {
                    var thisStatus = "";
                    var meterCurrentValue = JSON.parse(this.meterCurrentValue);
                    var imgStr = '<img src="img/arcm300t.png">';
                    var timerStatus = "";
                    var switchStatus = "";
                    if (this.meterStatus == "1") {
                        thisStatus =
                            "<span class='alarmStatus'>" + Operation["ui_Alarm"] + "</span>";
                        imgStr = '<img src="img/arcm300Talarm.png">';
                    } else {
                        var thisStatus =
                            "<span class='normalStatus'>" +
                            Operation["ui_normal"] +
                            "</span>";
                        var imgStr = '<img src="img/arcm300t.png">';
                    }
                    if (meterCurrentValue.timerStatus == "0") {
                        timerStatus = "<span class='alarmStatus'>未定时</span>";
                    } else {
                        timerStatus = "<span class='normalStatus'>已定时</span>";
                    }
                    if (meterCurrentValue.switchStatus == "0") {
                        switchStatus = "<span class='alarmStatus'>分闸</span>";
                    } else {
                        switchStatus = "<span class='normalStatus'>合闸</span>";
                    }
                    var meterTypeName = '';
                    if (this.meterType == '1') {
                        meterTypeName = "ARCM300T";
                    } else if (this.meterType == '2') {
                        meterTypeName = "ADW300";
                    }
                    strArr +=
                        '<label class="list-item label-checkbox light_opening" style="height:7.2rem" data-id="' +
                        this.meterCode +
                        '">\n' +
                        '                        <div class="row no-gutter">\n' +
                        '                            <input class="selectBox" type="checkbox" name="my-checkbox" data-id="' +
                        this.meterCode +
                        '">\n' +
                        '                            <div class="item-media col-15"><i class="icon icon-form-checkbox"></i></div>\n' +
                        '                            <span class="label-title col-85">' +
                        Substation.removeUndefined(this.meterName) +
                        "</span>\n" +
                        // "                            <a href=\"#\" class=\"view_detail col-25 button\">详情</a>\n" +
                        "                        </div>\n" +
                        '                            <span class="label-title" style="color: gray;font-size: 0.7rem;">' +
                        Operation["ui_deviceId"] +
                        "：" +
                        this.meterCode +
                        "</span>\n" +
                        // "                            <a href=\"#\" class=\"view_detail col-25 button\">详情</a>\n" +

                        '                        <div class="row no-gutter">\n' +
                        '                        <div class="col-40">\n' +
                        "                            " +
                        imgStr +
                        "\n" +
                        "                        </div>\n" +
                        '                        <div class="col-60">\n' +

                        "                            <p class='right-float' style='margin-top:.4rem;font-size:0.7rem;'>" + switchStatus + "</p>\n" +
                        "                            <p class='right-float' style='margin-top:.4rem;font-size:0.7rem;'>" +
                        thisStatus +
                        "</p>\n" +
                        "                            <p class='right-float' style='margin-top:.4rem;font-size:0.7rem;'>" + timerStatus + "</p>\n" +
                        "                        </div>\n" +
                        "                        </div>\n" +
                        "                    </label>";
                });
                $(".content-list").html(strArr);
                if (isControl == 0) {
                    $(".item-media").hide();
                    $(".label-title")
                        .removeClass("col-85")
                        .addClass("col-100");
                    $(".list-item").on("click", goToDetail);
                } else {
                    $(".label-title")
                        .removeClass("col-100")
                        .addClass("col-85");
                }
            }
        }
    );
}

initContent();

function controlClick() {
    $("input:checkbox").removeAttr("checked");
    if (!$(".footer_btn").length || $(".footer_btn").is(":hidden")) {
        isControl = 1;
        $("#back_btn").text(Operation["ui_SelectAll"]);
        $("#back_btn")
            .off("click")
            .on("click", selectAll);
        $("#control_btn").text(Operation["ui_cancel"]);
        $("#record_btn").toggle();
        $("#select_btn").toggle();
        $("#light_opening").click();
        $(".label-title")
            .removeClass("col-100")
            .addClass("col-85");
        $(".item-media").toggle();
        $(".button_bar").toggle();
        $(".footer_btn").toggle();
        $("input:checkbox").removeAttr("disabled");
        $(".list-item").off("click", goToDetail);
    } else {
        isControl = 0;
        $("#back_btn").html(
            '<span class="icon icon-left"></span>' +
            "<span>" +
            Operation["ui_back"] +
            "</span>"
        );
        $("#back_btn")
            .off("click")
            .on("click", goBack);
        $("#control_btn").text(Operation["ui_control"]);
        $("#record_btn").toggle();
        $("#select_btn").toggle();
        $(".label-title")
            .removeClass("col-85")
            .addClass("col-100");
        $(".item-media").toggle();
        $(".list-item").show();
        $(".button_bar").toggle();
        $(".footer_btn").toggle();
        $("input:checkbox").prop("disabled", "disabled");
        $("input:checkbox").removeAttr("checked");
        $(".list-item").on("click", goToDetail);
    }
}

//下拉刷新
$(document).on("refresh", ".pull-to-refresh-content", function (e) {
    setTimeout(function () {
        initContent();
        // done
        $.pullToRefreshDone(".pull-to-refresh-content");
    }, 2000);
});

$("#control_btn").click(function () {
    if (!$(".footer_btn").length || $(".footer_btn").is(":hidden")) {
        // $("#myModal2").show();
        Substation.getDataByAjaxNoLoading("/getControlValidType", {}, function (
            data
        ) {
            if (data) {
                if (data.validType == "sms") {
                    var sb =
                        '                <div class="outContain" style="width: auto;">';
                    sb += '                  <div class="codeDiv">';
                    sb +=
                        '                    <input id="phoneInput" type="text" class="sendInput" value="15151853872" disabled';
                    sb += '                      autocomplete="off">';
                    sb += '                    <span class="icon codePhoneImg"></span>';
                    sb += '                    <label class="errorInfo"></label>';
                    sb += "                  </div>";
                    sb += '                  <div class="codeDiv">';
                    sb +=
                        '                    <input id="canvasInput" type="text" class="sendInput" placeholder="请输入验证码"';
                    sb +=
                        '                      autocomplete="off" style="width:6.2rem;">';
                    // sb += '                    <span class="icon codeCanvasImg"></span>';
                    sb +=
                        '                    <canvas id="canvas" width="100" height="38"></canvas>';
                    sb += "                  </div>";
                    sb += "";
                    sb += '                  <div class="codeDiv">';
                    sb +=
                        '                    <input id="code" class="sendInput" type="text" placeholder="请输入短信验证码" autocomplete="off" style="width:6.2rem;"/>';
                    sb += '                    <span class="icon codeMsgImg"></span>';
                    sb +=
                        '                    <input id="btnSendCode" type="button" class="btn btn-default" disabled value="获取验证码" />';
                    sb += "                  </div>";
                    // sb += '                  <button class="btn" id="checkBtn" disabled>验证</button>';
                    sb += "                </div>";
                    // sb += '      </div>';
                    var modal = $.modal({
                        title: "手机动态验证码",
                        text: "需要通过手机动态验证码才能控制设备。",
                        afterText: sb,
                        buttons: [{
                                text: "取消"
                            },
                            {
                                text: "验证",
                                bold: true,
                                onClick: function () {
                                    var code = $("#code").val();
                                    Substation.getDataByAjaxNoLoading(
                                        "/checkSMSValid", {
                                            code: code,
                                            msgId: msgId
                                        },
                                        function (data) {
                                            console.log(data);
                                            if (data == true) {
                                                controlClick();
                                            } else {
                                                if (data.msg) {
                                                    $.toast(data.msg);
                                                } else {
                                                    $.toast("验证失败");
                                                }
                                            }
                                            // sendCommand();
                                        }
                                    );
                                }
                            }
                        ]
                    });
                    showModel2(data.userPhone);
                    // $.swiper($(modal).find('.swiper-container'), {
                    //   pagination: '.swiper-pagination'
                    // });
                } else {
                    showSecPasswordPrompt();
                }
                //   }
                // });
            }
        });
    } else {
        controlClick();
    }
});

function showModel2(userPhone) {
    $("#phoneInput").val(userPhone);
    $.codeDraw($("#canvas"), $("#canvasInput"), function () {
        $.countInterval($("#phoneInput"), $("#btnSendCode"), function () {
            Substation.getDataByAjaxNoLoading("/sendSMSValid", {}, function (data) {
                msgId = data;
                // $("#checkBtn").removeAttr('disabled');
                // $("#checkBtn").unbind('click').on('click', function () {
                //   var code = $("#code").val();
                //   Substation.getDataByAjaxNoLoading("/checkSMSValid", {}, function (data) {
                //     // sendCommand();
                //   })
                // })
            });
        });
    });
}

//二级密码
function showSecPasswordPrompt() {
    $.prompt(
        Operation["ui_needInputPwd"],
        Operation["ui_pleaseInputPwd"],
        function (value) {
            var pwdstr = $.md5(value);
            Substation.postDataByAjax(
                "/verifySePassword", {
                    sePassword: pwdstr
                },
                function (data) {
                    controlClick();
                }
            );
        }
    );
}

function selectAll() {
    if ($("#back_btn").text() == Operation["ui_SelectAll"]) {
        $("#back_btn").text(Operation["ui_UnselectAll"]);
        $(".list-item:visible input:checkbox").prop("checked", "checked");
    } else {
        $("#back_btn").text(Operation["ui_SelectAll"]);
        $(".list-item:visible input:checkbox").removeAttr("checked");
    }
}

function goBack() {
    //    if (isAndroid) {
    //        android.goBack();
    //    } else if (isIOS) {
    //        window.history.back();
    //        window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
    //    } else {
    window.history.back();
    //    }
}

$("#back_btn").on("click", goBack);

var canclick = 1;
//复位
$("#reset").click(function () {
    if (canclick == 1) {
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                meterCode: metercode,
                substationId: subObj.subId,
                type: "reset",
                value: "1"
            });
        });
        if (controlJson.length == 0) {
            $.toast(Operation["ui_selectNo"]);
            return;
        }
        setTimeout(function () {
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        }, 30000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax(
            "/send310ControlDemandHTTP",
            JSON.stringify(controlJson),
            function (data) {
                if (data.data.a != undefined) {
                    $.alert(data.data.a);
                }
            }
        );
    } else {
        $.alert(Operation["ui_operateAllTipOf30"]);
    }
});

//分闸
$("#DO").click(function () {
    if (canclick == 1) {
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                meterCode: metercode,
                substationId: subObj.subId,
                type: "DO",
                value: "0"
            });
        });
        if (controlJson.length == 0) {
            $.toast(Operation["ui_selectNo"]);
            return;
        }
        setTimeout(function () {
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        }, 30000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax(
            "/send310ControlDemandHTTP",
            JSON.stringify(controlJson),
            function (data) {
                if (data.data.a != undefined) {
                    $.alert(data.data.a);
                }
            }
        );
    } else {
        $.alert(Operation["ui_operateAllTipOf30"]);
    }
});

//合闸
$("#He").click(function () {
    if (canclick == 1) {
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                meterCode: metercode,
                substationId: subObj.subId,
                type: "DO",
                value: "1"
            });
        });
        if (controlJson.length == 0) {
            $.toast(Operation["ui_selectNo"]);
            return;
        }
        setTimeout(function () {
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        }, 30000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax(
            "/send310ControlDemandHTTP",
            JSON.stringify(controlJson),
            function (data) {
                if (data.data.a != undefined) {
                    $.alert(data.data.a);
                }
            }
        );
    } else {
        $.alert(Operation["ui_operateAllTipOf30"]);
    }
});

//跳转设定时间
$("#pushTime").click(function () {
    if (canclick == 1) {
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                meterCode: metercode,
                substationId: subObj.subId,
                type: "DO",
                openTime: '',
                closeTime: '',
                value: "2"
            });
        });
        if (controlJson.length == 0) {
            $.toast(Operation["ui_selectNo"]);
            return;
        }

        setTimeout(function () {
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        }, 30000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        var meterCode = $(this).attr("data-id");
        localStorage.setItem("meterCode", meterCode);
        localStorage.setItem("controlJsonArr", JSON.stringify(controlJson));
        window.location.href = "arcm310SelectTime.html";
    } else {
        $.alert(Operation["ui_operateAllTipOf30"]);
    }
});

//消音
$("#silent").click(function () {
    if (canclick == 1) {
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                meterCode: metercode,
                substationId: subObj.subId,
                type: "silent",
                value: "1"
            });
        });
        if (controlJson.length == 0) {
            $.toast(Operation["ui_selectNo"]);
            return;
        }
        setTimeout(function () {
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        }, 30000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax(
            "/send310ControlDemandHTTP",
            JSON.stringify(controlJson),
            function (data) {
                if (data.data.a != undefined) {
                    $.alert(data.data.a);
                }
            }
        );
    } else {
        $.alert(Operation["ui_operateAllTipOf30"]);
    }
});

//自检
$("#check").click(function () {
    if (canclick == 1) {
        var controlJson = [];
        $(".selectBox:checked").each(function (i, obj) {
            var metercode = $(obj).attr("data-id");
            controlJson.push({
                meterCode: metercode,
                substationId: subObj.subId,
                type: "check",
                value: "1"
            });
        });
        if (controlJson.length == 0) {
            $.toast(Operation["ui_selectNo"]);
            return;
        }
        setTimeout(function () {
            canclick = 1;
            $(".footer_btn").removeClass("noclick");
        }, 30000);
        canclick = 0;
        $(".footer_btn").addClass("noclick");
        Substation.postDataWithRawByAjax(
            "/send310ControlDemandHTTP",
            JSON.stringify(controlJson),
            function (data) {
                if (data.data.a != undefined) {
                    $.alert(data.data.a);
                }
            }
        );
    } else {
        $.alert(Operation["ui_operateAllTipOf30"]);
    }
});




function goToDetail() {
    var meterCode = $(this).attr("data-id");
    localStorage.setItem("meterCode", meterCode);
    window.location.href = "arcm300TDetail.html";
}

$("#controlLog").click(function () {
    window.location.href = "deviceControlLog.html?type=arcm310";
});

/*
            Following is page1 page1 page1 page1 page1
*/

var thisGroupid = -1;
var subList = [];
var selectUserList = [];
var chargerUser = [];
var workerUser = [];
var peopleType = "substation";

//筛选事件新增
$("#select_btn").click(function () {
    // peopleType = $(this).attr("id");
    $.router.loadPage("#page1");
    $("#page1 .content").scrollTop(0);

    // $("#peopleType").text(Operation['ui_substation']);
    $("#searchUser").prop("placeholder", Operation['ui_selectPosTip']);

    selectUserList = subList;

    $("#peopleClass").hide();
    $("#subClass").show();
    //组织机构
    Substation.getDataByAjax("/getCompanyListBypIdV2", {}, function (data) {
        // $("#subClass .item-title").html('<span data-id="' + data.tBdCompany[0].fCoaccountno + '">' + Substation.removeUndefined(data.tBdCompany[0].fConame) + '</span>');
        thisGroupid = data.tBdCompany[0].fCoaccountno;
        getGroupClass(data.tBdCompany[0].fCoaccountno);
    });

    if (selectUserList.length > 0) {
        $("#showSelected").html(Operation['ui_hasSelected'] + ":" + selectUserList.length + Operation['ui_personNum'] + "<i class='icon icon-up'></i>");
        $("#showSelected").off("click", goToSelectedPage).on("click", goToSelectedPage);
    } else {
        $("#showSelected").html(Operation['ui_hasSelected'] + ":");
        $("#showSelected").off("click", goToSelectedPage);
    }
});

function getGroupClass(pid) {
    $(".classUl").empty();
    // $("#classList").show();
    //隐藏平台机构
    $("#classList").hide();

    //组织机构
    // Substation.getDataByAjax("/getCompanyListBypIdV2", {
    //     fCoaccountno: pid
    // }, function (data) {
    //     if (data.hasOwnProperty("tBdCompany") && data.tBdCompany.length > 0) {
    //         $(".classUl").show();
    //         var html = "";
    //         $(data.tBdCompany).each(function () {
    //             html += "<li>\n" +
    //                 "    <div class=\"item-content\">\n" +
    //                 "        <div class=\"item-inner\">\n" +
    //                 "            <div class=\"item-title\">" + Substation.removeUndefined(this.fConame) + "</div>\n" +
    //                 "            <div class=\"item-after\">\n" +
    //                 "                <span class=\"nextClass\" data-id=\"" + this.fCoaccountno + "\" data-name=\"" + Substation.removeUndefined(this.fConame) + "\">\n" +
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
    getPersonList(pid);
    // });

}

function getPersonList() {
    $("#personListUl").empty();
    Substation.getDataByAjax("/getMeterPostionInfoListByfSubid", {
        fSubid: subObj.subId
    }, function (data) {
        if (data.hasOwnProperty("resultList") && data.resultList.length > 0) {
            $(".personUl").show();
            //修改单选
            $("#selectAll").hide();
            var html = "";
            $(data.resultList).each(function () {
                html += "<li>\n" +
                    "    <label class=\"label-checkbox item-content\">\n" +
                    "        <input type=\"checkbox\" name=\"my-checkbox\" id=\"" + this.fPostionid + "\" data-name=\"" + Substation.removeUndefined(this.fPositionname) + "\">\n" +
                    "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                    "        <div class=\"item-inner\">\n" +
                    "            <div class=\"item-title\">" + Substation.removeUndefined(this.fPositionname) + "</div>\n" +
                    "        </div>\n" +
                    "    </label>\n" +
                    "</li>"
            });
            $("#personListUl").html(html);
            $("input[name='my-checkbox']").off("change", addChangeListener).on("change", addChangeListener);
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
        // if (peopleType == "substation") {
        if ($(this).prop("checked")) {
            selectUserList = [{
                userId: thisUserid,
                userName: thisUsername
            }];
            $("input[name='my-checkbox']").attr("checked", false);
            $(this).prop("checked", true);
            // listSubPeople(thisUserid);
        } else {
            selectUserList = [];
        }
        // } else if (peopleType == "charger") {
        //     if ($(this).prop("checked")) {
        //         selectUserList = [{
        //             userId: thisUserid,
        //             userName: thisUsername
        //         }];
        //         $("input[name='my-checkbox']").attr("checked", false);
        //         $(this).prop("checked", true);
        //     } else {
        //         selectUserList = [];
        //     }
        // } else if (peopleType == "worker") {
        //     if ($(this).prop("checked")) {
        //         selectUserList.push({
        //             userId: thisUserid,
        //             userName: thisUsername
        //         });
        //     } else {
        //         $(selectUserList).each(function (i, obj) {
        //             if (obj.userId == thisUserid) {
        //                 selectUserList.splice(i, 1);
        //                 return false;
        //             }
        //         });
        //         $("#selectAll input[type='checkbox']").removeAttr("checked");
        //     }
        // }
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

//点击确认
function saveSelectedPeople() {
    $.router.back();
    positionID = selectUserList[0].userId;
    subList = selectUserList;
    $("#searchUser").val("");
    initContent();
    // listPeople(peopleType, selectUserList);
}

//模糊搜索
function getSearchUser() {
    $("#personListUl").empty();
    $(".personUl").show();
    $(".classUl").hide();
    $("#classList").hide();
    var typeStr = "";

    typeStr = "type=\"checkbox\"";
    $("#selectAll").hide();

    Substation.getDataByAjax("/getMeterPostionInfoListByfSubid", {
        searchey: $("#searchUser").val(),
        fSubid: subObj.subId
    }, function (data) {
        var html = "";
        $(data.resultList).each(function () {
            html += "<li>\n" +
                "    <label class=\"label-checkbox item-content\">\n" +
                "        <input " + typeStr + " name=\"my-checkbox\" id=\"" + this.fPostionid + "\" data-name=\"" + Substation.removeUndefined(this.fPositionname) + "\">\n" +
                "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                "        <div class=\"item-inner\">\n" +
                "            <div class=\"item-title\">" + Substation.removeUndefined(this.fPositionname) + "(" + Substation.removeUndefined(this.fSubid) + ")</div>\n" +
                "        </div>\n" +
                "    </label>\n" +
                "</li>";
        });
        $("#personListUl").html(html);
        $("input[name='my-checkbox']").off("change", addChangeListener).on("change", addChangeListener);
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
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓系统
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
    if (isIOS) {
        window.webkit.messageHandlers.goBackiOS.postMessage("");
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