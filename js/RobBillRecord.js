var lon = 0;
var lat = 0;
var addr = "";
var loading = false;
var itemsPerLoad = 10;
var pageNum = 1;
var typeId = 1;

$(".back_btn").click(function () {
  if (isIOS) {
    localStorage.removeItem("missionTypeid");
    localStorage.removeItem("taskID");
    window.webkit.messageHandlers.goBackiOS.postMessage("");
  } else {
    android.goBack();
  }
});

window.addEventListener(
  "pageshow",
  function (event) {
    if (localStorage.getItem("need-refresh") == "true") {
      localStorage.removeItem("need-refresh");
      window.location.reload();
    }
  },
  false
);

// window.addEventListener("pageshow", function (e) {
//     // ios系统 返回页面 不刷新的问题 Safari内核缓存机制导致 方案一 方案二：设置meta标签，清除页面缓存
//     var u = navigator.userAgent,
//         app = navigator.appVersion;
//     var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
//     if (e.persisted && isIOS) {
//         var needUpdate = localStorage.getItem("need-update");
//         if (needUpdate) {
//             localStorage.removeItem("need-update");
//             window.location.reload();
//         }
//         window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
//     }
// });

$(".buttons-tab .tab-link").click(function () {
  typeId = $(this).attr("name");
  getFirstPage(typeId);
});

//上拉加载
$(document).on("infinite", ".infinite-scroll", function () {
  // 如果正在加载，则退出
  if (loading) return;

  // 设置flag
  loading = true;

  setTimeout(function () {
    loading = false;
    var tabName = $(".tab-link.button.active").attr("name");
    addItems(itemsPerLoad, tabName);
    // $.pullToRefreshDone(".pull-to-refresh-content");
  }, 1000);
});

function getFirstPage(clickNum) {
  var num = "#tab" + clickNum;
  var list = "#listtab" + clickNum;
  $(list).empty();
  $(num + " .infinite-scroll-preloader").html('<div class="preloader"></div>');
  pageNum = 1;
  addItems(itemsPerLoad, clickNum);
  // $('.infinite-scroll-preloader').html('<div class="list-container"></div>');
  loading = false;
  // $.initPullToRefresh($('.pull-to-refresh-layer'));
  $.attachInfiniteScroll($(".infinite-scroll"));
}

//下拉刷新
$(document).on("refresh", ".pull-to-refresh-content", function (e) {
  setTimeout(function () {
    pageNum = 1;
    var tabName = $(".tab-link.button.active").attr("name");
    getFirstPage(tabName);
    // done
    $.pullToRefreshDone(".pull-to-refresh-content");
  }, 2000);
});

//初始化页面接口
function addItems(number, clickNum) {
  var text = "";
  var searchStr = $("#searchDaiban").val();
  if (!searchStr) {
    searchStr = "";
  }
  var url = "";
  var params = {};
  if (clickNum == 1) {
    url = "/getUnGrabbedOrderTaskList";
    params = {
      pageNo: pageNum,
      pageSize: number,
      userlongitude: lon,
      userlatitude: lat
    };
  } else if (clickNum == 2) {
    url = "/getGrabbedOrderTaskList";
    params = {
      pageNo: pageNum,
      pageSize: number,
      userlongitude: lon,
      userlatitude: lat
    };
  } else if (clickNum == 3) {
    url = "/getTaskListCreatedByMe";
    params = {
      pageNo: pageNum,
      pageSize: number,
      fTasktypeid: 7
    };
  }
  if (clickNum == 1 || clickNum == 2) {
    Substation.getDataByAjaxNoLoading(
      url,
      params,
      function (data) {
        var listDom = "#listtab" + clickNum;
        if (pageNum == 1) {
          $(listDom).empty();
        }
        var thisList;
        if (data.hasOwnProperty("orderList")) {
          thisList = data.orderList;
        }
        if (thisList != undefined && thisList != '' && thisList.length > 0) {
          var html = "";
          $(thisList).each(function () {
            var distance = this.userDistance;
            if (distance == undefined) {
              distance = "";
            } else {
              distance = Number(distance);
              if (distance >= 1000) {
                distance = (distance / 1000).toFixed(2) + "km";
              } else {
                distance = distance.toFixed(2) + "m";
              }
            }
            html += `<div class="card" onclick="goToDetail('${this.fTaskid}')">
                                  <div class="card-content">
                                      <div class="card-content-inner">
                                          <div class="row" style="margin-left:0;">
                                             <p class="subName limit-length col-80">${
                                               this.fSubName
                                             }</p>
                                             <p class="col-20 showRobImg" style="text-align:right;"><span class="showType">${
                                               Operation["ui_RobBill"]
                                             }</span></p>
                                          </div>
                                          <p class="row"><span class="col-66"><span style="color:gray;">${
                                            Operation["ui_TaskContent"]
                                          }</span>${this.fTaskcontent}</span>
                                              <span class="col-33"
                                                    style="color:#ADB2C1;text-align: right;">${distance}</span></p>
                                          <p class="row"><span class="col-50 showTime">${Operation[
                                            "ui_StarPlanTime"
                                          ] +
                                            this.fStartdate.substring(
                                              0,
                                              10
                                            )}</span>
                                              <span class="col-50 showTime">${Operation[
                                                "ui_endPlanTime"
                                              ] +
                                                this.fDeadlinedate.substring(
                                                  0,
                                                  10
                                                )}</span></p>
                                      </div>
                                  </div>
                              </div>`;
          });
          $(listDom).html(html);
          pageNum++;
          clickNum == 1 ? $(".showRobImg").show() : $(".showRobImg").hide();
        } else {
          $.detachInfiniteScroll($(".infinite-scroll"));
          $(".infinite-scroll-preloader").html(
            "<span class='bottomTip'>--" +
            Operation["ui_nomoredata"] +
            "--</span>"
          );
          return;
        }
        if (thisList.length < itemsPerLoad) {
          $.detachInfiniteScroll($(".infinite-scroll"));
          $(".infinite-scroll-preloader").html(
            "<span class='bottomTip'>--" +
            Operation["ui_nomoredata"] +
            "--</span>"
          );
          return;
        }
      },
      function (errorCode) {
        if (errorCode == 0) {
          $.detachInfiniteScroll($(".infinite-scroll"));
          $(".infinite-scroll-preloader").html(
            "--" + Operation["ui_neterror"] + "--"
          );
        } else {
          $.detachInfiniteScroll($(".infinite-scroll"));
          $(".infinite-scroll-preloader").html("");
        }
        return;
      }
    );
  } else if (clickNum == 3) {
    Substation.postDataByAjaxNoLoading(url, params, function (data) {
      if (data.hasOwnProperty("pageInfo") && data.pageInfo.list.length > 0) {
        var listDom = "#listtab" + clickNum;
        if (pageNum == 1) {
          $(listDom).empty();
        }
        var html = "";
        $(data.pageInfo.list).each(function () {
          html += `<div class="card" onclick="goToHistoryDetail('${
            this.fTaskid
          }')">
                              <div class="card-content">
                                  <div class="card-content-inner">
                                      <div class="row" style="margin-left:0;">
                                         <p class="subName limit-length col-80">${
                                           this.fSubName
                                         }</p>
                                         <p class="col-20 showRobImg" style="text-align:right;"><span class="showType">${
                                           Operation["ui_RobBill"]
                                         }</span></p>
                                      </div>
                                      <p class="row"><span class="col-66"><span style="color:gray;">${
                                        Operation["ui_TaskContent"]
                                      }</span>${this.fTaskcontent}</span>
                                          <span class="col-33"
                                                style="color:#ADB2C1;text-align: right;"></span></p>
                                      <p class="row"><span class="col-50 showTime">${Operation[
                                        "ui_StarPlanTime"
                                      ] +
                                        this.fStartdate.substring(0, 10)}</span>
                                          <span class="col-50 showTime">${Operation[
                                            "ui_endPlanTime"
                                          ] +
                                            this.fDeadlinedate.substring(
                                              0,
                                              10
                                            )}</span></p>
                                  </div>
                              </div>
                          </div>`;
        });
        $(listDom).append(html);
        pageNum++;
        clickNum == 1 ? $(".showRobImg").show() : $(".showRobImg").hide();
      } else {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html(
          "<span class='bottomTip'>--" +
          Operation["ui_nomoredata"] +
          "--</span>"
        );
        return;
      }
      if (data.pageInfo.list.length < itemsPerLoad) {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html(
          "<span class='bottomTip'>--" +
          Operation["ui_nomoredata"] +
          "--</span>"
        );
        return;
      }
    });
  }
}

$("#searchDaiban").bind("keydown", function (event) {
  if (event.keyCode == 13) {
    getFirstPage(tabName);
    document.activeElement.blur();
  }
});

$(".searchbar-cancel").click(function () {
  $("#searchDaiban").val("");
  getFirstPage(tabName);
});

$(".overButton").click(function () {
  if (isAndroid) {
    android.goToInHtml("taskPost.html?type=7");
  } else {
    window.location.href = "taskPost.html?type=7";
  }
});

function goToMonitorRobBill() {
  localStorage.setItem("userlatitude", lat);
  localStorage.setItem("userlongitude", lon);
  if (isAndroid) {
    android.goToInHtml("monitorRobBill.html");
  } else {
    window.location.href = "monitorRobBill.html";
  }
}

//记住状态
// $(".tab-link.button").click(function () {
//     var thisId = $(this).attr("id");
//     localStorage.setItem("thisItem", thisId);
//     tabName = Number(this.name);
//     pageNum = 1;
//     getFirstPage(tabName);
// });

//    var map = new BMap.Map("allmap");
//    var point1 = new BMap.Point(121.30713886, 31.34996039);
//    var point2 = new BMap.Point(116.31872260, 39.99664964);
//    var fDistance = map.getDistance(point1, point2);
//    console.log(fDistance);

function goToDetail(taskId) {
  localStorage.setItem("robTaskId", taskId);
  localStorage.setItem("userlatitude", lat);
  localStorage.setItem("userlongitude", lon);
  if (isAndroid) {
    android.goToInHtml("RobBillLocation.html");
  } else {
    window.location.href = "RobBillLocation.html";
  }
}

function goToHistoryDetail(taskId) {
  localStorage.setItem("robTaskId", taskId);
  localStorage.setItem("userlatitude", lat);
  localStorage.setItem("userlongitude", lon);
  localStorage.setItem("postTask", "true");
  if (isAndroid) {
    android.goToInHtml("RobBillLocation.html");
  } else {
    window.location.href = "RobBillLocation.html";
  }
}

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
  getFirstPage(typeId);
}

$.init();