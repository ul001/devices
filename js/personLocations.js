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
var markerCarArr = [];

//用于控制显隐
var personArr = [];
var carArr = [];
var subArr = [];

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
      getCarPage();
    }
  });
}

function getCarPage() {
  Substation.postDataByAjax("/getCarLocationList", {}, function (data) {
    if (data != undefined) {
      markerCarArr = data.data;
      //绘制点
      loadScript();
    }
  });
}

$("#fState").change(function (params) {
  var stateVal = $("#fState").val();
  if (stateVal == 2) {
    $("#search").attr("placeholder", "输入车辆简称或者车牌号...");
  } else if (stateVal == 3) {
    $("#search").attr("placeholder", "输入站点名称...");
  } else {
    $("#search").attr("placeholder", "输入人员姓名...");
  }
});

//人显隐
function walk() {
  var text = $("#Walk").html();
  if (text == Operation["ui_show"]) {
    $("#Walk").html(Operation["ui_hide"]);
    $("#WalkBtn").css("background-color", "lightgrey");
    personArr.forEach(function (marker) {
      marker.hide();
    });
  } else {
    $("#Walk").html(Operation["ui_show"]);
    $("#WalkBtn").css("background-color", "#02A8A6");
    personArr.forEach(function (marker) {
      marker.show();
    });
  }
}

//车
function drive() {
  var text = $("#Drive").html();
  if (text == Operation["ui_show"]) {
    $("#Drive").html(Operation["ui_hide"]);
    $("#DriveBtn").css("background-color", "lightgrey");
    carArr.forEach(function (marker) {
      marker.hide();
    });
  } else {
    $("#Drive").html(Operation["ui_show"]);
    $("#DriveBtn").css("background-color", "#02A8A6");
    carArr.forEach(function (marker) {
      marker.show();
    });
  }
}

//变电所
function substation() {
  var text = $("#Substation").html();
  if (text == Operation["ui_show"]) {
    $("#Substation").html(Operation["ui_hide"]);
    $("#SubstationBtn").css("background-color", "lightgrey");
    subArr.forEach(function (marker) {
      marker.hide();
    });
  } else {
    $("#Substation").html(Operation["ui_show"]);
    $("#SubstationBtn").css("background-color", "#02A8A6");
    subArr.forEach(function (marker) {
      marker.show();
    });
  }
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
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    marker.setLabel(label);
    map.addOverlay(marker);
    // marker.customData('searchId':'');
    //添加变电所marker
    subArr.push(marker);
    if ($("#showOrHide").attr("name") === "Showsubname") {
      label.hide();
      // marker.addEventListener("mouseover", AddShowEvent);
      // marker.addEventListener("mouseout", AddHideEvent);
    } else {
      label.show();
    }
    addClickHandler(marker, markDetail);
  }

  //添加人物点
  function addPersonMarker(point, label, markDetail) {
    var icon = "";
    //活跃度
    if (markDetail.F_IsActive == 1) {
      icon = new BMap.Icon("img/i-personP.png", new BMap.Size(40, 40));
    } else {
      icon = new BMap.Icon("img/i-personPgrey.png", new BMap.Size(40, 40));
    }
    var marker = new BMap.Marker(point, {
      icon: icon
    });
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    marker.setLabel(label);
    map.addOverlay(marker);
    //marker添加id
    marker.customData = {
      'userID': markDetail.F_UserID
    };
    //添加人员marker
    personArr.push(marker);
    if ($("#showOrHide").attr("name") === "Showsubname") {

      label.hide();
      // marker.addEventListener("mouseover", AddShowEvent);
      // marker.addEventListener("mouseout", AddHideEvent);
    } else {

      label.show();
    }
    // addClickHandler(marker, markDetail);
  }

  //添加车点
  function addCarMarker(point, label, markDetail) {
    var icon = "";
    //车活跃度
    if (markDetail.online == 1) {
      icon = new BMap.Icon("img/i-car.png", new BMap.Size(52, 26));
    } else {
      icon = new BMap.Icon("img/i-cargrey.png", new BMap.Size(52, 26));
    }
    var marker = new BMap.Marker(point, {
      icon: icon
    });
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    marker.setLabel(label);
    map.addOverlay(marker);
    //marker添加车id
    marker.customData = {
      'carID': markDetail.carInfo.fCarid
    };
    //添车marker
    carArr.push(marker);
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
      offset: new BMap.Size(30, -10)
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
      offset: new BMap.Size(33, -10)
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

  //che标记
  markerCarArr.forEach(function (marker) {
    var point = new BMap.Point(marker.lonc, marker.latc);
    var label = new BMap.Label(marker.carInfo.fCarname, {
      offset: new BMap.Size(33, -10)
    });
    label.setStyle({
      maxWidth: "none",
      fontSize: "15px",
      padding: "5px",
      border: "none",
      color: "#fff",
      background: "#1E90FF",
      borderRadius: "5px"
    });
    // 调用编写自定义函数,创建标注
    addCarMarker(point, label, marker);
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

$("#picker").picker({
  toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-left">按钮</button>\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">标题</h1>\
  </header>',
  cols: [{
    textAlign: 'center',
    values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
  }]
});

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
$("#search").bind("keydown", function (event) {
  if (event.keyCode == 13) {
    var searchKey = $("#search").val();
    var stateVal = $("#fState").val();
    if (stateVal == 2) {
      //搜车
      Substation.postDataByAjax("/getCarLocationList", {
        search: searchKey
      }, function (data) {
        if (data != undefined) {
          if (data.data.length > 0) {
            var html = "";
            data.data.forEach(function (value, index) {
              html += `<li class="item-content item-link" onclick="searchPlace('${value.lonc}','${value.latc}','${value.carInfo.fCarname}','${value.carId}')">
                                      <div class="item-inner">
                                          <div class="item-title-row">
                                              <div class="item-title">${value.carInfo.fCarname}</div>
                                          </div>
                                           <div class="item-subtitle">${value.carInfo.fCarlicense}</div>
                                      </div>
                                  </li>`;
              if (index > 10) {
                return;
              }
            });
            $("#results").show();
          } else {
            $("#results").hide();
          }
          $("#list-container").html(html);
        }
      });
    } else if (stateVal == 3) {
      //搜变电所
      Substation.getDataByAjax(
        "/getSubstationListByUser?pageNo=1&pageSize=999", {
          search: searchKey
        },
        function (data) {
          if (data != undefined) {
            if (data.list.length > 0) {
              var html = "";
              data.list.forEach(function (value, index) {
                var address = (value.fAddress != 'null') ? value.fAddress : "未知";
                html += `<li class="item-content item-link" onclick="searchPlace('${value.fLongitude}','${value.fLatitude}','${value.fSubname}','${value.fSubid}')">
                                      <div class="item-inner">
                                          <div class="item-title-row">
                                              <div class="item-title">${value.fSubname}</div>
                                          </div>
                                           <div class="item-subtitle">${address}</div>
                                      </div>
                                  </li>`;
                if (index > 10) {
                  return;
                }
              });
              $("#results").show();
            } else {
              $("#results").hide();
            }
            $("#list-container").html(html);
          }
        }
      );
    } else {
      //搜人
      Substation.getDataByAjax(
        "/getUserLocationList", {
          search: searchKey
        },
        function (data) {
          if (data != undefined) {
            if (data.length > 0) {
              var html = "";
              data.forEach(function (value, index) {
                var address = (value.F_Address != 'null') ? value.F_Address : "未知";
                html += `<li class="item-content item-link" onclick="searchPlace('${value.F_Longitude}','${value.F_Latitude}','${value.F_UserName}','${value.F_UserID}')">
                                      <div class="item-inner">
                                          <div class="item-title-row">
                                              <div class="item-title">${value.F_UserName}</div>
                                          </div>
                                           <div class="item-subtitle">${address}</div>
                                      </div>
                                  </li>`;
                if (index > 10) {
                  return;
                }
              });
              $("#results").show();
            } else {
              $("#results").hide();
            }
            $("#list-container").html(html);
          }
        }
      );
    }
  }
});

//搜索按钮取消
$("#searchCancel").click(function () {
  $("#suggestId").val("");
  $("#results").hide();
});

function searchPlace(longitude, latitude, name, userID) {
  setPersonPlace(longitude, latitude, userID);
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

function setPersonPlace(longitude, latitude, userID) {


  var pp = new BMap.Point(longitude, latitude);
  // var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
  map.centerAndZoom(pp, 18);
  // var marker = new BMap.Marker(pp);
  // marker.setLabel(lable);
  // map.addOverlay(marker); //添加标注
  // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
  //人员标记
  // markerPerArr.forEach(function (marker) {
  //   marker.addEventListener(e) {
  //     console.log(e.target.customData.userID);
  //   }
  // var point = new BMap.Point(marker.F_Longitude, marker.F_Latitude);
  // var label = new BMap.Label(marker.F_UserName, {
  //   offset: new BMap.Size(33, -10)
  // });
  // label.setStyle({
  //   maxWidth: "none",
  //   fontSize: "15px",
  //   padding: "5px",
  //   border: "none",
  //   color: "#fff",
  //   background: "#3CB371",
  //   borderRadius: "5px"
  // });
  // // 调用编写自定义函数,创建标注
  // addPersonMarker(point, label, marker);
  // });
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