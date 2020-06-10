jQuery(document).ready(function () {
    // $(function () {
    var titlename = localStorage.getItem("fSubname");
    $("#titleContent").text(titlename);
    //alert("1");
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

    function loadMenu() {
        $(".showlist").empty();
        var isEnglish = 0;
        if (languageOption == "en") {
            isEnglish = 1;
        } else {
            isEnglish = 0;
        }
        Substation.getDataByAjax("/getMessInfoType", {
            "english": isEnglish
        }, function (data) {
            // {
            //     messageType: [{
            //         fMessinfotypeid: 1,
            //         fMessinfotypeexplain: "工作",
            //         flag: true
            //     }, {
            //         fMessinfotypeid: 2,
            //         fMessinfotypeexplain: "test",
            //         flag: true
            //     }, {
            //         fMessinfotypeid: 3,
            //         fMessinfotypeexplain: "test2",
            //         flag: true
            //     }]
            // } = $1
            if (data.hasOwnProperty("tDtMessInfoType") && data.tDtMessInfoType.length > 0) {
                var strVar = "";
                $(data.tDtMessInfoType).each(function () {
                    var checkStr = "";
                    if (this.flag == true) {
                        checkStr = " checked=true";
                    }
                    strVar += " <li class='parentLi' data-flag='" + this.flag + "' data-id='" + this.fMessinfotypeid + "'>";
                    strVar += '                            <div class="item-content">';
                    strVar +=
                        '                                <div class="item-inner">';
                    strVar +=
                        '                                    <div class="item-title label">' +
                        this.fMessinfotypeexplain +
                        "</div>";
                    strVar +=
                        '                                    <div class="item-input">';
                    strVar +=
                        '                                        <label class="label-switch">';
                    strVar +=
                        '                                            <input class="cbselect" type="checkbox" name="checkbox" data-id="' + this.fMessinfotypeid + '"' + checkStr +
                        '">';
                    strVar +=
                        '                                            <div class="checkbox"></div>';
                    strVar += "                                        </label>";
                    strVar += "                                    </div>";
                    strVar += "                                </div>";
                    strVar += "                            </div>";
                    strVar += "                        </li>";
                });
                $(".showlist").append(strVar);
                $(".parentLi").each(function (i, dom) {
                    var thisType = $(dom).attr("data-id");
                    Substation.getDataByAjax("/selectByMessInfoTypeId", {
                        fMessinfotypeid: thisType
                    }, function (data) {
                        if (data.tDtMessInfoType != undefined && data.tDtMessInfoType.length > 0) {
                            var ulDom = $("<ul data-parentId='" + thisType + "'></ul>");
                            $(data.tDtMessInfoType).each(function (i, obj) {
                                var checkVal = "";
                                if (this.flag == true) {
                                    checkVal = " checked=true";
                                }
                                $(ulDom).append("<li class='childLi' data-code=\"" + obj.fMessinfocode + "\">\n" +
                                    "                                            <div class=\"item-content\">\n" +
                                    "                                                <div class=\"item-inner\">\n" +
                                    "                                                   <div class=\"item-title label\">" + obj.fMessinfoexplain + "</div>\n" +
                                    "                                                <div class='item-input'><label class='label-switch'>\n" +
                                    "                                                   <input class=\"cbselect\" type=\"checkbox\" name=\"checkbox\" data-code=\"" + obj.fMessinfocode + "\"" + checkVal + ">\n" +
                                    "                                                   <div class='checkbox'></div>\n" +
                                    "                                                </label></div>\n" +
                                    "                                                <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                                    "                                                </div>\n" +
                                    "                                            </div>\n" +
                                    "</li>");
                            });
                            $(ulDom).appendTo(dom);
                            changeLoadChildren(dom);
                            $(".cbselect").off("change", changeFunction).on("change", changeFunction);
                        }
                    });
                });
            }

            //      $(".cbselect")
            //        .unbind()
            //        .click(function () {
            //          var fMessinfotypeid = $(this).attr("id");
            //          var checkValue = $(this).prop("checked");
            //          // if ($("input[type='checkbox']").prop("checked")) {
            //          var showStr = Operation['ui_subscribe'] + $(this).attr("name") + Operation['ui_successfully'];
            //          if (checkValue == true) {
            //            param = {
            //              fMessinfotypeid: fMessinfotypeid,
            //              flag: true
            //            };
            //            Substation.getDataByAjaxNoLoading(
            //              "/subscribeMessage",
            //              param,
            //              function (data) {
            //                $.alert(showStr);
            //                $(this).prop("checked", true);
            //              }
            //            );
            //          } else {
            //            param = {
            //              fMessinfotypeid: fMessinfotypeid,
            //              flag: false
            //            };
            //            Substation.getDataByAjaxNoLoading(
            //              "/subscribeMessage",
            //              param,
            //              function (data) {
            //                // alert("已取消");
            //                $(this).removeAttr("checked");
            //              }
            //            );
            //          }
            //        });
        });
    }

    function changeLoadChildren(dom) {
        var dataFlag = $(dom).attr("data-flag");
        var dataId = $(dom).attr("data-id");
        if (dataFlag == "true") {
            $("ul[data-parentId='" + dataId + "']").show();
        } else {
            $("ul[data-parentId='" + dataId + "']").hide();
        }
    }

    function changeFunction() {
        var checkValue = $(this).prop("checked");
        var dataCode = $(this).attr("data-code");
        var thisLi;
        var params = {};
        if (dataCode == undefined) {
            dataCode = $(this).attr("data-id");
            thisLi = $("li[data-id='" + dataCode + "']");
        } else {
            thisLi = $("li[data-code='" + dataCode + "']");
        }
        var thisLiClass = $(thisLi).attr("class");
        if (thisLiClass == "parentLi") {
            params['fMessinfotypeid'] = dataCode;
            if (checkValue) {
                $(thisLi).attr("data-flag", "true");
                params['typeflag'] = true;
                Substation.getDataByAjax("/subscribeMessInfoOrNot", params, function (data) {
                    $(thisLi).find(".cbselect").prop("checked", true);
                    changeLoadChildren($(thisLi));
                });
            } else {
                $(thisLi).attr("data-flag", "false");
                params['typeflag'] = false;
                Substation.getDataByAjax("/subscribeMessInfoOrNot", params, function (data) {
                    $(thisLi).find(".cbselect").removeAttr("checked");
                    changeLoadChildren($(thisLi));
                });
            }
        } else {
            params['fMessinfocode'] = dataCode;
            if (checkValue) {
                params['codeflag'] = true;
            } else {
                params['codeflag'] = false;
                var changeParent = false;
                $($(thisLi).parent().find(".cbselect")).each(function (i, obj) {
                    if ($(obj).prop("checked")) {
                        changeParent = false;
                        return false;
                    } else {
                        changeParent = true;
                    }
                });
                if (changeParent) {
                    var parentId = $(thisLi).parent().attr("data-parentId");
                    $("input[data-id='" + parentId + "']").removeAttr("checked");
                    $("li[data-id='" + parentId + "']").attr("data-flag", "false");
                    changeLoadChildren($("li[data-id='" + parentId + "']"));
                }
            }
            Substation.getDataByAjax("/subscribeMessInfoOrNot", params, function (data) {

            });
        }
    }

    loadMenu();

    // $("#check1").click(function () {
    //     var showli = ' <li id="sli1"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">烟雾 </div><';
    //     showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
    //     showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';

    //     showli += ' <li id="sli2"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">越限 </div><';
    //     showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
    //     showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';
    //     if ($(this).prop("checked")) {
    //         // $(this).removeAttr("checked");
    //         $("#mostLi").after(showli);
    //     } else {
    //         $("#sli1").remove();
    //         $("#sli2").remove();
    //         // $(this).prop("checked", true);
    //     }
    // });

    // $("#check2").click(function () {
    //     var showli = ' <li id="sli3"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">开关门 </div><';
    //     showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
    //     showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';

    //     if ($(this).prop("checked")) {
    //         // $(this).removeAttr("checked");
    //         $("#moreLi").after(showli);
    //     } else {
    //         $("#sli3").remove();
    //         // $(this).prop("checked", true);
    //     }
    // });

    // $("#check3").click(function () {
    //     var showli = ' <li id="sli4"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">仪表离线 </div><';
    //     showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
    //     showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';
    //     showli += ' <li id="sli5"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">网关离线 </div><';
    //     showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
    //     showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';
    //     if ($(this).prop("checked")) {
    //         // $(this).removeAttr("checked");
    //         $("#noremalLi").after(showli);
    //     } else {
    //         $("#sli4").remove();
    //         $("#sli5").remove();
    //         // $(this).prop("checked", true);
    //     }
    // });

    window.addEventListener(
        "pageshow",
        function (event) {
            if (localStorage.getItem("need-refresh") == "true") {
                localStorage.removeItem("need-refresh");
                location.reload();
            }
        },
        false
    );

    function showAll(treeList, parent) {
        $(treeList).each(function (index, obj) {
            if (obj.hasOwnProperty("nodes") && obj.nodes.length > 0) {
                var li = $("<li id=\"" + obj.id + "\" data-parentId=\"" + obj.fParentid + "\"></li>");
                $(li).append("                                            <label class=\"label-checkbox item-content\">\n" +
                    "                                                <input type=\"checkbox\" name=\"checkbox\" value=\"" + obj.id + "\">\n" +
                    "                                                <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                    "                                                <div class=\"item-inner\">\n" +
                    "                                                    <div class=\"item-title-row\">\n" +
                    "                                                        <div class=\"item-title\">" + obj.text + "</div>\n" +
                    "                                                    </div>\n" +
                    "                                                </div>\n" +
                    "                                            </label>\n").append("<ul></ul>").appendTo(parent);
                showAll(obj.nodes, $(li).children().eq(1));
            } else {
                $("<li id=\"" + obj.id + "\" data-parentId=\"" + obj.fParentid + "\"></li>").append(
                    "                                            <label class=\"label-checkbox item-content\">\n" +
                    "                                                <input type=\"checkbox\" name=\"checkbox\" value=\"" + obj.id + "\">\n" +
                    "                                                <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                    "                                                <div class=\"item-inner\">\n" +
                    "                                                    <div class=\"item-title-row\">\n" +
                    "                                                        <div class=\"item-title\">" + obj.text + "</div>\n" +
                    "                                                    </div>\n" +
                    "                                                </div>\n" +
                    "                                            </label>\n").appendTo(parent);
            }
        });
    }

    function addClick() {
        $(".media-list input[name='checkbox']").change(function () {
            var thisValue = $(this).prop("checked");
            var thisVal = $(this).val();
            if (thisValue == true) {
                $(this).parents("li").each(function (index, obj) {
                    $($(obj).find('input[name="checkbox"]')[0]).prop("checked", true);
                });
                $(this).parent().parent().find("input[name='checkbox']").each(function (index, obj) {
                    $(obj).prop("checked", true)
                });
            } else {
                /*            $(this).parents("li").each(function(index,obj){
                                if($(obj).find($("input[name='checkbox']:checked").val()!="").length==0){
                                    $($(obj).find('input[name="checkbox"]')[0]).prop("checked",false);
                                }
                            });*/
                $(this).parent().parent().find("input[name='checkbox']").each(function (index, obj) {
                    $(obj).prop("checked", false)
                });
                var parentLi = $("#" + thisVal).parent().parent("li");
                while (parentLi) {
                    if (parentLi.find("input[name='checkbox']:checked").length == 1) {
                        $(parentLi.find("input[name='checkbox']")[0]).prop("checked", false);
                        parentLi = parentLi.parent().parent("li");
                    } else {
                        break;
                    }
                }
            }
        });
    }

    $.init();
});