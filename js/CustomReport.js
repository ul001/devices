var CustomReport = (function () {
    function _customReport() {
        this.getData = function (url, parama, type) {
            if (type == "0") {
                initHtml();
            } else {
                getData(url, parama);
            }
        };
        //填充时间控件
        // this.initDateTimePicker = function() {
        //   if (
        //     $.cookie("newDate") == "null" ||
        //     $.cookie("newDate") == null ||
        //     $.cookie("newDate") == undefined
        //   ) {
        //     Substation.DOMOperator.lastMonthInitDate();
        //     var startDate = $("#startDateBox").val();
        //     var endDate = $("#endDateBox").val();
        //     $.cookie("newDate", startDate);
        //     $.cookie("lastDate", endDate);
        //   } else {
        //     Substation.DOMOperator.initDateTimePicker(
        //       new Date($.cookie("newDate")),
        //       $("#startDate"),
        //       $("#startDateBox")
        //     );
        //     Substation.DOMOperator.initDateTimePicker(
        //       new Date($.cookie("lastDate")),
        //       $("#endDate"),
        //       $("#endDateBox")
        //     );
        //   }
        // };

        function getData(url, params) {
            Substation.getDataByAjaxMain(url, params, function (data) {
                eachData(data);
            });
        }

        var leng;

        function eachData(data) {
            $("#CustomReport").html("");

            if ((data == null) | (data.length == 0)) {
                return;
            }

            leng = data.length;

            for (var i = 1; i <= leng; i++) {
                var string =
                    '<div class="report-p1 split list-group" style="page-break-before: always">' +
                    '<h5 class="list-group-title" style="display:none;">0</h5>'+
                    '<label class="R-advert">电力运维  我们是您的管家</label>' +
                    "<h1>用电分析报告</h1>" +
                    '<table class="message">' +
                    "<tr>" +
                    "<td>站点名称：</td>" +
                    '<td id="subName' +
                    i +
                    '"></td>' +
                    "</tr>" +
                    "<tr>" +
                    "<td>站点地址：</td>" +
                    '<td id="subAddress' +
                    i +
                    '"></td>' +
                    "</tr>" +
                    "<tr>" +
                    "<td>报告日期：</td>" +
                    '<td id="subDate' +
                    i +
                    '"></td>' +
                    "</tr>" +
                    "</table>" +
                    '<img src="img/report-bg-01.png" class="page1-bg" />' +
                    "</div>" +
                    '<div class="report-p2 list-group" style="page-break-before: always">' +
                    '<h5 class="list-group-title" style="display:none;">1</h5>'+
                    "<h3>1、变配电站概况</h3>" +
                    '<table class="table table-bordered substation">' +
                    "<tr>" +
                    "<td>站点名称</td>" +
                    '<td colspan="3" id="name' +
                    i +
                    '">-</td>' +
                    "</tr>" +
                    "<tr>" +
                    "<td>站点地址</td>" +
                    '<td colspan="3" id="address' +
                    i +
                    '">-</td>' +
                    "</tr>" +
                    "<tr>" +
                    "<td>总容量</td>" +
                    "<td>电压等级</td>" +
                    "<td>主变台数</td>" +
                    "<td>监测点数</td>" +
                    "</tr>" +
                    "<tr>" +
                    '<td id="fInstalledcapacity' +
                    i +
                    '">-</td>' +
                    '<td id="fVoltagestep' +
                    i +
                    '">-</td>' +
                    '<td id="fTransformernum' +
                    i +
                    '">-</td>' +
                    '<td id="meterCount' +
                    i +
                    '">-</td>' +
                    "</tr>" +
                    "</table>" +
                    "<h3>2、用电量分析</h3>" +
                    "<h4>2.1、日耗电量分析</h4>" +
                    '<p class="powerString" id="powerString' +
                    i +
                    '"></p>' +
                    '<div class="powerContain" id="powerContain' +
                    i +
                    '"></div>' +
                    '<img src="img/report-bg-02.png" class="page2-bg"/>' +
                    "</div>" +
                    '<div class="report-p4 list-group">' +
                    '<h5 class="list-group-title" style="display:none;">2.2</h5>'+
                    "<h4>2.2、线路能耗排名</h4>" +
                    '<div class="ranking" id="ranking' +
                    i +
                    '"></div>' +
                    '<p class="ranking-p"></p>' +
                    "<h3>3、变压器运行情况</h3>" +
                    '<div class="monitorTable" id="monitorTable' +
                    i +
                    '"></div>' +
                    '<img src="img/report-bg-02.png" class="page3-bg"/>' +
                    "</div>" +
                    '<div class="monitor" id="monitor' +
                    i +
                    '">' +
                    "</div>" +
                    '<div class="report-p3 list-group" id="showEvent' +
                    i +
                    '" style="page-break-before: always">' +
                    '<h5 class="list-group-title" style="display:none;">4</h5>'+
                    "<h3>4、事件统计</h3>" +
                    "<h4>4.1、遥测越限事件</h4>" +
                    '<p id="event' +
                    i +
                    '"></p>' +
                    '<div class="eventDiv" id="eventDiv' +
                    i +
                    '"></div>' +
                    '<h4 class="change" id="changeDiv' +
                    i +
                    '">4.2、遥信变位事件</h4>' +
                    '<p id="sigevent' +
                    i +
                    '"></p>' +
                    '<div id="sigeventTable' +
                    i +
                    '"></div>' +
                    '<img src="img/report-bg-02.png" class="page3-bg"/>' +
                    "</div>" +
                    '<div id="inspection' +
                    i +
                    '" class="print_img">' +
                    '<div class="report-p6 list-group" id="report6' +
                    i +
                    '">' +
                    '<h5 class="list-group-title" style="display:none;">5</h5>'+
                    '<h3 class="message">5、现场运维情况</h3>' +
                    '<p id="operation' +
                    i +
                    '"></p>' +
                    '<div id="live' +
                    i +
                    '"></div>' +
                    "</div>" +
                    "</div>" +
                    '<div id="inspectionHide' +
                    i +
                    '" style="display:none;" class="print_imgHide">' +
                    '<div class="report-p6" id="report6Hide' +
                    i +
                    '">' +
                    '<h3 class="message">5、现场运维情况</h3>' +
                    '<p id="operationHide' +
                    i +
                    '"></p>' +
                    '<div id="liveHide' +
                    i +
                    '"></div>' +
                    "</div>" +
                    "</div>";

                var newData = [];
                newData = data[i - 1];
                $("#CustomReport").append(
                    '<div class="containDiv list-block contacts-block" id="div' + i + '"></div>'
                );
                $("#div" + i).html(string);
                showData(newData.substation, i);
                showPowerChart(newData, i);
                showEventtable(newData, +i);
                showsigEventtable(newData, i);
                showMonitor(newData.transformerNameCodeVoList, i);
                if (newData.gongdianjuFlag === "true") {
                    showoperationS(newData.HttpGetData, i);
                } else {
                    showoperation(newData.SceneRunningReport, i);
                    showoperationHide(newData.SceneRunningReport, i);
                }
                $(".contacts-block").indexList();
            }
        }

        function initHtml() {
            var string =
                '<div class="report-p1 split list-group" style="page-break-before: always">' +
                '<h5 class="list-group-title" style="display:none;">0</h5>'+
                '<label class="R-advert">电力运维  我们是您的管家</label>' +
                "<h1>用电分析报告</h1>" +
                '<table class="message">' +
                "<tr>" +
                "<td>站点名称：</td>" +
                '<td id="subName"></td>' +
                "</tr>" +
                "<tr>" +
                "<td>站点地址：</td>" +
                '<td id="subAddress"></td>' +
                "</tr>" +
                "<tr>" +
                "<td>报告日期：</td>" +
                '<td id="subDate"></td>' +
                "</tr>" +
                "</table>" +
                '<img src="img/report-bg-01.png" class="page1-bg" />' +
                "</div>" +
                '<div class="report-p2 list-group" style="page-break-before: always">' +
                '<h5 class="list-group-title" style="display:none;">1</h5>'+
                "<h3>1、变配电站概况</h3>" +
                '<table class="table table-bordered substation">' +
                "<tr>" +
                "<td>站点名称</td>" +
                '<td colspan="3" id="name">-</td>' +
                "</tr>" +
                "<tr>" +
                "<td>站点地址</td>" +
                '<td colspan="3" id="address">-</td>' +
                "</tr>" +
                "<tr>" +
                "<td>总容量</td>" +
                "<td>电压等级</td>" +
                "<td>主变台数</td>" +
                "<td>监测点数</td>" +
                "</tr>" +
                "<tr>" +
                '<td id="fInstalledcapacity">-</td>' +
                '<td id="fVoltagestep">-</td>' +
                '<td id="fTransformernum">-</td>' +
                '<td id="meterCount">-</td>' +
                "</tr>" +
                "</table>" +
                "<h3>2、用电量分析</h3>" +
                "<h4>2.1、日耗电量分析</h4>" +
                '<p class="powerString" id="powerString"></p>' +
                '<div class="powerContain" id="powerContain"></div>' +
                '<img src="img/report-bg-02.png" class="page2-bg"/>' +
                "</div>" +
                '<div class="report-p4 list-group">' +
                '<h5 class="list-group-title" style="display:none;">2.2</h5>'+
                "<h4>2.2、线路能耗排名</h4>" +
                '<div class="ranking" id="ranking"></div>' +
                '<p class="ranking-p"></p>' +
                "<h3>3、变压器运行情况</h3>" +
                '<div class="monitorTable" id="monitorTable"></div>' +
                '<img src="img/report-bg-02.png" class="page3-bg"/>' +
                "</div>" +
                '<div class="monitor list-group" id="monitor">' +
                '<h5 class="list-group-title" style="display:none;">3.1</h5>'+
                '<div class="report-p5">' +
                "<h4>3.1、日负荷曲线</h4>" +
                '<div class="daycurve"></div>' +
                '<p id="pDiv">本监测周期内，最大负荷XXX，发生于XX时间，最小负荷XXkW,发生于XXX，平均功率XXX;</p>' +
                '<h4 class="daycurve-h4">3.2、日功率因数曲线</h4>' +
                '<div class="daycurve2"></div>' +
                '<p id="pfDiv"></p>' +
                '<img src="img/report-bg-02.png" class="page3-bg"/>' +
                "</div>" +
                "</div>" +
                '<div class="report-p3 list-group" style="page-break-before: always">' +
                '<h5 class="list-group-title" style="display:none;">4</h5>'+
                "<h3>4、事件统计</h3>" +
                "<h4>4.1、遥测越限事件</h4>" +
                '<p id="event"></p>' +
                '<div class="eventDiv" id="eventDiv">' +
                '<div class="daycurve"></div>' +
                "</div>" +
                '<h4 class="change" id="change">4.2、遥信变位事件</h4>' +
                '<p id="sigevent"></p>' +
                '<div id="sigeventTable">' +
                '<div class="daycurve"></div>' +
                "</div>" +
                '<img src="img/report-bg-02.png" class="page3-bg"/>' +
                "</div>" +
                '<div class="report-p6 list-group" style="page-break-before: always">' +
                '<h5 class="list-group-title" style="display:none;">5</h5>'+
                '<h3 class="message">5、现场运维情况</h3>' +
                '<div class="daycurve"></div>' +
                // '<img src="img/report-bg-02.png" class="page3-bg"/>' +
                "</div>";

            $("#CustomReport").append('<div class="containDiv list-block contacts-block" id="div"></div>');
            $("#div").append(string);
        }

        //显示封面基础信息
        function showData(data, num) {
            if (data == null || data == undefined) {
                return;
            }
            $("#subName" + num).html(data.fSubname);
            $("#subAddress" + num).html(data.fAddress);
            $("#subDate" + num).html(
                $("#dateStart").val() + "至" + $("#dateEnd").val()
            );
            $("#name" + num).html(data.fSubname);
            $("#address" + num).html(data.fAddress);
            $("#fInstalledcapacity" + num).html(data.fInstalledcapacity + "kVA");
            $("#fVoltagestep" + num).html(data.fVoltagestep + "kV");
            $("#fTransformernum" + num).html(data.fTransformernum + "台");
            $("#meterCount" + num).html(data.meterCount + "个");
        }

        //用电量分析
        function showPowerChart(data, num) {
            var time = [];
            var dayData = [];
            var powerstring = "";
            $.each(data.energyDayResultVoList, function (key, val) {
                var row1 = {};
                var row2 = {};
                row1 = val.f_Date;
                row2 = parseInt(val.f_DayValue);
                time.push(row1.substring(5, 10));
                dayData.push(row2);
            });
            if (data.energyDayResultVoList.length != 0) {
                powerstring +=
                    "&nbsp;&nbsp;" +
                    "该变配电站监测周期内总耗电量" +
                    JSON.parse(data.totalEnergyDayResult).toFixed(1) +
                    "kW·h，" +
                    "日平均耗电量" +
                    JSON.parse(data.average).toFixed(1) +
                    "kW·h，单日最大耗电量" +
                    JSON.parse(data.maxEnergyValue).toFixed(1) +
                    "kW·h，日耗电情况详见下图：";
            } else {
                powerstring += "&nbsp;&nbsp;该配电站暂无耗电量数据。";
            }

            $("#powerString" + num).html(powerstring);
            var seriesA = [{
                name: "用电量",
                data: dayData,
                dataLabels: {
                    borderWidth: 0,
                    enabled: true
                }
            }];
            $("#powerContain" + num).html("");
            highCharts(
                "column",
                "日耗电量",
                false,
                time,
                "用电量 (kW·h)",
                seriesA,
                $("#powerContain" + num)
            );
            var xArr = [];
            var yArr = [];
            $.each(data.energyDayResultCircuitSums, function (key, val) {
                var row3 = {};
                var row4 = {};
                row3 = val.f_CircuitName;
                row4 = parseInt(val.sums);
                xArr.push(row3);
                yArr.push(row4);
            });
            var seriesB = [{
                name: "用电量",
                data: yArr,
                dataLabels: {
                    borderWidth: 0,
                    enabled: true
                }
            }];
            $("#ranking" + num).html("");
            highCharts(
                "column",
                "能耗排名前10的线路",
                false,
                xArr,
                "用电量 (kW·h)",
                seriesB,
                $("#ranking" + num)
            );
        }

        //变压器运行分析
        function showMonitor(data, num) {
            var length = data.length;
            var monitorString = "";
            for (var i = 1; i <= length; i++) {
                if (data[i - 1].hasOwnProperty("maxValue1")) {
                    monitorString +=
                        '<div class="report-p5 list-group" id="report' +
                        i +
                        '">' +
                        '<h5 class="list-group-title" style="display:none;">3.'+i+'</h5>'+
                        "<h4>3." +
                        i +
                        "、" +
                        data[i - 1].f_TransName +
                        "</h4>" +
                        "<h4>3." +
                        i +
                        ".1、日负荷分析</h4>";

                    monitorString +=
                        '<div class="daycurve" id="curve' +
                        num +
                        i +
                        '"></div>' +
                        '<p class="daycurve-p1">本监测周期内，最大负荷' +
                        JSON.parse(data[i - 1].maxValue1).toFixed(2) +
                        "kW，发生于" +
                        data[i - 1].maxValueTime.substring(0, 16) +
                        "，最小负荷" +
                        JSON.parse(data[i - 1].minValue).toFixed(2) +
                        "kW，" +
                        "发生于" +
                        data[i - 1].minValueTime.substring(0, 16) +
                        "，平均负荷" +
                        JSON.parse(data[i - 1].avgValue).toFixed(2) +
                        "kW。</p>";

                    monitorString +=
                        '<h4 class="daycurve-h4">3.' + i + ".2、日功率因数分析</h4>";

                    monitorString +=
                        '<div class="daycurve2" id="daycurve' +
                        num +
                        i +
                        '"></div>' +
                        '<p class="daycurve-p2">本监测周期内，最大功率因数' +
                        JSON.parse(data[i - 1].maxValue1_pf).toFixed(2) +
                        "，发生于" +
                        data[i - 1].maxValueTime_pf.substring(0, 16) +
                        "，最小功率因数" +
                        JSON.parse(data[i - 1].minValue_pf).toFixed(2) +
                        "，" +
                        "发生于" +
                        data[i - 1].minValueTime_pf.substring(0, 16) +
                        "，平均功率因数" +
                        JSON.parse(data[i - 1].avgValue_pf).toFixed(2) +
                        "。</p>";

                    monitorString +=
                        '<img src="img/report-bg-02.png" class="page3-bg"/>' +
                        "</div>";
                } else {
                    monitorString +=
                        '<div class="report-p5 list-group" id="report' +
                        i +
                        '">' +
                        '<h5 class="list-group-title" style="display:none;">3.'+i+'</h5>'+
                        "<h4>3." +
                        i +
                        "、" +
                        data[i - 1].f_TransName +
                        "</h4>" +
                        "<h4>3." +
                        i +
                        ".1、日负荷分析</h4>";

                    monitorString +=
                        '<div class="daycurve" id="curve' +
                        num +
                        i +
                        '"></div>' +
                        '<p class="daycurve-p1">本监测周期内暂无数据记录。</p>';

                    monitorString +=
                        '<h4 class="daycurve-h4">3.' + i + ".2、日功率因数分析</h4>";

                    monitorString +=
                        '<div class="daycurve2" id="daycurve' +
                        num +
                        i +
                        '"></div>' +
                        '<p class="daycurve-p2">本监测周期内暂无数据记录。</p>';

                    monitorString +=
                        '<img src="img/report-bg-02.png" class="page3-bg"/>' +
                        "</div>";
                }
            }
            $("#monitor" + num).html("");
            $("#monitor" + num).html(monitorString);
            var columns = [{
                    field: "f_TransName",
                    title: "变压器名称",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "maxValue1",
                    title: "最大负荷(kW)",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "minValue",
                    title: "最小负荷(kW)",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "avgValue",
                    title: "平均负荷(kW)",
                    valign: "middle",
                    align: "center"
                }
            ];
            var moniData = [];
            var monitime = [];
            var minp = [],
                maxp = [],
                minPf = [],
                maxPf = [];
            (avg = []), (avgpf = []);
            if (length == 0) {
                if (moniData != null) {
                    moniData = [];
                }
                for (var a = 0; a < 6; a++) {
                    var row1 = {};
                    row1.f_TransName = "-";
                    row1.maxValue1 = "-";
                    row1.minValue = "-";
                    row1.avgValue = "-";
                    moniData.push(row1);
                }
            } else {
                if (moniData != null) {
                    moniData = [];
                    monitime = [];
                }
                for (var j = 0; j < length; j++) {
                    var row = {};
                    row.f_TransName = data[j].f_TransName;
                    if (data[j].maxValue1 != undefined) {
                        row.maxValue1 = JSON.parse(data[j].maxValue1).toFixed(2);
                    } else {
                        row.maxValue1 = "-";
                    }
                    if (data[j].minValue != undefined) {
                        row.minValue = JSON.parse(data[j].minValue).toFixed(2);
                    } else {
                        row.minValue = "-";
                    }
                    if (data[j].avgValue != undefined) {
                        row.avgValue = JSON.parse(data[j].avgValue).toFixed(2);
                    } else {
                        row.avgValue = "-";
                    }
                    moniData.push(row);

                    var newData = data[j].transformerNameCodeDataVoList;
                    var newlength = newData.length;
                    if (minp != null) {
                        (minp = []), (maxp = []), (minPf = []), (maxPf = []);
                        (avg = []), (avgpf = []);
                    }
                    for (var k = 0; k < newlength; k++) {
                        var trow = {};
                        var minrow = {},
                            maxrow = {};
                        var minpf = {},
                            maxpf = {};
                        var avgrow = {},
                            avgpfrow = {};
                        trow = newData[k].times;
                        minrow = parseFloat(newData[k].min);
                        maxrow = parseFloat(newData[k].max);
                        avgrow = parseFloat(newData[k].avg);
                        minpf = parseFloat(newData[k].minpf);
                        maxpf = parseFloat(newData[k].maxpf);
                        avgpfrow = parseFloat(newData[k].avgpf);
                        monitime.push(trow.substring(5, 10));
                        minp.push(minrow);
                        maxp.push(maxrow);
                        minPf.push(minpf);
                        maxPf.push(maxpf);
                        avg.push(avgrow);
                        avgpf.push(avgpfrow);
                    }
                    var curveNum = j + 1;
                    var seriesC = [{
                            name: "最小负荷",
                            data: minp,
                            marker: {
                                enabled: false,
                                symbol: "square"
                            }
                        },
                        {
                            name: "最大负荷",
                            data: maxp,
                            marker: {
                                enabled: false,
                                symbol: "diamond"
                            }
                        },
                        {
                            name: "平均负荷",
                            data: avg,
                            marker: {
                                enabled: false,
                                symbol: "triangle"
                            }
                        }
                    ];

                    var seriesD = [{
                            name: "最小功率因数",
                            data: minPf,
                            marker: {
                                enabled: false,
                                symbol: "square"
                            }
                        },
                        {
                            name: "最大功率因数",
                            data: maxPf,
                            marker: {
                                enabled: false,
                                symbol: "diamond"
                            }
                        },
                        {
                            name: "平均功率因数",
                            data: avgpf,
                            marker: {
                                enabled: false,
                                symbol: "triangle"
                            }
                        }
                    ];

                    highCharts(
                        "line",
                        "",
                        true,
                        monitime,
                        "负荷 (kW)",
                        seriesC,
                        $("#curve" + num + curveNum)
                    );
                    highCharts(
                        "line",
                        "",
                        true,
                        monitime,
                        "功率因数",
                        seriesD,
                        $("#daycurve" + num + curveNum)
                    );
                }
                if (length < 6) {
                    for (var a = length; a < 6; a++) {
                        var row1 = {};
                        row1.f_TransName = "-";
                        row1.maxValue1 = "-";
                        row1.minValue = "-";
                        row1.avgValue = "-";
                        moniData.push(row1);
                    }
                }
            }

            $("#monitorTable" + num).html("");
            $("#monitorTable" + num).html(
                '<table id="monitorDiv' + num + '"></table>'
            );
            $("#monitorDiv" + num).bootstrapTable({
                data: moniData,
                columns: columns
            });
        }

        //highCharts
        function highCharts(
            type,
            titletxt,
            istrue,
            xAxisdata,
            yAxistxt,
            series,
            $select
        ) {
            var chart = {
                type: type
            };
            var title = {
                text: titletxt
            };
            var credits = {
                enabled: false
            };
            var legend = {
                enabled: istrue
            };
            var plotOption = {
                series: {
                    allowPotionSelect: true
                }
            };
            var xAxis = {
                categories: xAxisdata
            };
            var yAxis = {
                title: {
                    text: yAxistxt
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: "#808080"
                }]
            };

            var tooltip = {
                enabled: true,
                shared: true
            };
            var json = {};
            json.chart = chart;
            json.title = title;
            json.credits = credits;
            json.plotOption = plotOption;
            json.xAxis = xAxis;
            json.yAxis = yAxis;
            json.tooltip = tooltip;
            json.legend = legend;
            json.series = series;
            $select.html("");
            $select.highcharts(json);
        }

        //遥信事件、遥测事件
        function showEventtable(data, num) {
            var eventData = data.overLimitEventsList;
            var neweventData = [];
            var length = eventData.length;
            var eventstring = "";
            if (length <= 10) {
                eventstring +=
                    "&nbsp;&nbsp;&nbsp;&nbsp;" +
                    "本监测周期内经运维平台统计共发生" +
                    data.overlimitTimes +
                    "次遥测越限事件，统计数据如下：";
                neweventData = eventData;
            }
            if (length > 10) {
                eventstring +=
                    "&nbsp;&nbsp;&nbsp;&nbsp;" +
                    "本监测周期内经运维平台统计共发生" +
                    data.overlimitTimes +
                    "次遥测越限事件，为您显示发生次数排名前10的事件，统计数据如下：";
                eventData = eventData.sort(function (a, b) {
                    return b.countNum - a.countNum;
                });

                var obj = [];
                for (i = 0; i < 10; i++) {
                    obj.push(eventData[i]);
                }
                neweventData = obj;
            }
            $("#event" + num).html(eventstring);
            var columns = [{
                    field: "f_MeterName",
                    title: "监测点",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "f_AlarmType",
                    title: "类型",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "f_ParamName",
                    title: "参数",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "f_LimitValue",
                    title: "限值",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "countNum",
                    title: "次数",
                    valign: "middle",
                    align: "center"
                }
            ];
            $("#eventDiv" + num).html(
                '<table class="eventTable" id="eventTable' + num + '"></table>'
            );
            $("#eventTable" + num).bootstrapTable({
                data: neweventData,
                columns: columns
            });
        }

        function showsigEventtable(data, num) {
            var eventData = data.overLimitEventsList;
            var sigData = data.switchingTimesList;
            var lengthA = eventData.length;
            var length = sigData.length;
            var columns = [{
                    field: "f_MeterName",
                    title: "仪表名称",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "f_AlarmType",
                    title: "类型",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "f_ParamName",
                    title: "参数",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "valueType",
                    title: "值",
                    valign: "middle",
                    align: "center"
                },
                {
                    field: "groupCount",
                    title: "次数",
                    valign: "middle",
                    align: "center"
                }
            ];
            if (lengthA + length > 12) {
                $("#changeDiv" + num).remove();
                $("#sigevent" + num).remove();
                $("#sigeventTable" + num).remove();
                var addsigStr =
                    '<div class="report-p3 list-group" id="addshowEvent' +
                    num +
                    '" style="page-break-before: always">' +
                    '<h5 class="list-group-title" style="display:none;">4.2</h5>'+
                    '<h4 class="change" id="changeDiv' +
                    num +
                    '">4.2、遥信变位事件</h4>' +
                    '<p id="sigevent' +
                    num +
                    '"></p>' +
                    '<div id="sigeventTable' +
                    num +
                    '"></div>' +
                    '<img src="img/report-bg-02.png" class="page3-bg"/>' +
                    "</div>";
                $(addsigStr).insertAfter($("#showEvent" + num));
            }
            $("#sigeventTable" + num).html(
                '<table id="sigeveDiv' + num + '"></table>'
            );
            $("#sigeveDiv" + num).bootstrapTable({
                data: sigData,
                columns: columns
            });

            var sigeventstring =
                "&nbsp;&nbsp;&nbsp;&nbsp;" +
                "本监测周期内经运维平台统计共发生" +
                data.switchingTimes +
                "次遥信越限事件，统计数据如下：";
            $("#sigevent" + num).html(sigeventstring);
        }

        //现场运维情况
        function showoperation(data, num) {
            $("#inspection" + num)
                .children(".addDiv")
                .remove();

            if (data != null && data.tDevDeviceproblemList.length > 0) {
                var operationstring =
                    '<p class="messageContent">本周期内，该变配电站共完成巡检<span>' +
                    data.count +
                    "</span>次，巡检时间为：<span>" +
                    data.timeList.join("&nbsp") +
                    "</span>；巡检过程中发现如下缺陷：</p>";
                $("#operation" + num).html(operationstring);

                var itemlength = data.tDevDeviceproblemList.length;
                var parentNum = Math.ceil((itemlength - 2) / 3);

                var firstStr = "";
                for (var i = 0; i < 2; i++) {
                    var select = data.tDevDeviceproblemList[i];

                    if (select === undefined) {
                        continue;
                    }

                    var numList = i + 1;

                    var fDiscovertime,
                        fProblemlevel,
                        treePathName,
                        fProblemtype,
                        fDeviceproblemdes,
                        updataTime;
                    var fstate = "";
                    select.fDiscovertime === undefined ?
                        (fDiscovertime = "-") :
                        (fDiscovertime = select.fDiscovertime);
                    select.fProblemlevel === undefined ?
                        (fProblemlevel = "-") :
                        (fProblemlevel = select.fProblemlevel);
                    select.treePathName === undefined ?
                        (treePathName = "-") :
                        (treePathName = select.treePathName);

                    select.fProblemtype === undefined ?
                        (fProblemtype = "-") :
                        (fProblemtype = select.fProblemtype);
                    select.fDeviceproblemdes === undefined ?
                        (fDeviceproblemdes = "-") :
                        (fDeviceproblemdes = select.fDeviceproblemdes);
                    select.newestUpdate === undefined ?
                        (updataTime = "-") :
                        (updataTime = select.newestUpdate);

                    if (select.fState === "0") {
                        fstate = "未处理";
                    }
                    if (select.fState === "1") {
                        fstate = "已处理";
                    }

                    var imgstrun = "";
                    var imgstr = "";

                    if (select.beforeimg != undefined) {
                        $.each(select.beforeimg, function (key, value) {
                            imgstrun +=
                                '<img class="img lazy" src="' +
                                config.testConfig.ImagePath +
                                select.imgUrl +
                                "/" +
                                value.fDeviceproblemimgurl +
                                '">';
                        });
                    }
                    if (select.afterimg != undefined) {
                        $.each(select.afterimg, function (key, value) {
                            imgstr +=
                                '<img class="img lazy" src="' +
                                config.testConfig.ImagePath +
                                select.imgUrl +
                                "/" +
                                value.fDeviceproblemimgurl +
                                '">';
                        });
                    }

                    firstStr +=
                        '<div class="liveMessage">' +
                        '<div class="Num">' +
                        '<div class="NumList">' +
                        Substation.Common.addZero(numList) +
                        "</div>" +
                        "</div>" +
                        '<div class="ListMessageR">' +
                        '<div class="List2 ListTime">发现时间：<label>' +
                        fDiscovertime +
                        "</label></div>" +
                        '<div class="List2 ListTime">严重等级：<label>' +
                        fProblemlevel +
                        "</label></div>" +
                        '<div class="typeList">设备名称：<label>' +
                        treePathName +
                        "</label></div>" +
                        '<div class="typeList">缺陷类别：<label>' +
                        fProblemtype +
                        "</label></div>" +
                        '<div class="typeList typeListLast">缺陷描述：<label>' +
                        fDeviceproblemdes +
                        "</label></div>" +
                        '<div class="List2">缺陷状态：<label>' +
                        fstate +
                        "</label></div>" +
                        '<div class="List2">消缺时间：<label>' +
                        updataTime +
                        "</label></div>" +
                        '<div class="List2 imgHideDiv">缺陷图片：' +
                        '<div class="ListImg">' +
                        imgstrun +
                        "</div>" +
                        "</div>" +
                        '<div class="List2 imgHideDiv">整改图片：' +
                        '<div class="ListImg">' +
                        imgstr +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                }
                $("#live" + num).html("");
                $("#live" + num).html(firstStr);

                if (parentNum > 0) {
                    for (var k = 0; k < parentNum; k++) {
                        var Str = "";
                        for (var i = 0; i < 3; i++) {
                            var index = k * 3 + i + 2;

                            var select = data.tDevDeviceproblemList[index];

                            if (select === undefined) {
                                continue;
                            }

                            var numList = index + 1;

                            var fDiscovertime,
                                fProblemlevel,
                                treePathName,
                                fProblemtype,
                                fDeviceproblemdes,
                                updataTime;
                            var fstate = "";
                            select.fDiscovertime === undefined ?
                                (fDiscovertime = "-") :
                                (fDiscovertime = select.fDiscovertime);
                            select.fProblemlevel === undefined ?
                                (fProblemlevel = "-") :
                                (fProblemlevel = select.fProblemlevel);
                            select.treePathName === undefined ?
                                (treePathName = "-") :
                                (treePathName = select.treePathName);

                            select.fProblemtype === undefined ?
                                (fProblemtype = "-") :
                                (fProblemtype = select.fProblemtype);
                            select.fDeviceproblemdes === undefined ?
                                (fDeviceproblemdes = "-") :
                                (fDeviceproblemdes = select.fDeviceproblemdes);
                            select.newestUpdate === undefined ?
                                (updataTime = "-") :
                                (updataTime = select.newestUpdate);

                            if (select.fState === "0") {
                                fstate = "未处理";
                            }
                            if (select.fState === "1") {
                                fstate = "已处理";
                            }

                            var imgstrun2 = "";
                            var imgstr2 = "";

                            // 先加载缩略图，点击查看高清图
                            if (select.beforeimg != undefined) {
                                $.each(select.beforeimg, function (key, value) {
                                    var beforeimgurl_min =
                                        config.testConfig.ImagePath +
                                        select.imgUrl +
                                        "/" +
                                        value.fDeviceproblemimgmin;
                                    var beforeimgurl =
                                        config.testConfig.ImagePath +
                                        select.imgUrl +
                                        "/" +
                                        value.fDeviceproblemimgurl;
                                    imgstrun2 +=
                                        '<img class="img lazy" src="' +
                                        beforeimgurl_min +
                                        '" data-url="' +
                                        beforeimgurl +
                                        '">';
                                });
                            }
                            if (select.afterimg != undefined) {
                                $.each(select.afterimg, function (key, value) {
                                    var afterimgurl_min =
                                        config.testConfig.ImagePath +
                                        select.imgUrl +
                                        "/" +
                                        value.fDeviceproblemimgmin;
                                    var afterimgurl =
                                        config.testConfig.ImagePath +
                                        select.imgUrl +
                                        "/" +
                                        value.fDeviceproblemimgurl;
                                    imgstr2 +=
                                        '<img class="img lazy" src="' +
                                        afterimgurl_min +
                                        '" data-url="' +
                                        afterimgurl +
                                        '">';
                                });
                            }

                            Str +=
                                '<div class="liveMessage">' +
                                '<div class="Num">' +
                                '<div class="NumList">' +
                                Substation.Common.addZero(numList) +
                                "</div>" +
                                "</div>" +
                                '<div class="ListMessageR">' +
                                '<div class="List2 ListTime">发现时间：<label>' +
                                fDiscovertime +
                                "</label></div>" +
                                '<div class="List2 ListTime">严重等级：<label>' +
                                fProblemlevel +
                                "</label></div>" +
                                '<p class="typeList">设备名称：<label>' +
                                treePathName +
                                "</label></p>" +
                                '<p class="typeList">缺陷类别：<label>' +
                                fProblemtype +
                                "</label></p>" +
                                '<p class="typeList typeListLast">缺陷描述：<label>' +
                                fDeviceproblemdes +
                                "</label></p>" +
                                '<div class="List2">缺陷状态：<label>' +
                                fstate +
                                "</label></div>" +
                                '<div class="List2">消缺时间：<label>' +
                                updataTime +
                                "</label></div>" +
                                '<div class="List2 imgHideDiv imgHideDiv2">缺陷图片：' +
                                '<div class="ListImg">' +
                                imgstrun2 +
                                "</div>" +
                                "</div>" +
                                '<div class="List2 imgHideDiv imgHideDiv2">整改图片：' +
                                '<div class="ListImg">' +
                                imgstr2 +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                        }
                        var itemNum = k + 1;
                        var reportStr =
                            '<div class="report-p6 addDiv" id="itemDiv' +
                            num +
                            "-" +
                            itemNum +
                            '"></div>';
                        $("#inspection" + num).append(reportStr);
                        $("#itemDiv" + num + "-" + itemNum).html(Str);
                    }
                }
            } else {
                var operationstring =
                    '<p class="messageContent">&nbsp;&nbsp;该配电站暂无现场运维记录。</p>';
                $("#operation" + num).html(operationstring);
            }

            $("img .lazy").lazyload({
                effect: "dadeIn"
            });
        }

        $(document).on("click", ".img", function (event) {
            imgshow($(this), $("#bigimg"), $("#innerdiv"), $("#outterdiv"));
        });

        function imgshow(_this, bigimg, innerdiv, outterdiv) {
            outterdiv[0].style.display = "block";
            var src = _this.attr("data-url");
            bigimg.attr("src", src);
            $("<img/>")
                .attr("src", src)
                .load(function () {
                    var windowW = $(window).innerWidth();
                    var windowH = $(window).innerHeight();
                    var realwidth = this.width;
                    var realheight = this.height;
                    var imgwidth, imgheight;
                    var scale = 0.5;
                    if (realheight > windowH * scale) {
                        imgheight = windowH * scale;
                        imgwidth = (imgheight / realheight) * realwidth;
                        if (imgwidth > windowW * scale) {
                            imgwidth = windowW * scale;
                        }
                    } else if (realwidth > windowW * scale) {
                        imgwidth = windowW * scale;
                        imgheight = (imgwidth / realwidth) * realheight;
                    } else {
                        imgwidth = realwidth;
                        imgheight = realheight;
                    }
                    bigimg.css("width", imgwidth);
                    bigimg.css("height", imgheight);
                    var h = imgheight / 2;
                    var w = imgwidth / 2;
                    innerdiv.css({
                        positon: "relative"
                    });
                    outterdiv[0].style.top = "calc(50% - " + h + "px)";
                    outterdiv[0].style.left = "calc(50% - " + w + "px)";
                    $("body").css({
                        overflow: "hidden"
                    });
                    outterdiv.fadeIn("fast");
                });
            outterdiv.click(function () {
                $(this).fadeOut("fast");
                outterdiv[0].style.display = "none";
                document.body.style.overflow = null;
            });
        }

        //现场运维情况-无图片
        function showoperationHide(data, num) {
            $("#inspectionHide" + num)
                .children(".addDivHide")
                .remove();

            if (data != null && data.tDevDeviceproblemList.length > 0) {
                var operationstring =
                    '<p class="messageContent">本周期内，该变配电站共完成巡检<span>' +
                    data.count +
                    "</span>次，巡检时间为：<span>" +
                    data.timeList.join("&nbsp") +
                    "</span>；巡检过程中发现如下缺陷：</p>";
                $("#operationHide" + num).html(operationstring);

                var itemlength = data.tDevDeviceproblemList.length;
                var parentNum = Math.ceil((itemlength - 3) / 4);

                var firstStr = "";
                for (var i = 0; i < 3; i++) {
                    var select = data.tDevDeviceproblemList[i];

                    if (select === undefined) continue;

                    var numList = i + 1;

                    var fDiscovertime,
                        fProblemlevel,
                        treePathName,
                        fProblemtype,
                        fDeviceproblemdes,
                        updataTime;
                    var fstate = "";
                    select.fDiscovertime === undefined ?
                        (fDiscovertime = "-") :
                        (fDiscovertime = select.fDiscovertime);
                    select.fProblemlevel === undefined ?
                        (fProblemlevel = "-") :
                        (fProblemlevel = select.fProblemlevel);
                    select.treePathName === undefined ?
                        (treePathName = "-") :
                        (treePathName = select.treePathName);

                    select.fProblemtype === undefined ?
                        (fProblemtype = "-") :
                        (fProblemtype = select.fProblemtype);
                    select.fDeviceproblemdes === undefined ?
                        (fDeviceproblemdes = "-") :
                        (fDeviceproblemdes = select.fDeviceproblemdes);
                    select.newestUpdate === undefined ?
                        (updataTime = "-") :
                        (updataTime = select.newestUpdate);

                    if (select.fState === "0") {
                        fstate = "未处理";
                    }
                    if (select.fState === "1") {
                        fstate = "已处理";
                    }

                    firstStr +=
                        '<div class="liveMessage">' +
                        '<div class="Num">' +
                        '<div class="NumList">' +
                        Substation.Common.addZero(numList) +
                        "</div>" +
                        "</div>" +
                        '<div class="ListMessageR">' +
                        '<div class="List2 ListTime">发现时间：<label>' +
                        fDiscovertime +
                        "</label></div>" +
                        '<div class="List2 ListTime">严重等级：<label>' +
                        fProblemlevel +
                        "</label></div>" +
                        '<div class="typeList">设备名称：<label>' +
                        treePathName +
                        "</label></div>" +
                        '<div class="typeList">缺陷类别：<label>' +
                        fProblemtype +
                        "</label></div>" +
                        '<div class="typeList typeListLast">缺陷描述：<label>' +
                        fDeviceproblemdes +
                        "</label></div>" +
                        '<div class="List2">缺陷状态：<label>' +
                        fstate +
                        "</label></div>" +
                        '<div class="List2">消缺时间：<label>' +
                        updataTime +
                        "</label></div>" +
                        "</div>" +
                        "</div>";
                }
                $("#liveHide" + num).html("");
                $("#liveHide" + num).html(firstStr);

                if (parentNum > 0) {
                    for (var k = 0; k < parentNum; k++) {
                        var Str = "";
                        for (var i = 0; i < 4; i++) {
                            var index = k * 4 + i + 3;

                            var select = data.tDevDeviceproblemList[index];

                            if (select === undefined) continue;

                            var numList = index + 1;

                            var fDiscovertime,
                                fProblemlevel,
                                treePathName,
                                fProblemtype,
                                fDeviceproblemdes,
                                updataTime;
                            var fstate = "";
                            select.fDiscovertime === undefined ?
                                (fDiscovertime = "-") :
                                (fDiscovertime = select.fDiscovertime);
                            select.fProblemlevel === undefined ?
                                (fProblemlevel = "-") :
                                (fProblemlevel = select.fProblemlevel);
                            select.treePathName === undefined ?
                                (treePathName = "-") :
                                (treePathName = select.treePathName);

                            select.fProblemtype === undefined ?
                                (fProblemtype = "-") :
                                (fProblemtype = select.fProblemtype);
                            select.fDeviceproblemdes === undefined ?
                                (fDeviceproblemdes = "-") :
                                (fDeviceproblemdes = select.fDeviceproblemdes);
                            select.newestUpdate === undefined ?
                                (updataTime = "-") :
                                (updataTime = select.newestUpdate);

                            if (select.fState === "0") {
                                fstate = "未处理";
                            }
                            if (select.fState === "1") {
                                fstate = "已处理";
                            }

                            Str +=
                                '<div class="liveMessage">' +
                                '<div class="Num">' +
                                '<div class="NumList">' +
                                Substation.Common.addZero(numList) +
                                "</div>" +
                                "</div>" +
                                '<div class="ListMessageR">' +
                                '<div class="List2 ListTime">发现时间：<label>' +
                                fDiscovertime +
                                "</label></div>" +
                                '<div class="List2 ListTime">严重等级：<label>' +
                                fProblemlevel +
                                "</label></div>" +
                                '<p class="typeList">设备名称：<label>' +
                                treePathName +
                                "</label></p>" +
                                '<p class="typeList">缺陷类别：<label>' +
                                fProblemtype +
                                "</label></p>" +
                                '<p class="typeList typeListLast">缺陷描述：<label>' +
                                fDeviceproblemdes +
                                "</label></p>" +
                                '<div class="List2">缺陷状态：<label>' +
                                fstate +
                                "</label></div>" +
                                '<div class="List2">消缺时间：<label>' +
                                updataTime +
                                "</label></div>" +
                                "</div>" +
                                "</div>";
                        }
                        var itemNum = k + 1;
                        var reportStr =
                            '<div class="report-p6 addDiv" id="itemDivHide' +
                            num +
                            "" +
                            itemNum +
                            '"></div>';
                        $("#inspectionHide" + num).append(reportStr);
                        $("#itemDivHide" + num + "" + itemNum).html(Str);
                    }
                }
            } else {
                var operationstring =
                    '<p class="messageContent">&nbsp;&nbsp;该配电站暂无现场运维记录。</p>';
                $("#operationHide" + num).html(operationstring);
            }
        }

        // 供电局-现场运维情况
        function showoperationS(data, num) {
            $("#inspection" + num)
                .children(".addDiv")
                .remove();
            if (data !== null) {
                if (data.HeadData !== undefined) {
                    var liveDataB = data.HeadData.Table[0];

                    var operationstring = "";
                    if (
                        liveDataB.maintenance_date !== "" ||
                        liveDataB.maintenance_count !== null
                    ) {
                        operationstring +=
                            "&nbsp;&nbsp;" +
                            "该变配电站由" +
                            liveDataB.partner_name +
                            "进行现场运维，本周期内共运维" +
                            liveDataB.maintenance_count +
                            "次，" +
                            "运维时间为：" +
                            liveDataB.maintenance_date +
                            "异常情况如下表所示：";
                    } else {
                        operationstring +=
                            "&nbsp;&nbsp;" +
                            "该变配电站由" +
                            liveDataB.partner_name +
                            "进行现场运维，本周期内共运维" +
                            liveDataB.maintenance_count +
                            "次，" +
                            "运维时间为：" +
                            "-" +
                            "，异常情况如下表所示：";
                    }

                    $("#operation" + num).html(operationstring);
                }

                var firstTab = [];
                var columns = [{
                        field: "dj_date",
                        title: "日期",
                        valign: "middle",
                        align: "center"
                    },
                    {
                        field: "xj_type",
                        title: "类别",
                        valign: "middle",
                        align: "center"
                    },
                    {
                        field: "check_item",
                        title: "检查事项",
                        valign: "middle",
                        align: "center"
                    },
                    {
                        field: "anomaly_type",
                        title: "异常类型",
                        valign: "middle",
                        align: "center"
                    },
                    {
                        field: "fault_type",
                        title: "故障/缺陷类型",
                        valign: "middle",
                        align: "center"
                    },
                    {
                        field: "overhaul_content",
                        title: "情况描述",
                        valign: "middle",
                        align: "center"
                    },
                    {
                        field: "repair_status",
                        title: "处理结果",
                        valign: "middle",
                        align: "center"
                    }
                ];

                var parentNum = 0;

                if (data.DetailData != null && data.DetailData.Table.length > 0) {
                    var itemlength = data.DetailData.Table.length;
                    parentNum = Math.ceil((itemlength - 8) / 12);

                    for (var i = 0; i < 8; i++) {
                        var select = data.DetailData.Table[i];

                        if (select === undefined) continue;

                        firstTab.push(data.DetailData.Table[i]);
                    }
                }

                $("#live" + num).html("");
                $("#live" + num).html('<table id="liveDiv' + num + '"></table>');
                $("#liveDiv" + num).bootstrapTable({
                    data: firstTab,
                    columns: columns
                });

                if (parentNum > 0) {
                    for (var k = 0; k < parentNum; k++) {
                        var newData = [];

                        for (var i = 0; i < 12; i++) {
                            var index = k * 12 + i + 8;

                            var select = data.DetailData.Table[index];

                            if (select === undefined) continue;

                            newData.push(data.DetailData.Table[index]);
                        }

                        var itemNum = k + 1;
                        var reportStr =
                            '<div class="report-p6 addDiv" id="itemDiv' +
                            itemNum +
                            '"><div id="addtablive' +
                            num +
                            "-" +
                            itemNum +
                            '"></div></div>';

                        $("#inspection" + num).append(reportStr);
                        $("#addtablive" + num + "-" + itemNum).html(
                            '<table id="addliveDiv' + num + "-" + itemNum + '"></table>'
                        );
                        $("#addliveDiv" + num + "-" + itemNum).bootstrapTable({
                            data: newData,
                            columns: columns
                        });
                    }
                }
            } else {
                var operationstring =
                    '<p class="messageContent">&nbsp;&nbsp;该配电站暂无现场运维记录。</p>';
                $("#operation" + num).html(operationstring);
            }
        }
    }
    return _customReport;
})();
jQuery(document).ready(function () {
    //   language.common.iframeSelect();

    var customReport = new CustomReport();
    //   customReport.initDateTimePicker();

    customReport.getData("", "", "0");

    //   $("#startDateBox").change(function() {
    //     $.cookie("newDate", $("#startDateBox").val());
    //   });
    //   $("#endDateBox").change(function() {
    //     $.cookie("lastDate", $("#endDateBox").val());
    //   });

    //   var params = "pageNo=" + 1 + "&pageSize=" + 18;
    //   var url = "main/getSubstationListByUser";
    //   Substation.Common.requestData(url, params, function(data) {
    //     showSubNameInfo(data);
    //   });

    //生成列表框
    //   function showSubNameInfo(data) {
    //     $("#checkAllList").html("全选当页");
    //     $("#sublist").html("");
    //     $("#sublist").get(0).style.overflow = "auto";
    //     if (data.list.length > 0) {
    //       $.each(data.list, function(index, val) {
    //         $("#sublist").append(
    //           '<li><input type="checkbox" name="subs" value="' +
    //             val.fSubid +
    //             '"/><span>' +
    //             val.fSubname +
    //             "</span></li>"
    //         );
    //       });
    //     }
    //     pagination(data);
    //   }

    //   function pagination(data) {
    //     BootstrapPagination($("#pagination"), {
    //       layoutScheme: "prevgrouppage,prevpage,pagenumber,nextpage,nextgrouppage",
    //       //记录总数。
    //       total: data.total,
    //       //分页尺寸。指示每页最多显示的记录数量。
    //       pageSize: data.pageSize,
    //       //当前页索引编号。从其开始（从0开始）的整数。
    //       pageIndex: data.prePage,
    //       //指示分页导航栏中最多显示的页索引数量。
    //       pageGroupSize: 3,
    //       //接受用户输入内容的延迟时间。单位：毫秒
    //       pageInputTimeout: 800,
    //       //分页尺寸列表。
    //       pageSizeList: [1, 3],
    //       //当分页更改后引发此事件。
    //       pageChanged: function(pageIndex, pageSize) {
    //         var url = "main/getSubstationListByUser";
    //         var pageIndex = pageIndex + 1;
    //         var params = "pageNo=" + pageIndex + "&pageSize=" + pageSize;
    //         Substation.Common.requestData(url, params, function(data) {
    //           showSubNameInfo(data);
    //         });
    //       }
    //     });
    //   }

    //   $.search($("#searchDiv"), function(text) {
    //     var params = "fPartsubname=" + text + "&pageNo=" + 1 + "&pageSize=" + 18;
    //     var url = "main/getSubstationListByFuzzyLookup";
    //     Substation.Common.requestData(url, params, function(data) {
    //       showSubNameInfo(data);
    //     });
    //   });

    // 是否打印图片
    //   $("#printImg").on("click", function() {
    //     var imgstate = document.getElementById("printImg").checked;

    //     if (imgstate) {
    //       $(".print_img").css("display", "block");
    //       $(".print_imgHide").css("display", "none");
    //     } else {
    //       $(".print_img").css("display", "none");
    //       $(".print_imgHide").css("display", "block");
    //     }
    //   });

    //全选按钮
    //   $("#checkAllList").click(function() {
    //     var text = $("#checkAllList")[0].innerHTML;
    //     if (text == "全选当页") {
    //       $.each($("#sublist input"), function(index, val) {
    //         $(val)[0].checked = true;
    //       });
    //       $("#checkAllList").html("取消全选");
    //     }
    //     if (text == "取消全选") {
    //       $.each($("#sublist input"), function(index, val) {
    //         $(val)[0].checked = false;
    //       });
    //       $("#checkAllList").html("全选当页");
    //     }
    //   });

//    var checkedList = [];
//
//    $("#addConfirm").click(function () {
//        // if (!Substation.DOMOperator.timeCompare()) {
//        //     alert("请选择正确的开始截止时间！！！");
//        //     return;
//        // }
//
//        checkedList = [];
//        checkedList.push("10100001");
//        // $.each($("#sublist input"), function (index, val) {
//        //     if ($(val)[0].checked) {
//        // checkedList.push($(val).val());
//
//        //     }
//        // });
//
//        if (checkedList.length == 0) {
//            alert("请至少选择一个变配电站！！！");
//            return;
//        }
//
//        customReport.getData(
//            "main/getSubstationInfoReportByfSubId",
//            //   "fSubids=" +
//            //     checkedList.join(",") +
//            //     "&startTime=" +
//            //     $.cookie("newDate") +
//            //     "&endTime=" +
//            //     $.cookie("lastDate")
//            // );
//            "fSubids=" +
//            checkedList.join(",") +
//            "&startTime=" +
//            "2019-12-01" +
//            "&endTime=" +
//            "2019-12-31"
//        );
//    });

    //打印
    //   $("#print").click(function() {
    //     if (checkedList.length == 0) {
    //       alert("请至少选择一个变配电站！！！");
    //       return;
    //     }

    //是否双面打印
    // var initstate = document.getElementById("double").checked;

    // if (initstate) {
    //   var pageLength = $("#CustomReport").children().length;

    //   for (var k = 1; k < pageLength; k++) {
    //     var pageHieight = $("#div" + k).height();
    //     var size = (pageHieight / 820).toFixed(0); //奇偶页判断
    //     var isTrue = size % 2;
    //     if (isTrue) {
    //       var newPage = '<div class="report-p5 deletePage"></div>';
    //       $("#div" + k).after(newPage);
    //     }
    //   }
    // }

    // 执行打印操作
    // window.print("#CustomReport");

    // // 删除空白页
    // if (initstate) {
    //   $(".deletePage").remove();
    // }
    //   });

    //添加右上角事件
    var selectSubid = "";
    var clickSubid = "";
    if (selectSubid == "" || $("#dateStart").val() == "" || $("#dateEnd").val() == "") {
        $.toast("点击右上角按钮筛选！");
    }
    $('#searchBtn').click(function () {
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
            "fSubids=" +selectSubid+
            "&startTime=" +
            $("#dateStart").val() +
            "&endTime=" +
            $("#dateEnd").val()
        );
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
    });

    $(".back_btn").click(function () {
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

    $("#thisMonth").click();
});