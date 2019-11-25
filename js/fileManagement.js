var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;
var clickID = Substation.GetQueryString("clickID");
//var clickID = "bianwei";
var titleName = localStorage.getItem("titleName");
$(".title.title_color").text(titleName);
var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var selectSubid = "";
var clickSubid = "";
//var fileUrlBasePath = "";

function getFirstPage() {
    $(".list-container").empty();
    pageNum = 1;
    addItems(itemsPerLoad, 0);
    lastIndex = 10;
    $(".infinite-scroll-preloader").html('<div class="preloader"></div>');
    loading = false;
    $.attachInfiniteScroll($(".infinite-scroll"));
}

$(document).on("refresh", ".pull-to-refresh-content", function (e) {
    setTimeout(function () {
        getFirstPage();
        // done
        $.pullToRefreshDone(".pull-to-refresh-content");
    }, 2000);
});

function downloadFile(filecode, filepath) {
    if (isAndroid) {
        android.openFile(
            Substation.ipAddressFromAPP + "/" + filepath + "/" + filecode
        );
    } else {
        if (filecode != undefined && filepath != undefined) {
            var dic = {
                'fFilepath': filepath,
                'fFilecode': filecode
            };
            window.webkit.messageHandlers.pushDownFileVC.postMessage(dic);
        }
    }
}

function addItems(number, lastIndex) {
    var html = "";
    var url = "/selectDocument";
    // if (clickID == "bianwei") {
    //     url = "/getWarningMessageSignalEvents";
    //     //$(".title").html("遥信变位报警");
    // } else if (clickID == "yuexian") {
    //     url = "/getWarningMessageOverLimitEvents";
    //     //$(".title").html("遥测越限报警");
    // } else if (clickID == "platform") {
    //     url = "/getWarningMessagePlatformRunEvents";
    //     //$(".title").html("平台运行报警");
    // }
    // var searchKey = $("#search").val();
    var params = {
        category: clickID //类别id
        // subId: subId, //变电所id
        // startTime: "",
        // endTime: "",
        // pageNo: pageNum,
        // pageSize: number
    };
    if (selectSubid != "") {
        params['subId'] = selectSubid;
    }
    var dateStartVal = $("#dateStart").val();
    var dateEndVal = $("#dateEnd").val();
    if (dateStartVal != "") {
        params['startTime'] = dateStartVal + " 00:00:00";
    }
    if (dateEndVal != "") {
        params['endTime'] = dateEndVal + " 23:59:59";
    }
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        //文件拼接基础路径
        //        fileUrlBasePath = data.fileUrl;
        if (
            data.hasOwnProperty("tDtDocumentsManages") &&
            data.tDtDocumentsManages.length > 0
        ) {
            // if (pageNum == 1) {
            //     $(".list-container").empty();
            // }
            $(data.tDtDocumentsManages).each(function () {
                var pushTime = "";
                if (this.fFilepublishtime != undefined) {
                    pushTime = this.fFilepublishtime;
                    pushTime = pushTime.slice(0, 10);
                }
                var fileSize = "";
                if (this.fFilesize != undefined) {
                    fileSize = bytesToSize(this.fFilesize);
                }
                //waring暂时屏蔽
                var fileIcon = "";
                switch (this.fFiletype) {
                    case ".docx":
                        fileIcon = "<i class='icon icon-file icon-doc'></i>";
                        break;
                    case ".doc":
                        fileIcon = "<i class='icon icon-file icon-doc'></i>";
                        break;
                    case ".txt":
                        fileIcon = "<i class='icon icon-file icon-txt'></i>";
                        break;
                    case ".pptx":
                        fileIcon = "<i class='icon icon-file icon-ppt'></i>";
                        break;
                    case ".ppt":
                        fileIcon = "<i class='icon icon-file icon-ppt'></i>";
                        break;
                    case ".pdf":
                        fileIcon = "<i class='icon icon-file icon-pdf'></i>";
                        break;
                    case ".xlsx":
                        fileIcon = "<i class='icon icon-file icon-xls'></i>";
                        break;
                    case ".xls":
                        fileIcon = "<i class='icon icon-file icon-xls'></i>";
                        break;
                    default:
                        fileIcon = "<i class='icon icon-file icon-default'></i>";
                        break;
                }

                html +=
                    "<div class=\"card\"  onclick=\"downloadFile('" + this.fFilecode + "','" + this.fFilepath + "')\">\n" +
                    '                    <div class="card-content">\n' +
                    '                        <div class="content-padded">\n' +
                    '  <div class="row no-gutter sub_card">';
                html += '                                    <div class="col-10">';
                html += fileIcon;
                html += "                                    </div>";
                html +=
                    '                                    <div class="col-90">';
                html +=
                    '                                        <p class="subName limit-length"> ' +
                    this.fFilename +
                    this.fFiletype +
                    "</p>";
                html += '<div class="row no-gutter" style="font-size:12px"><div class="col-33 limit-length"><i class="icon icon-fileSubname"></i>&nbsp;' +
                    this.subName + '</div><div class="col-33 limit-length">&nbsp;<i class="icon icon-fileTime"></i>&nbsp;' +
                    pushTime + '</div><div class="col-33 limit-length">&nbsp;<i class="icon icon-fileSize"></i>&nbsp;' +
                    fileSize + "</div></div>";
                html += "                                    </div>";
                /*                html += '                                    <div class="col-15">';
                                html +=
                                    '                                        <button class="bg-primary external" type="button" onclick="downloadFile(\'' +
                                    this.fFilecode + "','" + this.fFilepath +
                                    "')\">下载";
                                html += "                                        </button>";
                                html += "                                    </div>";*/
                html +=
                    "                                </div>" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                </div>";
            });
            $(".list-container").append(html);
            //addClick();
            // Substation.getDataByAjaxNoLoading("/close");
            pageNum++;
        } else {
            $.detachInfiniteScroll($(".infinite-scroll"));
            $(".infinite-scroll-preloader").html("--end--");
            return;
        }
        if (data.tDtDocumentsManages.length < itemsPerLoad) {
            $.detachInfiniteScroll($(".infinite-scroll"));
            $(".infinite-scroll-preloader").html("--end--");
            return;
        }
    });
}

function bytesToSize(bytes) {
    if (bytes === 0) return "0 B";
    let k = 1024,
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

addItems(itemsPerLoad, 0);

var lastIndex = 10;

$(document).on("infinite", ".infinite-scroll", function () {
    // 如果正在加载，则退出
    if (loading) return;

    // 设置flag
    loading = true;

    setTimeout(function () {
        loading = false;

        if (lastIndex >= maxItems) {
            $.detachInfiniteScroll($(".infinite-scroll"));
            $(".infinite-scroll-preloader").html("--end--");
            return;
        }

        addItems(itemsPerLoad, lastIndex);
        lastIndex = $(".list-container .card").length;
    }, 1000);
});

$(".back_btn").click(function () {
    if (isIOS) {
        window.history.back();
        window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
    } else {
        window.history.back();
    }
});

$("#searchBtn").click(function () {
    $(".close-panel").click();
    /*    if(saveParam!=null){
              clickSubid = saveParam['fSubid'];
              saveParam=null;
          }*/
    if ($("#search").val() == "") {
        //        $("#subName").text("所有变电所");
        selectSubid = "";
    } else if (clickSubid != "") {
        //        $("#subName").text($("#search").val());
        selectSubid = clickSubid;
        clickSubid = "";
    }
    getFirstPage();
});

$("#dateStart").calendar();
$("#dateEnd").calendar();
$("#listContainer").hide();

function getSomeSubstation() {
    var url = "/getSubListByLetter";
    var searchKey = $("#search").val();
    var params = {
        key: searchKey
    };
    $("#listContainer").empty();
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        $(data).each(function () {
            $("#listContainer").append(
                '<li class="item-content" data-id="' +
                this.fSubid +
                '">' +
                '<div class="item-inner">' +
                '<div class="item-title">' +
                this.fSubname +
                "</div>" +
                "</div>" +
                "</li>"
            );
        });
        $("#listContainer").show();
        $("#listContainer .item-content")
            .unbind()
            .click(function () {
                clickSubid = $(this).attr("data-id");
                var clickName = $(this)
                    .find(".item-title")
                    .text();
                $("#search").val(clickName);
                $("#listContainer").empty();
                $("#listContainer").hide();
                //            $("#subName").text(clickName);
            });
    });
}

$("#search").bind("keydown", function (event) {
    if (event.keyCode == 13) {
        getSomeSubstation();
        document.activeElement.blur();
    }
});

$("#search").on("input", function () {
    if ($("#search").val().length > 0) {
        $(".icon.icon-clear").show();
    } else {
        $(".icon.icon-clear").hide();
    }
});

$(".icon.icon-clear").click(function () {
    $("#search").val("");
    $(this).hide();
});

//时间快捷按钮
$(".buttons-row .button").click(function () {
    $(this)
        .addClass("active")
        .siblings()
        .removeClass("active");
});
$("#today").click(function () {
    var myDate = new Date();
    var todayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart").val(todayVal);
    $("#dateEnd").val(todayVal);
});
$("#yestoday").click(function () {
    var myDate = new Date();
    myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
    var yestodayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart").val(yestodayVal);
    $("#dateEnd").val(yestodayVal);
});
$("#thisMonth").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart").val(firstDayVal);
    $("#dateEnd").val(lastDayVal);
});
$("#lastMonth").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart").val(firstDayVal);
    $("#dateEnd").val(lastDayVal);
});

Date.prototype.format = function (fmt) {
    //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
};

$("#dateStart,#dateEnd").click(function () {
    $(".buttons-row")
        .find($(".active"))
        .removeClass("active");
});

//解决键盘遮挡问题
var h = $(window).height();
window.addEventListener("resize", function () {
    if ($(window).height() < h) {
        $(".btnBar").hide();
    }
    if ($(window).height() >= h) {
        $(".btnBar").show();
    }
    if (
        document.activeElement.tagName == "INPUT" ||
        document.activeElement.tagName == "TEXTAREA"
    ) {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

//Substation.getDataByAjax("/getfCircuitidsList",{fSubid:10100001},function(data){
//    if(data!=null&&data!=undefined){
//        var showlist = $("<ul></ul>");
//        showAll(data,showlist);
//        $(".media-list").html(showlist);
//        addClick();
//    }
//});
//
//function showAll(treeList,parent){
//    $(treeList).each(function(index,obj){
//        if(obj.hasOwnProperty("nodes")&&obj.nodes.length>0){
//            var li = $("<li id=\""+obj.id+"\" data-parentId=\""+obj.fParentid+"\"></li>");
//            $(li).append("                                            <label class=\"label-checkbox item-content\">\n" +
//                      "                                                <input type=\"checkbox\" name=\"checkbox\" value=\""+obj.id+"\">\n" +
//                      "                                                <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
//                      "                                                <div class=\"item-inner\">\n" +
//                      "                                                    <div class=\"item-title-row\">\n" +
//                      "                                                        <div class=\"item-title\">"+obj.text+"</div>\n" +
//                      "                                                    </div>\n" +
//                      "                                                </div>\n" +
//                      "                                            </label>\n").append("<ul></ul>").appendTo(parent);
//            showAll(obj.nodes,$(li).children().eq(1));
//        }else{
//            $("<li id=\""+obj.id+"\" data-parentId=\""+obj.fParentid+"\"></li>").append(
//                        "                                            <label class=\"label-checkbox item-content\">\n" +
//                        "                                                <input type=\"checkbox\" name=\"checkbox\" value=\""+obj.id+"\">\n" +
//                        "                                                <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
//                        "                                                <div class=\"item-inner\">\n" +
//                        "                                                    <div class=\"item-title-row\">\n" +
//                        "                                                        <div class=\"item-title\">"+obj.text+"</div>\n" +
//                        "                                                    </div>\n" +
//                        "                                                </div>\n" +
//                        "                                            </label>\n").appendTo(parent);
//        }
//    });
//}
//
//function addClick(){
//    $(".media-list input[name='checkbox']").change(function(){
//        var thisValue = $(this).prop("checked");
//        var thisVal = $(this).val();
//        if(thisValue==true){
//            $(this).parents("li").each(function(index,obj){
//                $($(obj).find('input[name="checkbox"]')[0]).prop("checked",true);
//            });
//            $(this).parent().parent().find("input[name='checkbox']").each(function(index,obj){
//                $(obj).prop("checked",true)
//            });
//        }else{
///*            $(this).parents("li").each(function(index,obj){
//                if($(obj).find($("input[name='checkbox']:checked").val()!="").length==0){
//                    $($(obj).find('input[name="checkbox"]')[0]).prop("checked",false);
//                }
//            });*/
//            $(this).parent().parent().find("input[name='checkbox']").each(function(index,obj){
//                $(obj).prop("checked",false)
//            });
//            var parentLi = $("#"+thisVal).parent().parent("li");
//            while(parentLi){
//                if(parentLi.find("input[name='checkbox']:checked").length==1){
//                    $(parentLi.find("input[name='checkbox']")[0]).prop("checked",false);
//                    parentLi = parentLi.parent().parent("li");
//                }else{
//                    break;
//                }
//            }
//        }
//    });
//}

$.init();