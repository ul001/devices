var loading = false;
var itemsPerLoad = 10;
var pageNum = 1;

function getFirstPage() {
  $("#list-container").empty();
  pageNum = 1;
  addItems(itemsPerLoad);
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

function addItems(number) {
  var html = "";
  var url = "/getTaskListCreatedByMe";
  var searchKey = $("#searchDaiban").val();
  var fCreatest = $("#dateStart").val();
  var fCreateet = $("#dateEnd").val();
  var fPlanst = $("#dateStart1").val();
  var fPlanet = $("#dateEnd1").val();
  var fDeadlinest = $("#dateStart2").val();
  var fDeadlineet = $("#dateEnd2").val();
  var fTasktypeid = $("#taskType").val();
  var chargername = $("#chargeSelect").val();
  var executername = $("#doSelect").val();
  var orderby = $("#timeRank").val();
  var params = {
    pageNo: pageNum,
    pageSize: number
  };
  if (searchKey != "" && searchKey != null) {
    params["searchKey"] = searchKey;
  }
  if (fCreatest != "" && fCreatest != null) {
    params["fCreatest"] = fCreatest + " 00:00:00";
  }
  if (fCreateet != "" && fCreateet != null) {
    params["fCreateet"] = fCreateet + " 23:59:59";
  }
  if (fPlanst != "" && fPlanst != null) {
    params["fPlanst"] = fPlanst + " 00:00:00";
  }
  if (fPlanet != "" && fPlanet != null) {
    params["fPlanet"] = fPlanet + " 23:59:59";
  }
  if (fDeadlinest != "" && fDeadlinest != null) {
    params["fDeadlinest"] = fDeadlinest + " 00:00:00";
  }
  if (fDeadlineet != "" && fDeadlineet != null) {
    params["fDeadlineet"] = fDeadlineet + " 23:59:59";
  }
  if (fTasktypeid != "" && fTasktypeid != null) {
    params["fTasktypeid"] = fTasktypeid;
  }
  if (chargername != "" && chargername != null) {
    params["chargername"] = chargername;
  }
  if (executername != "" && executername != null) {
    params["executername"] = executername;
  }
  if (orderby != "" && orderby != null) {
    params["orderby"] = orderby;
  }
  Substation.postDataByAjaxNoLoading(url, params, function(data) {
    if (data.pageInfo.list.length > 0) {
      if (pageNum == 1) {
        $("#list-container").empty();
      }
      $(data.pageInfo.list).each(function() {
        var imgSrc = "";
        if (this.fTasktypeid == 2) {
          //现场
          imgSrc = "img/missionxian.png";
        } else if (this.fTasktypeid == 3) {
          //缺陷
          imgSrc = "img/missionque.png";
        } else if (this.fTasktypeid == 5) {
          //消警
          imgSrc = "img/missionjing.png";
        } else if (this.fTasktypeid == 1) {
          //巡检
          imgSrc = "img/missionxun.png";
        } else if (this.fTasktypeid == 6) {
          //抢修
          imgSrc = "img/missionxiu.png";
        }
        html += `<div class="card" onclick="goToDetail('${this.fTaskid}')">
                             <div class="item-content item-link">
                                 <div class="item-inner row no-gutter">
                                     <div class="col-15">
                                        <img class="showImg" src="${imgSrc}" />
                                     </div>
                                     <div class="col-85">
                                         <p class="subName limit-length">${this.fSubName}</p>
                                         <p>任务单号：${this.fTasknumber}</p>
                                         <p>发布时间：${this.fTaskcreatedate}</p>
                                     </div>
                                 </div>
                             </div>
                         </div>`;
      });
      $("#list-container").append(html);
      pageNum++;
    } else {
      $.detachInfiniteScroll($(".infinite-scroll"));
      $(".infinite-scroll-preloader").html(
        "<span class='bottomTip'>--" + Operation["ui_nomoredata"] + "--</span>"
      );
      return;
    }
    if (data.pageInfo.list.length < itemsPerLoad) {
      $.detachInfiniteScroll($(".infinite-scroll"));
      $(".infinite-scroll-preloader").html(
        "<span class='bottomTip'>--" + Operation["ui_nomoredata"] + "--</span>"
      );
      return;
    }
  });
}

$("#searchDaiban").bind("keydown", function(event) {
  if (event.keyCode == 13) {
    getFirstPage();
    document.activeElement.blur();
  }
});

$(".searchbar-cancel").click(function() {
  $("#searchDaiban").val("");
  getFirstPage();
});

function goToDetail(taskId) {
  localStorage.setItem("taskID", taskId);
  if (isAndroid) {
    android.goToIn();
  } else {
    window.location.href = "missionDetail.html";
  }
}

$(document).on("infinite", ".infinite-scroll", function() {
  // 如果正在加载，则退出
  if (loading) return;

  // 设置flag
  loading = true;

  setTimeout(function() {
    loading = false;
    addItems(itemsPerLoad);
  }, 1000);
});

getFirstPage();

$("#dateStart").calendar();
$("#dateEnd").calendar();
$("#dateStart1").calendar();
$("#dateEnd1").calendar();
$("#dateStart2").calendar();
$("#dateEnd2").calendar();

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

$("#today1").click(function() {
  var myDate = new Date();
  var todayVal = myDate.format("yyyy-MM-dd");
  Substation.changeCalendar(todayVal, "dateStart1", "selectStartTime1");
  Substation.changeCalendar(todayVal, "dateEnd1", "selectEndTime1");
});

$("#yestoday1").click(function() {
  var myDate = new Date();
  myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
  var yestodayVal = myDate.format("yyyy-MM-dd");
  Substation.changeCalendar(yestodayVal, "dateStart1", "selectStartTime1");
  Substation.changeCalendar(yestodayVal, "dateEnd1", "selectEndTime1");
});

$("#thisMonth1").click(function() {
  var myDate = new Date();
  var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
  var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
  var firstDayVal = firstDay.format("yyyy-MM-dd");
  var lastDayVal = lastDay.format("yyyy-MM-dd");
  Substation.changeCalendar(firstDayVal, "dateStart1", "selectStartTime1");
  Substation.changeCalendar(lastDayVal, "dateEnd1", "selectEndTime1");
});

$("#lastMonth1").click(function() {
  var myDate = new Date();
  var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
  var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
  var firstDayVal = firstDay.format("yyyy-MM-dd");
  var lastDayVal = lastDay.format("yyyy-MM-dd");
  Substation.changeCalendar(firstDayVal, "dateStart1", "selectStartTime1");
  Substation.changeCalendar(lastDayVal, "dateEnd1", "selectEndTime1");
});

$("#today2").click(function() {
  var myDate = new Date();
  var todayVal = myDate.format("yyyy-MM-dd");
  Substation.changeCalendar(todayVal, "dateStart2", "selectStartTime2");
  Substation.changeCalendar(todayVal, "dateEnd2", "selectEndTime2");
});

$("#yestoday2").click(function() {
  var myDate = new Date();
  myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
  var yestodayVal = myDate.format("yyyy-MM-dd");
  Substation.changeCalendar(yestodayVal, "dateStart2", "selectStartTime2");
  Substation.changeCalendar(yestodayVal, "dateEnd2", "selectEndTime2");
});

$("#thisMonth2").click(function() {
  var myDate = new Date();
  var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
  var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
  var firstDayVal = firstDay.format("yyyy-MM-dd");
  var lastDayVal = lastDay.format("yyyy-MM-dd");
  Substation.changeCalendar(firstDayVal, "dateStart2", "selectStartTime2");
  Substation.changeCalendar(lastDayVal, "dateEnd2", "selectEndTime2");
});

$("#lastMonth2").click(function() {
  var myDate = new Date();
  var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
  var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
  var firstDayVal = firstDay.format("yyyy-MM-dd");
  var lastDayVal = lastDay.format("yyyy-MM-dd");
  Substation.changeCalendar(firstDayVal, "dateStart2", "selectStartTime2");
  Substation.changeCalendar(lastDayVal, "dateEnd2", "selectEndTime2");
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
  var start1 = new Date(
    $("#dateStart1")
      .val()
      .replace(/-/g, "/")
  );
  var end1 = new Date(
    $("#dateEnd1")
      .val()
      .replace(/-/g, "/")
  );
  if (start1 > end1) {
    $.toast(Operation["ui_dateselecttip"]);
    return;
  }
  var start2 = new Date(
    $("#dateStart2")
      .val()
      .replace(/-/g, "/")
  );
  var end2 = new Date(
    $("#dateEnd2")
      .val()
      .replace(/-/g, "/")
  );
  if (start2 > end2) {
    $.toast(Operation["ui_dateselecttip"]);
    return;
  }
  $(".close-panel").click();
  getFirstPage();
});

$(".button-reset").click(function() {
  $("#dateStart").val("");
  $("#dateEnd").val("");
  $("#dateStart1").val("");
  $("#dateEnd1").val("");
  $("#dateStart2").val("");
  $("#dateEnd2").val("");
  $("#taskType").val("");
  $("#chargeSelect").val("");
  $("#doSelect").val("");
  $("#timeRank").val("");
  $(".buttons-row")
    .find($(".active"))
    .removeClass("active");
});

$.init();
