function loadPage() {
  var pids = [{ pid: -1, pname: "" }];
  var clickNum = 0;
  var selectSubid = 10100001;
  var showState = 1;
  var thisGroupid = -1;
  //var selectSubid = localStorage.getItem("fSubid");

  //主页内容
  function fillRightData() {
    Substation.getDataByAjax(
      "/getDeviceInspectionTemplate",
      { fSubdevicegroupid: 41, fSubid: 10100001 },
      function(data) {
        $(".content-block .tabs").empty();
        $(".buttons-tab").empty();
        var tempJson = "";
        if (data.hasOwnProperty("template")) {
          tempJson = data.template;
          tempJson = JSON.parse(tempJson);
        }
        $(data.list).each(function(index, obj) {
          var thisValueJson;
          if (this.hasOwnProperty("fInspectionslipjson")) {
            if (
              this.fInspectionslipjson != "" &&
              this.fInspectionslipjson != null
            ) {
              thisValueJson = JSON.parse(this.fInspectionslipjson);
            }
          }
          var tempStr = "";
          var num = 0;
          $(tempJson.checkInfo).each(function() {
            num++;
            if (this.type == "radio") {
              inputStr =
                '<div class="card">\n' +
                '                                <div class="card-content">\n' +
                '                                    <div class="card-content-inner">\n' +
                "                                        " +
                decodeURIComponent(this.name) +
                "\n" +
                '                                        <div class="pull-right">\n' +
                '                                            <label class="label-checkbox item-content">\n' +
                '                                                <input type="radio" data-code="' +
                this.code +
                '" name="' +
                (obj.fSubdeviceinfoid + "" + this.code) +
                '" value="yes">\n' +
                '                                                <div class="item-media"><i\n' +
                '                                                        class="icon icon-form-checkbox"></i></div>\n' +
                '                                                <div class="item-inner">\n' +
                "                                                    是\n" +
                "                                                </div>\n" +
                "                                            </label>\n" +
                "                                            &nbsp;\n" +
                '                                            <label class="label-checkbox item-content">\n' +
                '                                                <input type="radio" data-code="' +
                this.code +
                '" name="' +
                (obj.fSubdeviceinfoid + "" + this.code) +
                '" value="no" checked>\n' +
                '                                                <div class="item-media"><i\n' +
                '                                                        class="icon icon-form-checkbox"></i></div>\n' +
                '                                                <div class="item-inner">\n' +
                "                                                    否\n" +
                "                                                </div>\n" +
                "                                            </label>\n" +
                "                                        </div>\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                            </div>\n";
            } else if (this.type == "input") {
              var thisInputName = decodeURIComponent(this.name);
              if (this.value == "true") {
                thisInputName =
                  '<span class="redColor">*</span>' + thisInputName;
              }
              inputStr =
                '<div class="card">\n' +
                '                                <div class="card-content">\n' +
                '                                    <div class="card-content-inner">\n' +
                "                                        " +
                thisInputName +
                "\n" +
                '                                        <div class="pull-right">\n' +
                '                                            <input type="text" data-code="' +
                this.code +
                '" data-state="' +
                this.value +
                '">\n' +
                "                                        </div>\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                            </div>";
            }
            tempStr += inputStr;
          });
          $(".buttons-tab").append(
            '<a href="#' +
              obj.fSubdeviceinfoid +
              '" class="tab-link button">' +
              obj.fDevicename +
              "</a>"
          );
          $(".content-block .tabs").append(
            '<div id="' +
              obj.fSubdeviceinfoid +
              '" class="tab">\n' +
              '<div class="content-block">\n' +
              tempStr +
              "</div>\n" +
              "</div>"
          );
          //给模板赋值
          if (thisValueJson != null && thisValueJson != "") {
            $(thisValueJson).each(function() {
              if (this.type == "radio") {
                $(
                  "input[name='" +
                    (obj.fSubdeviceinfoid + "" + this.code) +
                    "'][value='" +
                    this.value +
                    "']"
                ).attr("checked", true);
              } else {
                $(
                  "#" +
                    obj.fSubdeviceinfoid +
                    " input[data-code='" +
                    this.code +
                    "']"
                ).val(this.value);
              }
            });
          }
        });
        addRadioClick();
        getGroupidContent();
        $(".tab-link")
          .eq(0)
          .click();
      }
    );
  }

  function getGroupidContent() {
    if (thisGroupid == -1) {
      $(".content").css("display", "none");
    } else {
      $(".content").css("display", "block");
    }
  }

  getGroupidContent();

  function saveThisPage() {
    var changeJson = [];
    if ($("input[data-state='true']")) {
      var thisTemp = false;
      $("input[data-state='true']").each(function() {
        if ($(this).val() == "") {
          $.toast("请填入必填项");
          thisTemp = true;
          return;
        }
      });
      if (thisTemp) {
        return;
      }
    }
    $(".tabs .tab").each(function() {
      var deviceJson = {};
      var deviceId = $(this).attr("id");
      var inputArray = [];
      $("#" + deviceId + " .card").each(function(index, obj) {
        var thisInput = $(obj).find($("input[type='radio']:checked"))[0];
        var thisObj = {};
        if (thisInput) {
          thisObj["code"] = $(thisInput).attr("data-code");
          thisObj["value"] = $(thisInput).attr("value");
          thisObj["type"] = "radio";
        } else {
          thisObj["code"] = $(obj)
            .find($("input"))
            .attr("data-code");
          thisObj["value"] = $(obj)
            .find($("input"))
            .val();
          thisObj["type"] = "input";
        }
        inputArray.push(thisObj);
      });
      deviceJson["fInspectionslipjson"] = inputArray;
      deviceJson["fSubdeviceinfoid"] = deviceId;
      deviceJson["fPlacecheckformid"] = 4;
      changeJson.push(deviceJson);
    });
    var jsonStr = JSON.stringify(changeJson);
    Substation.postDataByAjax(
      "/updateInspectionDetail",
      { deviceList: jsonStr },
      function(data) {
        if (data.code == 200) {
          $.toast("保存成功");
        } else {
          $.toast("操作失败");
        }
      }
    );
  }

  //左侧菜单
  function addBackClick() {
    $(".back-parent")
      .unbind()
      .click(function() {
        if (pids[clickNum + 1] != null) {
          pids.splice(-1, 1);
        }
        clickNum--;
        var lastPId = pids[clickNum];
        pids.splice(-1, 1);
        fillData(lastPId.pid);
      });
  }

  function fillData(parentId) {
    var params = {
      fSubid: selectSubid,
      fParentId: parentId
    };
    Substation.getDataByAjax("/selectSubDeviceGroupListByPid", params, function(
      data
    ) {
      if (data.hasOwnProperty("menuList")) {
        if (data.menuList.length > 0) {
          fillH5(parentId, data.menuList);
        }
      }
    });
  }

  function fillH5(parentId, thisList) {
    var ul;
    if (parentId == -1) {
      ul = $(".list-block .list-container");
      ul.empty();
    } else {
      ul = $(".list-block .list-container");
      ul.html(
        '<li class="item-content back-parent">\n' +
          '                        <div class="item-inner">\n' +
          '                            <div class="item-title"><i class="icon icon-goprev"></i>上一级</div>\n' +
          "                        </div>\n" +
          "                    </li>"
      );
    }
    $(thisList).each(function() {
      var li = "";
      var linkStr = '<li class="item-content item-link';
      if (this.displayOrHideState == false) {
        linkStr = '<li class="item-content item-link item-dis';
      }
      li =
        linkStr +
        '" id="' +
        this.fSubdevicegroupid +
        '">\n' +
        '                        <div class="item-inner">\n' +
        '                            <div class="item-title">' +
        this.fSubdevicegroupname +
        "</div>\n" +
        "                        </div>\n" +
        "                    </li>";
      ul.append(li);
    });
    if (showState == 0) {
      $(".item-dis").css("display", "none");
    } else {
      $(".item-dis").css("display", "flex");
    }
    $("#showOrHide")
      .unbind()
      .click(function() {
        if (showState == 0) {
          showState = 1;
          $("#showOrHide").text("仅显示有设备分类");
          $(".item-dis").css("display", "flex");
        } else {
          showState = 0;
          $("#showOrHide").text("显示全部分类");
          $(".item-dis").css("display", "none");
        }
      });
    linkClick(parentId);
    addBackClick();
  }

  function linkClick(parentId) {
    $(".list-block .item-link")
      .unbind()
      .click(function(event) {
        var clickId = $(this).attr("id");
        var params = {
          fSubid: selectSubid,
          fParentId: clickId
        };
        Substation.getDataByAjax(
          "/selectSubDeviceGroupListByPid",
          params,
          function(data) {
            if (data.hasOwnProperty("menuList")) {
              if (data.menuList.length > 0) {
                $(".selectLi").removeClass("selectLi");
                var clickName = $("#" + clickId + " .item-title").text();
                if (clickNum == 0) {
                  if (pids[clickNum + 1] != null) {
                    pids.splice(-1, 1);
                  }
                }
                clickNum++;
                pids.push({ pid: clickId, pname: clickName });
                $(".parent-page").css("display", "none");
                $(".child-page").css("display", "block");
                fillH5(clickId, data.menuList);
                return;
              }
            }
            thisGroupid = clickId;
            $("#" + clickId)
              .addClass("selectLi")
              .siblings()
              .removeClass("selectLi");
            var thisId = clickId;
            var clickName = $("#" + thisId + " .item-title").text();
            if (pids[clickNum + 1] == null) {
              pids.push({ pid: thisId, pname: clickName });
            } else {
              pids[clickNum + 1] = { pid: thisId, pname: clickName };
            }
            var titleTree = "";
            $(pids).each(function() {
              titleTree += this.pname + ">";
            });
            var titleTreeName = titleTree.substring(1, titleTree.length - 1);
            $("#subName").text(titleTreeName);
            $(".close-panel").click();
            fillRightData();
          }
        );
        event.stopPropagation();
      });
  }

  function addRadioClick() {
    $(":radio").click(function() {
      if ($(this).val() == "yes") {
        window.location.href = "defectPage.html";
      }
    });
  }

  $("#saveBtn").click(function() {
    saveThisPage();
  });

  fillData(-1);

  $(".open-panel").click();
}

loadPage();

$.init();
