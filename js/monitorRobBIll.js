$(".back_btn").click(function () {
    if (isAndroid) {
        android.goBack();
    } else {
        window.history.back();
    }
});

var selectSubid = localStorage.getItem("fSubid");
var subName = "";
var map;
var geoc;
var lable;
var myValue;
var dizhi = "";
var lat = localStorage.getItem("userlatitude");
var lon = localStorage.getItem("userlongitude");
var myPp;

var markersArr = [];

var params = {
    pageNo: 1,
    pageSize: 100,
    userlongitude: lon,
    userlatitude: lat
};
Substation.getDataByAjax(
    "/getUnGrabbedOrderTaskList", {
        params
    },
    function (data) {
        if (data.orderList != undefined) {
            markersArr = data.orderList;
            loadScript();
        }
    }
);

function initialize() {
    map = new BMap.Map("l-map");
    myPp = new BMap.Point(lon, lat);
    geoc = new BMap.Geocoder();
    map.centerAndZoom(myPp, 18);
    map.clearOverlays(); //清除地图上所有覆盖物
    map.addControl(new BMap.NavigationControl());
    // 编写自定义函数,创建标注
    function addMarker(point, label, markDetail) {
        var icon = new BMap.Icon("img/i-baiduBiaozhu.png", new BMap.Size(50, 50));
        var marker = new BMap.Marker(point, {
            icon: icon
        });
        map.addOverlay(marker);
        marker.setLabel(label);
        if ($("#showOrHide").attr("name") === "Showsubname") {
            label.hide();
            // marker.addEventListener("mouseover", AddShowEvent);
            // marker.addEventListener("mouseout", AddHideEvent);
        } else {
            label.show();
        }
        addClickHandler(marker, markDetail);
    }
    markersArr.forEach(function (marker) {
        var point = new BMap.Point(marker.fLongitude, marker.fLatitude);
        var label = new BMap.Label(marker.fTaskname, {
            offset: new BMap.Size(40, -10)
        });
        label.setStyle({
            maxWidth: "none",
            fontSize: "15px",
            padding: "5px",
            border: "none",
            color: "#fff",
            background: "#ff8355",
            borderRadius: "5px"
        });
        // 调用编写自定义函数,创建标注
        addMarker(point, label, marker);
    });
    var marker = new BMap.Marker(new BMap.Point(lon,lat));  // 创建标注
    map.addOverlay(marker);
	var label = new BMap.Label("我的位置", {
        offset: new BMap.Size(25, -15)
    });
    label.setStyle({
        maxWidth: "none",
        fontSize: "15px",
        padding: "5px",
        border: "none",
        color: "#fff",
        background: "#ff8355",
        borderRadius: "5px"
    });
	marker.setLabel(label);
    //点击静态marker
    function addClickHandler(marker, markDetail) {
        marker.addEventListener("click", function () {
            localStorage.setItem("robTaskId", markDetail.fTaskid);
            localStorage.setItem("userlatitude", lat);
            localStorage.setItem("userlongitude", lon);
//            if (isAndroid) {
//                android.goToInHtml("RobBillLocation.html");
//            } else {
                window.location.href = "RobBillLocation.html?isLocJump=1";
//            }
        });
    }
    // var marker = new BMap.Marker(myPp); // 创建标注
    // lable = new BMap.Label(subName, {
    //     offset: new BMap.Size(0, -32)
    // });
    // lable.setStyle({
    //     maxWidth: 'none',
    //     fontSize: '15px',
    //     padding: '5px',
    //     border: 'none',
    //     color: '#fff',
    //     background: '#ff8355',
    //     borderRadius: '5px'
    // });
    // marker.setLabel(lable);
    // map.addOverlay(marker);
    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE
        // 启用显示定位
        //        enableGeolocation: true
    });
    map.addControl(navigationControl);
    var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: map,
        onSearchComplete: function (data) {
            var indexs = data.getNumPois();
            var html = "";
            if (indexs > 0) {
                for (var i = 0; i < indexs; i++) {
                    var _value = data.getPoi(i);
                    if (_value != null && _value != undefined) {
                        var value =
                            _value.province +
                            _value.city +
                            _value.district +
                            _value.street +
                            _value.business;
                        html += `<li class="item-content item-link" onclick="getMyPlace('${value}','${
              _value.business
            }')">
                                        <div class="item-inner">
                                            <div class="item-title-row">
                                                <div class="item-title">${
                                                  _value.business
                                                }</div>
                                            </div>
                                            <div class="item-subtitle">${_value.province +
                                              _value.city +
                                              _value.district +
                                              _value.street}</div>
                                        </div>
                                    </li>`;
                    }
                }
                $("#results").show();
            } else {
                $("#results").hide();
            }
            $("#list-container").html(html);
        }
    });
    //      marker.enableDragging();
    //      marker.addEventListener("dragend", function(e) {
    //          lng = e.point.lng;
    //          lat = e.point.lat;
    //          geoc.getLocation(e.point, function(rs){
    //              var addComp = rs.addressComponents;
    //              dizhi = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
    //              //lable.setContent(dizhi);
    //              marker.setLabel(lable);
    //          //alert("当前位置：" + e.point.lng + ", " + e.point.lat);
    //          });
    //      });
}

function loadScript() {
    var script = document.createElement("script");
    script.src =
        "http://api.map.baidu.com/api?v=3.0&ak=XWWTK5DwIWdF6stShGYzMgDTDLfHwsM4&callback=initialize";
    document.body.appendChild(script);
}

//声明一个控制点击的变量
var upLoadClicktag = true;

function showOrHide() {
    if ($("#showOrHide").attr("name") === "Showsubname") {
        $("#showOrHide").attr("name", "Hidesubname");
        // language.common.eleSelect($("#showOrHide"));
        $("#showOrHide").addClass('isClick');
        var markers = map.getOverlays();
        $.each(markers, function (key, val) {
            var label = val.getLabel();
            if (label === null)
                return;
            label.show();
        });
    } else {
        $("#showOrHide").attr("name", "Showsubname");
        // language.common.eleSelect($("#showOrHide"));
        $("#showOrHide").removeClass('isClick');
        var markers = map.getOverlays();
        $.each(markers, function (key, val) {
            var label = val.getLabel();
            if (label === null)
                return;
            label.hide();

        });
    }
    // if (!upLoadClicktag) {
    //   return;
    // }
    // return;

}

$("#suggestId").bind("keydown", function (event) {
    if (event.keyCode == 13) {
        //            local.search($("#suggestId").val());
        //            $("#results").show();
        //            $("#l-map").addClass("search-map");
        document.activeElement.blur();
    }
});

$(".searchbar-cancel").click(function () {
    $("#suggestId").val("");
    $("#results").hide();
});

function getMyPlace(value, name) {
    myValue = value;
    setPlace();
    $("#suggestId").val(name);
    setTimeout(function () {
        $("#results").hide();
    }, 500);
}

function setPlace() {
    map.clearOverlays(); //清除地图上所有覆盖物
    function myFun() {
        var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        var marker = new BMap.Marker(pp);
        marker.setLabel(lable);
        map.addOverlay(marker); //添加标注
        geoc.getLocation(pp, function (rs) {
            var addComp = rs.addressComponents;
            dizhi =
                addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber;
        });
        myPp = pp;
    }
    var local = new BMap.LocalSearch(map, {
        //智能搜索
        onSearchComplete: myFun
    });
    local.search(myValue);
}


$.init();