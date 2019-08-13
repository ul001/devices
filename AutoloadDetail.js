var CustomerDevice = (function () {

    function _customerDevice() {

        var selectInfo;
        var count = 100;
        var curNodeInfo;

        //修改信息保存后，更新设备信息（复制设备时使用）
        this.reNewCurNodeInfo = function () {
            Substation.Common.requestData("authority/pageCustomList", "fSubid=" + 10100001 + "&fTemplateid=" + selectInfo.id, function (data) {
                curNodeInfo = data;
            })
        };

        // 获取当前选中节点信息
        this.getselectInfo = function () {
            return selectInfo;
        };

        // 当前选中节点设备信息
        this.returnNodeInfo = function () {
            return curNodeInfo;
        };

        // 新增一个设备
        this.addModal = function (data) {
            // 取消选中tabpanel
            $(".active[role='presentation']").removeClass("active");
            $(".tab-pane.active").removeClass("active");
            count++;
            var name = "addModal" + count;
            //假数据
            var text = "假的" + count;
            // var text = selectInfo.name;
            var string = ' <a role="presentation" href="#' + name + '" class="tab-link active button">' + text + '</a>';
            // var string = '<li role="presentation" class="active">' +
            //     '<a href="#' + name + '" aria-controls="home" role="tab" data-toggle="tab">' + text + '</a></li>';

            // var containStr = '<div role="tabpanel" class="tab active" id="' + name +
            // '"> <div class="content-block">< div class ="list-block"><ul id="addVarContain' + count + '"></ul></div></div></div>';
            var containStr = '<div role="tabpanel" class="tab active" id="' + name +
                '"> <div class="content-block" id="addVarContain' + count + '"></div></div>';
            // var containStr = '<div role="tabpanel" class="tab-pane active" id="' + name + '">' +
            // '<div id="addVarContain' + count + '"></div></div>';

            $("#addDataUL").append(string);
            $(".tab-content").append(containStr);
            //传信息参数为复制设备，无信息参数为新增设备
            if (data != undefined) {
                creatInfo(data, $("#addVarContain" + count), count);
            } else {
                //假数据
                creatInfo(130, $("#addVarContain" + count), count);

                // creatInfo(selectInfo.fFunctionfield, $("#addVarContain" + count), count);
            }
        };

        // 初始化获取信息
        this.show = function () {
            initHtml();
            getData();
        };

        function getData() {
            // $("body").showLoading();
            var url = "authority/appMenuSelectHideOrShow";
            var params = "fSubid=" + 10100001;
            Substation.Common.requestData(url, params, function (data) {
                var state = $("#showAllNodes").prop("checked"); //获取是否显示
                var showData = data;
                if (state == false) {
                    showData = data.filter(function (index) {
                        return index.state == "true";
                    });
                }
                var setting = {
                    edit: {
                        enable: true
                    },
                    view: {
                        dblClickExpand: false
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick: function (e, treeId, treeNode) {
                            initHtml();
                            $("#save").attr("disabled", true);
                            $("#Add").attr("disabled", true);
                            $("#delete").attr("disabled", true);
                            selectInfo = treeNode;
                            // 父级节点无信息
                            if (treeNode.isParent == false) {
                                onClick(treeNode);
                                $("#save").removeAttr("disabled");
                                $("#Add").removeAttr("disabled");
                                $("#copy").removeAttr("disabled");
                                $("#delete").removeAttr("disabled");
                            }
                            return false;
                        }
                    }
                };
                $.fn.zTree.init($("#treeDemo"), setting, showData); //初始化树结构
                // $("body").hideLoading();
            })
        }

        function initHtml() {
            $(".megbox").remove();
            $(":text").css({
                "border": '1px solid #ababab',
                "box-shadow": '0px 0px 0px #ababab'
            });
            $(".tab-content").html('');
            $("li[role='presentation']").remove(); //清空原有信息
        }

        // 是否显示全部树结构
        $("#showAllNodes").change(function () {
            getData();
        });

        // 点击一个节点
        function onClick(treeNode) {
            // $("body").showLoading();
            // Substation.Common.requestData("authority/pageCustomList", "fSubid=" + $.cookie("stationId") + "&fTemplateid=" + treeNode.id, function (data) {
            Substation.Common.requestData("authority/pageCustomList", "fSubid=" + 10100001 + "&fTemplateid=" + treeNode.id, function (data) {
                curNodeInfo = data;
                // 如果有设备信息
                if (data.length > 0) {
                    $.each(data, function (key, val) {
                        count++;
                        var name = "addModal" + val.fId;
                        if (key == 0) {
                            // var string = '<li role="presentation" class="active" name="' + val.fId + '">' +
                            //     '<a href="#' + name + '" aria-controls="home" role="tab" data-toggle="tab">' + decodeURIComponent(val.fPagename) + '</a></li>'; 
                            // var containStr = '<div role="tabpanel" class="tab-pane active" id="' + name + '">' +
                            //     '<div id="addVarContain' + count + '"></div>' +
                            //     '</div>';
                            var string = ' <a role="presentation" href="#' + name + '" class="tab-link active button" name="' + val.fId + '">' + decodeURIComponent(val.fPagename) + '</a>';
                            var containStr = '<div role="tabpanel" class="tab active" id="' + name +
                                '"> <div class="content-block" id="addVarContain' + count + '"></div></div>';
                        } else {
                            // var string = '<li role="presentation" name="' + val.fId + '">' +
                            //     '<a href="#' + name + '" aria-controls="home" role="tab" data-toggle="tab">' + decodeURIComponent(val.fPagename) + '</a></li>';
                            // var containStr = '<div role="tabpanel" class="tab-pane" id="' + name + '">' +
                            //     '<div id="addVarContain' + count + '"></div>' +
                            //     '</div>';
                            var string = ' <a role="presentation" href="#' + name + '" class="tab-link active button" name="' + val.fId + '">' + decodeURIComponent(val.fPagename) + '</a>';
                            var containStr = '<div role="tabpanel" class="tab active" id="' + name +
                                '"> <div class="content-block" id="addVarContain' + count + '"></div></div>';
                        }

                        $("#addDataUL").append(string);
                        $(".tab-content").append(containStr);
                        if (val.fPagejson != undefined && val.fPagejson != 'undefined') {
                            creatInfo(val.fPagejson, $("#addVarContain" + count), count);
                        }
                    });
                } else {
                    $("#delete").attr("disabled", true);
                    $("#copy").attr("disabled", true);
                    $("#save").attr("disabled", true);
                    $("#container-info").html("暂无相关信息！").css("text-align", "center");
                }
                $("body").hideLoading();
            });
        }

        // 显示已有信息
        function creatInfo(data, select, count) {
            if (data != "") {
                var info = JSON.parse(data);
                if (info != undefined) {
                    var divHeight = '300';
                    $.each(info, function (index, val) {
                        var id = "showInfoDiv" + count + index;
                        $(select).append('<label class="header">' + decodeURIComponent(val.name) +
                            '</label><div id="' + id + '" class="list-block baseInfoDiv" style="height: ' + divHeight + 'px" name="' + decodeURIComponent(val.name) + '"><ul></ul></div>');
                        $.each(val.value, function (key, value) {
                            showInfo(value, $("#" + id));
                        })
                    });
                }
            }
        }

        function showInfo(val, select) {
            count++;
            var string;
            switch (val.type) {
                case "input":
                    var info = JSON.parse(decodeURIComponent(val.value));
                    if (info.inpType == true) {
                        // string = '<div class="showDiv">' +
                        // '<label class="nameInputInfo" name="input">' + decodeURIComponent(val.name) + '</label>' + ':' +
                        // '<input type="text" id="input' + count + '" class="valueInput" value="' + info.inpName + '" name="'
                        //  + info.inpType + '" validator="required" onblur="blurEvent(this)" onfocus="focusEvent(this)">' + '</div>';
                        string = '<li><div class="item-content showDiv"><div class="item-inner"><div class="item-title label">' + decodeURIComponent(val.name) +
                            '</div> <div class="item-input">' + '<input type="text" id="input' + count + '" class="valueInput" value="' + info.inpName + '" name="' +
                            info.inpType + '" validator="required" onblur="blurEvent(this)" onfocus="focusEvent(this)">' + '</div></div></li>';
                    }
                    if (info.inpType == false) {
                        // string = '<div class="showDiv">' +
                        //     '<label class="nameInputInfo" name="input">' + decodeURIComponent(val.name) + '</label>' + ':' +
                        //     '<input type="text" class="valueInput" value="' + info.inpName + '" name="' + info.inpType + '">' + '</div>';
                        string = '<li><div class="item-content showDiv"><div class="item-inner"><div class="item-title label">' + decodeURIComponent(val.name) +
                            '</div> <div class="item-input">' + '<input type="text" class="valueInput" value="' + info.inpName + '" name="' + info.inpType + '">' + '</div></div></li>';
                    }
                    break;
                case "radio":
                    if (val.value == "yes") {
                        // string = '<div class="showDiv">' +
                        //     '<label class="nameInputInfo" name="radio">' + decodeURIComponent(val.name) + '</label>' + ':' +
                        //     '<input type="radio" id="operation' + count + '" name="operation' + count + '" value="yes" style="margin-left: 10px" checked><label style="margin-right: 10px" for="operation' + count + '">是</label>' +
                        //     '<input type="radio" id="operationNo' + count + '" name="operation' + count + '" value="no"><label style="margin-right: 10px" for="operationNo' + count + '">否</label>' +
                        //     '</div>';
                        string = '<li><div class="showDiv item-content"><div class="item-inner">' +
                            '<label class="item-title label nameInputInfo" name="radio">' + decodeURIComponent(val.name) + '</label>' +
                            '<input type="radio" id="operation' + count + '" name="operation' + count + '" value="yes" style="margin-left: 10px" checked><label style="margin-right: 10px" for="operation' + count + '">是</label>' +
                            '<input type="radio" id="operationNo' + count + '" name="operation' + count + '" value="no"><label style="margin-right: 10px" for="operationNo' + count + '">否</label>' +
                            '</div></div></li>';
                    }
                    if (val.value == "no") {
                        // string = '<div class="showDiv">' +
                        //     '<label class="nameInputInfo" name="radio">' + decodeURIComponent(val.name) + '</label>' + ':' +
                        //     '<input type="radio" id="operation' + count + '" name="operation' + count + '" value="yes" style="margin-left: 10px"><label style="margin-right: 10px" for="operation' + count + '">是</label>' +
                        //     '<input type="radio" id="operationNo' + count + '" name="operation' + count + '" value="no" checked><label style="margin-right: 10px" for="operationNo' + count + '">否</label>' +
                        //     '</div>';
                        string = '<li><div class="showDiv item-content"><div class="item-inner">' +
                            '<label class="item-title label nameInputInfo" name="radio">' + decodeURIComponent(val.name) + '</label>' +
                            '<input type="radio" id="operation' + count + '" name="operation' + count + '" value="yes" style="margin-left: 10px"><label style="margin-right: 10px" for="operation' + count + '">是</label>' +
                            '<input type="radio" id="operationNo' + count + '" name="operation' + count + '" value="no" checked><label style="margin-right: 10px" for="operationNo' + count + '">否</label>' +
                            '</div></div></li>';
                    }
                    break;
                case "select":
                    var list = JSON.parse(decodeURIComponent(val.value));
                    var opString = '<select>';
                    $.each(list, function (key, opval) {
                        if (opval.opType == true) {
                            opString += '<option selected>' + opval.opName + '</option>';
                        } else {
                            opString += '<option>' + opval.opName + '</option>';
                        }
                    });
                    opString += '</select>';

                    string = '<li><div class="showDiv item-content"><div class="item-inner">' +
                        '<label class="nameInputInfo item-title label"  name="select">' + decodeURIComponent(val.name) + '</label>' +
                        opString + '</div></div></li>';
                    break;
                case "date":
                    //         <li>
                    //     <div class="item-content">
                    //         <div class="item-media"><i class="icon icon-form-calendar"></i></div>
                    //         <div class="item-inner">
                    //             <div class="item-title label">生日</div>
                    //             <div class="item-input">
                    //                 <input type="date" placeholder="Birth day" value="2014-04-30">
                    //             </div>
                    //         </div>
                    //     </div>
                    // </li>
                    // string = '<div class="showDiv">' +
                    //     '<label class="nameInputInfo" name="date">' + decodeURIComponent(val.name) + '</label>' + ':' +
                    //     '<input type="text" class="daycalendarBox' + count + ' dateTime" value="' + decodeURIComponent(val.value) + '">';
                    string = '<li><div class="showDiv"><div class="item-inner">' +
                        '<div class="item-title label nameInputInfo" name="date">' + decodeURIComponent(val.name) + '</div>' +
                        '<input type="date" class="daycalendarBox' + count + ' dateTime" value="' + decodeURIComponent(val.value) + '"></div></div></li>';
                    break;
            }
            $(select).append(string);
            if (val.type == "date") {
                initDate($(".daycalendarBox" + count));
            }
        }
    }

    return _customerDevice;
})();

// jQuery(document).ready(function () {
$(function () {
    var customerDevice = new CustomerDevice();

    // if ($.cookie("stationId") != undefined && $.cookie("subName") != undefined) {
    //     $("#StationName").html($.cookie('subName'));
    customerDevice.show();
    // } else {
    //     return;
    // }

    // 新增按钮
    $('#tab-nav').on('click', '#Add', function () {
        var info = customerDevice.getselectInfo();

        // if (info.fFunctionfield == undefined) {
        //     alert("暂无设备信息，请增加相关信息！");
        //     return;
        // }

        // var fTemplateid = info.id;
        // var fPagename = info.name;
        // var json = info.fFunctionfield;

        // var formdata = new FormData();
        // formdata.append("fSubid", 10100001);
        // formdata.append("fTemplateid", fTemplateid);
        // formdata.append("fPagename", encodeURIComponent(fPagename));
        // formdata.append("fPagejson", json);
        // var url = "authority/pageCustomInsert";
        // $.ajax({
        //     url: Substation.Common.addHead() + url,
        //     type: 'POST',
        //     data: formdata,
        //     beforeSend: function (request) {
        //         request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        //     },
        //     processData: false,
        //     contentType: false
        // }).done(function (data) {
        //     if (data.msg != "ok") {
        //         alert("新增失败！");
        //     } else {
        customerDevice.addModal();
        // 假数据
        $(".active[role='presentation']").attr("name", 2);
        // $(".active[role='presentation']").attr("name", data.data.fId);
        $("#save").removeAttr("disabled");
        //     }
        // }).fail(function (res) {
        //     alert("新增失败！");
        // });
    });

    // 复制按钮
    $('#tab-nav').on('click', '#copy', function () {
        var info = customerDevice.getselectInfo();

        var fTemplateid = info.id;
        var fPagename = info.name;

        var nodeInfo = customerDevice.returnNodeInfo();
        var json;
        var selectDevice = $(".active[role='presentation']").attr("name");
        $.each(nodeInfo, function (key, val) {
            if (selectDevice == (val.fId).toString()) {
                json = val.fPagejson;
            }
        });

        var formdata = new FormData();
        formdata.append("fSubid", 10100001);
        formdata.append("fTemplateid", fTemplateid);
        formdata.append("fPagename", encodeURIComponent(fPagename));
        formdata.append("fPagejson", json);
        var url = "authority/pageCustomInsert";
        // $.ajax({
        //     url: Substation.Common.addHead() + url,
        //     type: 'POST',
        //     data: formdata,
        //     beforeSend: function (request) {
        //         request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        //     },
        //     processData: false,
        //     contentType: false
        // }).done(function (data) {
        //     if (data.msg != "ok") {
        //         alert("复制失败！");
        //     } else {
        customerDevice.addModal(json);
        $(".active[role='presentation']").attr("name", data.data.fId);
        //     }
        // }).fail(function (res) {
        //     alert("复制失败！");
        // });
    });

    // 删除按钮
    $('#tab-nav').on('click', '#delete', function () {
        var selectId = $(".active[role='presentation']").attr("name");
        var name = $(".active[role='presentation']").children('a').text();
        if (confirm("确认删除" + name + " 吗？")) {
            // Substation.Common.requestData("authority/pageCustomDelete", "fId=" + selectId, function (data) {
            //     if (data == true) {
            alert("删除成功！");
            var id = $(".active[role='presentation']").children('a').attr('href');
            var prevLi = $(".active[role='presentation']").prev('li');
            $(".active[role='presentation']").remove();
            $(id).remove();
            if (prevLi != undefined) {
                $('a', $(prevLi)).tab('show');
            }
            // } else {
            //     alert("删除失败！");
            // }
            // })
        }
    });

    // 修改保存按钮点击
    $('#tab-nav').on('click', '#save', function () {
        var isTrue = true;
        var input = $(".tab-pane.active").find(".valueInput[name='true']");
        $.each(input, function (key, val) {
            if (!Substation.Validator.validate($(val), "")) {
                $("#save").attr("disabled", true);
                isTrue = false;
                return false;
            }
        });

        if (isTrue) {
            var fFunctionfield = [];
            var divList = $(".tab-pane.active").find(".baseInfoDiv");
            $.each(divList, function (key, val) {
                var text = $(val).attr("name");
                fFunctionfield.push({
                    name: encodeURIComponent(text),
                    value: []
                });
                var infoList = $(val).children('.showDiv');
                $.each(infoList, function (index, val) {
                    var row = {};
                    var select = $(val).children(".nameInputInfo");
                    var name = $(select).text();
                    var type = $(select).attr("name");
                    var value;
                    switch (type) {
                        case "input":
                            var row = {};
                            row.inpName = $(val).find($(".valueInput")).val();
                            row.inpType = JSON.parse($(val).find($(".valueInput")).attr("name"));
                            value = JSON.stringify(row);
                            break;
                        case "radio":
                            value = $(val).find($("input:checked")).val();
                            break;
                        case "select":
                            var list = [];
                            var options = $(val).find('select').children('option');
                            $.each(options, function (opkey, opval) {
                                var row = {};
                                row.opName = $(opval).val();
                                row.opType = $(opval).is(":checked");
                                list.push(row);
                            });
                            value = JSON.stringify(list);
                            break;
                        case "date":
                            value = $(val).find($(".dateTime")).val();
                            break;
                    }
                    row.type = type;
                    row.name = encodeURIComponent(name);
                    row.value = encodeURIComponent(value);
                    fFunctionfield[key].value.push(row);
                });
            });
            upData(fFunctionfield);
        }
    });

    function upData(fFunctionfield) {
        var json = JSON.stringify(fFunctionfield);

        var fId = $(".active[role='presentation']").attr("name");

        var formdata = new FormData();
        formdata.append("fId", fId);
        formdata.append("fPagejson", json);
        var url = "authority/pageCustomUpdate";
        $.ajax({
            url: Substation.Common.addHead() + url,
            type: 'POST',
            data: formdata,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
            },
            processData: false,
            contentType: false
        }).done(function (data) {
            if (data.data == true) {
                alert("保存成功！");
                customerDevice.reNewCurNodeInfo();
            } else {
                alert("保存失败！");
            }
        }).fail(function (res) {
            alert("保存失败！");
        });
    }

    //点击弹出弹窗加载信息
    $("#myModal").on('shown.bs.modal', function () {
        Substation.DOMOperator.pagenation("main/getSubstationListByUser", 1, 8);
    });
    $("#myModal").on('hide.bs.modal', function () {
        $("#tableSubName").html("");
        $(".substationlist").val('');
    });

    $("#yesBtn").click(function (event) {
        var row = selectedInfoModal;
        Substation.DOMOperator.yesBtnClick(row);
        $("#myModal").modal('hide');
        $("#treeDemo").html('');
        customerDevice.show();
    });

    $(document).on('click', '.nav-tabs li', function () {
        $(".megbox").remove();
        $(":text").css({
            "border": '1px solid #ababab',
            "box-shadow": '0px 0px 0px #ababab'
        });
        $("#save").removeAttr("disabled");
    });
});

// 初始化时间控件
// function initDate(select) {
//     $(select).datetimepicker({
//         format: 'yyyy-mm-dd',
//         language: 'zh-CN',
//         weekStart: 1,
//         todayBtn: 1,
//         todayHighlight: 1,
//         autoclose: 1,
//         startView: 2,
//         minView: 2,
//         forceParse: 0,
//         pickerPosition: "bottom-left"
//     });
// }
//必填项绑定事件
function blurEvent(select) {
    if (!Substation.Validator.validate($(select), "")) {
        $("#save").attr("disabled", true);
    }
}

function focusEvent(select) {
    Substation.Validator.setFocus($(select));
    $("#save").removeAttr("disabled");
}