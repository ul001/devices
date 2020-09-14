(function ($) {
    var delParent;
    var defaults = {
        fileType: ["JPG", "PNG", "JPEG"],
        fileSize: 1024 * 1024 * 10
    };

    $.initFile = function (select, success, savedInfo) {
        var files = [];
        var imgContainer = $(select).parents(".z_photo");
        imgContainer.find(".up-section").remove()

        // 如果有存在的远程图片
        if (savedInfo !== undefined) {
            showSection(select, savedInfo, 'saved')
            setTimeout(function () {
                $(".up-section").removeClass("loading");
                $(".up-img").removeClass("up-opcity");
            }, 450);
            if (savedInfo.length >= 3) {
                $(select).parent().hide();
            }
            $(select).val("");
        }

        // 绑定事件
        $(select).unbind('change').bind('change', function () {
            var _this = $(this)
            var fileList = _this[0].files;

            var numUp = imgContainer.find(".up-section").length;
            var totalNum = numUp + fileList.length;
            if (fileList.length > 3 || totalNum > 3) {
                alert("上传图片数目不可以超过3个，请重新选择");
            }
            if (numUp < 3) {
                fileList = validateUp(fileList);
                showSection(select, fileList, 'add')
            }

            setTimeout(function () {
                $(".up-section").removeClass("loading");
                $(".up-img").removeClass("up-opcity");
            }, 450);
            numUp = imgContainer.find(".up-section").length;
            if (numUp >= 3) {
                _this.parent().hide();
            }
            $(this).val("");
            success(files)
        });

        // 显示图片
        function showSection(select, fileList, type) {
            for (var i = 0; i < fileList.length; i++) {

                if (fileList[i] === undefined) {
                    continue
                }


                var imgUrl;

                // 如果是已保存的远程图片，则进行转码
                if (type === "saved") {
                    imgUrl = fileList[i]

                    creatImg(imgUrl)
                } else {
                    imgUrl = window.URL.createObjectURL(fileList[i]);
                    files.push(fileList[0]);
                }

                var $section = $("<section class='up-section fl loading' data-index='" + fileList[i].name + "'>");
                imgContainer.prepend($section);
                var $span = $("<span class='up-span'>");
                $span.appendTo($section);

                var $img0 = $("<img class='close-upimg'>").off('click').on("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    delParent = $(this).parent();
                    confirm("是否要删除此图片？", "", function (isConfirm) {
                        if (isConfirm) {
                            var url = $(delParent).attr('data-index')
                            var index;

                            for (var i = 0; i < files.length; i++) {
                                if (files[i].name === url) {
                                    index = i
                                }
                            }

                            files.splice(index, 1)
                            delParent.remove();
                            var numUp = imgContainer.find(".up-section").length;
                            if (numUp < 3) {
                                $(select).parent().show();
                            }
                            success(files)
                        }
                    });
                });
                $img0.attr("src", "img/removeImg.png").appendTo($section);
                var $img = $("<img class='up-img'>");
                $img.attr("src", imgUrl);
                $img.appendTo($section);
            }
        }

        function creatImg(imgUrl) {

            var img = new Image();
            img.src = imgUrl;
            img.crossOrigin = 'anonymous'; //跨域

            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            img.onload = function () {
                canvas.width = 190;
                canvas.height = 190;

                ctx.drawImage(img, 0, 0, 190, 190);

                var base64 = canvas.toDataURL('image/png', 1.0);

                var a = imgUrl.split('/')
                var name = a[a.length - 1]

                files.push(dataURLtoFile(base64, name));

                success(files)
            }
        }
    }

    // 提交之前的格式验证
    function validateUp(files) {
        var arrFiles = [];
        for (var i = 0, file; file = files[i]; i++) {
            var newStr = file.name.split("").reverse().join("");
            if (newStr.split(".")[0] != null) {
                var type = newStr.split(".")[0].split("").reverse().join("");
                if (jQuery.inArray(type.toUpperCase(), defaults.fileType) > -1) {
                    if (file.size >= defaults.fileSize) {
                        alert(file.size);
                        alert(file.name + "文件大小过大");
                    } else {
                        arrFiles.push(file);
                    }
                } else {
                    alert(file.name + "上传类型不符合");
                }
            } else {
                alert(file.name + "没有类型, 无法识别");
            }
        }
        return arrFiles;
    }

    // base64转file
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(",");
        var mine = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, {
            type: mine
        });
    }

})(jQuery);