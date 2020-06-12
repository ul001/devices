var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
$(".click_btn").click(function () {
    if (isIOS) {
        window.history.back();
    } else {
        android.goBack();
    }
});

//选人
var peopleType = "";
var subList = [];
var selectUserList = [];
var workerUser = [];

//巡检的变电所id
var missionsubid = "10100002";
// var missionsubname = "X变电所";
var subDetail;
var taskid = localStorage.getItem("robTaskId");
if (!taskid) {
    taskid = 967;
}
var selectSubid = localStorage.getItem("fSubid");
var subName = "";
var lng = 0;
var lat = 0;
var dizhi = "";
var map;
//变电所
var subLat = 36.919141;
var subLon = 117.508328;
//我的位置
var myLat = 39.977552;
var myLon = 116.301934;
var p1;
var p2;
Substation.getDataByAjax(
    "/getSubInfoByfSubid", {
        fSubid: selectSubid
    },
    function (data) {
        if (data.subInfo != undefined) {
            subName = data.subInfo.fSubname;
            lng = data.subInfo.fLongitude;
            lat = data.subInfo.fLatitude;
            loadScript();
        }
    }
);

function initialize() {
    map = new BMap.Map("container");
    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
    });
    map.addControl(navigationControl);
    // 百度地图API功能
    // map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(subLon, subLat), 11);
    //先经度，再纬度
    p1 = new BMap.Point(myLon, myLat);
    p2 = new BMap.Point(subLon, subLat);
    var opts = {
        position: p2, // 指定文本标注所在的地理位置
        offset: new BMap.Size(30, -30) //设置文本偏移量
    };
    var output = "驾车时间：";
    var searchComplete = function (results) {
        if (!results || JSON.stringify(results) == "{}") {
            return;
        }
        // if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
        //     return;
        // }
        var plan = results.getPlan(0);
        output += plan.getDuration(true) + "\n"; //获取时间
        output += "总路程为：";
        output += plan.getDistance(true) + "\n"; //获取距离
        var label = new BMap.Label(output, opts); // 创建文本标注对象
        label.setStyle({
            color: "red",
            fontSize: "12px",
            height: "20px",
            lineHeight: "20px",
            fontFamily: "微软雅黑"
        });
        map.addOverlay(label);
    };
    var driving = new BMap.DrivingRoute(map, {
        renderOptions: {
            map: map,
            autoViewport: true
        },
        onSearchComplete: searchComplete
    });
    driving.search(p1, p2);
    $("#clickPopup").click();
}

function walk() {
    map = new BMap.Map("container");
    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
    });
    map.addControl(navigationControl);
    map.centerAndZoom(new BMap.Point(subLon, subLat), 11);
    p1 = new BMap.Point(myLon, myLat);
    p2 = new BMap.Point(subLon, subLat);
    var opts = {
        position: p2, // 指定文本标注所在的地理位置
        offset: new BMap.Size(30, -30) //设置文本偏移量
    };
    var output = "步行时间：";
    var searchComplete = function (results) {
        if (!results || JSON.stringify(results) == "{}") {
            $.toast("步行距离过远，建议选择其他交通方式！");
            return;
        }
        // if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
        //     return;
        // }
        var plan = results.getPlan(0);
        output += plan.getDuration(true) + "\n"; //获取时间
        output += "总路程为：";
        output += plan.getDistance(true) + "\n"; //获取距离
        var label = new BMap.Label(output, opts); // 创建文本标注对象
        label.setStyle({
            color: "red",
            fontSize: "12px",
            height: "20px",
            lineHeight: "20px",
            fontFamily: "微软雅黑"
        });
        map.addOverlay(label);
    };
    var walking = new BMap.WalkingRoute(map, {
        renderOptions: {
            map: map,
            autoViewport: true
        },
        onSearchComplete: searchComplete
    });
    walking.search(p1, p2);
}

function drive() {
    map = new BMap.Map("container");
    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
    });
    map.addControl(navigationControl);
    map.centerAndZoom(new BMap.Point(subLon, subLat), 11);
    p1 = new BMap.Point(myLon, myLat);
    p2 = new BMap.Point(subLon, subLat);
    var opts = {
        position: p2, // 指定文本标注所在的地理位置
        offset: new BMap.Size(30, -30) //设置文本偏移量
    };
    var output = "驾车时间：";
    var searchComplete = function (results) {
        if (!results || JSON.stringify(results) == "{}") {
            $.toast("查询失败");
            return;
        }
        // if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
        //     return;
        // }
        var plan = results.getPlan(0);
        output += plan.getDuration(true) + "\n"; //获取时间
        output += "总路程为：";
        output += plan.getDistance(true) + "\n"; //获取距离
        var label = new BMap.Label(output, opts); // 创建文本标注对象
        label.setStyle({
            color: "red",
            fontSize: "12px",
            height: "20px",
            lineHeight: "20px",
            fontFamily: "微软雅黑"
        });
        map.addOverlay(label);
    };
    var driving = new BMap.DrivingRoute(map, {
        renderOptions: {
            map: map,
            autoViewport: true
        },
        onSearchComplete: searchComplete
    });
    driving.search(p1, p2);
}

function loadScript() {
    var script = document.createElement("script");
    script.src =
        "http://api.map.baidu.com/api?v=3.0&ak=T9c1avrrhrkA5z5RacH7myHGg9VDt4Cb&callback=initialize";
    document.body.appendChild(script);
}

//声明一个控制点击的变量
var upLoadClicktag = true;

// deviceProblemSum: 0
// deviceProblemUnresolved: 0
// fConfigtypeid: 3
// fDeadlinedate: "2020-06-20 23:59:59"
// fLatitude: "31.34996039"
// fLongitude: "121.30713886"
// fStartdate: "2020-06-12 00:00:00"
// fSubName: "电气股份有限公司E楼"
// fSubid: 10100001
// fTaskcontent: "发布抢单任务测试2"
// fTaskcreatedate: "2020-06-11 10:02:34"
// fTaskcreateuserid: 311
// fTaskcreateusername: "吴小龙"
// fTaskcreateuserphone: "17715879373"
// fTaskid: 967
// fTaskname: "电气股份有限公司E楼"
// fTasknumber: "R2006110001"
// fTaskstateid: 1
// fTasktypeexplain: "抢单"
// fTasktypeid: 7
// taskStateId: 1
function getNetData() {
    Substation.getDataByAjax(
        "/getOrderTaskDetailByfTaskid",
        "fTaskid=" + taskid,
        function (data) {
            if (data.hasOwnProperty("orderTaskDetail")) {
                subDetail = data.orderTaskDetail;
                // var strVar = "";
                // strVar += " <p class=\"subName limit-length\">" + subDetail.fSubName + "<\/p>";
                // strVar += "                        <p class=\"missionNo row\" style=\"color:#ADB2C1;\">";
                // strVar += "                            <span class=\"col-85\" style=\"margin-left:0rem;\">任务单号：" + subDetail.fTasknumber + "<\/span>";
                // strVar += "                            <img class=\"col-15\" src=\"img\/video_watch.png\" style=\"height: 0.9rem;width: 1.5rem;\"";
                // strVar += "                                id=\"jumpVideo\">";
                // strVar += "                        <\/p>";
                // strVar += "                        <p class=\"missionList\">任务发布人：" + subDetail.fSubName + "<\/p>";
                // strVar += "                        <p class=\"missionList\">发布时间：" + subDetail.fSubName + "<\/p>";
                // strVar += "                        <p class=\"missionList\">任务内容：" + subDetail.fSubName + "<\/p>";
                // strVar += "                        <p class=\"missionList\">计划开始时间：" + subDetail.fSubName + "<\/p>";
                // strVar += "                        <p class=\"missionList\">计划完成时间：" + subDetail.fSubName + "<\/p>";
                strVar = `<p class="subName limit-length">${subDetail.fSubName}</p>
                        <p class="missionNo row" style="color:#ADB2C1;">
                            <span class="col-85" style="margin-left:0rem;">${Operation['ui_RobTaskNo']}${subDetail.fSubName}</span>
                            <img class="col-15" src="img/video_watch.png" style="height: 0.9rem;width: 1.5rem;"
                                id="jumpVideo">
                        </p>
                        <p class="missionList">${Operation['ui_RobTaskInitiator']}${subDetail.fTaskcreateusername}</p>
                        <p class="missionList">${Operation['ui_RobReleasetime']}${subDetail.fTaskcreatedate}</p>
                        <p class="missionList">${Operation['ui_RobTaskContent']}${subDetail.fTaskcontent}</p>
                        <p class="missionList">${Operation['ui_RobPlanStartTime']}${subDetail.fStartdate}</p>
                        <p class="missionList">${Operation['ui_RobPlanDeadlineTime']}${subDetail.fDeadlinedate}</p>`;
                $("#taskDetail").html(strVar);

                //跳转视频
                $("#jumpVideo").click(function () {
                    if (isAndroid) {
                        android.videoWatch(subDetail.fSubid);
                    } else if (isIOS) {
                        var subParam = {
                            Subid: subDetail.fSubid,
                            Subname: subDetail.fSubName
                        };
                        window.webkit.messageHandlers.pushVideoListVC.postMessage(subParam);
                    }
                });
            }
        }
    );
}

getNetData();
// function saveLocation() {
//     if (!upLoadClicktag) {
//         return;
//     }
//     upLoadClicktag = false;
//     var params = {
//         fSubid: selectSubid,
//         fLongitude: lng,
//         fLatitude: lat,
//         fAddress: dizhi
//     };
//     Substation.postDataByAjax("/updateSubstationLocation", params, function (data) {
//         if (data.code == 200) {
//             $.toast("保存成功");
//             upLoadClicktag = true;
//             window.location.href = "selectedSubstation.html";
//         }
//     });
//     //alert(selectSubid + "\n" + "lng:" + lng + "\nlat:" + lat);
// }

function navigation() {
    if (
        subLat != undefined &&
        subLat != "" &&
        subLon != undefined &&
        subLon != ""
    ) {
        if (isAndroid) {
            android.goToMap(subLat, subLon, subDetail.fSubName);
        } else if (isIOS) {
            var locParam = {
                Latitude: subLat,
                Longitude: subLon,
                locName: subDetail.fSubName
            };
            window.webkit.messageHandlers.pushMapSelect.postMessage(locParam);
        }
    } else {
        $.toast("尚未配置变电所经纬度！");
    }
}

//选人
$(".item-add").click(function () {
    $.closeModal(".popup-services");
    peopleType = $(this).attr("id");
    $.router.loadPage("#page1");
    $("#page1 .content").scrollTop(0);

    $("#peopleType").text(Operation["ui_worker"]);
    $("#searchUser").prop("placeholder", Operation["ui_selectUser"]);
    selectUserList = workerUser;

    $("#peopleClass").show();
    $("#subClass").hide();
    $("#peopleClass .item-title").html(
        '<span data-id="-1">' + Operation["ui_organization"] + "</span>"
    );
    getGroupClass(-1);

    if (selectUserList.length > 0) {
        $("#showSelected").html(
            Operation["ui_hasSelected"] +
            ":" +
            selectUserList.length +
            Operation["ui_personNum"] +
            "<i class='icon icon-up'></i>"
        );
        $("#showSelected")
            .off("click", goToSelectedPage)
            .on("click", goToSelectedPage);
    } else {
        $("#showSelected").html(Operation["ui_hasSelected"] + ":");
        $("#showSelected").off("click", goToSelectedPage);
    }
});

function listPeople(thisType, userList) {
    var html = "";
    if (userList.length > 0) {
        $(userList).each(function () {
            html +=
                '<span class="common">' +
                Substation.removeUndefined(this.userName) +
                '<i data-type="' +
                thisType +
                '" data-id="' +
                this.userId +
                '" data-name="' +
                Substation.removeUndefined(this.userName) +
                '" class="icon icon-close"></i></span>';
        });
        $(".peopleList." + thisType).html(html);
        $(".peopleList." + thisType).show();
        $(".icon.icon-close")
            .off("click", addCloseFunction)
            .on("click", addCloseFunction);
    }
}

//page1
var thisGroupid = -1;

function getGroupClass(pid) {
    $(".classUl").empty();
    $("#classList").show();

    Substation.getDataByAjax(
        "/selectUserGroupByPid", {
            userGroupPid: pid
        },
        function (data) {
            if (
                data.hasOwnProperty("userGroupList") &&
                data.userGroupList.length > 0
            ) {
                $(".classUl").show();
                var html = "";
                $(data.userGroupList).each(function () {
                    html +=
                        "<li>\n" +
                        '    <div class="item-content">\n' +
                        '        <div class="item-inner">\n' +
                        '            <div class="item-title">' +
                        Substation.removeUndefined(this.fUsergroupname) +
                        "</div>\n" +
                        '            <div class="item-after">\n' +
                        '                <span class="nextClass" data-id="' +
                        this.fUsergroupid +
                        '" data-name="' +
                        Substation.removeUndefined(this.fUsergroupname) +
                        '">\n' +
                        '                    <i class="icon icon-nextclass"></i>' +
                        Operation["ui_nextClass"] +
                        "\n" +
                        "                </span>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</li>";
                });
                $(".classUl").html(html);
                $(".nextClass")
                    .off("click", nextClassClick)
                    .on("click", nextClassClick);
            } else {
                $(".classUl").hide();
            }
            getPersonList(pid);
        }
    );
}

function getPersonList(gid) {
    $("#personListUl").empty();
    Substation.getDataByAjax(
        "/selectUserListByGroupId", {
            groupId: gid
        },
        function (data) {
            if (data.hasOwnProperty("userList") && data.userList.length > 0) {
                $(".personUl").show();
                if (peopleType == "charger") {
                    $("#selectAll").hide();
                }
                var html = "";
                $(data.userList).each(function () {
                    html +=
                        "<li>\n" +
                        '    <label class="label-checkbox item-content">\n' +
                        '        <input type="checkbox" name="my-checkbox" id="' +
                        this.fUserid +
                        '" data-name="' +
                        Substation.removeUndefined(this.fUsername) +
                        '">\n' +
                        '        <div class="item-media"><i class="icon icon-form-checkbox"></i></div>\n' +
                        '        <div class="item-inner">\n' +
                        '            <div class="item-title">' +
                        Substation.removeUndefined(this.fUsername) +
                        "</div>\n" +
                        "        </div>\n" +
                        "    </label>\n" +
                        "</li>";
                });
                $("#personListUl").html(html);
                $("input[name='my-checkbox']")
                    .off("change", addChangeListener)
                    .on("change", addChangeListener);
                checkSelectPeople();
            } else {
                $(".personUl").hide();
            }
        }
    );
}

//跳下级事件
function nextClassClick() {
    var clickPid = $(this).attr("data-id");
    thisGroupid = clickPid;
    $("#selectAll input[type='checkbox']").removeAttr("checked");
    var clickName = $(this).attr("data-name");
    $("#classList .item-title span").addClass("preClass");
    $(".preClass")
        .off("click", preClick)
        .on("click", preClick);
    $("#classList .item-title").append(
        '<i class="icon icon-nextArrow"></i><span data-id="' +
        clickPid +
        '">' +
        clickName +
        "</span>"
    );
    $("#classList .item-title").scrollLeft(10000);
    getGroupClass(clickPid);
}

//跳上级事件
function preClick() {
    var clickPid = $(this).attr("data-id");
    thisGroupid = clickPid;
    $("#selectAll input[type='checkbox']").removeAttr("checked");
    $(this).removeClass("preClass");
    $(this)
        .nextAll()
        .remove();
    getGroupClass(clickPid);
}

//选人状态变化监听
function addChangeListener() {
    var thisUserid = $(this).attr("id");
    var thisUsername = $(this).attr("data-name");
    if (thisUserid != undefined) {
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

        if (selectUserList.length > 0) {
            $("#showSelected").html(
                Operation["ui_hasSelected"] +
                ":" +
                selectUserList.length +
                Operation["ui_personNum"] +
                "<i class='icon icon-up'></i>"
            );
            $("#showSelected")
                .off("click", goToSelectedPage)
                .on("click", goToSelectedPage);
        } else {
            $("#showSelected").html(Operation["ui_hasSelected"] + ":");
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

//page2
function showPage2List() {
    $("#page2 .content").scrollTop(0);
    $("#selectedUl").empty();
    var html = "";
    $(selectUserList).each(function () {
        html +=
            '<li data-remove="' +
            this.userId +
            '">\n' +
            '    <div class="item-content">\n' +
            '        <div class="item-inner">\n' +
            '            <div class="item-title">' +
            Substation.removeUndefined(this.userName) +
            "</div>\n" +
            '            <div class="item-after">\n' +
            '                <span class="removeUser redColor" data-id="' +
            this.userId +
            '" data-name="' +
            Substation.removeUndefined(this.userName) +
            '">' +
            Operation["ui_remove"] +
            "\n" +
            "                </span>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</li>";
    });
    $("#numberShow").html(selectUserList.length);
    $("#selectedUl").html(html);
    $(".removeUser")
        .off("click", removeUser)
        .on("click", removeUser);
}

function saveSelectedPeople() {
    $.router.back();
    $.popup(".popup-services");
    $("#searchUser").val("");
    listPeople("worker", selectUserList);
}

function clickSelectPersonBack() {
    $.router.back();
    $.popup(".popup-services");
}

//模糊搜索
function getSearchUser() {
    $("#personListUl").empty();
    $(".personUl").show();
    $(".classUl").hide();
    $("#classList").hide();
    var typeStr = "";
    if (peopleType == "charger") {
        typeStr = 'type="checkbox"';
        $("#selectAll").hide();
    } else if (peopleType == "worker" || peopleType == "substation") {
        typeStr = 'type="checkbox"';
        $("#selectAll").show();
    }
    if (peopleType == "substation") {
        Substation.postDataByAjax(
            "/getSubstationListBySubGroupId", {
                search: $("#searchUser").val()
            },
            function (data) {
                var html = "";
                $(data.data.list).each(function () {
                    html +=
                        "<li>\n" +
                        '    <label class="label-checkbox item-content">\n' +
                        "        <input " +
                        typeStr +
                        ' name="my-checkbox" id="' +
                        this.fSubid +
                        '" data-name="' +
                        Substation.removeUndefined(this.fSubname) +
                        '">\n' +
                        '        <div class="item-media"><i class="icon icon-form-checkbox"></i></div>\n' +
                        '        <div class="item-inner">\n' +
                        '            <div class="item-title">' +
                        Substation.removeUndefined(this.fSubname) +
                        "(" +
                        Substation.removeUndefined(this.fSubid) +
                        ")</div>\n" +
                        "        </div>\n" +
                        "    </label>\n" +
                        "</li>";
                });
                $("#personListUl").html(html);
                $("input[name='my-checkbox']")
                    .off("change", addChangeListener)
                    .on("change", addChangeListener);
                checkSelectPeople();
            }
        );
    } else {
        Substation.postDataByAjax(
            "/getUserListByCondition", {
                searchKey: $("#searchUser").val()
            },
            function (data) {
                var html = "";
                $(data.data).each(function () {
                    html +=
                        "<li>\n" +
                        '    <label class="label-checkbox item-content">\n' +
                        "        <input " +
                        typeStr +
                        ' name="my-checkbox" id="' +
                        this.fUserid +
                        '" data-name="' +
                        Substation.removeUndefined(this.userName) +
                        '">\n' +
                        '        <div class="item-media"><i class="icon icon-form-checkbox"></i></div>\n' +
                        '        <div class="item-inner">\n' +
                        '            <div class="item-title">' +
                        Substation.removeUndefined(this.userName) +
                        "(" +
                        Substation.removeUndefined(this.fLoginname) +
                        ")</div>\n" +
                        "        </div>\n" +
                        "    </label>\n" +
                        "</li>";
                });
                $("#personListUl").html(html);
                $("input[name='my-checkbox']")
                    .off("change", addChangeListener)
                    .on("change", addChangeListener);
                checkSelectPeople();
            }
        );
    }
}

$("#searchUser").bind("keydown", function (event) {
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
    var html = "";
    $(selectUserList).each(function () {
        html +=
            '<li data-remove="' +
            this.userId +
            '">\n' +
            '    <div class="item-content">\n' +
            '        <div class="item-inner">\n' +
            '            <div class="item-title">' +
            Substation.removeUndefined(this.userName) +
            "</div>\n" +
            '            <div class="item-after">\n' +
            '                <span class="removeUser redColor" data-id="' +
            this.userId +
            '" data-name="' +
            Substation.removeUndefined(this.userName) +
            '">' +
            Operation["ui_remove"] +
            "\n" +
            "                </span>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</li>";
    });
    $("#numberShow").html(selectUserList.length);
    $("#selectedUl").html(html);
    $(".removeUser")
        .off("click", removeUser)
        .on("click", removeUser);
}

//删除人员
function addCloseFunction() {
    $(this)
        .parent("span")
        .remove();
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
        $("#showSelected").html(
            Operation["ui_hasSelected"] +
            ":" +
            selectUserList.length +
            Operation["ui_personNum"] +
            "<i class='icon icon-up'></i>"
        );
        $("#showSelected")
            .off("click", goToSelectedPage)
            .on("click", goToSelectedPage);
    } else {
        $("#showSelected").html(Operation["ui_hasSelected"] + ":");
        $("#showSelected").off("click", goToSelectedPage);
    }
    $("#numberShow").html(selectUserList.length);
}

$("#cancel").on("click", function () {
    $.popup(".popup-about");
});

//发布抢单任务
function publishRobTask() {
    if (selectUserList.length && subDetail) {
        var userIds = [];
        $(selectUserList).each(function (i, obj) {
            userIds.push(obj.userId);
        });
        var userStrs = userIds.join(",");
        Substation.getDataByAjax(
            "/achieveOrderTask", {
                "fTaskid": taskid,
                "userIds": userStrs
            },
            function (data) {
                $.router.back();
            });
    }
}

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
    if (
        document.activeElement.tagName == "INPUT" ||
        document.activeElement.tagName == "TEXTAREA"
    ) {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});
$.init();