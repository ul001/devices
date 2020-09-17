var u = navigator.userAgent,
    app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
var imagePath;
var upLoadClicktag = true;

var CustomerDevice = (function () {
    function _customerDevice() {
        var selectInfo;
        var count = 100;
        var curNodeInfo;
        var subid = localStorage.getItem("fSubid");
        //查询模板fPagedesigntemplateid 用父级的fParentid查模板
        // 用父级的fParentid查模板
        var parentId = localStorage.getItem("pid");
        var tempId = localStorage.getItem("fTempid");
        //用fSubdeviceinfoid组id查真实数据
        var deviceGroupId = localStorage.getItem("fDeviceGroupId");
        var fileList = []; //设备图片
        var imageListChange = []; //实时图片
        // deviceGroupId = 41;

        // var selectInfo = localStorage.getItem("fFunctionfield");
        // var selectInfo = JSON.parse(localStorage.getItem("fFunctionfield"));
        // selectInfo.id = tempId;
        //修改信息保存后，更新设备信息（复制设备时使用）
        this.reNewCurNodeInfo = function () {
            Substation.getDataByAjax(
                "/selectDeviceList",
                "subDeviceGroupId=" + deviceGroupId,
                function (data) {
                    curNodeInfo = data.deviceList;
                }
            );
        };

        // 获取当前选中节点信息
        this.getselectInfo = function () {
            return selectInfo;
        };

        // 当前选中节点设备信息
        this.returnNodeInfo = function () {
            return curNodeInfo;
        };

        // 获取
        this.getFilelist = function () {
            return fileList;
        };


        // 新增一个设备
        this.addModal = function (data, tabName) {
            // 取消选中tabpanel
            $(".active[role='presentation']").removeClass("active");
            $(".tab.active").removeClass("active");
            count++;
            var name = "addModal" + count;
            var text = selectInfo.name;
            if (tabName != null) {
                text = tabName;
            }
            var string =
                ' <a role="presentation" href="#' +
                name +
                '" class="tab-link active button" id="tab' +
                name +
                '"><span>' +
                text +
                "</span><i class='icon icon-edit'></i></a>";
            // var string = '<li role="presentation" class="active">' +
            //     '<a href="#' + name + '" aria-controls="home" role="tab" data-toggle="tab">' + text + '</a></li>';

            // var containStr = '<div role="tabpanel" class="tab active" id="' + name +
            // '"> <div class="content-block">< div class ="list-block"><ul id="addVarContain' + count + '"></ul></div></div></div>';
            var containStr =
                '<div role="tabpanel" class="tab pull-to-refresh-content active" id="' +
                name +
                '"><div class=\"pull-to-refresh-layer\"></div><div class="content-block tab-pane active" id="addVarContain' +
                count +
                '"></div></div>';
            // var containStr = '<div role="tabpanel" class="tab-pane active" id="' + name + '">' +
            // '<div id="addVarContain' + count + '"></div></div>';

            $("#addDataUL").append(string);
            $(".tab-content").append(containStr);
            $("#tab" + name).click();
            //传信息参数为复制设备，无信息参数为新增设备
            // if (data != undefined) {
            //     creatInfo(data, $("#addVarContain" + count), count);
            // } else {
            //     var json = JSON.parse(selectInfo.fFunctionfield);
            //     creatInfo(
            //         JSON.stringify(json.deviceInfo),
            //         $("#addVarContain" + count),
            //         count
            //     );
            //     // creatInfo(selectInfo.fFunctionfield, $("#addVarContain" + count), count);
            // }
            //创建模板
            // var json = JSON.parse(selectInfo.fFunctionfield);
            var select = $("#addVarContain" + count);
            creatInfo(selectInfo.fFunctionfield, select, count, name);
            if (data != undefined) {
                showPageInfo(data, select, name);
            } else {
                //新增模板图片
                var savedInfo = [],
                    arr = [];
                // 如果所选设备有模板图片
                if (selectInfo.fPreviewfiles !== undefined) {
                    savedInfo = JSON.parse(selectInfo.fPreviewfiles)
                }
                $.each(savedInfo, function (i, val) {
                    arr.push(Substation.ipAddressFromAPP + imagePath + '/' + val)
                })
                var imgid = name.substr(8);
                //新增必然是模板图片 传true
                $.initFile($("#upImage" + imgid), function (list) {
                    fileList = list
                }, arr, imgid, true)
                addEdit();
            }


        };

        //添加编辑按钮事件
        function addEdit() {
            $(".icon-edit").unbind().click(function (e) {
                var thisSpan = $(this).prev();
                var thisDeviceId = $(this).parent().attr("name");
                $.prompt(Operation['ui_rename'], function (value) {
                    if (thisDeviceId == undefined) {
                        thisSpan.text(value);
                    } else {
                        Substation.postDataByAjax("/updateDevice", {
                            fSubdeviceinfoid: thisDeviceId,
                            fDevicename: value
                        }, function (data) {
                            $.toast(Operation['ui_renamesuccess']);
                            thisSpan.text(value);
                        });
                    }
                });
                $(".modal-text-input").val(thisSpan.text());
                //                $(".modal-text-input").select();
                e.stopPropagation();
            });

        }

        // 初始化获取信息
        this.show = function () {
            initHtml();
            // getData();
            // getSelectInfo();
            //初始化页面
            getNetData();
        };

        // function getSelectInfo() {
        //     Substation.getDataByAjax(
        //         "/selectDeviceList",
        //         "subDeviceGroupId=" + deviceGroupId,
        //         function (data) {
        //             selectInfo = data.template;
        //             // $.each(menuList, function (key, val) {
        //             //     if (tempId == val.fPagedesigntemplateid.toString()) {
        //             //         selectInfo = val;
        //             //     }
        //             // });
        //         }
        //     );

        // };

        function getNetData() {
            Substation.getDataByAjax(
                "/selectDeviceList",
                "subDeviceGroupId=" + deviceGroupId,
                function (data) {
                    //赋模板
                    selectInfo = data.template;
                    imagePath = data.filePath;
                    // Substation.Common.getDataByAjax("authority/pageCustomList", "fSubid=" + subid + "&fTemplateid=" + tempId, function (data) {
                    curNodeInfo = data.deviceList;
                    //                     selectInfo = {
                    //                         id: tempId,
                    //                         name: "户外隔离刀闸",
                    //                         pId: 129,
                    //                         fParentid: "129",
                    //                         fTemplateid: "",
                    //                         parentId: "129",
                    //                         state: "true",
                    //                         fFunctionfield: '{"deviceInfo":[{"name":"%E8%AE%BE%E5%A4%87%E4%BF%A1%E6%81%AF","value":[{"inpName":"","inpType":false,"type":"input","name":"%E7%BC%96%E5%8F%B7%E5%8F%8A%E5%90%8D%E7%A7%B0","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Afalse%7D"},{"inpName":"","inpType":false,"type":"input","name":"%E5%9E%8B%E5%8F%B7%E8%A7%84%E6%A0%BC","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Afalse%7D"},{"inpName":"","inpType":false,"type":"input","name":"%E9%A2%9D%E5%AE%9A%E7%94%B5%E6%B5%81(A)","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Afalse%7D"},{"inpName":"","inpType":false,"type":"input","name":"%E9%A2%9D%E5%BA%A6%E7%94%B5%E5%8E%8B(kV)","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Afalse%7D"},{"inpName":"","inpType":false,"type":"input","name":"%E7%94%9F%E4%BA%A7%E5%8E%82%E5%AE%B6","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Afalse%7D"},{"type":"date","name":"%E7%94%9F%E4%BA%A7%E6%97%A5%E6%9C%9F","value":""},{"type":"date","name":"%E6%8A%95%E8%BF%90%E6%97%A5%E6%9C%9F","value":""},{"inpName":"","inpType":false,"type":"input","name":"%E6%95%B0%E9%87%8F(%E5%8F%B0)","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Afalse%7D"},{"type":"select","name":"%E5%BD%93%E5%89%8D%E7%8A%B6%E6%80%81","value":"%5B%7B%22opName%22%3A%22%E8%BF%90%E8%A1%8C%22%2C%22opType%22%3Afalse%7D%2C%7B%22opName%22%3A%22%E5%81%9C%E7%94%A8%22%2C%22opType%22%3Afalse%7D%2C%7B%22opName%22%3A%22%E5%A4%87%E7%94%A8%22%2C%22opType%22%3Afalse%7D%2C%7B%22opName%22%3A%22%E6%95%85%E9%9A%9C%22%2C%22opType%22%3Afalse%7D%5D"},{"inpName":"","inpType":false,"type":"input","name":"","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Afalse%7D"}]},{"name":"%E4%B8%8A%E7%BA%A7%E8%AE%BE%E5%A4%87","value":[{"inpName":"","inpType":false,"type":"input","name":"%E4%B8%8A%E7%BA%A7%E8%AE%BE%E5%A4%87%E5%8F%8A%E7%BC%96%E5%8F%B7%E5%90%8D%E7%A7%B0","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Afalse%7D"},{"inpName":"","inpType":false,"type":"input","name":"%E6%8E%92%E5%BA%8F%E5%8F%B7","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Afalse%7D"}]}],"checkInfo":[{"type":"radio","name":"%E5%B7%A1%E6%A3%80%E4%BF%A1%E6%81%AF-%E6%88%B7%E5%A4%96%E9%9A%94%E7%A6%BB%E5%88%80%E9%97%B8","value":"yes"},{"inpName":"","inpType":true,"type":"input","name":"%E6%B8%A9%E5%BA%A6","value":"%7B%22inpName%22%3A%22%22%2C%22inpType%22%3Atrue%7D"}]}'
                    //                     };
                    // 如果有设备信息
                    if (data.deviceList.length > 0) {
                        $.each(data.deviceList, function (key, val, index) {
                            count++;
                            var name = "addModal" + val.fSubdeviceinfoid;
                            //  var string = ' <a role="presentation" href="#' + name + '" class="tab-link active button" id="tab' + name + '">' + text + '</a>';
                            var string = "";
                            var containStr = "";
                            if (key == 0) {
                                // var string = '<li role="presentation" class="active" name="' + val.fId + '">' +
                                //     '<a href="#' + name + '" aria-controls="home" role="tab" data-toggle="tab">' + decodeURIComponent(val.fPagename) + '</a></li>';
                                // var containStr = '<div role="tabpanel" class="tab-pane active" id="' + name + '">' +
                                //     '<div id="addVarContain' + count + '"></div>' +
                                //     '</div>';
                                string =
                                    ' <a role="presentation" href="#' +
                                    name +
                                    '" class="tab-link button" name="' +
                                    val.fSubdeviceinfoid +
                                    '" id="tab' +
                                    name +
                                    '"><span>' +
                                    decodeURIComponent(val.fDevicename) +
                                    "</span><i class='icon icon-edit'></i></a>";
                                containStr =
                                    '<div role="tabpanel" class="tab pull-to-refresh-content" id="' +
                                    name +
                                    '"><div class=\"pull-to-refresh-layer\"></div><div class="content-block tab-pane active" id="addVarContain' +
                                    count +
                                    '"></div></div>';
                                if (val.fRealimg != undefined) {
                                    imageListChange = JSON.parse(val.fRealimg);
                                }
                            } else {
                                // var string = '<li role="presentation" name="' + val.fId + '">' +
                                //     '<a href="#' + name + '" aria-controls="home" role="tab" data-toggle="tab">' + decodeURIComponent(val.fPagename) + '</a></li>';
                                // var containStr = '<div role="tabpanel" class="tab-pane" id="' + name + '">' +
                                //     '<div id="addVarContain' + count + '"></div>' +
                                //     '</div>';
                                string =
                                    ' <a role="presentation" href="#' +
                                    name +
                                    '" class="tab-link button" name="' +
                                    val.fSubdeviceinfoid +
                                    '" id="tab' +
                                    name +
                                    '"><span>' +
                                    decodeURIComponent(val.fDevicename) +
                                    "</span><i class='icon icon-edit'></i></a>";
                                containStr =
                                    '<div role="tabpanel" class="tab pull-to-refresh-content" id="' +
                                    name +
                                    '"><div class=\"pull-to-refresh-layer\"></div><div class="content-block tab-pane" id="addVarContain' +
                                    count +
                                    '"></div></div>';
                            }
                            $("#addDataUL").append(string);
                            $(".tab-content").append(containStr);
                            if (count == 101) {
                                $("#tab" + name).click();
                            }
                            //创建模板
                            var select = $("#addVarContain" + count);
                            creatInfo(selectInfo.fFunctionfield, $("#addVarContain" + count), count, name);
                            if (
                                val.fDevicejson != undefined &&
                                val.fDevicejson != "undefined"
                            ) {
                                //填充数据
                                showPageInfo(val.fDevicejson, select, name);
                            }
                        });
                    } else {
                        $("#delete").attr("disabled", true);
                        $("#copy").attr("disabled", true);
                        $("#save").attr("disabled", true);
                        $("#container-info")
                            .html(Operation['ui_nodata'] + "！")
                            .css("text-align", "center");
                    }
                    addEdit();
                }
            );
        }

        //点击Tab 切换图片数据
        $(document).on('click', '#addDataUL a', function (data) {
            $.each(curNodeInfo, function (i, val) {
                if (data.currentTarget.name == val.fSubdeviceinfoid) {
                    var savedInfo = [],
                        arr = [];
                    // 如果存在设备实例模板
                    if (val.fRealimg !== undefined) {
                        savedInfo = JSON.parse(val.fRealimg)
                    } else {
                        if (selectInfo.fPreviewfiles !== undefined) {
                            savedInfo = JSON.parse(selectInfo.fPreviewfiles)
                        }
                    }
                    $.each(savedInfo, function (i, val) {
                        arr.push(Substation.ipAddressFromAPP + imagePath + '/' + val)
                    })

                    $.initFile($("#upImage" + val.fSubdeviceinfoid), function (list) {
                        fileList = list
                    }, arr, val.fSubdeviceinfoid)
                }
            })
        })

        function getData() {
            // $("body").showLoading();
            var url = "/appMenuSelectHideOrShow";
            var params = "fSubid=" + subid;
            Substation.getDataByAjax(url, params, function (data) {
                var state = $("#showAllNodes").prop("checked"); //获取是否显示
                var showData = data;

                if (state == false) {
                    showData = data.filter(function (index) {
                        return index.state == "true";
                    });
                }

                // var setting = {
                //     edit: {
                //         enable: true
                //     },
                //     view: {
                //         dblClickExpand: false
                //     },
                //     data: {
                //         simpleData: {
                //             enable: true
                //         }
                //     },
                //     callback: {
                //         onClick: function (e, treeId, treeNode) {
                //             initHtml();
                // $("#save").attr("disabled", true);
                // $("#Add").attr("disabled", true);
                // $("#delete").attr("disabled", true);

                // // 父级节点无信息
                // if (treeNode.isParent == false) {
                //     onClick(treeNode);
                //     $("#save").removeAttr("disabled");
                //     $("#Add").removeAttr("disabled");
                //     $("#copy").removeAttr("disabled");
                //     $("#delete").removeAttr("disabled");
                // }
                // return false;
                //         }
                //     }
                // };
                // $.fn.zTree.init($("#treeDemo"), setting, showData); //初始化树结构
                // $("body").hideLoading();
            });
        }

        function initHtml() {
            // $(".megbox").remove();
            // $(":text").css({
            //     "border": '1px solid #ababab',
            //     "box-shadow": '0px 0px 0px #ababab'
            // });
            $(".tab-content").html("");
            $("a[role='presentation']").remove(); //清空原有信息
        }

        // 是否显示全部树结构
        // $("#showAllNodes").change(function () {
        //     getData();
        // });

        // 点击一个节点
        //        function onClick(treeNode) {
        //            // $("body").showLoading();
        //            Substation.getDataByAjax(
        //                "/pageCustomList",
        //                "fSubid=" + $.cookie("stationId") + "&fTemplateid=" + treeNode.id,
        //                function (data) {
        //                    // Substation.Common.getDataByAjax("authority/pageCustomList", "fSubid=" + subid + "&fTemplateid=" + tempId, function (data) {
        //                    curNodeInfo = data;
        //                    // 如果有设备信息
        //                    if (data.length > 0) {
        //                        $.each(data, function (key, val) {
        //                            count++;
        //                            var name = "addModal" + val.fId;
        //                            var string ="";
        //                            var containStr ="";
        //                            if (key == 0) {
        //                                // var string = '<li role="presentation" class="active" name="' + val.fId + '">' +
        //                                //     '<a href="#' + name + '" aria-controls="home" role="tab" data-toggle="tab">' + decodeURIComponent(val.fPagename) + '</a></li>';
        //                                // var containStr = '<div role="tabpanel" class="tab-pane active" id="' + name + '">' +
        //                                //     '<div id="addVarContain' + count + '"></div>' +
        //                                //     '</div>';
        //                                string =
        //                                    ' <a role="presentation" href="#' +
        //                                    name +
        //                                    '" class="tab-link active button" name="' +
        //                                    val.fId +
        //                                    '">' +
        //                                    decodeURIComponent(val.fPagename) +
        //                                    "</a>";
        //                                containStr =
        //                                    '<div role="tabpanel" class="tab active" id="' +
        //                                    name +
        //                                    '"> <div class="content-block tab-pane active" id="addVarContain' +
        //                                    count +
        //                                    '"></div></div>';
        //                            } else {
        //                                // var string = '<li role="presentation" name="' + val.fId + '">' +
        //                                //     '<a href="#' + name + '" aria-controls="home" role="tab" data-toggle="tab">' + decodeURIComponent(val.fPagename) + '</a></li>';
        //                                // var containStr = '<div role="tabpanel" class="tab-pane" id="' + name + '">' +
        //                                //     '<div id="addVarContain' + count + '"></div>' +
        //                                //     '</div>';
        //                                string =
        //                                    ' <a role="presentation" href="#' +
        //                                    name +
        //                                    '" class="tab-link active button" name="' +
        //                                    val.fId +
        //                                    '">' +
        //                                    decodeURIComponent(val.fPagename) +
        //                                    "</a>";
        //                                containStr =
        //                                    '<div role="tabpanel" class="tab active" id="' +
        //                                    name +
        //                                    '"> <div class="content-block tab-pane" id="addVarContain' +
        //                                    count +
        //                                    '"></div></div>';
        //                            }
        //                            $("#addDataUL").append(string);
        //                            $(".tab-content").append(containStr);
        //                            if (val.fPagejson != undefined && val.fPagejson != "undefined") {
        //                                creatInfo(val.fPagejson, $("#addVarContain" + count), count);
        //                            }
        //                        });
        //                    } else {
        //                        $("#delete").attr("disabled", true);
        //                        $("#copy").attr("disabled", true);
        //                        $("#save").attr("disabled", true);
        //                        $("#container-info")
        //                            .html("暂无相关信息！")
        //                            .css("text-align", "center");
        //                    }
        //                    $("body").hideLoading();
        //                }
        //            );
        //        }

        // 显示已有信息
        // < div id = "tab1"
        // role = "tabpanel"
        // class = "tab active" >
        //     <
        //     div class = "content-block"
        // id = "addVarContain123" >
        //     <
        //     div class = "content-block-title" > 信息一 < /div>
        function creatInfo(data, select, count, name) {
            if (data != "") {
                var info = JSON.parse(data);
                if (info != undefined) {
                    var divHeight = "300";
                    $.each(info.deviceInfo, function (index, val) {
                        var id = "showInfoDiv" + count + index;
                        $(select).append(
                            '<div class="content-block-title">' +
                            decodeURIComponent(val.name) +
                            '</div><div id="' +
                            id +
                            '" class="list-block baseInfoDiv" name="' +
                            decodeURIComponent(val.name) +
                            '"><ul class="selectUl"></ul></div>'
                        );
                        // $(select).append('<div class="content-block-title">' + decodeURIComponent(val.name) +
                        //     '</div><div id="' + id + '" class="list-block baseInfoDiv" name="' + decodeURIComponent(val.name) + '"><ul></ul></div>');
                        $.each(val.value, function (key, value) {
                            showInfo(value, $("#" + id + " .selectUl"), name);
                        });
                    });
                }
            }
        }

        //根据真实数据填充
        function showPageInfo(data, parent, name) {
            var pageInfo = JSON.parse(data);
            var imgid = name.substr(8);
            pageInfo.forEach(function (val, i) {
                val.value.forEach(function (value) {
                    var name = decodeURIComponent(value.name);
                    var prevLable = $(parent).children(".baseInfoDiv[name='" + val.name + "']").find(".item-title:contains('" + name + "')");
                    var info = decodeURIComponent(value.value);
                    switch (value.type) {
                        case "input":
                            $(prevLable).next("div").find("input").val(decodeURIComponent(value.value));
                            break;
                        case "radio":
                            if (info == "yes") {
                                $(prevLable).next("input[value='yes']").attr("checked", true);
                            }
                            if (info == "no") {
                                $(prevLable).next("input[value='no']").attr("checked", true);
                            }
                            break;
                        case "select":
                            var selectOption = decodeURIComponent(value.value);
                            var options = $(prevLable).next("select").children("option");
                            var select = $(prevLable).next("select");
                            $.each(options, function (key, value2) {
                                if (value2.innerHTML == selectOption) {
                                    // $(value2).attr('selected', true);
                                    $(select).val(value2.value);
                                }
                            });
                            break;
                        case "date":
                            $(prevLable).next($(".dateTime")).val(value.value);
                            try {
                                $(prevLable).next($(".datetime-local")).val(value.value.replace(" ", "T"));
                            } catch (e) {}
                            break;
                            // imgAdd
                        case "image":
                            var arr = [];
                            var savedInfo = []

                            if (imageListChange !== undefined) {
                                savedInfo = imageListChange;
                            } else {
                                if (selectInfo.fPreviewfiles !== undefined) {
                                    savedInfo = JSON.parse(selectInfo.fPreviewfiles)
                                }
                            }

                            $.each(savedInfo, function (i, val) {
                                arr.push(Substation.ipAddressFromAPP + imagePath + '/' + val)
                            })

                            $.initFile($("#upImage" + imgid), function (list) {
                                fileList = list
                            }, arr, imgid)
                            break;
                    }
                })
            })
            // console.log(pageInfo);
        }


        function showInfo(val, select, name) {
            count++;
            var string;
            var imgid = name.substr(8);
            // var functionfield = JSON.parse(selectInfo.fFunctionfield);
            // var info = functionfield.deviceInfo;
            switch (val.type) {
                case "input":
                    var info = JSON.parse(decodeURIComponent(val.value));
                    // var info = JSON.parse(decodeURIComponent(selectInfo.fFunctionfield));
                    if (info == true) {
                        // string = '<div class="showDiv">' +
                        // '<label class="nameInputInfo" name="input">' + decodeURIComponent(val.name) + '</label>' + ':' +
                        // '<input type="text" id="input' + count + '" class="valueInput" value="' + info.inpName + '" name="'
                        //  + info.inpType + '" validator="required" onblur="blurEvent(this)" onfocus="focusEvent(this)">' + '</div>';
                        string =
                            '<li><div class="item-content showDiv"><div class="item-inner"><div class="item-title label" name="input">' +
                            decodeURIComponent(val.name) +
                            '</div> <div class="item-input">' +
                            '<input type="text" id="input' +
                            count +
                            '" class="valueInput" value="' +
                            //                            info.inpName +
                            '" name="' +
                            //                            info.inpType +
                            '" validator="required" onblur="blurEvent(this)" onfocus="focusEvent(this)">' +
                            "</div></div></li>";
                    }
                    if (info == false) {
                        string =
                            '<li><div class="item-content showDiv"><div class="item-inner"><div class="item-title label" name="input">' +
                            decodeURIComponent(val.name) +
                            '</div> <div class="item-input">' +
                            '<input type="text" class="valueInput" value="' +
                            //                            info.inpName +
                            '" name="' +
                            //                            info.inpType +
                            '">' +
                            "</div></div></li>";
                    }
                    break;
                case "radio":
                    if (val.value == "yes") {
                        // string = '<div class="showDiv">' +
                        //     '<label class="nameInputInfo" name="radio">' + decodeURIComponent(val.name) + '</label>' + ':' +
                        //     '<input type="radio" id="operation' + count + '" name="operation' + count + '" value="yes" style="margin-left: 10px" checked><label style="margin-right: 10px" for="operation' + count + '">'+Operation['ui_yes']+'</label>' +
                        //     '<input type="radio" id="operationNo' + count + '" name="operation' + count + '" value="no"><label style="margin-right: 10px" for="operationNo' + count + '">'+Operation['ui_no']+'</label>' +
                        //     '</div>';
                        string =
                            '<li><div class="showDiv item-content"><div class="item-inner">' +
                            '<label class="item-title label nameInputInfo" name="radio">' +
                            decodeURIComponent(val.name) +
                            "</label>" +
                            '<input type="radio" id="operation' +
                            count +
                            '" name="operation' +
                            count +
                            '" value="yes" style="margin-left: 10px" checked><label style="margin-right: 10px" for="operation' +
                            count +
                            '">' + Operation['ui_yes'] + '</label>' +
                            '<input type="radio" id="operationNo' +
                            count +
                            '" name="operation' +
                            count +
                            '" value="no"><label style="margin-right: 10px" for="operationNo' +
                            count +
                            '">' + Operation['ui_no'] + '</label>' +
                            "</div></div></li>";
                    }
                    if (val.value == "no") {
                        // string = '<div class="showDiv">' +
                        //     '<label class="nameInputInfo" name="radio">' + decodeURIComponent(val.name) + '</label>' + ':' +
                        //     '<input type="radio" id="operation' + count + '" name="operation' + count + '" value="yes" style="margin-left: 10px"><label style="margin-right: 10px" for="operation' + count + '">'+Operation['ui_yes']+'</label>' +
                        //     '<input type="radio" id="operationNo' + count + '" name="operation' + count + '" value="no" checked><label style="margin-right: 10px" for="operationNo' + count + '">'+Operation['ui_no']+'</label>' +
                        //     '</div>';
                        string =
                            '<li><div class="showDiv item-content"><div class="item-inner">' +
                            '<label class="item-title label nameInputInfo" name="radio">' +
                            decodeURIComponent(val.name) +
                            "</label>" +
                            '<input type="radio" id="operation' +
                            count +
                            '" name="operation' +
                            count +
                            '" value="yes" style="margin-left: 10px"><label style="margin-right: 10px" for="operation' +
                            count +
                            '">' + Operation['ui_yes'] + '</label>' +
                            '<input type="radio" id="operationNo' +
                            count +
                            '" name="operation' +
                            count +
                            '" value="no" checked><label style="margin-right: 10px" for="operationNo' +
                            count +
                            '">' + Operation['ui_no'] + '</label>' +
                            "</div></div></li>";
                    }
                    break;
                case "select":
                    var list = JSON.parse(decodeURIComponent(val.value));
                    var opString = "<select>";
                    $.each(list, function (key, opval) {
                        // if (opval.opType == true) {
                        //     opString += "<option selected>" + opval.opName + "</option>";
                        // } else {
                        opString += '<option value=' + opval.opName + '>' + opval.opName + "</option>";
                        // }
                    });
                    opString += "</select>";

                    string =
                        '<li><div class="showDiv item-content"><div class="item-inner">' +
                        '<label class="nameInputInfo item-title label"  name="select">' +
                        decodeURIComponent(val.name) +
                        "</label>" +
                        opString +
                        "</div></div></li>";
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
                    if (val.value == "devInstall") {
                        string = '<li><div class="showDiv item-content"><div class="item-inner">' +
                            '<label class="item-title label nameInputInfo" style="width:initial;" name="date">' +
                            decodeURIComponent(val.name) +
                            "</label>" +
                            '<input type="datetime-local" class="daycalendarBox' +
                            count +
                            ' datetime-local" style="text-align:end;" min="2010-01-01T00:00" max="2050-01-01T00:00" value=""/></div></div></li>';
                    } else if (val.value == "devicewarranty") {
                        string = '<li><div class="showDiv item-content"><div class="item-inner">' +
                            '<label class="item-title label nameInputInfo" name="date">' +
                            decodeURIComponent(val.name) +
                            "</label>" +
                            '<input type="number" class="daycalendarBox' +
                            count +
                            ' dateTime" value="">' + Operation['ui_month'] + '</div></div></li>';
                    } else {
                        string = '<li><div class="showDiv item-content"><div class="item-inner">' +
                            '<label class="item-title label nameInputInfo" name="date">' +
                            decodeURIComponent(val.name) +
                            "</label>" +
                            '<input type="date" class="daycalendarBox' +
                            count +
                            ' dateTime" value="' +
                            decodeURIComponent(val.value) +
                            '"></div></div></li>';
                    }
                    break;
                    // imgAdd
                case "image":
                    string = '<li><div class="showDiv z_photo upimg-div"><div class="item-inner" style="display: block;">' +
                        '<label class="nameInputInfo item-title" name="image">' +
                        '<span class="compareName"></span>' +
                        '</label>' +
                        '<section class="z_file">' +
                        '<img class="add-img" src="img/chooseImg.png">' +
                        '<input type="file" id="upImage' + imgid + '" class="nameInput file" data-device="devImg" name="image">' +
                        '</section>' +
                        '</div></div></li>';
                    break;
                    // instructionAdd
                case "instruction":
                    if (selectInfo.fInstruction !== undefined && selectInfo.fInstruction !== "") {
                        string = '<li><div class="showDiv"><div class="item-inner">' +
                            '<label class="item-title label nameInputInfo" name="instruction" data-file="' + selectInfo.fInstruction + '">' +
                            '<span class="compareName">资料：</span>' +
                            '</label>' +
                            '<input type="button" class="nameInput" data-device="devInstruction" name="instruction" data-file="' + selectInfo.fInstruction + '" value="' + val.value + '(点击预览)" onclick="downloadFile(this)" data-name="' + val.value + '">' +
                            // '<input type="button" class="nameInput" id="fileClick' + imgid + '" data-device="devInstruction" name="instruction" data-file="' + selectInfo.fInstruction + '" value="' + val.value + '(点击预览)" onclick="downloadFile(this)" data-name="' + val.value + '">' +
                            '</div>';
                    } else {
                        string = '<li><div class="showDiv"><div class="item-inner">' +
                            '<label class="item-title label nameInputInfo" name="instruction">' +
                            '<span class="compareName">资料：</span>' +
                            '</label>' +
                            '<input type="button" class="nameInput" data-device="devInstruction" name="instruction" value="无" disabled>' +
                            '</div></div></li>';
                    }

                    break;
            }
            $(select).append(string);
            if (val.type == "date") {
                // initDate($(".daycalendarBox" + count));
            }

            // $("#fileClick" + imgid).click(function (select) {
            //     var fileName = $(select).parent().children('.nameInputInfo').attr("data-file")
            //     var name = $(select).attr("data-name")
            //     alert('正在导出...', '', '', {
            //         type: 'export',
            //         showConfirmButton: false
            //     });
            //     var formdata = new FormData();
            //     formdata.append("fileName", fileName);
            // });
        }
    }


    return _customerDevice;
})();

jQuery(document).ready(function () {
    // $(function () {
    var deviceGroupId = localStorage.getItem("fDeviceGroupId");
    var clickGroupTree = localStorage.getItem("clickGroupTree");
    var subid = localStorage.getItem("fSubid");
    var jumpPid = localStorage.getItem("pid");
    var lastClickNum = localStorage.getItem("clickNum");


    // $("#fileClick").click(function (select) {
    //     var fileName = $(select).parent().children('.nameInputInfo').attr("data-file")
    //     var name = $(select).attr("data-name")
    //     alert('正在导出...', '', '', {
    //         type: 'export',
    //         showConfirmButton: false
    //     });
    //     var formdata = new FormData();
    //     formdata.append("fileName", fileName);
    // })

    $("#goBackLastPid").click(function () {
        /*window.location.href =
            "deviceClass.html?pid=" + jumpPid + "&clickNum=" + lastClickNum;*/
        localStorage.setItem("pid", jumpPid);
        localStorage.setItem("clickNum", lastClickNum);
        if (isAndroid) {
            android.refresh();
            android.goBack();
        } else {
            localStorage.setItem("need-refresh", "true");
            window.history.back();
        }
    });

    //解决键盘遮挡问题
    window.addEventListener("resize", function () {
        if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
            window.setTimeout(function () {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
        }
    });
    // var tempId = localStorage.getItem("fTempId");
    // var parentId = localStorage.getItem("fPid");
    // var u = navigator.userAgent,
    //     app = navigator.appVersion;
    // var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
    // var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
    // //判断数组中是否包含某字符串
    // var baseUrlFromAPP;
    // var tokenFromAPP;
    // var subidFromAPP;
    // if (isIOS) { //ios系统的处理
    //     window.webkit.messageHandlers.iOS.postMessage(null);
    //     var storage = localStorage.getItem("accessToken");
    //     // storage = storage ? JSON.parse(storage):[];
    //     storage = JSON.parse(storage);
    //     baseUrlFromAPP = storage.baseurl;
    //     tokenFromAPP = storage.token;
    //     subidFromAPP = storage.fsubID;
    // } else {
    //     baseUrlFromAPP = android.getBaseUrl();
    //     tokenFromAPP = android.getToken();
    //     subidFromAPP = android.getfSubid();
    //     $("#meterName,#paramName").on("click", function () {
    //         var _this = this;
    //         setTimeout(function () {
    //             _this.scrollIntoViewIfNeeded();
    //         }, 200);
    //     });
    // }

    // tokenFromAPP =
    // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjYyMzg1NzcsInVzZXJuYW1lIjoiYWRtaW4ifQ.3ykmtPxVLS5D5031ts7-VrLe90jm-3OTQVV19Dp2RQg";

    var customerDevice = new CustomerDevice();

    // if ($.cookie("stationId") != undefined && $.cookie("subName") != undefined) {
    //     $("#StationName").html($.cookie('subName'));
    customerDevice.show();
    // } else {
    //     return;
    // }
    var Subname = localStorage.getItem("fSubname");
    $("#titleContent").html(Subname);

    // 新增按钮
    $("#Add").on("click", function () {
        if (!upLoadClicktag) {
            return;
        }
        upLoadClicktag = false;
        setTimeout(function () {
            upLoadClicktag = true;
        }, 500);
        var info = customerDevice.getselectInfo();
        if (info.fFunctionfield == undefined) {
            $.toast(Operation['ui_nodevice']);
            return;
        }

        var fSubdevicegroupid = info.id;
        var fDevicename = info.name;
        // var json = info.fFunctionfield;
        var json = JSON.parse(info.fFunctionfield);
        var newJson = JSON.stringify(json.deviceInfo);

        var formdata = new FormData();
        formdata.append("fSubid", subid);
        formdata.append("fDevicenamepath", clickGroupTree);
        formdata.append("fSubdevicegroupid", deviceGroupId);
        formdata.append("fDevicename", /*encodeURIComponent*/ (fDevicename));
        // formdata.append("fPagejson", json);
        if (newJson != undefined) {
            formdata.append("fPagejson", newJson);
        } else {
            console.log("信息错误！");
            return;
        }
        // var url = "/addDevice";

        // Substation.postFormDataByAjax(url, formdata, function (data) {
        //     if (data.msg != "ok") {
        //         $.toast("新增失败！");
        //     } else {
        customerDevice.addModal();
        // $(".active[role='presentation']").attr(
        //     "name",
        //     data.data.fSubdeviceinfoid
        // );
        $("#addDataUL").scrollLeft(10000);
        $("#save").removeAttr("disabled");
        $.prompt(Operation['ui_deviceName'], function (value) {
            $(".tab-link.active span").text(value);
            $("#addDataUL").scrollLeft(10000);
        });
        //     }
        // });
    });

    // 复制按钮
    $("#copy").on("click", function () {
        if (!upLoadClicktag) {
            return;
        }
        upLoadClicktag = false;
        setTimeout(function () {
            upLoadClicktag = true;
        }, 500);
        var canCopy = $(".tab-link").hasClass("button");
        if (!canCopy) {
            $.toast(Operation['ui_cannotcopy']);
            return;
        }
        var selectId = $(".active[role='presentation']").attr("name");
        if (selectId === undefined) {
            $.toast(Operation['ui_nosave']);
            return;
        }
        var info = customerDevice.getselectInfo();

        var infoid = info.id;
        var fPagename = info.name;

        var nodeInfo = customerDevice.returnNodeInfo();
        var json;
        var selectDevice = $(".active[role='presentation']").attr("name");
        $.each(nodeInfo, function (key, val) {
            if (selectDevice == (val.fSubdeviceinfoid).toString()) {
                json = val.fDevicejson;
                return false;
            }
        });

        var formdata = new FormData();
        formdata.append("fSubid", subid);
        formdata.append("fSubdevicegroupid", deviceGroupId);
        formdata.append("fDevicenamepath", clickGroupTree);
        var deviceName = $(".tab-link.active span").text() + "copy";
        formdata.append("fDevicename", deviceName);
        if (json != undefined) {
            formdata.append("fDevicejson", json);
        }
        var url = "/addDevice";
        Substation.postFormDataByAjax(url, formdata, function (data) {
            if (data.msg != "ok") {
                $.toast(Operation['ui_copyFail']);
            } else {
                customerDevice.addModal(json, deviceName);
                $(".active[role='presentation']").attr("name", data.data.fSubdeviceinfoid);
                $.toast(Operation['ui_copySuccess']);
                $("#addDataUL").scrollLeft(10000);
            }
        });
    });

    // 删除按钮
    $("#delete").on("click", function () {
        if (!upLoadClicktag) {
            return;
        }
        upLoadClicktag = false;
        setTimeout(function () {
            upLoadClicktag = true;
        }, 500);
        var canCopy = $(".tab-link").hasClass("button");
        if (!canCopy) {
            $.toast(Operation['ui_cannotdel']);
            return;
        }
        var selectId = $(".active[role='presentation']").attr("name");
        if (selectId === undefined) {
            //            $.toast("当前设备暂未保存！");
            var id = $(".active[role='presentation']").attr("href");
            var prevLi = $(".active[role='presentation']").prev();
            var nextLi = $(".active[role='presentation']").next();
            // var prevLi = $(".active[role='presentation']");
            $(".active[role='presentation']").remove();
            $(id).remove();
            if (prevLi != undefined && prevLi.length > 0) {
                //TODO: 如有其它tab则选中它
                prevLi.click();
                // $(prevLi).tab("show");
                // $("a", $(prevLi)).tab("show");
            } else {
                nextLi.click();
            }
            return;
        }
        var name = $(".active[role='presentation']").text();
        $.confirm(Operation['ui_suredel'] + name + Operation['ui_question'], function () {
            Substation.getDataByAjaxAllData(
                "/deleteDevice",
                "deleteId=" + selectId,
                function (data) {
                    if (data.code == 200) {
                        $.toast(Operation['ui_delsuccess']);
                        var id = $(".active[role='presentation']").attr("href");
                        var prevLi = $(".active[role='presentation']").prev();
                        var nextLi = $(".active[role='presentation']").next();
                        // var prevLi = $(".active[role='presentation']");
                        $(".active[role='presentation']").remove();
                        $(id).remove();
                        if (prevLi != undefined && prevLi.length > 0) {
                            //TODO: 如有其它tab则选中它
                            prevLi.click();
                            // $(prevLi).tab("show");
                            // $("a", $(prevLi)).tab("show");
                        } else {
                            nextLi.click();
                        }
                    } else {
                        $.toast(Operation['ui_delFail']);
                    }
                }
            );
        });
    });

    // 保存按钮点击
    $("#save").on("click", function () {
        if (!upLoadClicktag) {
            return;
        }
        upLoadClicktag = false;
        setTimeout(function () {
            upLoadClicktag = true;
        }, 500);
        var canCopy = $(".tab-link").hasClass("button");
        if (!canCopy) {
            $.toast(Operation['ui_nosave']);
            return;
        }
        var isTrue = true;
        // var input = $(".tab.active").find(".valueInput[name='true']");
        var input = $(".tab.active").find(".valueInput[name='true']");
        $.each(input, function (key, val) {
            if (!Substation.Validator.validate($(val), "")) {
                $("#save").attr("disabled", true);
                isTrue = false;
                return false;
            }
        });

        if (isTrue) {
            var fPagejson = [];
            var divList = $(".tab.active").find(".baseInfoDiv");
            $.each(divList, function (key, val) {
                var text = $(val).attr("name");
                fPagejson.push({
                    name: /*encodeURIComponent*/ (text),
                    value: []
                });
                var infoList = $(val).children().children().children('.showDiv');
                $.each(infoList, function (index, val) {
                    var row = {};
                    // var select = $(val).children(".nameInputInfo");
                    var select = $(val)
                        .children()
                        .children(".item-title");
                    var name = $(select).text();
                    var type = $(select).attr("name");
                    var value;
                    switch (type) {
                        case "input":
                            value = $(val).find($(".valueInput")).val();
                            // value = $(val).children().children(".item-input").val();
                            // var row = {};
                            // row.inpName = $(val).find($(".valueInput")).val();
                            // row.inpType = JSON.parse($(val).find($(".valueInput")).attr("name"));
                            // value = JSON.stringify(row);
                            break;
                        case "radio":
                            value = $(val).children().find($("input:checked")).val();
                            break;
                        case "select":
                            value = $(val).find('select option:selected').val();
                            // value = $(val).children().children("select").val();
                            break;
                        case "date":
                            // value = $(val).children().children(".dateTime").val();
                            if ($(val).find($(".dateTime"))) {
                                value = $(val).find($(".dateTime")).val();
                            }
                            if ($(val).find($(".datetime-local"))) {
                                try {
                                    value = $(val).find($(".datetime-local")).val().replace("T", " ");
                                } catch (e) {}
                            }
                            break;
                        case "image":
                            value = 'image';
                            name = "image"
                            break;
                    }
                    row.type = type;
                    row.name = /*encodeURIComponent*/ (name);
                    row.value = /*encodeURIComponent*/ (value);
                    fPagejson[key].value.push(row);
                });
            });
            var deviceinfoid = $(".active[role='presentation']").attr("name");
            if (deviceinfoid === undefined) {
                insertDevice(fPagejson);
            } else {
                upData(fPagejson);
            }
            // upData(fPagejson);
        }
    });

    function fileDown(select) {
        var fileName = $(select).parent().children('.nameInputInfo').attr("data-file")
        var name = $(select).attr("data-name")
        alert('正在导出...', '', '', {
            type: 'export',
            showConfirmButton: false
        });
        var formdata = new FormData();
        formdata.append("fileName", fileName);

    }

    function insertDevice(fDevicejson) {
        // var info = customerDevice.getselectInfo();

        // var formdata = new FormData();
        // formdata.append("fSubid", $.cookie("stationId"));
        // formdata.append("fSubdevicegroupid", info.id);
        // formdata.append("fDevicename", info.name);
        // formdata.append("fDevicejson", fDevicejson);
        // formdata.append("fDevicenamepath", info.treePathName);

        // Substation.Common.requestDataByPOST("authority/addDevice", formdata, function (data) {
        //     if (data.code === 200) {
        //         $(".active[role='presentation']").attr("name", data.data.Subdeviceinfoid);
        //         code.codeConfig.context(2004);
        //     } else {
        //         alert("保存失败！");
        //     }
        // })

        var info = customerDevice.getselectInfo();

        if (info.fFunctionfield == undefined) {
            $.alert(Operation['ui_devicetemplate']);
            return;
        }

        var fSubdevicegroupid = info.id;
        var fDevicename = info.name;
        // var json = info.fFunctionfield;
        var json = JSON.parse(info.fFunctionfield);
        var newJson = JSON.stringify(json.deviceInfo);

        var formdata = new FormData();
        formdata.append("fSubid", subid);
        formdata.append("fDevicenamepath", clickGroupTree);
        formdata.append("fSubdevicegroupid", deviceGroupId);
        var deviceName = $(".tab-link.active span").text();
        formdata.append("fDevicename", deviceName);
        // formdata.append("fDevicename", encodeURIComponent(fDevicename));
        // formdata.append("fPagejson", json);
        if (newJson != undefined) {
            var json = JSON.stringify(fDevicejson);
            formdata.append("fDevicejson", json);
        } else {
            console.log("信息错误！");
            return;
        }
        // imgAdd
        var fileList = customerDevice.getFilelist();

        $.each(fileList, function (i, item) {
            formdata.append("realImgs", item);
        });

        var url = "/addDevice";

        Substation.postFormDataByAjax(url, formdata, function (data) {
            if (data.msg != "ok") {
                $.toast(Operation['ui_addFail']);
            } else {
                // customerDevice.addModal();
                $(".active[role='presentation']").attr(
                    "name",
                    data.data.fSubdeviceinfoid
                );
                $("#save").removeAttr("disabled");
                $.toast(Operation['ui_savesuccess']);
                setTimeout(function () {
                    customerDevice.reNewCurNodeInfo();
                }, 2000);
                // $("#addDataUL").scrollLeft(10000);
                // upData(fDevicejson);
            }
        });

    }


    function upData(fPagejson) {
        // var json = JSON.stringify(fPagejson);

        // var fId = $(".active[role='presentation']").attr("name");

        // var formdata = new FormData();
        // formdata.append("fId", fId);
        // formdata.append("fPagejson", json);
        // var url = "/updateDevice";
        var json = JSON.stringify(fPagejson);
        var fId = $(".active[role='presentation']").attr("name");
        var info = customerDevice.getselectInfo();
        var formdata = new FormData();
        formdata.append("fSubid", subid);
        formdata.append("fSubdevicegroupid", deviceGroupId);
        formdata.append("fSubdeviceinfoid", fId);
        formdata.append("fDevicejson", json);
        // imgAdd
        var fileList = customerDevice.getFilelist();

        $.each(fileList, function (i, item) {
            formdata.append("realImgs", item);
        });

        var url = "/updateDevice";
        Substation.postFormDataByAjax(url, formdata, function (data) {
            if (data.code == 200) {
                $.toast(Operation['ui_savesuccess']);
                setTimeout(function () {
                    customerDevice.reNewCurNodeInfo();
                }, 2000);
            }
        });
    }

    //点击弹出弹窗加载信息
    $("#myModal").on("shown.bs.modal", function () {
        Substation.DOMOperator.pagenation("main/getSubstationListByUser", 1, 8);
    });
    $("#myModal").on("hide.bs.modal", function () {
        $("#tableSubName").html("");
        $(".substationlist").val("");
    });

    $("#yesBtn").click(function (event) {
        var row = selectedInfoModal;
        Substation.DOMOperator.yesBtnClick(row);
        $("#myModal").modal("hide");
        $("#treeDemo").html("");
        customerDevice.show();
    });

    $(document).on("click", ".nav-tabs li", function () {
        // $(".megbox").remove();
        // $(":text").css({
        //     "border": '1px solid #ababab',
        //     "box-shadow": '0px 0px 0px #ababab'
        // });
        $("#save").removeAttr("disabled");
    });
    // });

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



    // input选中事件
    function focusEvent(select) {
        Substation.Validator.setFocus($(select));
        $("#save").removeAttr("disabled");
    }
    // $.init();
});

function downloadFile(file) {
    var fileName = $(file).parent().children('.nameInputInfo').attr("data-file")
    if (!upLoadClicktag) {
        return;
    }
    upLoadClicktag = false;
    setTimeout(function () {
        upLoadClicktag = true;
    }, 1000);
    if (isAndroid) {
        android.openFile(
            Substation.ipAddressFromAPP + imagePath + "/" + fileName
        );
    } else {
        if (fileName) {
            var dic = {
                'fFilepath': imagePath,
                'fFilecode': fileName,
                'fFilename': fileName
            };
            window.webkit.messageHandlers.pushDownFileVC.postMessage(dic);
        }
    }
}