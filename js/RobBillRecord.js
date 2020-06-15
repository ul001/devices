 var userlongitude = 121.30713886;
 var userlatitude = 31.34996039;

 jQuery(document).ready(function () {
     var loading = false;
     var itemsPerLoad = 10;
     var pageNum = 1;
     var typeId = 1;

     $(".back_btn").click(function () {
         if (isIOS) {
             localStorage.removeItem("missionTypeid");
             localStorage.removeItem("taskID");
             window.webkit.messageHandlers.goBackiOS.postMessage("");
         } else {
             android.goBack();
         }
     });

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

     $(".buttons-tab .tab-link").click(function () {
         typeId = $(".tab-link.button.active").attr("name");
         getFirstPage(typeId);
     });

     //上拉加载
     $(document).on("infinite", ".infinite-scroll", function () {
         // 如果正在加载，则退出
         if (loading) return;

         // 设置flag
         loading = true;

         setTimeout(function () {
             loading = false;
             var tabName = $(".tab-link.button.active").attr("name");
             addItems(itemsPerLoad, tabName);
             // $.pullToRefreshDone(".pull-to-refresh-content");
         }, 1000);
     });

     getFirstPage(typeId);

     function getFirstPage(clickNum) {
         var num = "#tab" + clickNum;
         var list = "#listtab" + clickNum;
         $(list).empty();
         $(num + " .infinite-scroll-preloader").html(
             '<div class="preloader"></div>'
         );
         pageNum = 1;
         addItems(itemsPerLoad, clickNum);
         // $('.infinite-scroll-preloader').html('<div class="list-container"></div>');
         loading = false;
         // $.initPullToRefresh($('.pull-to-refresh-layer'));
         $.attachInfiniteScroll($(".infinite-scroll"));
     }

     //下拉刷新
     $(document).on("refresh", ".pull-to-refresh-content", function (e) {
         setTimeout(function () {
             pageNum = 1;
             var tabName = $(".tab-link.button.active").attr("name");
             getFirstPage(tabName);
             // done
             $.pullToRefreshDone(".pull-to-refresh-content");
         }, 2000);
     });

     //初始化页面接口
     function addItems(number, clickNum) {
         var text = "";
         var url = "/getUnGrabbedOrderTaskList";
         var searchStr = $("#searchDaiban").val();
         if (!searchStr) {
             searchStr = "";
         }
         if (clickNum == 1) {
             var params = {
                 pageNo: pageNum,
                 pageSize: number,
                 userlongitude: 121.30713886,
                 userlatitude: 31.34996039
             };
             Substation.getDataByAjaxNoLoading(url, params, function (data) {
                     var listDom = "#listtab" + clickNum;
                     if (pageNum == 1) {
                         $(listDom).empty();
                     }
                     var thisList = data.orderList;
                     if (thisList.length > 0) {
                         var html = "";
                         $(thisList).each(function () {
                             var distance = this.userDistance;
                             if (distance == undefined) {
                                 distance = "";
                             } else {
                                 distance = Number(distance);
                                 if (distance >= 1000) {
                                     distance = (distance / 1000).toFixed(2) + "km";
                                 } else {
                                     distance = distance.toFixed(2) + "m";
                                 }
                             }
                             html += `<div class="card" onclick="goToDetail('${this.fTaskid}')">
                                         <div class="card-content">
                                             <div class="card-content-inner">
                                                 <p class="subName limit-length row"><span class="col-85">${this.fSubName}</span>
                                                 <span class="col-15 showType">${Operation['ui_RobBill']}</span></p>
                                                 <p class="row"><span class="col-66"><span style="color:gray;">${Operation['ui_TaskContent']}</span>${this.fTaskcontent}</span>
                                                     <span class="col-33"
                                                           style="color:#ADB2C1;text-align: right;">${distance}</span></p>
                                                 <p class="row"><span class="col-50 showTime">${Operation['ui_StarPlanTime']+this.fStartdate.substring(0,10)}</span>
                                                     <span class="col-50 showTime">${Operation['ui_endPlanTime']+this.fDeadlinedate.substring(0,10)}</span></p>
                                             </div>
                                         </div>
                                     </div>`;
                         });
                         $(listDom).html(html);
                         pageNum++;
                     } else {
                         $.detachInfiniteScroll($(".infinite-scroll"));
                         $(".infinite-scroll-preloader").html(
                             "<span class='bottomTip'>--" +
                             Operation["ui_nomoredata"] +
                             "--</span>"
                         );
                         return;
                     }
                     if (thisList.length < itemsPerLoad) {
                         $.detachInfiniteScroll($(".infinite-scroll"));
                         $(".infinite-scroll-preloader").html(
                             "<span class='bottomTip'>--" +
                             Operation["ui_nomoredata"] +
                             "--</span>"
                         );
                         return;
                     }
                 },
                 function (errorCode) {
                     if (errorCode == 0) {
                         $.detachInfiniteScroll($(".infinite-scroll"));
                         $(".infinite-scroll-preloader").html(
                             "--" + Operation["ui_neterror"] + "--"
                         );
                     } else {
                         $.detachInfiniteScroll($(".infinite-scroll"));
                         $(".infinite-scroll-preloader").html("");
                     }
                     return;
                 }
             );
         }
     }

     $("#searchDaiban").bind("keydown", function (event) {
         if (event.keyCode == 13) {
             getFirstPage(tabName);
             document.activeElement.blur();
         }
     });

     $(".searchbar-cancel").click(function () {
         $("#searchDaiban").val("");
         getFirstPage(tabName);
     });

     $(".overButton").click(function () {
         window.location.href = "taskPost.html?type=7";
     });

     //记住状态
     // $(".tab-link.button").click(function () {
     //     var thisId = $(this).attr("id");
     //     localStorage.setItem("thisItem", thisId);
     //     tabName = Number(this.name);
     //     pageNum = 1;
     //     getFirstPage(tabName);
     // });

     //    var map = new BMap.Map("allmap");
     //    var point1 = new BMap.Point(121.30713886, 31.34996039);
     //    var point2 = new BMap.Point(116.31872260, 39.99664964);
     //    var fDistance = map.getDistance(point1, point2);
     //    console.log(fDistance);


     $.init();
 });

 function goToDetail(taskId) {
     localStorage.setItem("robTaskId", taskId);
     localStorage.setItem("userlatitude", userlatitude);
     localStorage.setItem("userlongitude", userlongitude);
     window.location.href = "RobBillLocation.html";
 }