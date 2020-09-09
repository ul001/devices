$(".back_btn").click(function () {
  if (isAndroid) {
    android.goBack();
  } else {
    window.history.back();
    window.webkit.messageHandlers.goBackiOS.postMessage("");
  }
});

var selectSubid = localStorage.getItem("fSubid");
var subName = "";
var map;
var geoc;
var lable;
var myValue;
var dizhi = "";
var lat;
var lon;
var myPp;
var markersArr = [];
var markerPerArr = [];

//获取定位
if (isIOS) {
  window.webkit.messageHandlers.getLocation.postMessage("");
  loc = localStorage.getItem("locationStrJS");
} else if (isAndroid) {
  if (android.getGPSUse()) {
    loc = android.getLocation();
    getLocAndCheckIn(loc);
  }
} else {
  getFirstPage(typeId);
}

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
    lat = array[0];
    lon = array[1];
    addr = array[2];
    if (addr == null || addr == "null") {
      addr = "";
    }
    //        alert(lat+","+lon+","+addr);
  }
  getFirstPage();
}

function getFirstPage() {
  Substation.getDataByAjax(
    "/getSubstationListByUser?pageNo=1&pageSize=999", {},
    function (data) {
      if (data.list != undefined) {
        markersArr = data.list;
        //绘制点
        // loadScript();
        getPersonsPage();
      }
    }
  );
}

function getPersonsPage() {
  Substation.getDataByAjax("/getUserLocationList", {}, function (data) {
    if (data != undefined) {
      markerPerArr = data;
      //绘制点
      loadScript();
    }
  });
}

function initialize() {
  map = new BMap.Map("l-map");
  if (!lat || lat == null || lat == undefined) {
    lat = markersArr[0].fLatitude;
  }
  if (!lon || lon == null || lon == undefined) {
    lon = markersArr[0].fLongitude;
  }
  myPp = new BMap.Point(lon, lat);
  geoc = new BMap.Geocoder();
  map.centerAndZoom(myPp, 8);
  map.clearOverlays(); //清除地图上所有覆盖物
  map.addControl(new BMap.NavigationControl());
  // 编写自定义函数,创建标注
  function addMarker(point, label, markDetail) {
    var icon = new BMap.Icon("img/i-baiduBiaozhu.png", new BMap.Size(50, 50));
    var marker = new BMap.Marker(point, {
      icon: icon
    });
    map.addOverlay(marker);
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
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

  function addPersonMarker(point, label, markDetail) {
    // var icon = new BMap.Icon("img/i-baiduBiaozhu.png", new BMap.Size(50, 50));
    // var marker = new BMap.Marker(point, {
    //     icon: icon
    // });
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    marker.setLabel(label);
    if ($("#showOrHide").attr("name") === "Showsubname") {

      label.hide();
      // marker.addEventListener("mouseover", AddShowEvent);
      // marker.addEventListener("mouseout", AddHideEvent);
    } else {

      label.show();
    }
    // addClickHandler(marker, markDetail);
  }

  //地图标记
  markersArr.forEach(function (marker) {
    var point = new BMap.Point(marker.fLongitude, marker.fLatitude);
    var label = new BMap.Label(marker.fSubname, {
      offset: new BMap.Size(20, -10)
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

  //人员标记
  markerPerArr.forEach(function (marker) {
    var point = new BMap.Point(marker.F_Longitude, marker.F_Latitude);
    var label = new BMap.Label(marker.F_UserName, {
      offset: new BMap.Size(20, -10)
    });
    label.setStyle({
      maxWidth: "none",
      fontSize: "15px",
      padding: "5px",
      border: "none",
      color: "#fff",
      background: "#3CB371",
      borderRadius: "5px"
    });
    // 调用编写自定义函数,创建标注
    addPersonMarker(point, label, marker);
  });

  //点击静态marker
  function addClickHandler(marker, markDetail) {
    // marker.addEventListener("click", function () {
    //   if (isAndroid) {
    //     android.clickSubstation(markDetail.fSubid, markDetail.fSubname);
    //   } else {
    //     window.history.back();
    //     window.webkit.messageHandlers.goBackSubPage.postMessage(markDetail);
    //   }
    // });
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
  // var ac = new BMap.Autocomplete({
  //     //建立一个自动完成的对象
  //     input: "suggestId",
  //     location: map,
  //     onSearchComplete: function (data) {
  //         var indexs = data.getNumPois();
  //         var html = "";
  //         if (indexs > 0) {
  //             for (var i = 0; i < indexs; i++) {
  //                 var _value = data.getPoi(i);
  //                 if (_value != null && _value != undefined) {
  //                     var value =
  //                         _value.province +
  //                         _value.city +
  //                         _value.district +
  //                         _value.street +
  //                         _value.business;
  //                     html += `<li class="item-content item-link" onclick="getMyPlace('${value}','${
  //           _value.business
  //         }')">
  //                                     <div class="item-inner">
  //                                         <div class="item-title-row">
  //                                             <div class="item-title">${
  //                                               _value.business
  //                                             }</div>
  //                                         </div>
  //                                         <div class="item-subtitle">${_value.province +
  //                                           _value.city +
  //                                           _value.district +
  //                                           _value.street}</div>
  //                                     </div>
  //                                 </li>`;
  //                 }
  //             }
  //             $("#results").show();
  //         } else {
  //             $("#results").hide();
  //         }
  //         $("#list-container").html(html);
  //     }
  // });

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
    $("#showOrHide").addClass("isClick");
    var markers = map.getOverlays();
    $("#showOrHide").empty();
    $("#showOrHide").html('<i class="icon icon-changeShowP"></i>');
    $.each(markers, function (key, val) {
      var label = val.getLabel();
      if (label === null) return;
      label.show();
    });
  } else {
    $("#showOrHide").attr("name", "Showsubname");
    // language.common.eleSelect($("#showOrHide"));
    $("#showOrHide").removeClass("isClick");
    var markers = map.getOverlays();
    $("#showOrHide").empty();
    $("#showOrHide").html('<i class="icon icon-changeHideP"></i>');
    $.each(markers, function (key, val) {
      var label = val.getLabel();
      if (label === null) return;
      label.hide();
    });
  }
  // if (!upLoadClicktag) {
  //   return;
  // }
  // return;
}

//搜索按钮点击
$("#suggestId").bind("keydown", function (event) {
  if (event.keyCode == 13) {
    var searchKey = $("#suggestId").val();
    Substation.getDataByAjax(
      "/getUserLocationList", {
        search: searchKey
      },
      function (data) {
        if (data != undefined) {
          if (data.length > 0 && data.length < 10) {
            var html = "";
            data.forEach(function (value) {
              var address = (value.F_Address != 'null') ? value.F_Address : "未知";
              html += `<li class="item-content item-link" onclick="searchPlace('${value.F_Longitude}','${value.F_Latitude}','${value.F_UserName}')">
                                      <div class="item-inner">
                                          <div class="item-title-row">
                                              <div class="item-title">${value.F_UserName}</div>
                                          </div>
                                           <div class="item-subtitle">${address}</div>
                                      </div>
                                  </li>`;
            });
            // for (var i = 0; i < data.length; i++) {
            //   var _value = data;
            //   if (_value != null && _value != undefined) {
            //     var value =
            //       _value.province +
            //       _value.city +
            //       _value.district +
            //       _value.street +
            //       _value.business;
            //     html += `<li class="item-content item-link" onclick="getMyPlace('${value}','${
            //       _value.business
            //     }')">
            //                           <div class="item-inner">
            //                               <div class="item-title-row">
            //                                   <div class="item-title">${
            //                                     _value.business
            //                                   }</div>
            //                               </div>
            //                               <div class="item-subtitle">${_value.province +
            //                                 _value.city +
            //                                 _value.district +
            //                                 _value.street}</div>
            //                           </div>
            //                       </li>`;
            //   }
            // }
            $("#results").show();
          } else {
            $("#results").hide();
          }
          $("#list-container").html(html);
        }
        // markersArr.forEach(function(marker) {
        //   if (marker.fAddress.search(searchKey) != -1) {
        //     var point = new BMap.Point(marker.fLongitude, marker.fLatitude);

        //     map.centerAndZoom(point, 15);
        //     var marker = new BMap.Marker(point); // 创建标注
        //     map.addOverlay(marker);
        //     marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        //     // if ($("#showOrHide").attr("name") === "Showsubname") {
        //     //     label.hide();
        //     // } else {
        //     //     label.show();
        //     // }
        //     // addClickHandler(marker, markDetail);
        //   }

        // var point = new BMap.Point(marker.fLongitude, marker.fLatitude);
        // var label = new BMap.Label(marker.fSubname, {
        //     offset: new BMap.Size(40, -10)
        // });
        // label.setStyle({
        //     maxWidth: "none",
        //     fontSize: "15px",
        //     padding: "5px",
        //     border: "none",
        //     color: "#fff",
        //     background: "#ff8355",
        //     borderRadius: "5px"
        // });
        // // 调用编写自定义函数,创建标注
        // addMarker(point, label, marker);
      }
    );
    //            local.search($("#suggestId").val());
    //            $("#results").show();
    //            $("#l-map").addClass("search-map");
    // document.activeElement.blur();
  }
});

//搜索按钮取消
$(".searchbar-cancel").click(function () {
  $("#suggestId").val("");
  $("#results").hide();
});

function searchPlace(longitude, latitude, name) {
  setPersonPlace(longitude, latitude);
  $("#suggestId").val(name);
  setTimeout(function () {
    $("#results").hide();
  }, 500);
}

function getMyPlace(value, name) {
  myValue = value;
  setPlace();
  $("#suggestId").val(name);
  setTimeout(function () {
    $("#results").hide();
  }, 500);
}

function setPersonPlace(longitude, latitude) {
  var pp = new BMap.Point(longitude, latitude);
  // var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
  map.centerAndZoom(pp, 18);
  var marker = new BMap.Marker(pp);
  marker.setLabel(lable);
  map.addOverlay(marker); //添加标注
  marker.setAnimation(BMAP_ANIMATION_BOUNCE);
  // geoc.getLocation(pp, function(rs) {
  //   var addComp = rs.addressComponents;
  //   dizhi =
  //     addComp.province +
  //     addComp.city +
  //     addComp.district +
  //     addComp.street +
  //     addComp.streetNumber;
  // });
  // myPp = pp;
  // }
  // var local = new BMap.LocalSearch(map, {
  //   //智能搜索
  //   onSearchComplete: personFun
  // });
  // local.search(myValue);
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