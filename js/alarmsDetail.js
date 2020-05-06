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

function getFirstPage() {
  $(".list-container").empty();
  pageNum = 1;
  addItems(itemsPerLoad, 0);
  lastIndex = 10;
  $(".infinite-scroll-preloader").html('<div class="preloader"></div>');
  loading = false;
  $.attachInfiniteScroll($(".infinite-scroll"));
}

$(document).on("refresh", ".pull-to-refresh-content", function(e) {
  setTimeout(function() {
    getFirstPage();
    // done
    $.pullToRefreshDone(".pull-to-refresh-content");
  }, 2000);
});

function addItems(number, lastIndex) {
  var html = "";
  var url = "";
  if (clickID == "bianwei") {
    url = "/getWarningMessageSignalEvents";
    //$(".title").html("遥信变位报警");
  } else if (clickID == "yuexian") {
    url = "/getWarningMessageOverLimitEvents";
    //$(".title").html("遥测越限报警");
  } else if (clickID == "platform") {
    url = "/getWarningMessagePlatformRunEvents";
    //$(".title").html("平台运行报警");
  }
  // var searchKey = $("#search").val();
  var params = {
    pageNo: pageNum,
    pageSize: number
    // key: searchKey
  };
  Substation.getDataByAjaxNoLoading(
    url,
    params,
    function(data) {
      var datadic = data.WarningMessage;
      if (datadic.hasOwnProperty("list") && datadic.list.length > 0) {
        if (pageNum == 1) {
          $(".list-container").empty();
        }
        $(datadic.list).each(function() {
          html +=
            '<div class="card">\n' +
            '                    <div class="card-content">\n' +
            '                        <div class="content-padded">\n' +
            '                            <div class="row  no-gutter sub_card' +
            (this.fIsread == true ? "" : " unRead") +
            '">\n' +
            '                                <div class="col-75">\n' +
            '                                    <p class="subName"><i class="icon icon-subIcon"></i>' +
            this.fSubname +
            "</p>\n" +
            "                                    <P>" +
            Operation["ui_MeterName"] +
            (clickID == "platform" ? this.fDevicename : this.fMetername) +
            "</P>\n" +
            "                                    <p>" +
            Operation["ui_EventType"] +
            this.fAlarmtype +
            "</p>\n" +
            "                                </div>\n" +
            '                                <div class="col-25">\n' +
            '                                    <p><i class="icon icon-alarm"></i></p>\n' +
            '                                    <p><span class="cardtime">' +
            this.fStarttime +
            "</span></p>" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>";
          //                html += "<div class=\"card\">\n" +
          //                    "                    <div class=\"card-content\">\n" +
          //                    "                        <div class=\"content-padded\">\n" +
          //                    "                            <div class=\"row  no-gutter sub_card" + (this.fIsread == true ? "" : " unRead") + "\">\n" +
          //                    "                                <div class=\"col-80\">\n" +
          //                    "                                    <p class=\"subName\"><i class=\"icon icon-subIcon\"></i>" + this.fSubname + "</p>\n" +
          ////                    "                                   <div class=\"row no-gutter icon_center\">\n" +
          ////                    "                                   <div class=\"col-15\"><i class=\"icon icon-alarm\"></i></div>\n" +
          ////                    "                                   <div class=\"col-85\">\n" +
          //                    "                                    <P>仪表名称：" + (clickID == "platform" ? (this.fDevicename) : (this.fMetername)) + "</P>\n" +
          //                    "                                    <p>事件类型：" + this.fAlarmtype + "</p>\n" +
          //                    "                                    <p>报警时间：" + this.fStarttime + "</p>\n" +
          ////                    "                                   </div>\n" +
          ////                    "                                   </div>\n" +
          //                    "                                </div>\n" +
          //                    "                                <div class=\"col-20\">\n" +
          //                    "                                    <a href='#' class='bg-dark button' style='margin-bottom:.3rem;'>已读</a>\n" +
          //                    "                                    <a href='#' class='bg-dark button'>处理</a>\n" +
          //                    "                                </div>\n" +
          //                    "                            </div>\n" +
          //                    "                        </div>\n" +
          //                    "                    </div>\n" +
          //                    "                </div>";
        });
        $(".list-container").append(html);
        //addClick();
        Substation.getDataByAjaxNoLoading("/close");
        pageNum++;
      } else {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html(
          "<span class='bottomTip'>--" +
            Operation["ui_nomoredata"] +
            "--</span>"
        );
        return;
      }
      if (datadic.list.length < itemsPerLoad) {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html(
          "<span class='bottomTip'>--" +
            Operation["ui_nomoredata"] +
            "--</span>"
        );
        return;
      }
    },
    function(errorCode) {
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

var lastIndex = 10;

$(document).on("infinite", ".infinite-scroll", function() {
  // 如果正在加载，则退出
  if (loading) return;

  // 设置flag
  loading = true;

  setTimeout(function() {
    loading = false;

    if (lastIndex >= maxItems) {
      $.detachInfiniteScroll($(".infinite-scroll"));
      $(".infinite-scroll-preloader").html(
        "<span class='bottomTip'>--" + Operation["ui_nomoredata"] + "--</span>"
      );
      return;
    }

    addItems(itemsPerLoad, lastIndex);
    lastIndex = $(".list-container .card").length;
  }, 1000);
});

$(".back_btn").click(function() {
  if (isAndroid) {
    android.goBack();
  } else if (isIOS) {
    window.history.back();
    window.webkit.messageHandlers.needHiddenTabbar.postMessage("NO");
  } else {
    window.history.back();
  }
});

/*$('#searchBtn').click(function () {
    $(".close-panel").click();
    */
/*    if(saveParam!=null){
            clickSubid = saveParam['fSubid'];
            saveParam=null;
        }*/
/*
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
    }
    $("#listContainer").empty();
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
        $(data).each(function () {
            $("#listContainer").append('<li class="item-content" data-id="' + this.fSubid + '">' +
                '<div class="item-inner">' +
                '<div class="item-title">' + this.fSubname + '</div>' +
                '</div>' +
                '</li>');
        });
        $("#listContainer").show();
        $("#listContainer .item-content").unbind().click(function () {
            clickSubid = $(this).attr("data-id");
            var clickName = $(this).find(".item-title").text();
            $("#search").val(clickName);
            $("#listContainer").empty();
            $("#listContainer").hide();
            //            $("#subName").text(clickName);
        });
    });
}

$('#search').bind('keydown', function (event) {
    if (event.keyCode == 13) {
        getSomeSubstation();
        document.activeElement.blur();
    }
});

$('#search').on("input", function () {
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
    $(this).addClass("active").siblings().removeClass("active");
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

Date.prototype.format = function (fmt) { //author: meizz
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

$("#dateStart,#dateEnd").click(function () {
    $(".buttons-row").find($(".active")).removeClass("active");
});

//解决键盘遮挡问题
var h = $(window).height();
window.addEventListener("resize", function () {
    if ($(window).height() < h) {
        $('.btnBar').hide();
    }
    if ($(window).height() >= h) {
        $('.btnBar').show();
    }
    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});*/

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
