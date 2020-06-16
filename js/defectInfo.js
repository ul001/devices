/*
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if(!clientWidth) return;
            //docEl.style.fontSize = 100 * (clientWidth / 1125) + 'px';
        };
    if(!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);*/
var imgNum1 = 0;
var imgNum = 0;
var fDeviceproblemid = Substation.GetQueryString("fDeviceproblemid");
var androidProblemid = localStorage.getItem("fDeviceproblemid");
if (androidProblemid != null && androidProblemid != undefined) {
  fDeviceproblemid = androidProblemid;
  $(".back_btn").click(function () {
    android.goBack();
  });
} else {
  $(".back_btn").click(function () {
    window.history.back();
  });
}
var taskProblem = Substation.GetQueryString("taskProblem");
var selectSubid = localStorage.getItem("fSubid");
//var clickTree = localStorage.getItem("clickTree");
var canClick = localStorage.getItem("canClick");
var url = "/getDeviceProblemDetail";
var problemParam = {
  fDeviceproblemid: fDeviceproblemid
};
if (taskProblem == 1) {
  var taskId = localStorage.getItem("taskID");
  url = "/getDeviceProblemDetailByfTaskid";
  problemParam["fTaskid"] = taskId;
}

if (canClick == "false") {
  $(".upload_img_wrap .upload_img").unbind();
  $(".upload_img_wrap .upload_img").css("display", "none");
  $(".blueColor").removeClass("blueColor");
  $("#saveData").css("display", "none");
  $("#fClientadvice").val('');
  $("#fState").val('');
}

Substation.getDataByAjax(url, problemParam, function (data) {
  var imgUrl = data.imgUrl;
  var defectJson = data.tDevDeviceproblem;
  var beforeimg = data.beforeimg;
  var afterimg = data.afterimg;
  var deviceName = defectJson.fdeviceinfoName;
  if (deviceName == undefined) {
    deviceName = defectJson.treePathName;
    $(".pathShow").hide();
  } else {
    $("#treePath").text(Substation.removeUnDefinedStr(defectJson.fDeviceNamePath));
  }
  $("#taskNumber").text(Substation.removeUnDefinedStr(defectJson.fTasknumber));
  $("#deviceName").text(Substation.removeUnDefinedStr(deviceName));
  $("#fDeviceproblemdes").text(Substation.removeUnDefinedStr(defectJson.fDeviceproblemdes));
  var fProblemlocation = Substation.removeUnDefinedStr(defectJson.fProblemlocation);
  $("#defectPosition").empty();
  if (fProblemlocation.indexOf(",") != -1) {
    var defectPosition = fProblemlocation.split(",")[0];
    var defectPositionVal = fProblemlocation.split(",")[1];
    var defectPositionArray = defectPosition.split(";");
    var defectPositionValArray = defectPositionVal.split(";");
    $(defectPositionArray).each(function (index, obj) {
      $("#defectPosition").append(
        '<input type="checkbox" disabled value="' +
        obj +
        '" id="' +
        index +
        '"><label for="' +
        index +
        '">' +
        obj +
        "</label><br>"
      );
    });
    $(defectPositionValArray).each(function () {
      $("input[type='checkbox'][value='" + this + "']").attr("checked", true);
    });
  }
  $("#fProblemtype").val(Substation.removeUnDefinedStr(defectJson.fProblemtype));
  $("#fProblemlevel").val(Substation.removeUnDefinedStr(defectJson.fProblemlevel));
  $("#fTimelimit").val(Substation.removeUnDefinedStr(defectJson.fTimelimit));
  $("#fProblemharm").val(Substation.removeUnDefinedStr(defectJson.fProblemharm));
  $("#fCreatetime").val(Substation.removeUnDefinedStr(defectJson.fCreatetime));
  $("#fResolution").val(Substation.removeUnDefinedStr(defectJson.fResolution));
  if (canClick == "false") {
    $("#fClientadvice").val(Substation.removeUnDefinedStr(defectJson.fClientadvice));
    $("#fState").val(Substation.removeUnDefinedStr(defectJson.fState));
    if (taskProblem != 1 && defectJson.fState != 1) {
      var menuId = "2391";
      try {
        if (isIOS) {
          window.webkit.messageHandlers.iOS.postMessage(null);
          var storage = localStorage.getItem("accessToken");
          storage = JSON.parse(storage);
          menuId = storage.fmenuId;
          if (!menuId) {
            menuId = "2391";
          }
        } else if (isAndroid) {
          menuId = android.getMenuId();
          if(menuId==undefined || menuId==null){
            menuId = "342";
          }
        }
      } catch (e) {menuId = "2391"}
      Substation.getDataByAjax("/getSubinfoVoByPid", {
        pid: menuId
      }, function (data) {
        if (data.hasOwnProperty("menuList") && data.menuList.length > 0) {
          $(data.menuList).each(function () {
            if (this.fCode == "pushDefectClean") {
              var showstr =
                '<div class="bottomDiv"><a class="button button-bottom button-fill" id="carryOut">' +
                Operation["ui_postDefectClean"] +
                "</a></div>";
              $(".list-block").append(showstr);
              $("#carryOut").click(function () {
                localStorage.setItem("alarmSubid", selectSubid);
                localStorage.setItem("problemId", fDeviceproblemid);
                window.location.href = "alarmCleanPost.html";
              });
            }
          });
        }
      });
    }
    if (defectJson.fSolvedUserName != undefined) {
      $(".showSolveUser").css("display", "block");
      $("#fSolveUser").val(defectJson.fSolvedUserName);
    }
    if (defectJson.fUpdateDate != undefined) {
      $(".showSolveTime").css("display", "block");
      $("#fSolveTime").val(defectJson.fUpdateDate);
    }
  } else {
    $("#fClientadvice").val(Substation.removeUnDefinedStr(defectJson.fClientadvice));
    $("#fState").val(Substation.removeUnDefinedStr(defectJson.fState));
  }
  if (beforeimg.length > 0) {
    $.each(beforeimg, function (i, value) {
      imgNum1++;
      if (value.fDeviceproblemimgurlMin == undefined) {
        var imgDiv =
          '<div class="imgContainer" id=' +
          value.fDeviceproblemimgid +
          "><img src=" +
          (Substation.ipAddressFromAPP +
            imgUrl +
            "/" +
            value.fDeviceproblemimgurl) +
          " name=" +
          (Substation.ipAddressFromAPP +
            imgUrl +
            "/" +
            value.fDeviceproblemimgurl) +
          ' onclick="imgDisplay(this)"></div>';
      } else {
        var imgDiv =
          '<div class="imgContainer" id=' +
          value.fDeviceproblemimgid +
          "><img src=" +
          (Substation.ipAddressFromAPP +
            imgUrl +
            "/" +
            value.fDeviceproblemimgurlMin) +
          " name=" +
          (Substation.ipAddressFromAPP +
            imgUrl +
            "/" +
            value.fDeviceproblemimgurl) +
          ' onclick="imgDisplay(this)"></div>';
      }

      $("#imgBox1").append(imgDiv);
    });
  }
  if (afterimg.length > 0) {
    $.each(afterimg, function (i, value) {
      imgNum++;
      if (value.fDeviceproblemimgurlMin == undefined) {
        var imgDiv =
          '<div class="imgContainer RectificationPIC" id=' +
          value.fDeviceproblemimgid +
          " data-index=" +
          (i + 1) +
          "><img   src=" +
          (Substation.ipAddressFromAPP +
            imgUrl +
            "/" +
            value.fDeviceproblemimgurl) +
          " name=" +
          (Substation.ipAddressFromAPP +
            imgUrl +
            "/" +
            value.fDeviceproblemimgurl) +
          '  onclick="imgDisplay(this)"></div>';
      } else {
        var imgDiv =
          '<div class="imgContainer RectificationPIC" id=' +
          value.fDeviceproblemimgid +
          " data-index=" +
          (i + 1) +
          "><img   src=" +
          (Substation.ipAddressFromAPP +
            imgUrl +
            "/" +
            value.fDeviceproblemimgurlMin) +
          " name=" +
          (Substation.ipAddressFromAPP +
            imgUrl +
            "/" +
            value.fDeviceproblemimgurl) +
          '  onclick="imgDisplay(this)"></div>';
      }

      $("#imgBox").append(imgDiv);
    });
  }
  if (canClick == "false") {
    $($("input")).each(function () {
      if ($(this).attr("id") == "fProblemharm" || $(this).attr("id") == "fResolution") {
        var thisValue = $(this).val();
        var thisInput = $(this).parent();
        thisInput.html('<div class="item-label">' + thisValue + '</div>');
      } else {
        $(this).attr("readonly", true);
      }
    });
    $($("select")).each(function () {
      var thisInput = $(this).parent();
      var thisValue = "";
      if (this.selectedIndex != -1) {
        thisValue = this.options[this.selectedIndex].innerText;
      }
      thisInput.html('<input type="text" readonly value="' + thisValue + '">');
    });
  }
});

$("#inputBox").html("");
$(".upload_img_wrap .upload_img").on("click", function () {
  //console.log(ev.currentTarget.dataset.id)
  var index = imgNum + 1;
  if ($("#file" + index).length < 1) {
    //        var ua = navigator.userAgent.toLowerCase(); //获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
    //        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1); //判断是否是苹果手机，是则是true
    //        if (isIos) {
    //            $("#inputBox").append("<input type=\"file\" name=\"cover\" data-id=\"" + index + "\" title=\"请选择图片\" id=\"file" + index + "\" accept=\"image/png,image/jpg,image/gif,image/JPEG\" />");
    //            // $("input:file").removeAttr("capture");
    //        }else{
    $("#inputBox").append(
      '<input type="file" class="fileInput" capture="camera" name="myFiles" data-id="' +
      index +
      '" title="请选择图片" id="file' +
      index +
      '" accept="image/png,image/jpg,image/gif,image/JPEG" />'
    );
    //        }
  }
  $("#file" + index).click();
  var u = navigator.userAgent,
    app = navigator.appVersion;
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
  if (isIOS) {
    $("#file" + index).click();
  }
  $("#file" + index)
    .unbind()
    .change(function (e) {
      var index = e.currentTarget.dataset.id;
      if ($("#file" + index).val() == "") {
        $("#inputBox input")
          .eq(index - 1)
          .remove();
        return false;
      }
      var filePath = $(this).val();
      changeImg(e, filePath, index);
      imgNum++;
      //$(".upload_img_length").html(imgNum);
      return;
    });
});

function changeImg(e, filePath, index) {
  fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
  //检查后缀名
  if (!fileFormat.match(/.png|.jpg|.jpeg/)) {
    showError("文件格式必须为：png/jpg/jpeg");
    return;
  }
  //获取并记录图片的base64编码
  var reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onloadend = function () {
    // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
    var dataURL = reader.result;
    // console.log(dataURL)
    // 显示图片
    $("#imgBox").append(
      '<div class="imgContainer" data-index=' +
      index +
      "><img   src=" +
      dataURL +
      " name=" +
      dataURL +
      ' onclick="imgDisplay(this)"><img onclick="removeImg(this,' +
      index +
      ')"  class="imgDelete" src="img/del_img.png" /></div>'
    );
  };
}

function removeImg(obj, index) {
  for (var i = 0; i < $(".imgContainer").length; i++) {
    if (
      $(".imgContainer")
      .eq(i)
      .attr("data-index") == index
    ) {
      var imgId = $(".imgContainer")
        .eq(i)
        .attr("id");
      if (imgId == undefined) {
        $(".imgContainer")
          .eq(i)
          .remove();
        $("#file" + index).remove();
        // $("#inputBox input")
        //   .eq(index)
        //   .remove();
      } else {
        //                if(confirm("确定要删除已保存的图片？")){
        /*$.confirm("确定要删除已保存的图片？", function () {
                            $(".imgContainer").eq(i).remove();
                            Substation.getDataByAjax("/deleteSubstationImg", {
                                fId: imgId
                            }, function () {

                            });
                        });*/
        /*$(".imgContainer").eq(i).remove();
                        Substation.getDataByAjax("/deleteSubstationImg", {
                            fId: imgId
                        }, function () {

                        });*/
        //                }
      }
      imgNum--;
    }
  }
  //$(".upload_img_length").html(imgNum);
}

function imgDisplay(obj) {
  var src = $(obj).attr("name");
  var imgHtml =
    '<div style="width: 100%;height: 100vh;overflow: auto;background: rgba(0,0,0,0.5);text-align: center;position: fixed;top: 0;left: 0;z-index: 2000;display: flex;justify-content: center;    align-items: center;"><img onclick="closePicture(this)" src=' +
    src +
    ' style="margin-top: 100px;width: 96%;margin-bottom: 100px;"/><p style="font-size: 50px;position: fixed;top: 30px;right: 30px;color: white;cursor: pointer;" onclick="closePicture(this)">×</p></div>';
  $("body").append(imgHtml);
}

function closePicture(obj) {
  $(obj)
    .parent("div")
    .remove();
}

/*function loadSavedPic() {
    Substation.getDataByAjax("/selectSubstationImg", {
        fSubid: selectSubid
    }, function (data) {
        if (data.hasOwnProperty("substationImgList") && data.substationImgList.length > 0) {
            var imgUrl = data.substationImgUrl;
            $.each(data.substationImgList, function (i, value) {
                imgNum++;
                var imgDiv = '<div class="imgContainer" id=' + value.fId + ' data-index=' + (i + 1) + '><img   src=' + (Substation.ipAddressFromAPP + imgUrl + "/" + value.fImagename) + ' onclick="imgDisplay(this)"><img onclick="removeImg(this,' + (i + 1) + ')"  class="imgDelete" src="img/del_img.png" /></div>';
                $("#imgBox").append(imgDiv);
            });
        }
    });
}*/

//loadSavedPic();

var upLoadClicktag = true;

function saveFormData() {
  if (!upLoadClicktag) {
    return;
  }
  upLoadClicktag = false;
  setTimeout(function () {
    upLoadClicktag = true;
  }, 1000);
  $(".fileInput").each(function () {
    if ($(this).val() == "" || $(this).val() == null) {
      $(this).remove();
    }
  });
  if ($(".fileInput").length > 6) {
    $.toast(Operation['ui_uploadPicTip']);
    return;
  }
  if ($(".RectificationPIC").length + $(".fileInput").length > 6) {
    $.toast(Operation['ui_uploadPicTip']);
    return;
  }
  var params = new FormData($("#form1")[0]);
  var taskId = localStorage.getItem("taskID");
  params.append("fDeviceproblemid", fDeviceproblemid);
  params.append("fTaskId", taskId);
  Substation.postFormDataByAjax("/updateDeviceProblemDetail", params, function (
    data
  ) {
    if (data.code == 200) {
      $.toast(Operation['ui_savesuccess']);
      localStorage.setItem("need-update", "true");
      window.history.back();
    }
  });
}

//解决键盘遮挡问题
window.addEventListener("resize", function () {
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