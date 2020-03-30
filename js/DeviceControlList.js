jQuery(document).ready(function () {


    //添加右上角事件
    var subObj = JSON.parse(localStorage.getItem("subObj"));
    try {
        if (isAndroid) {
            subObj = JSON.parse(android.getSpItem("subObj"));
        }
    } catch (e) {}
    var selectSubid = "";
    var clickSubid = "";
    var clickName = "";
    getSomeSubstation(1);
    if (subObj != null && subObj != undefined) {
        selectSubid = subObj.subId;
        $("#search").val(subObj.subName);
        $(".item-content[data-id=" + subObj.subId + "]").addClass("select").siblings().removeClass("select");
    }
    $("#outTip").click(function () {
        $("#outTip").hide();
    });
    $('#searchBtn').click(function () {
        /*    if(saveParam!=null){
                clickSubid = saveParam['fSubid'];
                saveParam=null;
            }*/
        var start = new Date($("#dateStart").val().replace(/-/g, '/'));
        var end = new Date($("#dateEnd").val().replace(/-/g, '/'));
        if (start > end) {
            $.toast(Operation['ui_dateselecttip']);
            return;
        }
        $(".close-panel").click();
        if ($("#search").val() == "") {
            //        $("#subName").text("所有变电所");
            selectSubid = "";
        } else if (clickSubid != "") {
            //        $("#subName").text($("#search").val());
            selectSubid = clickSubid;
            var subObj = {
                subId: clickSubid,
                subName: clickName
            };
            localStorage.setItem("subObj", JSON.stringify(subObj));
            try {
                if (isAndroid) {
                    android.setSpItem("subObj", JSON.stringify(ubObj));
                }
            } catch (e) {}
            clickSubid = "";
        }
        $("#outTip").hide();
        $(".content").scrollTop(0);
        //        getFirstPage();
        customReport.getData(
            "/main/getSubstationInfoReportByfSubId",
            //   "fSubids=" +
            //     checkedList.join(",") +
            //     "&startTime=" +
            //     $.cookie("newDate") +
            //     "&endTime=" +
            //     $.cookie("lastDate")
            // );
            "fSubids=" + selectSubid +
            "&startTime=" +
            $("#dateStart").val() +
            "&endTime=" +
            $("#dateEnd").val()
        );
    });

    $("#dateStart").calendar();
    $("#dateEnd").calendar();
    $("#listContainer").hide();

    function getSomeSubstation(isAll) {
        var url = "/getSubListByLetter";
        if (isAll == 1) {
            url = "/getSubstationListByUser";
        }
        var listObj = [];
        var searchKey = $("#search").val();
        var params = {
            key: searchKey
        }
        $("#listContainer").empty();
        Substation.getDataByAjaxNoLoading(url, params, function (data) {
            if (isAll == 1) {
                listObj = data.list;
            } else {
                listObj = data;
            }
            $(listObj).each(function () {
                $("#listContainer").append('<li class="item-content" data-id="' + this.fSubid + '">' +
                    '<div class="item-inner">' +
                    '<div class="item-title">' + this.fSubname + '</div>' +
                    '</div>' +
                    '</li>');
            });
            $("#listContainer").show();
            $("#listContainer .item-content").unbind().click(function () {
                clickSubid = $(this).attr("data-id");
                clickName = $(this).find(".item-title").text();
                $("#search").val(clickName);
                $(this).addClass("select").siblings().removeClass("select");
                $("#listContainer").hide();
                $("#listContainer").empty();
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

    $('#search').on("focus", function () {
        if ($("#search").val().length > 0) {
            $(".icon.icon-clear").show();
        } else {
            $(".icon.icon-clear").hide();
        }
    });

    /*    $('#search').blur(function(){
            $(".icon.icon-clear").hide();
        });*/

    $(".icon.icon-clear").click(function () {
        $("#search").val("");
        $(this).hide();
        getSomeSubstation(1);
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
    });

    $(".back_btn").click(function () {
        //        var u = navigator.userAgent,
        //            app = navigator.appVersion;
        //        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓系统
        //        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
        if (isIOS) {
            window.webkit.messageHandlers.goBackiOS.postMessage("");
        } else {
            android.goBack();
        }
    });

    $("#lastMonth").click();

    if (selectSubid == "" || $("#dateStart").val() == "" || $("#dateEnd").val() == "") {
        $(".pull-right").click();
        $.toast(Operation['ui_subSelectTip']);
    } else {
        $('#searchBtn').click();
        $("#outTip").hide();
    }
});