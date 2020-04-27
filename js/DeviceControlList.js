jQuery(document).ready(function () {
    var menuId = "2536";
    //添加右上角事件
    var subObj = JSON.parse(localStorage.getItem("subObj"));
    try {
        if (isIOS) {
            window.webkit.messageHandlers.iOS.postMessage(null);
            var storage = localStorage.getItem("accessToken");
            storage = JSON.parse(storage);
            menuId = storage.fmenuId;
        } else if (isAndroid) {
            menuId = android.getMenuId();
        }
    } catch (e) {}
    try {
        if (isAndroid) {
            subObj = JSON.parse(android.getSpItem("subObj"));
        }
    } catch (e) {}
    var selectSubid = "";
    var clickSubid = "";
    var clickName = "";
    loadMenu();
    getSomeSubstation(1);
    if (subObj != null && subObj != undefined) {
        selectSubid = subObj.subId;
        $("#search").val(subObj.subName);
        $("#subName").text(subObj.subName);
        $(".item-content[data-id=" + subObj.subId + "]")
            .addClass("select")
            .siblings()
            .removeClass("select");
    }
    $("#outTip").click(function () {
        $("#outTip").hide();
    });
    $("#searchBtn").click(function () {
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
        loadMenu();
    });

    $("#listContainer").hide();

    function loadMenu() {
        if (!selectSubid) {
            return;
        }
        if (!menuId || menuId == undefined) {
            toast(Operation['ui_noDeviceList']);
            return;
        }

        Substation.getDataByAjax(
            "/getSubinfoVoByPid", {
                pid: menuId
            },
            function (data) {
                if (data.hasOwnProperty("menuList") && data.menuList.length > 0) {
                    $(".content-list").empty();
                    $(data.menuList).each(function () {
                        var sb =
                            ' <label class="list-item label-checkbox light_opening" id="' +
                            this.fCode +
                            '">';
                        sb += '                            <div class="img_text">';
                        if (this.fCode == "lightingControl") {
                            sb +=
                                '                                <img class="imgBox" src="img/lightsort.png">';
                        } else {
                            sb +=
                                '                                <img class="imgBox" src="img/yibiaosort.png">';
                        }
                        sb += "                            </div>";
                        sb += '                            <div class="row">';
                        sb +=
                            '                                <span class="label-title col-100">' +
                            this.fMenuname +
                            "</span>";
                        sb += "                            </div>";
                        sb += "                        </label>";
                        $(".content-list").append(sb);

                        //声明一个控制点击的变量
                        var upLoadClicktag = true;
                        $(".label-checkbox").unbind().click(function () {
                            if (!upLoadClicktag) {
                                return;
                            }
                            upLoadClicktag = false;
                            setTimeout(function () {
                                upLoadClicktag = true;
                            }, 1000);
                            var clickId = $(this).attr("id");
                            if (!selectSubid || selectSubid == "" || selectSubid == undefined) {
                                return;
                            } else {
                                var thisTitleName = $($("#"+clickId).find(".label-title")[0]).text();
                                if (clickId == "lightingControl") {
                                    localStorage.setItem("controlClassTitle",thisTitleName);
                                    window.location.href = "lightingControl.html?fSubid=" + selectSubid;
                                } else {
                                    localStorage.setItem("controlClassTitle",thisTitleName);
                                    window.location.href = "arcm300TControl.html?fSubid=" + selectSubid;
                                }
                            }
                        });

                    });
                }
            }
        );
    }

    function getSomeSubstation(isAll) {
        var url = "/getSubListByLetter";
        if (isAll == 1) {
            url = "/getSubstationListByUser";
        }
        var listObj = [];
        var searchKey = $("#search").val();
        var params = {
            key: searchKey
        };
        $("#listContainer").empty();
        Substation.getDataByAjaxNoLoading(url, params, function (data) {
            if (isAll == 1) {
                listObj = data.list;
            } else {
                listObj = data;
            }
            $(listObj).each(function () {
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
                    clickName = $(this)
                        .find(".item-title")
                        .text();
                    $("#search").val(clickName);
                    $(this)
                        .addClass("select")
                        .siblings()
                        .removeClass("select");
                    $("#listContainer").hide();
                    $("#listContainer").empty();
                    //            $("#subName").text(clickName);
                });
        },function(errorcode){});
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

    $("#search").on("focus", function () {
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
        $.toast(Operation["ui_subSelectTip"]);
    } else {
        $("#searchBtn").click();
        $("#outTip").hide();
    }

//    $("#lightControl").click(function () {
//        var clickTitle = $(this).find(".label-title")[0].text();
//        window.location.href = "lightingControl.html";
//    });
//
//    $("#arcm300TControl").click(function () {
//        var clickTitle = $(this).find(".label-title")[0].text();
//        window.location.href = "arcm300TControl.html";
//    });
});