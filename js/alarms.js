var unreadCountSum = 0;
var u = navigator.userAgent,
  app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var menuId = "342";
if (isIOS) {
  window.webkit.messageHandlers.iOS.postMessage(null);
  var storage = localStorage.getItem("accessToken");
  storage = JSON.parse(storage);
  menuId = storage.fmenuId;
} else if (isAndroid) {
  menuId = android.getMenuId();
}

//下拉刷新
$(document).on("refresh", ".pull-to-refresh-content", function (e) {
  setTimeout(function () {
    loadMenu();
    // done
    $.pullToRefreshDone(".pull-to-refresh-content");
  }, 2000);
});

window.addEventListener("pageshow", function (e) {
  // ios系统 返回页面 不刷新的问题 Safari内核缓存机制导致 方案一 方案二：设置meta标签，清除页面缓存
  var u = navigator.userAgent,
    app = navigator.appVersion;
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (e.persisted && isIOS) {
    var needUpdate = localStorage.getItem("need-update");
    if (needUpdate) {
      localStorage.removeItem("need-update");
      window.location.reload();
    }
    window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
  }
});

function loadMenu() {
  $(".list-container").empty();
  //    $.showPreloader(Operation['ui_loading']);
  $(".infinite-scroll-preloader").html('<div class="preloader"></div>');
  var isEnglish = 0;
  if (languageOption == "en") {
    isEnglish = 1;
  } else {
    isEnglish = 0;
  }
  Substation.getDataByAjaxNoLoading(
    "/getMessInfoType", {
      "english": isEnglish
    },
    function (data) {
      if (
        data.hasOwnProperty("tDtMessInfoType") &&
        data.tDtMessInfoType.length > 0
      ) {
        $(data.tDtMessInfoType).each(function () {
          if (this.fMessinfotypeid == "1") {
            return true;
          }
          $(".list-container").append(
            '<li class="item-content item-link" id="item' +
            this.fMessinfotypeid +
            '" value="' +
            this.fMessinfotypeid +
            '">\n' +
            '                        <div class="item-media"><i class="icon icon-alarm"></i></div>\n' +
            '                        <div class="item-inner">\n' +
            '                            <div class="item-title">' +
            this.fMessinfotypeexplain +
            "</div>\n" +
            '                            <div class="item-after" id="' +
            this.fMessinfotypeid +
            '"></div>\n' +
            "                        </div>\n" +
            "                    </li>"
          );
        });
        $(".infinite-scroll-preloader").empty();
        fillData();
      }
    },
    function (errorcode) {}
  );

  $("#postAnalysis").css("display", "none");
  //判断隐藏右上角按钮
  Substation.getDataByAjaxNoLoading("/getSubinfoVoByPid", {
    pid: menuId
  }, function (data) {
    if (data.hasOwnProperty("menuList") && data.menuList.length > 0) {
      $(data.menuList).each(function () {
        if (this.fCode == "AlarmAnalysis") {
          $("#postAnalysis").css("display", "block");
        }
      });
    }
  });
}

function fillData() {
  Substation.getDataByAjaxNoLoading(
    "/getUnConfirmedEventsNum", {},
    function (data) {
      if (!data.unConfirmedEventsNum.length) {
        return;
      }
      unreadCountSum = 0;
      $(data.unConfirmedEventsNum).each(function (key, value) {
        if (value.fMessinfotypeid == "1") {
          return true;
        }
        if (value.unConfirmNum > 0) {
          var string = '<span class="badge">' + value.unConfirmNum + "</span>";
          $("#" + value.fMessinfotypeid).html(string);
          unreadCountSum += value.unConfirmNum;
        }
        //            var name = value.name;
        //            if (name == "遥测越限") {
        //                if ($("#yuexian")) {
        //                    if (value.count > 0) {
        //                        var string = '<span class="badge">' + value.count + '</span>';
        //                        $("#yuexian").html(string);
        //                        unreadCountSum += value.count;
        //                    }
        //                }
        //            } else if (name == "遥信变位") {
        //                if ($("#bianwei")) {
        //                    if (value.count > 0) {
        //                        var string = '<span class="badge">' + value.count + '</span>';
        //                        $("#bianwei").html(string);
        //                        unreadCountSum += value.count;
        //                    }
        //                }
        //            } else if (name == "平台运行") {
        //                if ($("#platform")) {
        //                    if (value.count > 0) {
        //                        var string = '<span class="badge">' + value.count + '</span>';
        //                        $("#platform").html(string);
        //                        unreadCountSum += value.count;
        //                    }
        //                }
        //            }
      });
      if (isIOS) {
        //iOS回调未读数
        var message = {
          unreadCountSum: unreadCountSum
        };
        window.webkit.messageHandlers.jsToOcWithPrams.postMessage(message);
      } else if (isAndroid) {
        android.getAlarmNum(unreadCountSum);
      }
      var upLoadClicktag = true;
      $(".item-link")
        .unbind()
        .click(function () {
          if (!upLoadClicktag) {
            return;
          }
          upLoadClicktag = false;
          setTimeout(function () {
            upLoadClicktag = true;
          }, 1000);
          var clickId = $(this).attr("value");
          var titleName = $(this)
            .find($(".item-title"))
            .text();
          localStorage.setItem("titleName", titleName);
          if (clickId != "" && clickId != null) {
            // if (isAndroid) {
            //     android.goToWebActivity(titleName, "alarmsDetail.html?clickID=" + clickId);
            // } else if (isIOS) {
            //     window.location.href = "alarmsDetail.html?clickID=" + clickId;
            //     window.webkit.messageHandlers.needHiddenTabbar.postMessage("YES");
            // } else {
            //     window.location.href = "alarmsDetail.html?clickID=" + clickId;
            // }
            if (isAndroid) {
              android.goToWebActivity(
                titleName,
                "alarmsDetailNew.html?clickID=" + clickId
              );
            } else if (isIOS) {
              window.location.href = "alarmsDetailNew.html?clickID=" + clickId;
              window.webkit.messageHandlers.needHiddenTabbar.postMessage("YES");
            } else {
              window.location.href = "alarmsDetailNew.html?clickID=" + clickId;
            }
          }
        });
      //        $.hidePreloader();
    },
    function (errorcode) {}
  );
  // }
  // });
}

$("#postAnalysis").click(function () {
  if (isAndroid) {
    android.goToWebActivity(
      Operation["ui_AlarmAnalysis"],
      "alarmAnalysisRank.html"
    );
  } else if (isIOS) {
    window.location.href = "alarmAnalysisRank.html";
    window.webkit.messageHandlers.needHiddenTabbar.postMessage("YES");
  } else {
    window.location.href = "alarmAnalysisRank.html";
  }
})

loadMenu();

$.init();