var u = navigator.userAgent,
  app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var subid = localStorage.getItem("fSubid");
var upLoadClicktag = true;

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

function goToManager(subId, subname) {
  // if (!upLoadClicktag) {
  //     return;
  // }
  // upLoadClicktag = false;
  // setTimeout(function () {
  //     upLoadClicktag = true;
  // }, 1000);
  // localStorage.setItem("fSubid", subId);
  // localStorage.setItem("fSubname", subname);
  // if (isAndroid) {
  //     android.goToIn();
  //     return;
  // }
  // window.location.href = "alarmAnalysisManager.html";
}

//点击修改管理按钮
function changeManager(devicecode, messinfocode) {
  if (!upLoadClicktag) {
    return;
  }
  upLoadClicktag = false;
  setTimeout(function() {
    upLoadClicktag = true;
  }, 1000);
  var buttons1 = [
    {
      text: "请选择",
      label: true
    },
    {
      text: "未使用",
      bold: true,
      // color: 'danger',
      onClick: function() {
        // $.alert("设置'未使用'成功");
        setDevicestate(devicecode, "0");
      }
    },
    {
      text: "使用",
      bold: true,
      // color: 'danger',
      onClick: function() {
        // $.alert("设置'使用'成功");
        setDevicestate(devicecode, "1");
      }
    },
    {
      text: "调试",
      bold: true,
      // color: 'danger',
      onClick: function() {
        // $.alert("设置'调试'成功");
        setDevicestate(devicecode, "2");
      }
    },
    {
      text: "监测",
      bold: true,
      onClick: function() {
        // $.alert("设置'监测'成功");
        setDevicestate(devicecode, "3");
      }
    }
  ];
  var buttons2 = [
    {
      text: "取消",
      bg: "danger"
    }
  ];
  var groups = [buttons1, buttons2];
  $.actions(groups);
}

function setDevicestate(devicecode, state) {
  var url = "/setMeterState";
  var params = {
    fMetercode: devicecode,
    fState: state,
    fSubid: subid
  };
  Substation.getDataByAjaxNoLoading(
    url,
    params,
    function(data) {
      $.toast("设置成功");
      getFirstPage();
    },
    function(errorCode) {
      $.toast("设置失败，errorCode:" + errorCode);
      return;
    }
  );
}

var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;

$("#dateStart").calendar();
$("#dateEnd").calendar();
// var myDate = new Date;
// var year = myDate.getFullYear(); //获取当前年
// var mon = myDate.getMonth() + 1; //获取当前月
// var date = myDate.getDate(); //获取当前日
// var nowDate = year + "-" + format0(mon) + "-" + format0(date);
// $("#dateStart").val(nowDate);
// //获取三十天前日期
// let lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30); //最后一个数字30可改，30天的意思
// let lastY = lw.getFullYear();
// let lastM = lw.getMonth() + 1;
// let lastD = lw.getDate();
// let lastdate = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD); //三十天之前日期
// $("#dateEnd").val(lastdate);
var startDate = localStorage.getItem("dateStartTime");
var endDate = localStorage.getItem("dateEndTime");
$("#dateStart").val(startDate);
$("#dateEnd").val(endDate);

//一键确认
$("#clearAlarm").click(function() {
  $.confirm(Operation["ui_selectTip"], function() {
    var url = "/oneClickConfirmSubAlarms";
    var params = {
      fSubid: subId
    };
    var dateStartVal = $("#dateStart").val();
    var dateEndVal = $("#dateEnd").val();
    if (dateStartVal != "") {
      params["fStarttime"] = dateStartVal + " 00:00:00";
    }
    if (dateEndVal != "") {
      params["fEndtime"] = dateEndVal + " 23:59:59";
    }
    Substation.getDataByAjaxNoLoading(
      url,
      params,
      function(data) {
        $.toast("一键确认成功");
        getFirstPage();
      },
      function(errorCode) {
        $.toast("一键确认失败，errorCode:" + errorCode);
        return;
      }
    );
  });
});

function format0(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
}

function getFirstPage() {
  $(".list-container").empty();
  pageNum = 1;
  addItems(itemsPerLoad, 0);
  lastIndex = 10;
  $(".infinite-scroll-preloader").html('<div class="preloader"></div>');
  loading = false;
  $.attachInfiniteScroll($(".infinite-scroll"));
}

$(document).on("refresh", ".pull-to-refresh-content", function(e) {
  setTimeout(function() {
    getFirstPage();
    // done
    $.pullToRefreshDone(".pull-to-refresh-content");
  }, 2000);
});

function addItems(number, lastIndex) {
  var html = "";
  var url = "/getSubDeviceAlarmLogNum";
  // var searchKey = $("#search").val();
  var dateStartVal = $("#dateStart").val();
  var dateEndVal = $("#dateEnd").val();
  var stateVal = $("#fState").val();
  var params = {
    pageNo: pageNum,
    pageSize: number,
    // key: searchKey,
    fSubid: subid
  };
  if (dateStartVal != "") {
    params["fStarttime"] = dateStartVal + " 00:00:00";
  }
  if (dateEndVal != "") {
    params["fEndtime"] = dateEndVal + " 23:59:59";
  }
  if (stateVal != "") {
    params["fState"] = stateVal;
  }
  Substation.getDataByAjaxNoLoading(
    url,
    params,
    function(data) {
      var listData = data.subDeviceAlarmLogNum;
      if (listData.hasOwnProperty("list") && listData.list.length > 0) {
        if (pageNum == 1) {
          $(".list-container").empty();
        }
        $(listData.list).each(function() {
          var titleColor = "#4682B4";
          if (this.fState == 1) {
            titleColor = "#4682B4";
          } else {
            titleColor = "red";
          }
          html +=
            '<div class="card">\n' +
            '                    <div class="card-content">\n' +
            '                        <div class="content-padded">\n' +
            '                            <div class="row  no-gutter sub_card">\n' +
            '                                <div class="col-90"  onClick="goToManager(' +
            this.fDevicecode +
            ",'" +
            this.fDevicename +
            "')\">\n" +
            '                                    <p class="subName limit-length">' +
            this.fDevicename +
            '                                            <span style="color:' +
            titleColor +
            '">(' +
            this.fStateExplain +
            ")</span>" +
            "                                    </p>\n" +
            "                                        <p>" +
            Operation["ui_AlarmAnalysisCount"] +
            "：" +
            '                                            <span style="color:red">' +
            this.fLogNum +
            "</span>" +
            "                                        </p>" +
            '                                     <p style="margin: 0.4rem 0;">' +
            Operation["ui_AlarmAnalysisType"] +
            "：" +
            this.fMessInfoExplain +
            "</p>" +
            "                                </div>" +
            '                                <div class="col-10">\n' +
            '                                        <button class="external goPhoto" type="button" onClick="changeManager(\'' +
            this.fDevicecode +
            "','" +
            this.fMessinfotypeid +
            "')\">" +
            '                                            <img class="upload_img" src="img/i-hAnalysisRank.png" style="width:60%" />' +
            "                                        </button>" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>";
        });
        $(".list-container").append(html);
        //addClick();
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
      if (listData.list.length < itemsPerLoad) {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html(
          "<span class='bottomTip'>--" +
            Operation["ui_nomoredata"] +
            "--</span>"
        );
        return;
      }
    },
    function(errorCode) {
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
addItems(itemsPerLoad, 0);

var lastIndex = 10;

$(document).on("infinite", ".infinite-scroll", function() {
  // 如果正在加载，则退出
  if (loading) return;

  // 设置flag
  loading = true;

  setTimeout(function() {
    loading = false;

    if (lastIndex >= maxItems) {
      $.detachInfiniteScroll($(".infinite-scroll"));
      $(".infinite-scroll-preloader").html(
        "<span class='bottomTip'>--" + Operation["ui_nomoredata"] + "--</span>"
      );
      return;
    }

    addItems(itemsPerLoad, lastIndex);
    lastIndex = $(".list-container .card").length;
  }, 1000);
});

$("#search").bind("keydown", function(event) {
  if (event.keyCode == 13) {
    getFirstPage();
    document.activeElement.blur();
  }
});

$(".searchbar-cancel").click(function() {
  $("#search").val("");
  getFirstPage();
});

//右上角
$("#searchBtn").click(function() {
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
  //存变电所
  //    if (saveAlarmParam != null && clickSubid == "") {
  //        clickSubid = saveAlarmParam['fSubid'];
  //        saveAlarmParam = null;
  //    }
  // if ($("#search").val() == "") {
  //     //        $("#subName").text("所有变电所");
  //     selectSubid = "";
  // } else if (clickSubid != "") {
  //     //        $("#subName").text($("#search").val());
  //     selectSubid = clickSubid;
  //     clickSubid = "";
  // }
  getFirstPage();
});

$("#search").bind("keydown", function(event) {
  if (event.keyCode == 13) {
    getSomeSubstation();
    document.activeElement.blur();
  }
});

$("#search").on("input", function() {
  if ($("#search").val().length > 0) {
    $(".icon.icon-clear").show();
  } else {
    $(".icon.icon-clear").hide();
  }
});

$("#search").on("focus", function() {
  if ($("#search").val().length > 0) {
    $(".icon.icon-clear").show();
  } else {
    $(".icon.icon-clear").hide();
  }
});

$(".icon.icon-clear").click(function() {
  $("#search").val("");
  getSomeSubstation(1);
  $(this).hide();
});

//时间快捷按钮
$(".buttons-row .button").click(function() {
  $(this)
    .addClass("active")
    .siblings()
    .removeClass("active");
});

$("#today").click(function() {
  var myDate = new Date();
  var todayVal = myDate.format("yyyy-MM-dd");
  Substation.changeCalendar(todayVal, "dateStart", "selectStartTime");
  Substation.changeCalendar(todayVal, "dateEnd", "selectEndTime");
});
$("#yestoday").click(function() {
  var myDate = new Date();
  myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
  var yestodayVal = myDate.format("yyyy-MM-dd");
  Substation.changeCalendar(yestodayVal, "dateStart", "selectStartTime");
  Substation.changeCalendar(yestodayVal, "dateEnd", "selectEndTime");
});
$("#thisMonth").click(function() {
  var myDate = new Date();
  var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
  var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
  var firstDayVal = firstDay.format("yyyy-MM-dd");
  var lastDayVal = lastDay.format("yyyy-MM-dd");
  Substation.changeCalendar(firstDayVal, "dateStart", "selectStartTime");
  Substation.changeCalendar(lastDayVal, "dateEnd", "selectEndTime");
});
$("#lastMonth").click(function() {
  var myDate = new Date();
  var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
  var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
  var firstDayVal = firstDay.format("yyyy-MM-dd");
  var lastDayVal = lastDay.format("yyyy-MM-dd");
  Substation.changeCalendar(firstDayVal, "dateStart", "selectStartTime");
  Substation.changeCalendar(lastDayVal, "dateEnd", "selectEndTime");
});

Date.prototype.format = function(fmt) {
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

$("#dateStart,#dateEnd").click(function() {
  $(".buttons-row")
    .find($(".active"))
    .removeClass("active");
});

//解决键盘遮挡问题
var h = $(window).height();
window.addEventListener("resize", function() {
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
    window.setTimeout(function() {
      document.activeElement.scrollIntoViewIfNeeded();
    }, 0);
  }
});

$(".back_btn").click(function() {
  if (isAndroid) {
    android.goBack();
  } else if (isIOS) {
    window.history.back();
  } else {
    window.history.back();
  }
});

$.init();
