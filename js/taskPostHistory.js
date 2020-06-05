var loading = false;
var itemsPerLoad = 10;
var pageNum = 1;

function getFirstPage() {
    $("#list-container").empty();
    pageNum = 1;
    addItems(itemsPerLoad);
    $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
    loading = false;
    $.attachInfiniteScroll($('.infinite-scroll'));
}

$(document).on('refresh', '.pull-to-refresh-content', function (e) {
    setTimeout(function () {
        getFirstPage();
        // done
        $.pullToRefreshDone('.pull-to-refresh-content');
    }, 2000);
});

function addItems(number) {
    var html = '';
    var url = "/getTaskListCreatedByMe";
    var searchKey = $("#searchDaiban").val();
    var fCreatest = $("#dateStart").val();
    var fCreateet = $("#dateEnd").val();
    var fPlanst = $("#dateStart1").val();
    var fPlanet = $("#dateEnd1").val();
    var fDeadlinest = $("#dateStart2").val();
    var fDeadlineet = $("#dateEnd2").val();
    var fTasktypeid = $("#taskType").val();
    var chargername = $("#chargeSelect").val();
    var executername = $("#doSelect").val();
    var orderby = $("#timeRank").val();
    var params = {
        pageNo: pageNum,
        pageSize: number,
    };
    if(searchKey!="" && searchKey!=null){
      params['searchKey'] = searchKey;
    }
    if(fCreatest!="" && fCreatest!=null){
      params['fCreatest'] = fCreatest+" 00:00:00";
    }
    if(fCreateet!="" && fCreateet!=null){
      params['fCreateet'] = fCreateet+" 23:59:59";
    }
    if(fPlanst!="" && fPlanst!=null){
      params['fPlanst'] = fPlanst+" 00:00:00";
    }
    if(fPlanet!="" && fPlanet!=null){
      params['fPlanet'] = fPlanet+" 23:59:59";
    }
    if(fDeadlinest!="" && fDeadlinest!=null){
      params['fDeadlinest'] = fDeadlinest+" 00:00:00";
    }
    if(fDeadlineet!="" && fDeadlineet!=null){
      params['fDeadlineet'] = fDeadlineet+" 23:59:59";
    }
    if(fTasktypeid!="" && fTasktypeid!=null){
      params['fTasktypeid'] = fTasktypeid;
    }
    if(chargername!="" && chargername!=null){
      params['chargername'] = chargername;
    }
    if(executername!="" && executername!=null){
      params['executername'] = executername;
    }
    if(orderby!="" && orderby!=null){
      params['orderby'] = orderby;
    }
    Substation.postDataByAjaxNoLoading(url, params, function (data) {
        if (data.pageInfo.list.length > 0) {
            if (pageNum == 1) {
                $("#list-container").empty();
            }
            $(data.pageInfo.list).each(function () {
                var imgSrc = "";
                if (this.fTasktypeid == 2) {
                  //现场
                   imgSrc = "img/missionxian.png";
                } else if (this.fTasktypeid == 3) {
                  //缺陷
                   imgSrc = "img/missionque.png";
                } else if (this.fTasktypeid == 5) {
                  //消警
                   imgSrc = "img/missionjing.png";
                } else if (this.fTasktypeid == 1){
                  //巡检
                   imgSrc = "img/missionxun.png";
                } else if (this.fTasktypeid == 6){
                  //抢修
                   imgSrc = "img/missionxiu.png";
                }
                html += `<div class="card" onclick="goToDetail('${this.fTaskid}')">
                             <div class="item-content item-link">
                                 <div class="item-inner row no-gutter">
                                     <div class="col-15">
                                        <img class="showImg" src="${imgSrc}" />
                                     </div>
                                     <div class="col-85">
                                         <p class="subName limit-length">${this.fSubName}</p>
                                         <p>任务单号：${this.fTasknumber}</p>
                                         <p>发布时间：${this.fTaskcreatedate}</p>
                                     </div>
                                 </div>
                             </div>
                         </div>`;
            });
            $('#list-container').append(html);
            pageNum++;
        }else {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
            return;
        }
        if (data.pageInfo.list.length < itemsPerLoad) {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
            return;
        }
    });
}

function goToDetail(taskId){
    localStorage.setItem("taskID", taskId);
    if (isAndroid) {
      android.goToIn();
    } else {
      window.location.href = "missionDetail.html";
    }
}

$(document).on('infinite', '.infinite-scroll', function () {
    // 如果正在加载，则退出
    if (loading) return;

    // 设置flag
    loading = true;

    setTimeout(function () {
        loading = false;
        addItems(itemsPerLoad);
    }, 1000);
});

getFirstPage();

$("#dateStart").calendar();
$("#dateEnd").calendar();
$("#dateStart1").calendar();
$("#dateEnd1").calendar();
$("#dateStart2").calendar();
$("#dateEnd2").calendar();

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

$("#today1").click(function () {
    var myDate = new Date();
    var todayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart1").val(todayVal);
    $("#dateEnd1").val(todayVal);
});
$("#yestoday1").click(function () {
    var myDate = new Date();
    myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
    var yestodayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart1").val(yestodayVal);
    $("#dateEnd1").val(yestodayVal);
});
$("#thisMonth1").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart1").val(firstDayVal);
    $("#dateEnd1").val(lastDayVal);
});
$("#lastMonth1").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart1").val(firstDayVal);
    $("#dateEnd1").val(lastDayVal);
});

$("#today2").click(function () {
    var myDate = new Date();
    var todayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart2").val(todayVal);
    $("#dateEnd2").val(todayVal);
});
$("#yestoday2").click(function () {
    var myDate = new Date();
    myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
    var yestodayVal = myDate.format("yyyy-MM-dd");
    $("#dateStart2").val(yestodayVal);
    $("#dateEnd2").val(yestodayVal);
});
$("#thisMonth2").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart2").val(firstDayVal);
    $("#dateEnd2").val(lastDayVal);
});
$("#lastMonth2").click(function () {
    var myDate = new Date();
    var firstDay = new Date(myDate.getFullYear(), myDate.getMonth() - 1, 1);
    var lastDay = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
    var firstDayVal = firstDay.format("yyyy-MM-dd");
    var lastDayVal = lastDay.format("yyyy-MM-dd");
    $("#dateStart2").val(firstDayVal);
    $("#dateEnd2").val(lastDayVal);
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

$.init();