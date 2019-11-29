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
var imgNum = 0;
var selectSubid = localStorage.getItem("fSubid");
var defectJson = JSON.parse(localStorage.getItem("defectJson"));
var code = defectJson.code;
var name = decodeURIComponent(defectJson.name);
var defectPosition = decodeURIComponent(defectJson.defectPosition);
var identification = decodeURIComponent(defectJson.identification);
var deadline = decodeURIComponent(defectJson.deadline);
var dangerous = defectJson.dangerous;
$("#defectDiscribe").val(name);
if(defectPosition==""||defectPosition==null){
    $(".redColor").remove();
}else{
    var defectPositionArray = defectPosition.split(";");
    $("#defectPosition").empty();
    $(defectPositionArray).each(function (index, obj) {
        $("#defectPosition").append('<input type="checkbox" value="' + obj + '" id="' + index + '"><label for="' + index + '">' + obj + '</label><br>');
    });
}
$("#dangerCategory").val(defectJson.dangerCategory);
$("#dangerType").val(defectJson.dangerType);
$("#dangerous").val(dangerous);
$("#suggest").val(defectJson.suggest);
$("#deadline").val(deadline);
var defectPositionVal = defectPosition;
var fPlacecheckformid = localStorage.getItem("fPlacecheckformid");
var fSubdeviceinfoid = Substation.GetQueryString("fSubdeviceinfoid");

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
        $("#inputBox").append("<input type=\"file\" class=\"fileInput\" name=\"file\" data-id=\"" + index + "\" title=\"请选择图片\" id=\"file" + index + "\" accept=\"image/png,image/jpg,image/gif,image/JPEG\" />");
        //        }
    }
    $("#file" + index).click();
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
    if (isIOS) {
        $("#file" + index).click();
    }
    $("#file" + index).unbind().change(function (e) {
        var index = e.currentTarget.dataset.id;
        if ($('#file' + index).val() == '') {
            $("#inputBox input").eq(index - 1).remove();
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
        showError('文件格式必须为：png/jpg/jpeg');
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
        $("#imgBox").append('<div class="imgContainer" data-index=' + index + '><img   src=' + dataURL + ' onclick="imgDisplay(this)"><img onclick="removeImg(this,' + index + ')"  class="imgDelete" src="img/del_img.png" /></div>');
    };

}

function removeImg(obj, index) {
    for (var i = 0; i < $(".imgContainer").length; i++) {
        if ($(".imgContainer").eq(i).attr("data-index") == index) {
            var imgId = $(".imgContainer").eq(i).attr("id");
            if (imgId == undefined) {
                $(".imgContainer").eq(i).remove();
                $("#file" + (i + 1)).remove();
            } else {
                //                if(confirm("确定要删除已保存的图片？")){
                $.confirm("确定要删除已保存的图片？", function () {
                    $(".imgContainer").eq(i).remove();
                    Substation.getDataByAjax("/deleteSubstationImg", {
                        fId: imgId
                    }, function () {

                    });
                });
                /*$(".imgContainer").eq(i).remove();
                Substation.getDataByAjax("/deleteSubstationImg", {
                    fId: imgId
                }, function () {

                });*/
                //                }
            }
            imgNum--;
            break;
        }
    }
    //$(".upload_img_length").html(imgNum);
}


function imgDisplay(obj) {
    var src = $(obj).attr("src");
    var imgHtml = '<div onclick="closePicture(this)" style="width: 100%;height: 100vh;overflow: auto;background: rgba(0,0,0,0.5);text-align: center;position: fixed;top: 0;left: 0;z-index: 2000;display: flex;justify-content: center;    align-items: center;"><img src=' + src + ' style="margin-top: 100px;width: 96%;margin-bottom: 100px;"/><p style="font-size: 50px;position: fixed;top: 30px;right: 30px;color: blue;cursor: pointer;" onclick="closePicture(this)">×</p></div>'
    $('body').append(imgHtml);
}

function closePicture(obj) {
    $(obj).parent("div").remove();
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
}

loadSavedPic();*/

function saveFormData() {
    $(".fileInput").each(function () {
        if ($(this).val() == "" || $(this).val() == null) {
            $(this).remove();
        }
    });
    if ($(".fileInput").length > 6) {
        $.toast("最多上传6张图片");
        return;
    }
    if ($("input:checkbox:checked").length == 0) {
        $.toast("请选择缺陷位置！");
        return;
    } else {
        var checkedVal = ",";
        $("input:checkbox:checked").each(function () {
            checkedVal += $(this).val() + ";";
        });
        checkedVal = checkedVal.substring(0, checkedVal.length - 1);
        defectPositionVal = defectPosition + checkedVal;
    }
/*    if ($(".fileInput") && $(".fileInput").length == 0) {
        $.toast("请上传现场照！");
        return;
    }*/
    var params = new FormData($('#form1')[0]);
    params.append("fTimelimit", deadline);
    params.append("fProblemlocation", defectPositionVal);
    params.append("fPlacecheckformid", fPlacecheckformid);
    params.append("fSubdeviceinfoid", fSubdeviceinfoid);
    params.append("fDeviceitem", code);
    Substation.postFormDataByAjax("/saveCheckItemProblem", params, function (data) {
        if (data.code == 200) {
            $.toast("保存成功");
            window.history.back();
        }
    });
}

//解决键盘遮挡问题
window.addEventListener("resize", function () {
    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

$.init();