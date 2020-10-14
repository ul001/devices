var subObj = JSON.parse(localStorage.getItem("subObj"));
var titleName = localStorage.getItem("controlClassTitle");
$(".title.title_color").text(titleName);
var isControl = 0;
$(".item-media").hide();
$("input:checkbox").prop("disabled", "disabled");

function initContent() {
  Substation.getDataByAjax(
    "/selectByStationId", {
      stationId: subObj.subId,
      meterType: '1,2'
    },
    function (data) {
      $(".content-list").empty();
      var strArr = "";
      if (data.list != undefined && data.list.length && data.list.length > 0) {
        $(data.list).each(function () {
          var thisStatus = "";
          var imgStr = '<img src="img/arcm300t.png">';
          if (this.meterStatus == "1") {
            thisStatus =
              "<span class='alarmStatus'>" + Operation["ui_Alarm"] + "</span>";
            imgStr = '<img src="img/arcm300Talarm.png">';
          } else if (this.meterStatus == "0") {
            var thisStatus =
              "<span class='normalStatus'>" +
              Operation["ui_normal"] +
              "</span>";
            var imgStr = '<img src="img/arcm300t.png">';
          }
          var meterTypeName = '';
          if (this.meterType == '1') {
            meterTypeName = "ARCM300T";
          } else if (this.meterType == '2') {
            meterTypeName = "ADW300";
          }
          strArr +=
            '<label class="list-item label-checkbox light_opening" data-id="' +
            this.meterCode +
            '">\n' +
            '                        <div class="row">\n' +
            '                            <input class="selectBox" type="checkbox" name="my-checkbox" data-id="' +
            this.meterCode +
            '">\n' +
            '                            <div class="item-media col-15"><i class="icon icon-form-checkbox"></i></div>\n' +
            '                            <span class="label-title col-85">' +
            Substation.removeUndefined(this.meterName) +
            "</span>\n" +
            // "                            <a href=\"#\" class=\"view_detail col-25 button\">详情</a>\n" +
            "                        </div>\n" +
            '                            <span class="label-title" style="color: gray;font-size: 0.7rem;">' +
            Operation["ui_deviceId"] +
            "：" +
            this.meterCode +
            "</span>\n" +
            // "                            <a href=\"#\" class=\"view_detail col-25 button\">详情</a>\n" +

            '                        <div class="row no-gutter">\n' +
            '                        <div class="col-40">\n' +
            "                            " +
            imgStr +
            "\n" +
            "                        </div>\n" +
            '                        <div class="col-60">\n' +
            "                            <p class='right-float limit-length' style='margin-top:.4rem;font-size:0.7rem;'>" + meterTypeName + "</p>\n" +
            "                            <p class='right-float'>" +
            thisStatus +
            "</p>\n" +
            "                        </div>\n" +
            "                        </div>\n" +
            "                    </label>";
        });
        $(".content-list").html(strArr);
        if (isControl == 0) {
          $(".item-media").hide();
          $(".label-title")
            .removeClass("col-85")
            .addClass("col-100");
          $(".list-item").on("click", goToDetail);
        } else {
          $(".label-title")
            .removeClass("col-100")
            .addClass("col-85");
        }
      }
    }
  );
}

initContent();

function controlClick() {
  $("input:checkbox").removeAttr("checked");
  if (!$(".footer_btn").length || $(".footer_btn").is(":hidden")) {
    isControl = 1;
    $("#back_btn").text(Operation["ui_SelectAll"]);
    $("#back_btn")
      .off("click")
      .on("click", selectAll);
    $("#control_btn").text(Operation["ui_cancel"]);
    $("#record_btn").toggle();
    $("#light_opening").click();
    $(".label-title")
      .removeClass("col-100")
      .addClass("col-85");
    $(".item-media").toggle();
    $(".button_bar").toggle();
    $(".footer_btn").toggle();
    $("input:checkbox").removeAttr("disabled");
    $(".list-item").off("click", goToDetail);
  } else {
    isControl = 0;
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
      .removeClass("col-85")
      .addClass("col-100");
    $(".item-media").toggle();
    $(".list-item").show();
    $(".button_bar").toggle();
    $(".footer_btn").toggle();
    $("input:checkbox").prop("disabled", "disabled");
    $("input:checkbox").removeAttr("checked");
    $(".list-item").on("click", goToDetail);
  }
}

//下拉刷新
$(document).on("refresh", ".pull-to-refresh-content", function (e) {
  setTimeout(function () {
    initContent();
    // done
    $.pullToRefreshDone(".pull-to-refresh-content");
  }, 2000);
});

$("#control_btn").click(function () {
  if (!$(".footer_btn").length || $(".footer_btn").is(":hidden")) {
    // $("#myModal2").show();
    Substation.getDataByAjaxNoLoading("/getControlValidType", {}, function (
      data
    ) {
      if (data) {
        if (data.validType == "sms") {
          var sb =
            '                <div class="outContain" style="width: auto;">';
          sb += '                  <div class="codeDiv">';
          sb +=
            '                    <input id="phoneInput" type="text" class="sendInput" value="15151853872" disabled';
          sb += '                      autocomplete="off">';
          sb += '                    <span class="icon codePhoneImg"></span>';
          sb += '                    <label class="errorInfo"></label>';
          sb += "                  </div>";
          sb += '                  <div class="codeDiv">';
          sb +=
            '                    <input id="canvasInput" type="text" class="sendInput" placeholder="请输入验证码"';
          sb +=
            '                      autocomplete="off" style="width:6.2rem;">';
          // sb += '                    <span class="icon codeCanvasImg"></span>';
          sb +=
            '                    <canvas id="canvas" width="100" height="38"></canvas>';
          sb += "                  </div>";
          sb += "";
          sb += '                  <div class="codeDiv">';
          sb +=
            '                    <input id="code" class="sendInput" type="text" placeholder="请输入短信验证码" autocomplete="off" style="width:6.2rem;"/>';
          sb += '                    <span class="icon codeMsgImg"></span>';
          sb +=
            '                    <input id="btnSendCode" type="button" class="btn btn-default" disabled value="获取验证码" />';
          sb += "                  </div>";
          // sb += '                  <button class="btn" id="checkBtn" disabled>验证</button>';
          sb += "                </div>";
          // sb += '      </div>';
          var modal = $.modal({
            title: "手机动态验证码",
            text: "需要通过手机动态验证码才能控制设备。",
            afterText: sb,
            buttons: [{
                text: "取消"
              },
              {
                text: "验证",
                bold: true,
                onClick: function () {
                  var code = $("#code").val();
                  Substation.getDataByAjaxNoLoading(
                    "/checkSMSValid", {
                      code: code,
                      msgId: msgId
                    },
                    function (data) {
                      console.log(data);
                      if (data == true) {
                        controlClick();
                      } else {
                        if (data.msg) {
                          $.toast(data.msg);
                        } else {
                          $.toast("验证失败");
                        }
                      }
                      // sendCommand();
                    }
                  );
                }
              }
            ]
          });
          showModel2(data.userPhone);
          // $.swiper($(modal).find('.swiper-container'), {
          //   pagination: '.swiper-pagination'
          // });
        } else {
          showSecPasswordPrompt();
        }
        //   }
        // });
      }
    });
  } else {
    controlClick();
  }
});

function showModel2(userPhone) {
  $("#phoneInput").val(userPhone);
  $.codeDraw($("#canvas"), $("#canvasInput"), function () {
    $.countInterval($("#phoneInput"), $("#btnSendCode"), function () {
      Substation.getDataByAjaxNoLoading("/sendSMSValid", {}, function (data) {
        msgId = data;
        // $("#checkBtn").removeAttr('disabled');
        // $("#checkBtn").unbind('click').on('click', function () {
        //   var code = $("#code").val();
        //   Substation.getDataByAjaxNoLoading("/checkSMSValid", {}, function (data) {
        //     // sendCommand();
        //   })
        // })
      });
    });
  });
}

//二级密码
function showSecPasswordPrompt() {
  $.prompt(
    Operation["ui_needInputPwd"],
    Operation["ui_pleaseInputPwd"],
    function (value) {
      var pwdstr = $.md5(value);
      Substation.postDataByAjax(
        "/verifySePassword", {
          sePassword: pwdstr
        },
        function (data) {
          controlClick();
        }
      );
    }
  );
}

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

var canclick = 1;
//复位
$("#reset").click(function () {
  if (canclick == 1) {
    var controlJson = [];
    $(".selectBox:checked").each(function (i, obj) {
      var metercode = $(obj).attr("data-id");
      controlJson.push({
        meterCode: metercode,
        substationId: subObj.subId,
        type: "reset",
        value: "1"
      });
    });
    if (controlJson.length == 0) {
      $.toast(Operation["ui_selectNo"]);
      return;
    }
    setTimeout(function () {
      canclick = 1;
      $(".footer_btn").removeClass("noclick");
    }, 30000);
    canclick = 0;
    $(".footer_btn").addClass("noclick");
    Substation.postDataWithRawByAjax(
      "/sendMeterControlDemandHTTP",
      JSON.stringify(controlJson),
      function (data) {
        if (data.data.a != undefined) {
          $.alert(data.data.a);
        }
      }
    );
  } else {
    $.alert(Operation["ui_operateAllTipOf30"]);
  }
});

//分闸
$("#DO").click(function () {
  if (canclick == 1) {
    var controlJson = [];
    $(".selectBox:checked").each(function (i, obj) {
      var metercode = $(obj).attr("data-id");
      controlJson.push({
        meterCode: metercode,
        substationId: subObj.subId,
        type: "DO",
        value: "1"
      });
    });
    if (controlJson.length == 0) {
      $.toast(Operation["ui_selectNo"]);
      return;
    }
    setTimeout(function () {
      canclick = 1;
      $(".footer_btn").removeClass("noclick");
    }, 30000);
    canclick = 0;
    $(".footer_btn").addClass("noclick");
    Substation.postDataWithRawByAjax(
      "/sendMeterControlDemandHTTP",
      JSON.stringify(controlJson),
      function (data) {
        if (data.data.a != undefined) {
          $.alert(data.data.a);
        }
      }
    );
  } else {
    $.alert(Operation["ui_operateAllTipOf30"]);
  }
});

//消音
$("#silent").click(function () {
  if (canclick == 1) {
    var controlJson = [];
    $(".selectBox:checked").each(function (i, obj) {
      var metercode = $(obj).attr("data-id");
      controlJson.push({
        meterCode: metercode,
        substationId: subObj.subId,
        type: "silent",
        value: "1"
      });
    });
    if (controlJson.length == 0) {
      $.toast(Operation["ui_selectNo"]);
      return;
    }
    setTimeout(function () {
      canclick = 1;
      $(".footer_btn").removeClass("noclick");
    }, 30000);
    canclick = 0;
    $(".footer_btn").addClass("noclick");
    Substation.postDataWithRawByAjax(
      "/sendMeterControlDemandHTTP",
      JSON.stringify(controlJson),
      function (data) {
        if (data.data.a != undefined) {
          $.alert(data.data.a);
        }
      }
    );
  } else {
    $.alert(Operation["ui_operateAllTipOf30"]);
  }
});

//自检
$("#check").click(function () {
  if (canclick == 1) {
    var controlJson = [];
    $(".selectBox:checked").each(function (i, obj) {
      var metercode = $(obj).attr("data-id");
      controlJson.push({
        meterCode: metercode,
        substationId: subObj.subId,
        type: "check",
        value: "1"
      });
    });
    if (controlJson.length == 0) {
      $.toast(Operation["ui_selectNo"]);
      return;
    }
    setTimeout(function () {
      canclick = 1;
      $(".footer_btn").removeClass("noclick");
    }, 30000);
    canclick = 0;
    $(".footer_btn").addClass("noclick");
    Substation.postDataWithRawByAjax(
      "/sendMeterControlDemandHTTP",
      JSON.stringify(controlJson),
      function (data) {
        if (data.data.a != undefined) {
          $.alert(data.data.a);
        }
      }
    );
  } else {
    $.alert(Operation["ui_operateAllTipOf30"]);
  }
});

function goToDetail() {
  var meterCode = $(this).attr("data-id");
  localStorage.setItem("meterCode", meterCode);
  window.location.href = "arcm300TDetail.html";
}

$("#controlLog").click(function () {
  window.location.href = "deviceControlLog.html?type=arcm300T";
});

$.init();