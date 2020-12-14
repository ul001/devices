var loading = false;
var itemsPerLoad = 10;
var pageNum = 1;
var meterId = Substation.GetQueryString("meterId");
var deviceType = Substation.GetQueryString("type");
var loadUrl = "/getControlLogList";
var subObj = JSON.parse(localStorage.getItem("subObj"));
try {
  if (isAndroid) {
    subObj = JSON.parse(android.getSpItem("subObj"));
  }
} catch (e) {}
var selectSubid = subObj.subId;
if (deviceType == "arcm300T") {
  loadUrl = "/getARCMControlLogList";
} else if (deviceType == "arcm310") {
  loadUrl = "/getARCM310ControlLogList";
} else {
  loadUrl = "/getControlLogList";
}
var params = {};

function getFirstPage() {
  $(".list-container").empty();
  pageNum = 1;
  addItems(itemsPerLoad);
  $(".infinite-scroll-preloader").html('<div class="preloader"></div>');
  loading = false;
  $.attachInfiniteScroll($(".infinite-scroll"));
}

$(document).on("refresh", ".pull-to-refresh-content", function (e) {
  setTimeout(function () {
    getFirstPage();
    // done
    $.pullToRefreshDone(".pull-to-refresh-content");
  }, 2000);
});

$(document).on("infinite", ".infinite-scroll", function () {
  // 如果正在加载，则退出
  if (loading) return;

  // 设置flag
  loading = true;

  setTimeout(function () {
    loading = false;
    addItems(itemsPerLoad);
  }, 1000);
});

function addItems(number) {
  params = {};
  params["pageNo"] = pageNum;
  params["pageSize"] = number;
  if (selectSubid != "") {
    params["fSubid"] = selectSubid;
  }
  var dateStartVal = $("#dateStart").val();
  var dateEndVal = $("#dateEnd").val();
  var controlPerson = $("#search").val();
  if (deviceType == "arcm300T" || deviceType == "arcm310") {
    if (dateStartVal != "") {
      params["startTime"] = dateStartVal + " 00:00:00";
    }
    if (dateEndVal != "") {
      params["endTime"] = dateEndVal + " 23:59:59";
    }
    if (controlPerson != "") {
      params["userName"] = controlPerson;
    }
    if (meterId != "" && meterId != undefined) {
      params["SerialNumber"] = meterId;
    }
  } else if (deviceType == "light") {
    if (dateStartVal != "") {
      params["fStarttime"] = dateStartVal + " 00:00:00";
    }
    if (dateEndVal != "") {
      params["fEndtime"] = dateEndVal + " 23:59:59";
    }
    if (controlPerson != "") {
      params["fUsername"] = controlPerson;
    }
    if (meterId != "" && meterId != undefined) {
      params["fMetercode"] = meterId;
    }
  } else if (
    deviceType == "05002" ||
    deviceType == "05004" ||
    deviceType == "05003"
  ) {
    if (dateStartVal != "") {
      params["fStarttime"] = dateStartVal + " 00:00:00";
    }
    if (dateEndVal != "") {
      params["fEndtime"] = dateEndVal + " 23:59:59";
    }
    if (controlPerson != "") {
      params["fUsername"] = controlPerson;
    }
    if (meterId != "" && meterId != undefined) {
      params["fMetercode"] = meterId;
    }
    if (deviceType != "" && deviceType != undefined) {
      params["fDevicetype"] = deviceType;
    }
  }
  Substation.postDataByAjaxNoLoading(
    loadUrl,
    params,
    function (data) {
      if (
        deviceType == "light" ||
        deviceType == "05002" ||
        deviceType == "05004" ||
        deviceType == "05003"
      ) {
        var dataSrc = data;
        if (pageNum == 1) {
          $(".list-container").empty();
        }
        if (dataSrc.list != undefined && dataSrc.list.length > 0) {
          $(dataSrc.list).each(function () {
            var controlStr = "";
            switch (this.fControltype) {
              case "reset":
                controlStr = Operation["ui_reset"];
                break;
              case "DO":
                controlStr = Operation["ui_DO"];
                break;
              case "silent":
                controlStr = Operation["ui_silent"];
                break;
              case "check":
                controlStr = Operation["ui_check"];
                break;
            }
            var askTime = "-";
            if (this.fAcktime != undefined && this.fAcktime != "") {
              askTime = this.fSendtime;
            }
            var askResult = Operation["ui_noResult"];
            if (this.fResult != undefined && this.fResult != "") {
              askResult = this.fResult;
            }
            $(".list-container").append(
              '<div class="card-log">' +
              '<div class="card-top">' +
              '<div class="lightGrayColor">' +
              Operation["ui_operating"] +
              "（" +
              Operation["ui_logTime"] +
              "：" +
              Substation.removeUndefined(this.fOperatetime) +
              "）</div>" +
              '<div class="blackColor">' +
              Substation.removeUndefined(this.fOperatername) +
              Operation["ui_logTowards"] +
              Substation.removeUndefined(this.fDevicename) +
              "（" +
              Substation.removeUndefined(this.fMetercode) +
              "）" +
              Operation["ui_logDoing"] +
              Substation.removeUndefined(this.deviceValueExplain) +
              Operation["ui_logOperate"] +
              "</div>" +
              "</div>" +
              '<div class="card-bottom">' +
              '<div class="lightGrayColor">' +
              Operation["ui_result"] +
              "（" +
              Operation["ui_logTime"] +
              "：" +
              askTime +
              "）</div>" +
              '<div class="blackColor">' +
              askResult +
              "</div>" +
              "</div>" +
              "</div>"
            );
          });
          pageNum++;
        } else {
          $.detachInfiniteScroll($(".infinite-scroll"));
          $(".infinite-scroll-preloader").html(
            "<span class='bottomTip'>--" +
            Operation["ui_nomoredata"] +
            "--</span>"
          );
          return;
        }
        if (dataSrc.list.length < itemsPerLoad) {
          $.detachInfiniteScroll($(".infinite-scroll"));
          $(".infinite-scroll-preloader").html(
            "<span class='bottomTip'>--" +
            Operation["ui_nomoredata"] +
            "--</span>"
          );
          return;
        }
      } else if (deviceType == "arcm300T" || deviceType == "arcm310") {
        var dataSrc = data.pageInfo;
        if (pageNum == 1) {
          $(".list-container").empty();
        }
        if (dataSrc.list != undefined && dataSrc.list.length > 0) {
          $(dataSrc.list).each(function () {
            var controlStr = "";
            switch (this.fControltype) {
              case "reset":
                controlStr = Operation["ui_reset"];
                break;
              case "DO":
                controlStr = Operation["ui_DO"];
                break;
              case "silent":
                controlStr = Operation["ui_silent"];
                break;
              case "check":
                controlStr = Operation["ui_check"];
                break;
            }
            var askTime = "-";
            if (this.fAcktime != undefined && this.fAcktime != "") {
              // askTime = formatDate(this.fAcktime);
              askTime = this.fAcktime;
            }
            var askResult = Operation["ui_noResult"];
            if (this.fResult != undefined && this.fResult != "") {
              askResult = this.fResult;
            }
            $(".list-container").append(
              '<div class="card-log">' +
              '<div class="card-top">' +
              '<div class="lightGrayColor">' +
              Operation["ui_operating"] +
              "（" +
              Operation["ui_logTime"] +
              "：" +
              Substation.removeUndefined(this.fSendtime) +
              "）</div>" +
              '<div class="blackColor">' +
              Substation.removeUndefined(this.fUsername) +
              Operation["ui_logTowards"] +
              Substation.removeUndefined(this.meterInfoname) +
              "（" +
              Substation.removeUndefined(this.fMeterserialnumber) +
              "）" +
              Operation["ui_logDoing"] +
              controlStr +
              Operation["ui_logOperate"] +
              "</div>" +
              "</div>" +
              '<div class="card-bottom">' +
              '<div class="lightGrayColor">' +
              Operation["ui_result"] +
              "（" +
              Operation["ui_logTime"] +
              "：" +
              askTime +
              "）</div>" +
              '<div class="blackColor">' +
              askResult +
              "</div>" +
              "</div>" +
              "</div>"
            );
          });
          pageNum++;
        } else {
          $.detachInfiniteScroll($(".infinite-scroll"));
          $(".infinite-scroll-preloader").html(
            "<span class='bottomTip'>--" +
            Operation["ui_nomoredata"] +
            "--</span>"
          );
          return;
        }
        if (dataSrc.list.length < itemsPerLoad) {
          $.detachInfiniteScroll($(".infinite-scroll"));
          $(".infinite-scroll-preloader").html(
            "<span class='bottomTip'>--" +
            Operation["ui_nomoredata"] +
            "--</span>"
          );
          return;
        }
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
}

addItems(itemsPerLoad);

$("#searchBtn").click(function () {
  var start = new Date(
    $("#dateStart")
    .val()
    .replace(/-/g, "/")
  );
  var end = new Date(
    $("#dateEnd")
    .val()
    .replace(/-/g, "/")
  );
  if (start > end) {
    $.toast(Operation["ui_dateselecttip"]);
    return;
  }
  $(".close-panel").click();
  getFirstPage();
});

function add0(m) {
  return m < 10 ? "0" + m : m;
}

function formatDate(timestamp) {
  //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
  var time = new Date(timestamp);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();
  return (
    year +
    "-" +
    add0(month) +
    "-" +
    add0(date) +
    " " +
    add0(hours) +
    ":" +
    add0(minutes) +
    ":" +
    add0(seconds)
  );
}

//时间快捷按钮
$(".buttons-row .button").click(function () {
  $(this)
    .addClass("active")
    .siblings()
    .removeClass("active");
});
$("#today").click(function () {
  var myDate = new Date();
  var todayVal = myDate.format("yyyy-MM-dd");
  Substation.changeCalendar(todayVal, "dateStart", "selectStartTime");
  Substation.changeCalendar(todayVal, "dateEnd", "selectEndTime");
});
$("#yestoday").click(function () {
  var myDate = new Date();
  myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
  var yestodayVal = myDate.format("yyyy-MM-dd");
  Substation.changeCalendar(yestodayVal, "dateStart", "selectStartTime");
  Substation.changeCalendar(yestodayVal, "dateEnd", "selectEndTime");
});
$("#thisMonth").click(function () {
  var myDate = new Date();
  var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
  var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
  var firstDayVal = firstDay.format("yyyy-MM-dd");
  var lastDayVal = lastDay.format("yyyy-MM-dd");
  Substation.changeCalendar(firstDayVal, "dateStart", "selectStartTime");
  Substation.changeCalendar(lastDayVal, "dateEnd", "selectEndTime");
});
$("#lastMonth").click(function () {
  var myDate = new Date();
  var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
  var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
  var firstDayVal = firstDay.format("yyyy-MM-dd");
  var lastDayVal = lastDay.format("yyyy-MM-dd");
  Substation.changeCalendar(firstDayVal, "dateStart", "selectStartTime");
  Substation.changeCalendar(lastDayVal, "dateEnd", "selectEndTime");
});

Date.prototype.format = function (fmt) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

//解决键盘遮挡问题
var h = $(window).height();
window.addEventListener("resize", function () {
  if ($(window).height() < h) {
    $(".btnBar").hide();
  }
  if ($(window).height() >= h) {
    $(".btnBar").show();
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