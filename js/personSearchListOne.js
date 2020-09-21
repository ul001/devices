var stateVal = localStorage.getItem("SearchVal");

$("#fState").val(stateVal);

var videoUrl;

function getData(val, searchKey) {
    if (val == 1) {
        //搜人
        Substation.getDataByAjax(
            "/getUserLocationList", {
                search: searchKey
            },
            function (data) {
                if (data == undefined) {
                    $("#noDataDiv").show();
                    return;
                }
                if (data != undefined) {
                    $(".list-container").empty();
                    if (data.length > 0) {
                        var html = "";
                        data.forEach(function (value, index) {
                            var address = (value.F_Address != 'null') ? value.F_Address : "未知";
                            $(".list-container").append("<li class=\"item-content item-link update-li\" data-str='" + JSON.stringify(value) + "'>\n" +
                                "                        <div class=\"item-inner\">\n" +
                                "                            <div class=\"item-title-row\">\n" +
                                "                                <div class=\"item-title\">" + value.F_UserName + "</div>\n" +
                                "                            </div>\n" +
                                "                            <div class=\"item-subtitle\">" + address + "</div>\n" +
                                "                        </div>\n" +
                                "                    </li>");
                        });
                        addClick();
                    } else {
                        $("#noDataDiv").show();
                    }
                    // $("#list-container").html(html);
                }
            }
        );
    } else if (val == 2) {
        //搜车
        Substation.postDataByAjax("/getCarLocationList", {
            search: searchKey
        }, function (data) {
            if (data == undefined) {
                $("#noDataDiv").show();
                return;
            }
            if (data != undefined) {
                $(".list-container").empty();
                if (data.data.length > 0) {
                    var html = "";
                    data.data.forEach(function (value, index) {
                        $(".list-container").append("<li class=\"item-content item-link update-li\" data-str='" + JSON.stringify(value) + "'>\n" +
                            "                        <div class=\"item-inner\">\n" +
                            "                            <div class=\"item-title-row\">\n" +
                            "                                <div class=\"item-title\">" + value.carInfo.fCarname + "</div>\n" +
                            "                            </div>\n" +
                            "                            <div class=\"item-subtitle\">" + value.carInfo.fCarlicense + "</div>\n" +
                            "                        </div>\n" +
                            "                    </li>");

                    });
                    addClick();
                } else {
                    $("#noDataDiv").show();
                }
                // $("#list-container").html(html);
            }
        });
    } else {
        //搜变电所
        Substation.getDataByAjax(
            "/getSubstationListByUser?pageNo=1&pageSize=999", {
                search: searchKey
            },
            function (data) {
                if (data == undefined) {
                    $("#noDataDiv").show();
                    return;
                }
                if (data != undefined) {
                    $(".list-container").empty();
                    if (data.list.length > 0) {
                        var html = "";
                        data.list.forEach(function (value, index) {
                            var address = (value.fAddress != 'null') ? value.fAddress : "未知";
                            $(".list-container").append("<li class=\"item-content item-link update-li\" data-str='" + JSON.stringify(value) + "'>\n" +
                                "                        <div class=\"item-inner\">\n" +
                                "                            <div class=\"item-title-row\">\n" +
                                "                                <div class=\"item-title\">" + value.fSubname + "</div>\n" +
                                "                            </div>\n" +
                                "                            <div class=\"item-subtitle\">" + address + "</div>\n" +
                                "                        </div>\n" +
                                "                    </li>");
                        });
                        addClick();
                    } else {
                        $("#noDataDiv").show();
                    }
                    // $("#list-container").html(html);
                }
            }
        );
    }
}

function addClick() {
    $(".item-link.update-li").click(function () {
        var thisLog = $(this).attr("data-str");
        localStorage.setItem("updateLog", thisLog);
        var stateVal = $("#fState").val();
        if (isAndroid) {
            android.goToIn(
                "personSearchLocationOne.html?fState=" + stateVal
            );
        } else {
            window.location.href =
                "personSearchLocationOne.html?fState=" + stateVal;
        }
    });
}

if (stateVal == 1) {
    getData(1);
} else if (stateVal == 2) {
    getData(2);
} else {
    getData(3);
}

$("#fState").change(function (params) {
    var stateVal = $("#fState").val();
    if (stateVal == 2) {
        $("#search").attr("placeholder", "输入车辆简称或者车牌号...");
    } else if (stateVal == 3) {
        $("#search").attr("placeholder", "输入站点名称...");
    } else {
        $("#search").attr("placeholder", "输入人员姓名...");
    }
    getData(stateVal);
});

//搜索按钮点击
$("#search").bind("keydown", function (event) {
    if (event.keyCode == 13) {
        var searchKey = $("#search").val();
        var stateVal = $("#fState").val();
        getData(stateVal, searchKey);
    }
});

$(".back_btn").click(function () {
    if (isIOS) {
        window.history.back();
    } else if (isAndroid) {
        android.goBack();
    }
});

$.init();