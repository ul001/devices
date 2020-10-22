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
 jQuery(document).ready(function () {

     var selectSubid = "";
     var clickSubid = "";
     var clickName = "";

     if (subObj != null && subObj != undefined) {
         selectSubid = subObj.subId;
         clickName = subObj.subName;
         $("#search").val(subObj.subName);
         $("#subName").text(subObj.subName);
         $(".item-content[data-id=" + subObj.subId + "]")
             .addClass("select")
             .siblings()
             .removeClass("select");
     }
     loadMenu();
     getSomeSubstation(1);
     // $("#outTip").click(function () {
     //     $("#outTip").hide();
     // });
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
                         } else if (this.fCode == "arcmControl") {
                             sb +=
                                 '                                <img class="imgBox" src="img/yibiaosort.png">';
                         } else if (this.fCode == "cameraControl") {
                             sb +=
                                 '                                <img class="imgBox" src="img/camera.png">';
                         } else if (this.fCode == "FanControl") {
                             sb +=
                                 '                                <img class="imgBox" src="img/FanControl.png">';
                         } else if (this.fCode == "SVGControl") {
                             sb +=
                                 '                                <img class="imgBox" src="img/SvgControl.png">';
                         } else if (this.fCode == "AirControl") {
                             sb +=
                                 '                                <img class="imgBox" src="img/airContol.png">';
                         } else if (this.fCode == "arcm310Control") {
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
                                 var thisTitleName = $($("#" + clickId).find(".label-title")[0]).text();
                                 if (clickId == "lightingControl") {
                                     localStorage.setItem("controlClassTitle", thisTitleName);
                                     window.location.href = "lightingControl.html?fSubid=" + selectSubid;
                                 } else if (clickId == "arcmControl") {
                                     localStorage.setItem("controlClassTitle", thisTitleName);
                                     window.location.href = "arcm300TControl.html?fSubid=" + selectSubid;

                                 } else if (clickId == "arcm310Control") {
                                     localStorage.setItem("controlClassTitle", thisTitleName);
                                     window.location.href = "arcm310Control.html?fSubid=" + selectSubid;
                                     // window.location.href = "arcm310SelectTime.html?fSubid=" + selectSubid;
                                 } else if (clickId == "cameraControl") {
                                     if (isAndroid) {
                                         android.videoWatch(selectSubid);
                                     } else if (isIOS) {
                                         var subParam = {
                                             Subid: selectSubid,
                                             Subname: clickName
                                         };
                                         window.webkit.messageHandlers.pushVideoListVC.postMessage(subParam);
                                     }
                                 } else if (clickId == "FanControl") {
                                     //风机
                                     localStorage.setItem("controlClassTitle", thisTitleName);
                                     window.location.href = "lopenOrCloseControl.html?fSubid=" + selectSubid + "&deviceType=05004";
                                 } else if (clickId == "SVGControl") {
                                     //SVG
                                     localStorage.setItem("controlClassTitle", thisTitleName);
                                     window.location.href = "lopenOrCloseControl.html?fSubid=" + selectSubid + "&deviceType=05002";
                                 } else if (clickId == "AirControl") {
                                     //空调
                                     localStorage.setItem("controlClassTitle", thisTitleName);
                                     window.location.href = "lopenOrCloseControl.html?fSubid=" + selectSubid + "&deviceType=05003";
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
         }, function (errorcode) {});
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

     //筛选事件新增
     $(".pull-right").click(function () {
         peopleType = $(this).attr("id");
         $.router.loadPage("#page1");
         $("#page1 .content").scrollTop(0);

         $("#peopleType").text(Operation['ui_substation']);
         $("#searchUser").prop("placeholder", Operation['ui_selectSubTip']);
         selectUserList = subList;

         $("#peopleClass").hide();
         $("#subClass").show();
         //组织机构
         Substation.getDataByAjax("/getCompanyListBypIdV2", {}, function (data) {
             $("#subClass .item-title").html('<span data-id="' + data.tBdCompany[0].fCoaccountno + '">' + Substation.removeUndefined(data.tBdCompany[0].fConame) + '</span>');
             thisGroupid = data.tBdCompany[0].fCoaccountno;
             getGroupClass(data.tBdCompany[0].fCoaccountno);
         });

         if (selectUserList.length > 0) {
             $("#showSelected").html(Operation['ui_hasSelected'] + ":" + selectUserList.length + Operation['ui_personNum'] + "<i class='icon icon-up'></i>");
             $("#showSelected").off("click", goToSelectedPage).on("click", goToSelectedPage);
         } else {
             $("#showSelected").html(Operation['ui_hasSelected'] + ":");
             $("#showSelected").off("click", goToSelectedPage);
         }
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
         //  
         $.toast(Operation["ui_subSelectTip"]);
         setTimeout(function () {
             $(".pull-right").click();
         }, 100);
         // $("#outTip").hide();
     } else {
         $("#searchBtn").click();
         // $("#outTip").hide();
     }


 });

 //mainPage
 function listPeople(thisType, userList) {
     var html = "";
     if (userList.length > 0) {
         // $(userList).each(function () {
         //     html += '<span class="common">' + Substation.removeUndefined(this.userName) + '<i data-type=\"' + thisType + '\" data-id=\"' + this.userId + '\" data-name=\"' + Substation.removeUndefined(this.userName) + '\" class="icon icon-close"></i></span>';
         // });
         // $(".peopleList." + thisType).html(html);
         // $(".peopleList." + thisType).show();
         $(userList).each(function () {
             selectSubid = this.userId;
             var subObj = {
                 subId: this.userId,
                 subName: this.userName
             };
             localStorage.setItem("subObj", JSON.stringify(subObj));
             try {
                 if (isAndroid) {
                     android.setSpItem("subObj", JSON.stringify(ubObj));
                 }
             } catch (e) {}
             clickSubid = "";
             $("#subName").text(this.userName);
         });
         $(".icon.icon-close").off("click", addCloseFunction).on("click", addCloseFunction);
     }
 }

 /*
             Following is page1 page1 page1 page1 page1
 */
 function listSubPeople(subId) {
     Substation.getDataByAjaxMain("/main/getDefaultInfoByfSubId", {
         fSubid: subId
     }, function (data) {
         if (data.substation.defaultChargenameList != undefined) {
             chargerUser = [];
             $.each(data.substation.defaultChargenameList, function () {
                 chargerUser.push({
                     userId: this.fUserid,
                     userName: this.fUsername
                 });
                 listPeople("charger", chargerUser);
             });
         }
         if (data.substation.defaultUsernameList != undefined) {
             workerUser = [];
             $.each(data.substation.defaultUsernameList, function () {
                 workerUser.push({
                     userId: this.fUserid,
                     userName: this.fUsername
                 });
                 listPeople("worker", workerUser);
             });
         }
     });
 }

 var thisGroupid = -1;
 var subList = [];
 var selectUserList = [];
 var chargerUser = [];
 var workerUser = [];
 var peopleType = "substation";

 function getGroupClass(pid) {
     $(".classUl").empty();
     $("#classList").show();
     //组织机构
     Substation.getDataByAjax("/getCompanyListBypIdV2", {
         fCoaccountno: pid
     }, function (data) {
         if (data.hasOwnProperty("tBdCompany") && data.tBdCompany.length > 0) {
             $(".classUl").show();
             var html = "";
             $(data.tBdCompany).each(function () {
                 html += "<li>\n" +
                     "    <div class=\"item-content\">\n" +
                     "        <div class=\"item-inner\">\n" +
                     "            <div class=\"item-title\">" + Substation.removeUndefined(this.fConame) + "</div>\n" +
                     "            <div class=\"item-after\">\n" +
                     "                <span class=\"nextClass\" data-id=\"" + this.fCoaccountno + "\" data-name=\"" + Substation.removeUndefined(this.fConame) + "\">\n" +
                     "                    <i class=\"icon icon-nextclass\"></i>" + Operation['ui_nextClass'] + "\n" +
                     "                </span>\n" +
                     "            </div>\n" +
                     "        </div>\n" +
                     "    </div>\n" +
                     "</li>";
             });
             $(".classUl").html(html);
             $(".nextClass").off("click", nextClassClick).on("click", nextClassClick);
         } else {
             $(".classUl").hide();
         }
         getPersonList(pid);
     });

 }

 function getPersonList(gid) {
     $("#personListUl").empty();
     Substation.postDataByAjax("/getSubstationListBySubGroupId", {
         fCoaccountno: gid
     }, function (data) {
         if (data.data.hasOwnProperty("list") && data.data.list.length > 0) {
             $(".personUl").show();
             //修改单选
             $("#selectAll").hide();
             var html = "";
             $(data.data.list).each(function () {
                 html += "<li>\n" +
                     "    <label class=\"label-checkbox item-content\">\n" +
                     "        <input type=\"checkbox\" name=\"my-checkbox\" id=\"" + this.fSubid + "\" data-name=\"" + Substation.removeUndefined(this.fSubname) + "\">\n" +
                     "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                     "        <div class=\"item-inner\">\n" +
                     "            <div class=\"item-title\">" + Substation.removeUndefined(this.fSubname) + "</div>\n" +
                     "        </div>\n" +
                     "    </label>\n" +
                     "</li>"
             });
             $("#personListUl").html(html);
             $("input[name='my-checkbox']").off("change", addChangeListener).on("change", addChangeListener);
             checkSelectPeople();
         } else {
             $(".personUl").hide();
         }
     });

 }

 //跳下级事件
 function nextClassClick() {
     var clickPid = $(this).attr("data-id");
     thisGroupid = clickPid;
     $("#selectAll input[type='checkbox']").removeAttr("checked");
     var clickName = $(this).attr("data-name");
     $("#classList .item-title span").addClass("preClass");
     $(".preClass").off("click", preClick).on("click", preClick);
     $("#classList .item-title").append("<i class=\"icon icon-nextArrow\"></i><span data-id=\"" + clickPid + "\">" + clickName + "</span>")
     $("#classList .item-title").scrollLeft(10000);
     getGroupClass(clickPid);
 }

 //跳上级事件
 function preClick() {
     var clickPid = $(this).attr("data-id");
     thisGroupid = clickPid;
     $("#selectAll input[type='checkbox']").removeAttr("checked");
     $(this).removeClass("preClass");
     $(this).nextAll().remove();
     getGroupClass(clickPid);
 }

 //选人状态变化监听
 function addChangeListener() {
     var thisUserid = $(this).attr("id");
     var thisUsername = $(this).attr("data-name");
     if (thisUserid != undefined) {
         // if (peopleType == "substation") {
         if ($(this).prop("checked")) {
             selectUserList = [{
                 userId: thisUserid,
                 userName: thisUsername
             }];
             $("input[name='my-checkbox']").attr("checked", false);
             $(this).prop("checked", true);
             listSubPeople(thisUserid);
         } else {
             selectUserList = [];
         }
         // } else if (peopleType == "charger") {
         //     if ($(this).prop("checked")) {
         //         selectUserList = [{
         //             userId: thisUserid,
         //             userName: thisUsername
         //         }];
         //         $("input[name='my-checkbox']").attr("checked", false);
         //         $(this).prop("checked", true);
         //     } else {
         //         selectUserList = [];
         //     }
         // } else if (peopleType == "worker") {
         //     if ($(this).prop("checked")) {
         //         selectUserList.push({
         //             userId: thisUserid,
         //             userName: thisUsername
         //         });
         //     } else {
         //         $(selectUserList).each(function (i, obj) {
         //             if (obj.userId == thisUserid) {
         //                 selectUserList.splice(i, 1);
         //                 return false;
         //             }
         //         });
         //         $("#selectAll input[type='checkbox']").removeAttr("checked");
         //     }
         // }
         if (selectUserList.length > 0) {
             $("#showSelected").html(Operation['ui_hasSelected'] + ":" + selectUserList.length + Operation['ui_personNum'] + "<i class='icon icon-up'></i>");
             $("#showSelected").off("click", goToSelectedPage).on("click", goToSelectedPage);
         } else {
             $("#showSelected").html(Operation['ui_hasSelected'] + ":");
             $("#showSelected").off("click", goToSelectedPage);
         }
     }
 }

 $("#selectAll").change(function () {
     if ($("#selectAll input[type='checkbox']").prop("checked")) {
         $("#personListUl input[type='checkbox']:not(:checked)").click();
     } else {
         $("#personListUl input[type='checkbox']:checked").click();
     }
 });

 //选择的人员复选框选中
 function checkSelectPeople() {
     $(selectUserList).each(function () {
         $("#" + this.userId).prop("checked", true);
     });
 }

 //跳转选择人列表
 function goToSelectedPage() {
     $.router.loadPage("#page2");
     showPage2List();
 }

 function saveSelectedPeople() {
     $.router.back();
     // if (peopleType == "charger") {
     //     chargerUser = selectUserList;
     // } else if (peopleType == "worker") {
     //     workerUser = selectUserList;
     // } else if (peopleType == "substation") {
     subList = selectUserList;
     // }
     $("#searchUser").val("");
     listPeople(peopleType, selectUserList);
     loadMenu2();
 }

 //模糊搜索
 function getSearchUser() {
     $("#personListUl").empty();
     $(".personUl").show();
     $(".classUl").hide();
     $("#classList").hide();
     var typeStr = "";
     // if (peopleType == "charger" || peopleType == "substation") {
     typeStr = "type=\"checkbox\"";
     $("#selectAll").hide();
     // } else if (peopleType == "worker") {
     //     typeStr = "type=\"checkbox\"";
     //     $("#selectAll").show();
     // }
     Substation.postDataByAjax("/getSubstationListBySubGroupId", {
         search: $("#searchUser").val()
     }, function (data) {
         var html = "";
         $(data.data.list).each(function () {
             html += "<li>\n" +
                 "    <label class=\"label-checkbox item-content\">\n" +
                 "        <input " + typeStr + " name=\"my-checkbox\" id=\"" + this.fSubid + "\" data-name=\"" + Substation.removeUndefined(this.fSubname) + "\">\n" +
                 "        <div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>\n" +
                 "        <div class=\"item-inner\">\n" +
                 "            <div class=\"item-title\">" + Substation.removeUndefined(this.fSubname) + "(" + Substation.removeUndefined(this.fSubid) + ")</div>\n" +
                 "        </div>\n" +
                 "    </label>\n" +
                 "</li>";
         });
         $("#personListUl").html(html);
         $("input[name='my-checkbox']").off("change", addChangeListener).on("change", addChangeListener);
         checkSelectPeople();
     });

 }

 $('#searchUser').bind('keydown', function (event) {
     if (event.keyCode == 13) {
         if ($("#searchUser").val() != "") {
             getSearchUser();
             document.activeElement.blur();
         }
     }
 });

 $(".searchbar-cancel").click(function () {
     $("#searchUser").val("");
     getGroupClass(thisGroupid);
 });

 //page2
 function showPage2List() {
     $("#page2 .content").scrollTop(0);
     $("#selectedUl").empty();
     var html = '';
     $(selectUserList).each(function () {
         html += "<li data-remove=\"" + this.userId + "\">\n" +
             "    <div class=\"item-content\">\n" +
             "        <div class=\"item-inner\">\n" +
             "            <div class=\"item-title\">" + Substation.removeUndefined(this.userName) + "</div>\n" +
             "            <div class=\"item-after\">\n" +
             "                <span class=\"removeUser redColor\" data-id=\"" + this.userId + "\" data-name=\"" + Substation.removeUndefined(this.userName) + "\">" + Operation['ui_remove'] + "\n" +
             "                </span>\n" +
             "            </div>\n" +
             "        </div>\n" +
             "    </div>\n" +
             "</li>";
     });
     $("#numberShow").html(selectUserList.length);
     $("#selectedUl").html(html);
     $(".removeUser").off("click", removeUser).on("click", removeUser);
 }

 function removeUser() {
     $("#selectAll input[type='checkbox']").removeAttr("checked");
     var thisUserid = $(this).attr("data-id");
     var thisUsername = $(this).attr("data-name");
     $("li[data-remove='" + thisUserid + "']").remove();
     $(selectUserList).each(function (i, obj) {
         if (obj.userId == thisUserid) {
             selectUserList.splice(i, 1);
             return false;
         }
     });
     $("#" + thisUserid).removeAttr("checked");
     if (selectUserList.length > 0) {
         $("#showSelected").html(Operation['ui_hasSelected'] + ":" + selectUserList.length + Operation['ui_personNum'] + "<i class='icon icon-up'></i>");
         $("#showSelected").off("click", goToSelectedPage).on("click", goToSelectedPage);
     } else {
         $("#showSelected").html(Operation['ui_hasSelected'] + ":");
         $("#showSelected").off("click", goToSelectedPage);
     }
     $("#numberShow").html(selectUserList.length);
 }

 function addCloseFunction() {
     $(this).parent("span").remove();
     var thisUserid = $(this).attr("data-id");
     var thisUsername = $(this).attr("data-name");
     var thisType = $(this).attr("data-type");
     if (thisType == "charger") {
         $(chargerUser).each(function (i, obj) {
             if (obj.userId == thisUserid) {
                 chargerUser.splice(i, 1);
                 return false;
             }
         });
         if (chargerUser.length == 0) {
             $(".peopleList.charger").hide();
         }
     } else if (thisType == "worker") {
         $(workerUser).each(function (i, obj) {
             if (obj.userId == thisUserid) {
                 workerUser.splice(i, 1);
                 return false;
             }
         });
         if (workerUser.length == 0) {
             $(".peopleList.worker").hide();
         }
     }
 }

 function loadMenu2() {
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
                     } else if (this.fCode == "arcmControl") {
                         sb +=
                             '                                <img class="imgBox" src="img/yibiaosort.png">';
                     } else if (this.fCode == "cameraControl") {
                         sb +=
                             '                                <img class="imgBox" src="img/camera.png">';
                     } else if (this.fCode == "FanControl") {
                         sb +=
                             '                                <img class="imgBox" src="img/FanControl.png">';
                     } else if (this.fCode == "SVGControl") {
                         sb +=
                             '                                <img class="imgBox" src="img/SvgControl.png">';
                     } else if (this.fCode == "AirControl") {
                         sb +=
                             '                                <img class="imgBox" src="img/airContol.png">';
                     } else if (this.fCode == "arcm310Control") {
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
                             var thisTitleName = $($("#" + clickId).find(".label-title")[0]).text();
                             if (clickId == "lightingControl") {
                                 localStorage.setItem("controlClassTitle", thisTitleName);
                                 window.location.href = "lightingControl.html?fSubid=" + selectSubid;
                             } else if (clickId == "arcmControl") {
                                 localStorage.setItem("controlClassTitle", thisTitleName);
                                 window.location.href = "arcm300TControl.html?fSubid=" + selectSubid;

                             } else if (clickId == "arcm310Control") {
                                 localStorage.setItem("controlClassTitle", thisTitleName);
                                 window.location.href = "arcm310Control.html?fSubid=" + selectSubid;
                                 // window.location.href = "arcm310SelectTime.html?fSubid=" + selectSubid;
                             } else if (clickId == "cameraControl") {
                                 if (isAndroid) {
                                     android.videoWatch(selectSubid);
                                 } else if (isIOS) {
                                     var subParam = {
                                         Subid: selectSubid,
                                         Subname: clickName
                                     };
                                     window.webkit.messageHandlers.pushVideoListVC.postMessage(subParam);
                                 }
                             } else if (clickId == "FanControl") {
                                 //风机
                                 localStorage.setItem("controlClassTitle", thisTitleName);
                                 window.location.href = "lopenOrCloseControl.html?fSubid=" + selectSubid + "&deviceType=05004";
                             } else if (clickId == "SVGControl") {
                                 //SVG
                                 localStorage.setItem("controlClassTitle", thisTitleName);
                                 window.location.href = "lopenOrCloseControl.html?fSubid=" + selectSubid + "&deviceType=05002";
                             } else if (clickId == "AirControl") {
                                 //空调
                                 localStorage.setItem("controlClassTitle", thisTitleName);
                                 window.location.href = "lopenOrCloseControl.html?fSubid=" + selectSubid + "&deviceType=05003";
                             }
                         }
                     });

                 });
             }
         }
     );
 }

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

 $("#postHistory").click(function () {
     window.location.href = "taskPostHistory.html";
 });

 //解决键盘遮挡问题
 var h = $(window).height();
 window.addEventListener("resize", function () {
     if ($(window).height() < h) {
         $(".bar.bar-footer").hide();
         $(".bar-footer~.content").css("bottom", "0");
     }
     if ($(window).height() >= h) {
         $(".bar.bar-footer").show();
         $(".bar-footer~.content").css("bottom", "2.2rem");
     }
     if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
         window.setTimeout(function () {
             document.activeElement.scrollIntoViewIfNeeded();
         }, 0);
     }
 });

 $.init();