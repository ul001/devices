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
        $("#subName").text(subObj.subName);
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
//        var start = new Date($("#dateStart").val().replace(/-/g, '/'));
//        var end = new Date($("#dateEnd").val().replace(/-/g, '/'));
//        if (start > end) {
//            $.toast(Operation['ui_dateselecttip']);
//            return;
//        }
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
            $("#subName").text(clickName);
        }
        $("#outTip").hide();
        $(".content").scrollTop(0);
    });

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

//    $("#lastMonth").click();

    if (selectSubid == "") {
        $(".pull-right").click();
        $.toast(Operation['ui_subSelectTip']);
    } else {
        $('#searchBtn').click();
        $("#outTip").hide();
    }

    $("#lightControl").click(function(){
        window.location.href = "lightingControl.html";
    });

    $("#arcm300TControl").click(function(){
        window.location.href = "arcm300TControl.html";
    });
});