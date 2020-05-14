var imgNum1 = 0;
var imgNum = 0;
var repairId = Substation.GetQueryString("repairId");
//var repairId = 20200514160441941440585;
var androidRepairId = localStorage.getItem("repairId");
localStorage.removeItem("repairId");
if (androidRepairId != null && androidRepairId != undefined) {
    repairId = androidRepairId;
    $(".back_btn").click(function () {
        android.goBack();
    });
} else {
    $(".back_btn").click(function () {
        window.history.back();
    });
}
//var taskProblem = Substation.GetQueryString("taskProblem");
var selectSubid = localStorage.getItem("fSubid");
//var clickTree = localStorage.getItem("clickTree");
var canClick = localStorage.getItem("canClick");
var jumpId = Substation.GetQueryString("jumpId");
var isPush = "0";
if (jumpId != undefined && jumpId != null && jumpId != "") {
    alarmeventlogid = jumpId;
    isPush = "1";
}

// var param = JSON.parse(localStorage.getItem("DetailParam"));
// localStorage.removeItem("DetailParam");
// creatView(param);
loadMenu();

function loadMenu() {
//    $("#form1").empty();
    $.showPreloader(Operation["ui_loading"]);
    Substation.getDataByAjaxNoLoading(
        "/getTaskAndRushRepairDetailById", {
            fTaskandrushrepairid: repairId
            // fAlarmeventlogid: "2020050712100851951629671"
        },
        function (data) {
            if (data.hasOwnProperty("taskAndRushRepairDetail")) {
                creatView(data);
            } else {
                $.toast("数据异常，未获取到报警对应详情");
            }
            $.hidePreloader();
        },
        function (errorcode) {
            $.hidePreloader();
        }
    );
}

$(".pull-left.click_btn").click(function () {
    if (isPush == "1") {
        //推送详情点击返回事件
        if (isAndroid) {
            android.goBack();
        } else if (isIOS) {
            //            window.history.back();
            window.webkit.messageHandlers.goBackiOS.postMessage("");
        }
    } else {
        window.history.back();
    }
});

function creatView(dataParam) {
    var html = "";
    if (dataParam) {
        var imgUrl = dataParam.ImgURL;
        var taskParam = dataParam.taskAndRushRepairDetail;
        var picArr = dataParam.tDevTaskAndRushRepairImgs;
        try{
            $("#fState").val(taskParam.fState);
            $("#taskNumber").text(taskParam.fTasknumber);
            $("#taskContent").text(taskParam.fTaskcontent);
        }catch(e){}
        if (canClick == "false") {
            $(".upload_img_wrap .upload_img").unbind();
            $(".upload_img_wrap .upload_img").css("display", "none");
            $(".blueColor").removeClass("blueColor");
            $("#saveData").css("display", "none");
            $("#fSolveresult").attr("readonly", true);
            $($("select")).each(function () {
              var thisInput = $(this).parent();
              var thisValue = "";
              if (this.selectedIndex != -1) {
                thisValue = this.options[this.selectedIndex].innerText;
              }
              thisInput.html('<input type="text" readonly value="' + thisValue + '">');
            });
        }

        if (picArr.length > 0) {
            $.each(picArr, function (i, value) {
                imgNum++;
                if (value.fImgnamemin == undefined) {
                    var imgDiv =
                        '<div class="imgContainer RectificationPIC" id=' +
                        value.fTaskandalarmeventid +
                        " data-index=" +
                        (i + 1) +
                        "><img   src=" +
                        (Substation.ipAddressFromAPP + imgUrl + "/" + value.fImgname) +
                        " name=" +
                        (Substation.ipAddressFromAPP + imgUrl + "/" + value.fImgname) +
                        '  onclick="imgDisplay(this)"></div>';
                } else {
                    var imgDiv =
                        '<div class="imgContainer RectificationPIC" id=' +
                        value.fTaskandalarmeventid +
                        " data-index=" +
                        (i + 1) +
                        "><img   src=" +
                        (Substation.ipAddressFromAPP + imgUrl + "/" + value.fImgnamemin) +
                        " name=" +
                        (Substation.ipAddressFromAPP + imgUrl + "/" + value.fImgname) +
                        '  onclick="imgDisplay(this)"></div>';
                }

                $("#imgBox").append(imgDiv);
            });
        }
        $.hidePreloader();
    } else {
        $.hidePreloader();
    }

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
}

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
        $.toast(Operation["ui_uploadPicTip"]);
        return;
    }
    if ($(".RectificationPIC").length + $(".fileInput").length > 6) {
        $.toast(Operation["ui_uploadPicTip"]);
        return;
    }
    var params = new FormData($("#form1")[0]);
    var taskId = localStorage.getItem("taskID");
    // params.append("fDeviceproblemid", fDeviceproblemid);
    params.append("fTaskandrushrepairid", repairId);
    Substation.postFormDataByAjax(
        "/modifyTaskAndRushRepairDetail",
        params,
        function (data) {
            if (data.code == 200) {
                $.toast(Operation["ui_savesuccess"]);
                localStorage.setItem("need-update", "true");
                window.history.back();
            }
        }
    );
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