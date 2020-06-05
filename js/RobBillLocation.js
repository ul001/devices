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



    var selectSubid = localStorage.getItem("fSubid");
    var subName = "";
    var lng = 0;
    var lat = 0;
    var dizhi = "";
    var map;
    //变电所
    var subLat = 116.301934;
    var subLon = 39.977552;
    //我的位置
    var myLat = 116.508328;
    var myLon = 39.919141;
    var p1;
    var p2;
    Substation.getDataByAjax("/getSubInfoByfSubid", {
        fSubid: selectSubid
    }, function (data) {
        if (data.subInfo != undefined) {
            subName = data.subInfo.fSubname;
            lng = data.subInfo.fLongitude;
            lat = data.subInfo.fLatitude;
            loadScript();
        }
    });

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
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

        p1 = new BMap.Point(116.301934, 39.977552);
        p2 = new BMap.Point(116.508328, 39.919141);
        // var marker = new BMap.Marker(p2); // 创建标注
        // map.addOverlay(marker);
        // var label = new BMap.Label("变电所A", {
        //     offset: new BMap.Size(30, 0)
        // });
        // marker.setLabel(label);
        var driving = new BMap.DrivingRoute(map, {
            renderOptions: {
                map: map,
                autoViewport: true
            }
        });
        driving.search(p1, p2);
        $("#clickPop").click();

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
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        p1 = new BMap.Point(116.301934, 39.977552);
        p2 = new BMap.Point(116.508328, 39.919141);
        var walking = new BMap.WalkingRoute(map, {
            renderOptions: {
                map: map,
                autoViewport: true
            }
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
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        p1 = new BMap.Point(116.301934, 39.977552);
        p2 = new BMap.Point(116.508328, 39.919141);
        var driving = new BMap.DrivingRoute(map, {
            renderOptions: {
                map: map,
                autoViewport: true
            }
        });
        driving.search(p1, p2);
    }


    function loadScript() {
        var script = document.createElement("script");
        script.src = "http://api.map.baidu.com/api?v=3.0&ak=T9c1avrrhrkA5z5RacH7myHGg9VDt4Cb&callback=initialize";
        document.body.appendChild(script);
    }

    //声明一个控制点击的变量
    var upLoadClicktag = true;

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
        if (subLat != undefined && subLat != "" && subLon != undefined && subLon != "") {
            if (isAndroid) {
                android.goToMap(subLat, subLon, missionsubname);
            } else if (isIOS) {
                var locParam = {
                    Latitude: subLat,
                    Longitude: subLon,
                    locName: missionsubname
                };
                window.webkit.messageHandlers.pushMapSelect.postMessage(locParam);
            }
        } else {
            $.toast("尚未配置变电所经纬度！");
        }
    }

    $("#cancel").on('click', function () {
        $.popup('.popup-about');
    });

    $.init();