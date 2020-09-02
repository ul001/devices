$(".item-media").hide();
$("input:checkbox").prop("disabled", "disabled");
var subid = Substation.GetQueryString("fSubid");
var subObj = JSON.parse(localStorage.getItem("subObj"));
var titleName = localStorage.getItem("controlClassTitle");
$(".title.title_color").text(titleName);
try {
  if (isAndroid) {
    subObj = JSON.parse(android.getSpItem("subObj"));
  }
} catch (e) {}
// var Subname = Substation.GetQueryString("");
var itemsPerLoad = 10;
var pageNum = 1;
var lightList = [];

function controlClick() {
  if (!$(".footer_btn").length || $(".footer_btn").is(":hidden")) {
    $("#back_btn").text(Operation["ui_SelectAll"]);
    $("#back_btn")
      .off("click")
      .on("click", selectAll);
    $("#control_btn").text(Operation["ui_cancel"]);
    $("#record_btn").toggle();
    $("#light_opening").click();
    $(".label-title")
      .removeClass("col-75")
      .addClass("col-60");
    $(".item-media").toggle();
    $(".button_bar").toggle();
    $(".footer_btn").toggle();
    $("input:checkbox").removeAttr("disabled");
    $(".list-item").hide();
    $(".light_closed").show();
  } else {
    $("#back_btn").html(
      '<span class="icon icon-left"></span>' +
      "<span>" +
      Operation["ui_back"] +
      "</span>"
    );
    $("#back_btn")
      .off("click")
      .on("click", goBack);
    $("#control_btn").text(Operation["ui_control"]);
    $("#record_btn").toggle();
    $(".label-title")
      .removeClass("col-60")
      .addClass("col-75");
    $(".item-media").toggle();
    $(".list-item").show();
    $(".button_bar").toggle();
    $(".footer_btn").toggle();
    $("input:checkbox").prop("disabled", "disabled");
    $("input:checkbox").removeAttr("checked");
    $(".light_closed").hide();
    $(".list-item").show();
  }
}

function getFirstPage() {
  $(".content-list").empty();
  pageNum = 1;
  lastIndex = 10;
  addItems(itemsPerLoad);
  $(".infinite-scroll-preloader").html('<div class="preloader"></div>');
  loading = false;
  $.attachInfiniteScroll($(".infinite-scroll"));
}

//下拉刷新
$(document).on("refresh", ".pull-to-refresh-content", function (e) {
  setTimeout(function () {
    // done
    $.pullToRefreshDone(".pull-to-refresh-content");
    getFirstPage();
  }, 2000);
});

function addItems(number, lastIndex) {
  var html = "";
  var url = "/selectMeterValue";
  var params = {};

  params = {
    fSubid: subid
    //    pageNo: pageNum,
    //    pageSize: number
  };
  Substation.getDataByAjaxNoLoading(
    url,
    params,
    function (data) {
      // var datadic = data.alarmEventLogList;
      if (data.hasOwnProperty("list") && data.list.length > 0) {
        if (pageNum == 1) {
          $(".content-list").empty();
        }
        var datashowdic = JSON.parse(data.list[0].fStatedesc);
        $("#closeLight").text(datashowdic["0"]);
        $("#openLight").text(datashowdic["1"]);
        $(data.list).each(function () {
          var deviceValue = this.deviceValue;
          if (deviceValue == "0" || deviceValue == "1") {
            html = '<label class="list-item label-checkbox light_closed">';
            // } else if (deviceValue == "1") {
            // html = '<label class="list-item label-checkbox light_opening">';
          } else {
            html = '<label class="list-item label-checkbox no_device">';
          }
          html += '                            <div class="row">';
          html +=
            '                                <input type="checkbox" name="my-checkbox" datametercode="' +
            this.fMetercode +
            '" datafuncid="' +
            this.fFuncid +
            '" datagatewayid="' +
            this.fGatewayid +
            '" datacomid="' +
            this.fComid +
            '" datafDeivcename="' +
            this.fDevicename +
            '"  datadeviceValue="' +
            this.deviceValue +
            '" datadeviceValueExplain="' +
            this.deviceValueExplain +
            '" datafDevicetype="' +
            this.fDevicetype +
            '">';
          html +=
            '                                <div class="item-media col-15"><i class="icon icon-form-checkbox"></i></div>';
          html +=
            '                                <span class="label-title col-100">' +
            Substation.removeUndefined(this.fDevicename) +
            "</span>";
          html += "                            </div>";
          html += '                            <div class="img_text">';
          // if (deviceValue == "0") {
          html +=
            '                                <img src="img/lightClose.png">';
          // } else if (deviceValue == "1") {
          //   html +=
          //     '                                <img src="img/lightsort.png">';
          // } else {
          //   html +=
          //     '                                <img src="img/noDevice.png">';
          // }
          html +=
            '                                <span class="right-bottom">' +
            (this.deviceValueExplain ? this.deviceValueExplain : "无设备") +
            "</span>";
          html += "                            </div>";
          html += "                        </label>";
          $(".content-list").append(html);
          lightList.push(this);

          $(".list-item").click(function (deviceValue) {
            if ($(".footer_btn").is(":hidden")) {
              // fSubname
              var value = $(this).find("input");
              var Subname = subObj.subName;
              param = {
                fSubname: Subname ? Subname : "",
                fMetercode: value.attr("datametercode"),
                datafuncid: value.attr("datafuncid"),
                datagatewayid: value.attr("datagatewayid"),
                datacomid: value.attr("datacomid"),
                datafDeivcename: value.attr("datafDeivcename"),
                deviceValue: value.attr("datadeviceValue"),
                datadeviceValueExplain: value.attr("datadeviceValueExplain"),
                datafDevicetype: value.attr("datafDevicetype")
              };
              localStorage.setItem("lightingDetail", JSON.stringify(param));
              window.location.href = "lightingDetail.html";
            }
          });
        });
        $(".item-media").hide();
        $("input:checkbox").prop("disabled", "disabled");
        //addClick();
        $(".item-media").hide();
        //保存记录
        //                params['subName'] = $("#search").val();
        //                localStorage.setItem("saveAlarmParam", JSON.stringify(params));
        //                Substation.getDataByAjaxNoLoading("/close", {}, function () {});
        pageNum++;
      }
      //复选框初始化
      $(".selectAlarms").toggle();
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

addItems(itemsPerLoad, 0);

$("#control_btn").click(function () {
  // if (!$(".footer_btn").length || $(".footer_btn").is(":hidden")) {
  //   $.prompt(Operation["ui_needInputPwd"], Operation["ui_pleaseInputPwd"], function (value) {
  //     var pwdstr = $.md5(value);
  //     Substation.postDataByAjax(
  //       "/verifySePassword", {
  //         sePassword: pwdstr
  //       },
  //       function (data) {
  //         controlClick();
  //       }
  //     );
  //   });
  // } else {
  controlClick();
  // }

});

$(".button_bar .button").click(function () {
  $(this)
    .addClass("active")
    .siblings()
    .removeClass("active");
  var showClass = $(this).attr("id");
  $(".list-item").hide();
  $("." + showClass).show();
  // if (showClass == "light_opening") {
  //   $(".footer_btn").text(Operation['ui_CloseLight']);
  // } else if (showClass == "light_closed") {
  //   $(".footer_btn").text(Operation['ui_OpenLight']);
  // }
});

var canClick = 1;
// $(".footer_btn").click(function () {
//   if (canClick == 1) {
//     var arr = [];
//     var controlUrl = "/sendBulbControlDemandHTTP";
//     var controlparam = {};
//     if ($(".footer_btn").text == Operation['ui_CloseLight']) {
//       $("input[type=checkbox]:checked").each(function (e) {
//         // if ($('input[type=checkbox]:checked').val()) {
//         controlparam = {
//           fSubid: subid,
//           fGatewayid: $("input[type=checkbox]:checked").attr("datagatewayid") ?
//             $("input[type=checkbox]:checked").attr("datagatewayid") : "",
//           fMetercode: $("input[type=checkbox]:checked").attr("datametercode") ?
//             $("input[type=checkbox]:checked").attr("datametercode") : "",
//           fFuncid: $("input[type=checkbox]:checked").attr("datafuncid") ?
//             $("input[type=checkbox]:checked").attr("datafuncid") : "",
//           fComid: $("input[type=checkbox]:checked").attr("datacomid") ?
//             $("input[type=checkbox]:checked").attr("datacomid") : "",
//           fValue: "0"
//         };
//         arr.push(controlparam);
//       });
//     } else {
//       $("input[type=checkbox]:checked").each(function (e) {
//         // if ($('input[type=checkbox]:checked').val()) {
//         controlparam = {
//           fSubid: subid,
//           fGatewayid: $("input[type=checkbox]:checked").attr("datagatewayid") ?
//             $("input[type=checkbox]:checked").attr("datagatewayid") : "",
//           fMetercode: $("input[type=checkbox]:checked").attr("datametercode") ?
//             $("input[type=checkbox]:checked").attr("datametercode") : "",
//           fFuncid: $("input[type=checkbox]:checked").attr("datafuncid") ?
//             $("input[type=checkbox]:checked").attr("datafuncid") : "",
//           fComid: $("input[type=checkbox]:checked").attr("datacomid") ?
//             $("input[type=checkbox]:checked").attr("datacomid") : "",
//           fValue: "1"
//         };
//         arr.push(controlparam);
//       });
//     }
//     // var param = {
//     //   tEtControlDemandList: JSON.stringify(arr)
//     // };
//     if (arr.length == 0) {
//       $.toast(Operation['ui_selectNo']);
//       return;
//     }
//     var param = JSON.stringify(arr);
//     setTimeout(function () {
//       canClick = 1;
//       $(".footer_btn").removeClass("noclick");
//     }, 15000);
//     canClick = 0;
//     $(".footer_btn").addClass("noclick");
//     Substation.postDataWithRawByAjax(controlUrl, param, function (data) {
//       if (data.code == 200) {
//         $.toast(Operation['ui_sendSuccess']);
//         $(this)
//           .addClass("active")
//           .siblings()
//           .removeClass("active");
//       }
//     });
//     // var logList = arr.join(','); //数组转成为字符串
//     // confirmAlarmEvents(logList);
//   } else {
//     $.alert(Operation['ui_operateAllTip']);
//   }
// });

$("#closeLight").click(function () {
  if (canClick == 1) {
    var arr = [];
    var controlUrl = "/sendBulbControlDemandHTTP";
    var controlparam = {};
    $("input[type=checkbox]:checked").each(function (e) {
      // if ($('input[type=checkbox]:checked').val()) {
      controlparam = {
        fSubid: subid,
        fGatewayid: $("input[type=checkbox]:checked").attr("datagatewayid") ?
          $("input[type=checkbox]:checked").attr("datagatewayid") : "",
        fMetercode: $("input[type=checkbox]:checked").attr("datametercode") ?
          $("input[type=checkbox]:checked").attr("datametercode") : "",
        fFuncid: $("input[type=checkbox]:checked").attr("datafuncid") ?
          $("input[type=checkbox]:checked").attr("datafuncid") : "",
        fComid: $("input[type=checkbox]:checked").attr("datacomid") ?
          $("input[type=checkbox]:checked").attr("datacomid") : "",
        fValue: "0"
      };
      arr.push(controlparam);
    });

    // var param = {
    //   tEtControlDemandList: JSON.stringify(arr)
    // };
    if (arr.length == 0) {
      $.toast(Operation["ui_selectNo"]);
      return;
    }
    var param = JSON.stringify(arr);
    setTimeout(function () {
      canClick = 1;
      $(".footer_btn").removeClass("noclick");
    }, 15000);
    canClick = 0;
    $(".footer_btn").addClass("noclick");
    Substation.postDataWithRawByAjax(controlUrl, param, function (data) {
      if (data.code == 200) {
        $.toast(Operation["ui_sendSuccess"]);
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
      }
    });
    // var logList = arr.join(','); //数组转成为字符串
    // confirmAlarmEvents(logList);
  } else {
    $.alert(Operation["ui_operateAllTip"]);
  }
});

$("#openLight").click(function () {
  if (canClick == 1) {
    var arr = [];
    var controlUrl = "/sendBulbControlDemandHTTP";
    var controlparam = {};
    $("input[type=checkbox]:checked").each(function (e) {
      // if ($('input[type=checkbox]:checked').val()) {
      controlparam = {
        fSubid: subid,
        fGatewayid: $("input[type=checkbox]:checked").attr("datagatewayid") ?
          $("input[type=checkbox]:checked").attr("datagatewayid") : "",
        fMetercode: $("input[type=checkbox]:checked").attr("datametercode") ?
          $("input[type=checkbox]:checked").attr("datametercode") : "",
        fFuncid: $("input[type=checkbox]:checked").attr("datafuncid") ?
          $("input[type=checkbox]:checked").attr("datafuncid") : "",
        fComid: $("input[type=checkbox]:checked").attr("datacomid") ?
          $("input[type=checkbox]:checked").attr("datacomid") : "",
        fValue: "1"
      };
      arr.push(controlparam);
    });

    // var param = {
    //   tEtControlDemandList: JSON.stringify(arr)
    // };
    if (arr.length == 0) {
      $.toast(Operation["ui_selectNo"]);
      return;
    }
    var param = JSON.stringify(arr);
    setTimeout(function () {
      canClick = 1;
      $(".footer_btn").removeClass("noclick");
    }, 15000);
    canClick = 0;
    $(".footer_btn").addClass("noclick");
    Substation.postDataWithRawByAjax(controlUrl, param, function (data) {
      if (data.code == 200) {
        if (data.data.a != undefined) {
          $.alert(data.data.a);
        }
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
      }
    });
    // var logList = arr.join(','); //数组转成为字符串
    // confirmAlarmEvents(logList);
  } else {
    $.alert(Operation["ui_operateAllTip"]);
  }
});

$("#record_btn").click(function () {
  window.location.href = "deviceControlLog.html?type=light";
});

function selectAll() {
  if ($("#back_btn").text() == Operation["ui_SelectAll"]) {
    $("#back_btn").text(Operation["ui_UnselectAll"]);
    $(".list-item:visible input:checkbox").prop("checked", "checked");
  } else {
    $("#back_btn").text(Operation["ui_SelectAll"]);
    $(".list-item:visible input:checkbox").removeAttr("checked");
  }
}

function goBack() {
  //    if (isAndroid) {
  //        android.goBack();
  //    } else if (isIOS) {
  //        window.history.back();
  //        window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
  //    } else {
  window.history.back();
  //    }
}

$("#back_btn").on("click", goBack);

$.init();