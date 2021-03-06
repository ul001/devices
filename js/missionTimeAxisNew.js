var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

//选人
var peopleType = "";
var subList = [];
var selectUserList = [];
var workerUser = [];

//巡检的变电所id
var missionsubid = "";
// var missionsubname = "X变电所";
// var subDetail;
var subName = localStorage.getItem("subName");
var missionTypeName = localStorage.getItem("missionTypeName");
var taskid = localStorage.getItem("taskID");
if (!taskid) {
    taskid = 967;
}
var jumpId = Substation.GetQueryString("jumpId");
var isPush = "0";
if (jumpId != undefined && jumpId != null && jumpId != "") {
    taskid = jumpId;
    isPush = "1";
}

//是否是我发布的
// var isOwnPostTask = localStorage.getItem("postTask");
//先隐藏
$(".popBottomBtn").hide();
$(".popBottomBtn2").hide();

var selectSubid = localStorage.getItem("fSubid");
// var subName = "";
var lng = 0;
var lat = 0;
var dizhi = "";
var map;
//变电所
var subLat = localStorage.getItem("subLat");
var subLon = localStorage.getItem("subLon");
// var subLat = 36.919141;
// var subLon = 117.508328;
//我的位置
var myLat = localStorage.getItem("userlatitude");
var myLon = localStorage.getItem("userlongitude");
var p1;
var p2;
var missionType = "";
var userID = localStorage.getItem("timeUserId");
localStorage.removeItem("timeUserId");
var ischargePerson = Substation.GetQueryString("ischargePerson");

if (userID && userID != undefined && userID != 'undefined' && userID.length > 0) {
    $("#control").hide();
}

//返回按钮事件
$(".suibian").click(function () {
    if (isPush == "1") {
        //推送详情点击返回事件
        if (isAndroid) {
            android.goBack();
        } else if (isIOS) {
            window.webkit.messageHandlers.goBackiOS.postMessage("");
            //            window.history.back();
        }
    } else {
        // if (isAndroid) {
        //     android.goBack();
        // } else {
        window.history.back();
        // }
    }
});

//地图初始化并默认查询行车路线
function initialize() {
    if (userID && userID != undefined && userID != 'undefined' && userID.length > 0) {
        // $("#control").hide();
        var useID = localStorage.getItem("YYUserId");
        var fTrackstarttime = localStorage.getItem("YYStartTime");
        var fTrackendtime = localStorage.getItem("YYEndTime");
        var path = [];

        var urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
        var baseUrlFromAPP = "http://116.236.149.165:8090/SubstationWEBV2/v5";
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
        //判断数组中是否包含某字符串
        if (isIOS) {
            //ios系统的处理
            window.webkit.messageHandlers.iOS.postMessage(null);
            var storage = localStorage.getItem("accessToken");
            storage = JSON.parse(storage);
            baseUrlFromAPP = storage.baseurl;
        } else {
            baseUrlFromAPP = android.getBaseUrl();
        }
        baseUrlFromAPP = baseUrlFromAPP.replace(/http:\/\//g, "");
        baseUrlFromAPP = baseUrlFromAPP.replace(/https:\/\//g, "");
        var realUrlArr = baseUrlFromAPP.split('/');
        baseUrlFromAPP = realUrlArr[0];
        var newrealArr = baseUrlFromAPP.split('.');
        var baseNew = newrealArr.join('-');
        if (baseNew.search(":") != -1) {
            newrealArr = baseNew.split(':');
            baseNew = newrealArr.join('_');
        }
        // baseUrlFromAPP = baseUrlFromAPP.replace(/./g, '-');
        // var baseUrl = (baseUrlFromAPP.replace(/:/g, '_')).split('.');
        var params = "ak=T9c1avrrhrkA5z5RacH7myHGg9VDt4Cb" + "&service_id=" + serviceId +
            "&entity_name=" + baseNew + '-' + useID +
            "&start_time=" + fTrackstarttime +
            "&end_time=" + fTrackendtime +
            "&is_processed=1";
        $.ajax({
            type: "GET",
            url: "http://yingyan.baidu.com/api/v3/track/gettrack",
            data: params,
            dataType: 'jsonp',
            beforeSend: function (request) {
                request.setRequestHeader("Access-Control-Allow-Origin", '*');
            },
            success: function (data) {
                if (data.status === 0) {
                    map = new BMap.Map("container");
                    map.centerAndZoom(new BMap.Point(data.start_point.longitude, data.start_point.latitude), 11);
                    // map.enableScrollWheelZoom(true);
                    path.push(data.start_point);
                    $.each(data.points, function (i, val) {
                        path.push(val);
                    });
                    path.push(data.end_point);
                    //标记起点
                    var startpoint = new BMap.Point(data.start_point.longitude, data.start_point.latitude);
                    var marker1 = new BMap.Marker(startpoint);
                    map.addOverlay(marker1); // 将标注添加到地图中
                    var label = new BMap.Label("起点", {
                        offset: new BMap.Size(20, -10)
                    });
                    marker1.setLabel(label);
                    //标记终点
                    var endpoint = new BMap.Point(data.end_point.longitude, data.end_point.latitude);
                    var marker2 = new BMap.Marker(endpoint);
                    map.addOverlay(marker2); // 将标注添加到地图中
                    var label2 = new BMap.Label("终点", {
                        offset: new BMap.Size(20, -10)
                    });
                    marker2.setLabel(label2);
                } else {
                    alert(data.message)
                }

                var point = [];
                for (var i = 0; i < path.length; i++) {
                    point.push(new BMap.Point(path[i].longitude, path[i].latitude));
                }
                var polyline = new BMap.Polyline(point, {
                    strokeColor: "red",
                    strokeWeight: 4,
                    strokeOpacity: 0.5
                });
                map.addOverlay(polyline);
            }
        });

        $("#clickPopup").click();

    } else {
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

}

//查询步行
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
            $.toast("未查询到步行路线，建议选择其他交通方式！");
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

//查询驾车
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

function pushTaskDetails() {
    // localStorage.setItem("missionType", missionType);
    // localStorage.setItem("taskID", taskid);
    // if (isAndroid) {
    //     android.goToIn();
    // } else {
    //     window.location.href = "missionDetail.html";
    // }
    // localStorage.setItem("need-refresh", "true");
    // if (isAndroid) {
    //     android.goBack();
    //     android.refresh();
    // } else {
    window.history.back();
    // }
}

//初始化地图
function loadScript() {
    var script = document.createElement("script");
    script.src =
        "http://api.map.baidu.com/api?v=3.0&ak=XWWTK5DwIWdF6stShGYzMgDTDLfHwsM4&callback=initialize";
    document.body.appendChild(script);
}

//声明一个控制点击的变量
var upLoadClicktag = true;

//从推送消息点击跳转
function getOwnLocation() {
    // if (jumpId) {
    //获取定位
    if (isIOS) {
        window.webkit.messageHandlers.getLocation.postMessage("");
        loc = localStorage.getItem("locationStrJS");
    } else if (isAndroid) {
        if (android.getGPSUse()) {
            loc = android.getLocation();
            getLocAndCheckIn(loc);
        }
    }
    // } else {
    //     $.toast("无法获取抢单详情，抢单ID为空");
    // }
}

//获取定位后初始化地图+查询行车路线
function getLocAndCheckIn(loc) {
    if (loc == undefined || !loc.length) {
        //        $.hidePreloader();
        $.toast(Operation["ui_localErrorTip"]);
        return;
    } else if (loc == "-1") {
        //        $.hidePreloader();
        $.toast(Operation["ui_gpsTip"]);
        return;
    } else {
        //        $.hidePreloader();
    }
    if (loc != "" && loc != null) {
        var array = loc.split(";");
        myLat = array[0];
        myLon = array[1];
        addr = array[2];
        if (addr == null || addr == "null") {
            addr = "";
        }
        //        alert(lat+","+lon+","+addr);
    }
    if (myLat && myLon) {
        // alert(myLat + "," + myLon + "," + addr);
        loadScript();
    } else {}
}

var params = {
    "taskId": taskid
};
if (userID && userID != undefined && userID != 'undefined' && userID.length > 0) {
    params["userId"] = userID;
}
// userID
function getNetData() {
    $(".demo").empty();
    Substation.getDataByAjax("/getTaskTimeLine", params, function (
        data
    ) {
        var strVar = "";
        strVar += '<div class="history">';
        strVar += '   <div class="history-date">';
        strVar += '      <ul class="history-ul">';
        strVar += "      </ul>";
        strVar += "   </div>";
        strVar += "</div>";
        $(".demo").append(strVar);

        if (data.length > 0) {
            if (ischargePerson == 1) {
                if (userID && userID != undefined && userID != 'undefined' && userID.length > 0) {
                    var lineData = data;
                    //个人
                    $(lineData).each(function () {
                        var strVar = "";
                        var timeY = this.F_TimeTitle.substring(8, 17);
                        var timeS = this.F_TimeTitle.substring(0, 5);
                        strVar += " <li>";
                        strVar +=
                            "                                            <h3>" +
                            timeS +
                            "<span>" +
                            timeY +
                            "</span></h3>";
                        strVar += "                                            <dl>";
                        strVar += "                                                <dt>";
                        strVar += this.F_Done;
                        strVar += "                                                </dt>";
                        strVar += "                                            </dl>";
                        strVar += "                                        </li>";
                        $(".history-ul").append(strVar);
                    });
                } else {
                    //总任务
                    var lineData = data;
                    $(lineData).each(function () {
                        var strArr = this.F_Done.split(";");
                        var strVar = "";
                        strVar += " <li>";
                        strVar +=
                            '                                            <h3 style="font: normal 0.6rem Arial;">' +
                            this.F_TimeTitle +
                            "</h3>";
                        strVar += "                                            <dl>";
                        $(strArr).each(function () {
                            strVar += "                                                <dt style=\"font: 15px/22px 微软雅黑;\">";
                            strVar += this;
                            strVar += "                                                </dt>";
                        });
                        strVar += "                                            </dl>";
                        strVar += "                                        </li>";
                        $(".history-ul").append(strVar);
                    });
                }
            } else {
                var lineData = data;
                //个人
                $(lineData).each(function () {
                    var strVar = "";
                    var timeY = this.F_TimeTitle.substring(8, 17);
                    var timeS = this.F_TimeTitle.substring(0, 5);
                    strVar += " <li>";
                    strVar +=
                        "                                            <h3>" +
                        timeS +
                        "<span>" +
                        timeY +
                        "</span></h3>";
                    strVar += "                                            <dl>";
                    strVar += "                                                <dt>";
                    strVar += this.F_Done;
                    strVar += "                                                </dt>";
                    strVar += "                                            </dl>";
                    strVar += "                                        </li>";
                    $(".history-ul").append(strVar);
                });
            }

            // for (let index = 0; index < 5; index++) {
            //   // const element = array[index];
            //   var strVar = "";
            //   strVar += " <li>";
            //   strVar +=
            //     "                                            <h3>10:08<span>12/10/08</span></h3>";
            //   strVar += "                                            <dl>";
            //   strVar += "                                                <dt>";
            //   strVar +=
            //     "                                                    发布任务<span>张三发布了上海嘉定变电所的巡检任务</span>";
            //   strVar += "                                                </dt>";
            //   strVar += "                                            </dl>";
            //   strVar += "                                        </li>";
            // }
            //给最后一个li添加绿色效果
            $("ul li:last-child").attr("class", "green");

            getOwnLocation();

            // loadScript();
            $(".popBottomBtn2").show();
            //         }

            //         missionType = subDetail.fTaskstateid;
            //         //判断按钮显隐
            //         if (userList && userList.length > 0) {
            //             $(".popBottomBtn").hide();
            //             $(".popBottomBtn2").show();
            //         } else if (isOwnPostTask == "true") {
            //             $(".popBottomBtn").hide();
            //             $(".popBottomBtn2").show();
            //         } else {
            //             $(".popBottomBtn").show();
            //         }

            //         localStorage.removeItem("postTask");
            //         // localStorage.setItem("postTask", "false");
            //         //跳转视频
            //         $("#jumpVideo").click(function () {
            //             if (isAndroid) {
            //                 android.videoWatch(subDetail.fSubid);
            //             } else if (isIOS) {
            //                 var subParam = {
            //                     Subid: subDetail.fSubid,
            //                     Subname: subDetail.fSubName
            //                 };
            //                 window.webkit.messageHandlers.pushVideoListVC.postMessage(subParam);
            //             }
            //         });
            //     }
        } else {
            var strVar = "";
            strVar += '<div class="history">';
            strVar += '   <div class="history-date">';
            strVar += '      <p style="width: 100%;display: flex;align-items: center;justify-content: center;font-size: 0.8rem;">--暂无数据--';
            strVar += "      </p>";
            strVar += "   </div>";
            strVar += "</div>";
            $(".demo").append(strVar);
            getOwnLocation();
        }
    });
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
            android.goToMap(subLat, subLon, subName);
        } else if (isIOS) {
            var locParam = {
                Latitude: subLat,
                Longitude: subLon,
                locName: subName
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
            // if (
            //     data.hasOwnProperty("userGroupList") &&
            //     data.userGroupList.length > 0
            // ) {
            //     $(".classUl").show();
            //     var html = "";
            //     $(data.userGroupList).each(function () {
            //         html +=
            //             "<li>\n" +
            //             '    <div class="item-content">\n' +
            //             '        <div class="item-inner">\n' +
            //             '            <div class="item-title">' +
            //             Substation.removeUndefined(this.fUsergroupname) +
            //             "</div>\n" +
            //             '            <div class="item-after">\n' +
            //             '                <span class="nextClass" data-id="' +
            //             this.fUsergroupid +
            //             '" data-name="' +
            //             Substation.removeUndefined(this.fUsergroupname) +
            //             '">\n' +
            //             '                    <i class="icon icon-nextclass"></i>' +
            //             Operation["ui_nextClass"] +
            //             "\n" +
            //             "                </span>\n" +
            //             "            </div>\n" +
            //             "        </div>\n" +
            //             "    </div>\n" +
            //             "</li>";
            //     });
            //     $(".classUl").html(html);
            //     $(".nextClass")
            //         .off("click", nextClassClick)
            //         .on("click", nextClassClick);
            // } else {
            //     $(".classUl").hide();
            // }
            // getPersonList(pid);
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
                        Substation.removeUndefined(this.fUserName) +
                        '">\n' +
                        '        <div class="item-media"><i class="icon icon-form-checkbox"></i></div>\n' +
                        '        <div class="item-inner">\n' +
                        '            <div class="item-title">' +
                        Substation.removeUndefined(this.fUserName) +
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
            "                </lineData.taskPost.fUserName>\n" +
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

//动画效果
// $(function () {
//     systole();
// });

// function systole() {
//     if (!$(".history").length) {
//         return;
//     }
//     var $warpEle = $(".history-date"),
//         $targetA = $warpEle.find("h2 a,ul li dl dt a"),
//         parentH, eleTop = [];
//     parentH = $warpEle.parent().height();
//     $warpEle.parent().css({
//         "height": 59
//     });
//     setTimeout(function () {
//         $warpEle.find("ul").children(":not('h2:first')").each(function (idx) {
//             eleTop.push($(this).position().top);
//             $(this).css({
//                 "margin-top": -eleTop[idx]
//             }).children().hide();
//         }).animate({
//             "margin-top": 0
//         }, 1600).children().fadeIn();
//         $warpEle.parent().animate({
//             "height": parentH
//         }, 2600);
//         $warpEle.find("ul").children(":not('h2:first')").addClass("bounceInDown").css({
//             "-webkit-animation-duration": "2s",
//             "-webkit-animation-delay": "0",
//             "-webkit-animation-timing-function": "ease",
//             "-webkit-animation-fill-mode": "both"
//         }).end().children("h2").css({
//             "position": "relative"
//         });
//     }, 600);
//     $targetA.click(function () {
//         $(this).parent().css({
//             "position": "relative"
//         });
//         $(this).parent().siblings().slideToggle();
//         $warpEle.parent().removeAttr("style");
//         return false;
//     });
// };