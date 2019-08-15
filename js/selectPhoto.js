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
$("#inputBox").html("");
$(".upload_img_wrap .upload_img").on("click", function () {
    //console.log(ev.currentTarget.dataset.id)
    var index = imgNum + 1;
    if ($("#file" + index).length < 1) {
        $("#inputBox").append("<input type=\"file\" name=\"image[]\" data-id=\"" + index + "\" title=\"请选择图片\" id=\"file" + index + "\" accept=\"image/png,image/jpg,image/gif,image/JPEG\" />");
    }
    var that = this;
    $("#file" + index).click();
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
})

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
            $(".imgContainer").eq(i).remove();
            $("#inputBox input").eq(i - 1).remove();
        }
    }
    imgNum--;
    //$(".upload_img_length").html(imgNum);
}


function imgDisplay(obj) {
    var src = $(obj).attr("src");
    var imgHtml = '<div style="width: 100%;height: 100vh;overflow: auto;background: rgba(0,0,0,0.5);text-align: center;position: fixed;top: 0;left: 0;z-index: 2000;display: flex;justify-content: center;    align-items: center;"><img src=' + src + ' style="margin-top: 100px;width: 96%;margin-bottom: 100px;"/><p style="font-size: 50px;position: fixed;top: 30px;right: 30px;color: white;cursor: pointer;" onclick="closePicture(this)">×</p></div>'
    $('body').append(imgHtml);
}

function closePicture(obj) {
    $(obj).parent("div").remove();
}

$.init();