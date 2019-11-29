var selectSubid = "";
var clickSubid = "";
$(function() {
    'use strict';
    $(document).on("pageInit", "#listPage", function(e, id, page) {
        var loading = false;
        var itemsPerLoad = 5;
        var pageNum = 1;

        function getFirstPage() {
            $("#list-container").empty();
            pageNum = 1;
            addItems(itemsPerLoad, 0);
            lastIndex = 5;
            $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
            loading = false;
            $.attachInfiniteScroll($('.infinite-scroll'));
        }

        $(document).on('refresh', '.pull-to-refresh-content', function(e) {
            setTimeout(function() {
                getFirstPage();
                // done
                $.pullToRefreshDone('.pull-to-refresh-content');
            }, 2000);
        });

        function addItems(number, lastIndex) {
            var html = '';
            var url = "/getDeviceProblemList";
            var params = {
                pageNum: pageNum,
                pageSize: number
            };
            if (selectSubid != "") {
                params['fSubid'] = selectSubid;
            }
            var dateStartVal = $("#dateStart").val();
            var dateEndVal = $("#dateEnd").val();
            var stateVal = $("#fState2").val();
            var dangerVal = $("#dangerType").val();
            if (dateStartVal != "") {
                params['ftimeStart'] = dateStartVal + " 00:00:00";
            }
            if (dateEndVal != "") {
                params['ftimeEnd'] = dateEndVal + " 23:59:59";
            }
            if (stateVal != "") {
                params['fState'] = stateVal;
            }
            if (dangerVal != "") {
                params['fProblemlevel'] = dangerVal;
            }
            Substation.getDataByAjaxNoLoading(url, params, function(data) {
                if (data.tDevDeviceproblemList.list.length > 0) {
                    if (pageNum == 1) {
                        $("#list-container").empty();
                    }
                    $(data.tDevDeviceproblemList.list).each(function() {
                        var problemStr = "";
                        if (this.hasOwnProperty("fProblemlocation")) {
                            if (this.fProblemlocation.indexOf(",") != -1) {
                                problemStr = this.fProblemlocation.split(",")[1]
                            }
                        }
                        var stateStr = "";
                        switch (this.fState) {
                            case "0":
                                stateStr = "<span class=\"redColor\">未处理</span>";
                                break;
                            case "2":
                                stateStr = "<span class=\"redColor\">待处理</span>";
                                break;
                            case "3":
                                stateStr = "<span class=\"redColor\">待客户停电处理</span>";
                                break;
                            case "4":
                                stateStr = "<span class=\"redColor\">待线路停电处理</span>";
                                break;
                            case "5":
                                stateStr = "<span class=\"redColor\">其他</span>";
                                break;
                            case "1":
                                stateStr = "<span class=\"button-success\">已处理</span>";
                                break;
                            default:
                                stateStr = "<span class=\"redColor\">未处理</span>";
                                break;
                        }
                        /*var solveUser = "";
                        if(this.fSolvedUserName!=undefined){
                            solveUser="<p>处理人员："+this.fSolvedUserName+"</p>";
                        }
                        var solveTime = "";
                        if(this.fUpdateDate!=undefined){
                            solveTime="<p>处理时间："+this.fUpdateDate+"</p>";
                        }*/
                        html += "<div class=\"card\" id=\"" + this.fDeviceproblemid + "\" value=\"" + (this.treePathName == undefined ? "" : this.treePathName) + "\">\n" +
                            "                    <div class=\"card-content\">\n" +
                            "                        <div class=\"card-content-inner row no-gutter\">\n" +
                            /*"                            <div class=\"col-10\">\n" +
                            "                                <i class=\"icon icon-alarm\"></i>\n" +
                            "                            </div>\n" +*/
                            "                            <div class=\"col-95\">\n" +
                            "<p class=\"subName limit-length\">" + this.fSubName + "</p>" +
                            "                                <p>设备名称:<span class=\"redColor\">" + (this.treePathName == undefined ? "" : this.treePathName) + "</span>\n" +
                            "                                </p>\n" +
                            "                                <p>缺陷描述:<span class=\"redColor\">" + this.fDeviceproblemdes + "</span></p>\n" +
                            //                        "                                <p>危害:"+this.fProblemharm+"</p>\n" +
                            "                                <p>具体位置:" + problemStr + "</p>\n" +
                            "                                <p class=\"row\"><span class=\"col-50\">缺陷类别:" + this.fProblemtype + "</span><span class=\"col-50\">紧急程度:" + this.fProblemlevel + "</span></p>\n" +
                            //                        "                                <p>消缺期限:"+this.fTimelimit+"</p>\n" +
                            //                        "                                <p>处理建议:"+this.fResolution+"</p>\n" +
                            //                        "                                <p>客户意见:"+this.fClientadvice+"</p>\n" +
                            "                                <p>处理状态:" + stateStr + "</p>\n" +
                            "                                <p>发现时间:" + this.fCreatetime + "</p>\n" +
                            //                        solveUser+solveTime+
                            "                            </div>\n" +
                            "                            <div class=\"col-5\">\n" +
                            "                                <i class=\"icon icon-right\"></i>\n" +
                            "                            </div>\n" +
                            "                        </div>\n" +
                            "                    </div>\n" +
                            "                </div>";
                    });
                    $('#list-container').append(html);
                    $(".card").unbind().click(function() {
                        var clickId = $(this).attr("id");
                        var clickTree = $(this).attr("value");
                        $.router.loadPage("#defectInfo");
                        $("#defectInfo .content").scrollTop(0,0);
                        getDefectInfo(clickId, clickTree, "false");
                    });
                    pageNum++;
                } else {
                    $.detachInfiniteScroll($('.infinite-scroll'));
                    $('.infinite-scroll-preloader').html("--end--");
                    return;
                }
                if (data.tDevDeviceproblemList.list.length < itemsPerLoad) {
                    $.detachInfiniteScroll($('.infinite-scroll'));
                    $('.infinite-scroll-preloader').html("--end--");
                    return;
                }
            });
        }

        $("#list-container").empty();

        addItems(itemsPerLoad, 0);

        var lastIndex = 5;

        $(document).on('infinite', '.infinite-scroll', function() {

            // 如果正在加载，则退出
            if (loading) return;

            // 设置flag
            loading = true;

            setTimeout(function() {
                loading = false;
                addItems(itemsPerLoad, lastIndex);
                lastIndex = $('#list-container .card').length;
            }, 1000);
        });

        $('#searchBtn').click(function() {
            $(".close-panel").click();
            if ($("#search").val() == "") {
//                $("#subName").text("所有变电所");
                selectSubid = "";
            } else if (clickSubid != "") {
//                $("#subName").text($("#search").val());
                selectSubid = clickSubid;
                clickSubid = "";
            }
            getFirstPage();
        });

        $("#dateStart").calendar();
        $("#dateEnd").calendar();
        $("#listContainer").hide();

        /*$('#search').on("focus",function(){
            if($("#search").val().length>0){
                $(".icon.icon-clear").show();
            }else{
                $(".icon.icon-clear").hide();
            }
        });

        $('#search').blur(function(){
            $(".icon.icon-clear").hide();
        });*/

        //时间快捷按钮
        $(".buttons-row .button").click(function() {
            $(this).addClass("active").siblings().removeClass("active");
        });
        $("#today").click(function() {
            var myDate = new Date();
            var todayVal = myDate.format("yyyy-MM-dd");
            $("#dateStart").val(todayVal);
            $("#dateEnd").val(todayVal);
        });
        $("#yestoday").click(function() {
            var myDate = new Date();
            myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
            var yestodayVal = myDate.format("yyyy-MM-dd");
            $("#dateStart").val(yestodayVal);
            $("#dateEnd").val(yestodayVal);
        });
        $("#thisMonth").click(function() {
            var myDate = new Date();
            var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
            var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
            var firstDayVal = firstDay.format("yyyy-MM-dd");
            var lastDayVal = lastDay.format("yyyy-MM-dd");
            $("#dateStart").val(firstDayVal);
            $("#dateEnd").val(lastDayVal);
        });
        $("#lastMonth").click(function() {
            var myDate = new Date();
            var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
            var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
            var firstDayVal = firstDay.format("yyyy-MM-dd");
            var lastDayVal = lastDay.format("yyyy-MM-dd");
            $("#dateStart").val(firstDayVal);
            $("#dateEnd").val(lastDayVal);
        });

        Date.prototype.format = function(fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        $("#dateStart,#dateEnd").click(function() {
            $(".buttons-row").find($(".active")).removeClass("active");
        });

        //解决键盘遮挡问题
        var h = $(window).height();
        window.addEventListener("resize", function() {
            if ($(window).height() < h) { $('.btnBar').hide(); }
            if ($(window).height() >= h) { $('.btnBar').show(); }
            if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                window.setTimeout(function() {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        });

        $(".back_btn").click(function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓系统
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
            if (isIOS) {
                window.webkit.messageHandlers.goBackiOS.postMessage("");
            } else {
                android.goBack();
            }
        });
    });

    $(document).on("pageInit", "#defectInfo", function(e, id, page) {
        $("#inputBox").html("");
    });

    function getDefectInfo(problemid, clickTree, canClick) {
        var imgNum1 = 0;
        var imgNum = 0;
        $("#imgBox1").empty();
        $("#imgBox").empty();
        var url = "/getDeviceProblemDetail";
        var problemParam = {
            fDeviceproblemid: problemid
        };
        Substation.getDataByAjax(url, problemParam, function(data) {
            var imgUrl = data.imgUrl;
            var defectJson = data.tDevDeviceproblem;
            var beforeimg = data.beforeimg;
            var afterimg = data.afterimg;
            $("#taskNumber").text(defectJson.fTasknumber);
            $("#treePathName").text(clickTree);
            $("#fDeviceproblemdes").text(defectJson.fDeviceproblemdes);
            var fProblemlocation = defectJson.fProblemlocation;
            $("#defectPosition").empty();
            if (fProblemlocation.indexOf(",") != -1) {
                var defectPosition = fProblemlocation.split(",")[0];
                var defectPositionVal = fProblemlocation.split(",")[1];
                var defectPositionArray = defectPosition.split(";");
                var defectPositionValArray = defectPositionVal.split(";");
                $(defectPositionArray).each(function(index, obj) {
                    $("#defectPosition").append('<input type="checkbox" disabled value="' + obj + '" id="' + index + '"><label for="' + index + '">' + obj + '</label><br>');
                });
                $(defectPositionValArray).each(function() {
                    $("input[type='checkbox'][value='" + this + "']").attr("checked", true);
                });
            }
            $("#fProblemtype").val(defectJson.fProblemtype);
            $("#fProblemlevel").val(defectJson.fProblemlevel);
            $("#fTimelimit").val(defectJson.fTimelimit);
            $("#fProblemharm").val(defectJson.fProblemharm);
            $("#fCreatetime").val(defectJson.fCreatetime);
            $("#fResolution").val(defectJson.fResolution);
            if (canClick == "false") {
                $("#fClientadvice").val(defectJson.fClientadvice);
                $("#fState").val(defectJson.fState);
                if (defectJson.fSolvedUserName != undefined) {
                    $(".showSolveUser").css("display", "block");
                    $("#fSolveUser").val(defectJson.fSolvedUserName);
                }
                if (defectJson.fUpdateDate != undefined) {
                    $(".showSolveTime").css("display", "block");
                    $("#fSolveTime").val(defectJson.fUpdateDate);
                }
            } else {
                if (defectJson.fClientadvice != "" && defectJson.fClientadvice != null && defectJson.hasOwnProperty("fClientadvice")) {
                    $("#fClientadvice").val(defectJson.fClientadvice);
                }
                if (defectJson.fState != "" && defectJson.hasOwnProperty("fState") && defectJson.fState != null) {
                    $("#fState").val(defectJson.fState);
                }
            }
            if (beforeimg.length > 0) {
                $.each(beforeimg, function(i, value) {
                    imgNum1++;
                    var imgDiv = '<div class="imgContainer" id=' + value.fDeviceproblemimgid + '><img   src=' + (Substation.ipAddressFromAPP + imgUrl + "/" + value.fDeviceproblemimgurl) + ' onclick="imgDisplay(this)"></div>';
                    $("#imgBox1").append(imgDiv);
                });
            }
            if (afterimg.length > 0) {
                $.each(afterimg, function(i, value) {
                    imgNum++;
                    var imgDiv = '<div class="imgContainer" id=' + value.fDeviceproblemimgid + ' data-index=' + (i + 1) + '><img   src=' + (Substation.ipAddressFromAPP + imgUrl + "/" + value.fDeviceproblemimgurl) + ' onclick="imgDisplay(this)"></div>';
                    $("#imgBox").append(imgDiv);
                });
            }
            if (canClick == "false") {
                $($("#defectInfo input")).each(function() {
                    $(this).attr("readonly", true);
                });
                $($("#defectInfo select")).each(function() {
                    var thisInput = $(this).parent();
                    var thisValue = "";
                    if (this.selectedIndex != -1) {
                        thisValue = (this.options[this.selectedIndex]).innerText;
                    }
                    thisInput.html('<input type="text" readonly value="' + thisValue + '">');
                });
                $(".upload_img_wrap .upload_img").unbind();
                $(".upload_img_wrap .upload_img").css("display", "none");
                $(".blueColor").removeClass("blueColor");
                $("#saveData").css("display", "none");
            }
        });

    }

    $.init();

});

$('#search').bind('keydown', function(event) {
    if (event.keyCode == 13) {
        getSomeSubstation();
        document.activeElement.blur();
    }
});

$('#search').on("input", function() {
    if ($("#search").val().length > 0) {
        $(".icon.icon-clear").show();
    } else {
        $(".icon.icon-clear").hide();
    }
});

$(".icon.icon-clear").click(function() {
    $("#search").val("");
    $(this).hide();
});

function getSomeSubstation() {
    var url = "/getSubListByLetter";
    var searchKey = $("#search").val();
    var params = {
        key: searchKey
    }
    $("#listContainer").empty();
    Substation.getDataByAjaxNoLoading(url, params, function(data) {
        $(data).each(function() {
            $("#listContainer").append('<li class="item-content" data-id="' + this.fSubid + '">' +
                '<div class="item-inner">' +
                '<div class="item-title">' + this.fSubname + '</div>' +
                '</div>' +
                '</li>');
        });
        $("#listContainer").show();
        $("#listContainer .item-content").click(function() {
            clickSubid = $(this).attr("data-id");
            var clickName = $(this).find(".item-title").text();
            $("#search").val(clickName);
            $("#listContainer").empty();
            $("#listContainer").hide();
            //            $("#subName").text(clickName);
        });
    });
}

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
    reader.onloadend = function() {
        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
        var dataURL = reader.result;
        // console.log(dataURL)
        // 显示图片
        $("#imgBox").append('<div class="imgContainer" data-index=' + index + '><img   src=' + dataURL + ' onclick="imgDisplay(this)"><img onclick="removeImg(this,' + index + ')"  class="imgDelete" src="img/del_img.png" /></div>');
    };

}

function imgDisplay(obj) {
    var src = $(obj).attr("src");
    var imgHtml = '<div style="width: 100%;height: 100vh;overflow: auto;background: rgba(0,0,0,0.5);text-align: center;position: fixed;top: 0;left: 0;z-index: 2000;display: flex;justify-content: center;    align-items: center;"><img onclick="closePicture(this)" src=' + src + ' style="margin-top: 100px;width: 96%;margin-bottom: 100px;"/><p style="font-size: 50px;position: fixed;top: 30px;right: 30px;color: white;cursor: pointer;" onclick="closePicture(this)">×</p></div>'
    $('body').append(imgHtml);
}

function closePicture(obj) {
    $(obj).parent("div").remove();
}