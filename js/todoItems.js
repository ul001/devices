jQuery(document).ready(function () {
  // $("#titleContent").text($.i18n.prop('data_todogoods'));

  var u = navigator.userAgent,
    app = navigator.appVersion;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

  var loading = false;
  var maxItems = 1000;
  var itemsPerLoad = 10;
  var pageNum = 1;
  var tasktypeid = "";
  var tasktypeName = "";
  var tabName = 1;
  var taskstatus = 0;
  var clickTaskTypeId = localStorage.getItem("taskTypeId");
  var clickTasktypeName = localStorage.getItem("taskTypeName");
  var thisClickItem = localStorage.getItem("thisItem");
  if (clickTaskTypeId != null) {
    tasktypeid = clickTaskTypeId;
  }
  if (clickTasktypeName != null && clickTasktypeName != "") {
    $(".clickrightbtn").text(clickTasktypeName);
  }
  if (thisClickItem != "" && thisClickItem != null) {
    $("#" + thisClickItem).click();
    var num = $("#" + thisClickItem).attr("name");
    tabName = num;
    $("#titleContent").text("");
    if (num == 1) {
      $("#titleContent").text(Operation['ui_todo'] + " " + Operation['ui_goods']);
    } else if (num == 2) {
      $("#titleContent").text(Operation['ui_doing'] + " " + Operation['ui_goods']);
    } else if (num == 3) {
      $("#titleContent").text(Operation['ui_done'] + " " + Operation['ui_goods']);
    }
    getFirstPage(num);
  } else {
    $("#daiban").click();
    var num = $("#daiban").attr("name");
    tabName = num;
    $("#titleContent").text(Operation['ui_todo'] + " " + Operation['ui_goods']);
    getFirstPage(num);
  }

  $(".buttons-tab .tab-link").click(function () {
    var i = $(this).index();
    if (i == 0) {
      // pageNum = 1;
      // $(".list-container").empty();
      // url = "/getWarningMessageSignalEvents";
      taskstatus = 0;
      $("#titleContent").text(Operation['ui_todo'] + " " + Operation['ui_goods']);
    } else if (i == 1) {
      // pageNum = 1;
      // $(".list-container").empty();
      // url = "/getWarningMessageOverLimitEvents";
      taskstatus = 1;
      $("#titleContent").text(Operation['ui_doing'] + " " + Operation['ui_goods']);
    } else if (i == 2) {
      // pageNum = 1;
      // $(".list-container").empty();
      // url = "/getWarningMessagePlatformRunEvents";
      taskstatus = 2;
      $("#titleContent").text(Operation['ui_done'] + " " + Operation['ui_goods']);
    }
  });

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
  //我要处理 巡视
  // $("#dealMission1").click(function () {
  //     localStorage.setItem("fSubname", "任务详情");
  //     localStorage.setItem("showType", "missionDoing");
  //     localStorage.setItem("missionType", "patrol");
  //     window.location.href = "missionDetail.html";
  // });

  // //现场交接
  // $("#dealMission2").click(function () {
  //     localStorage.setItem("fSubname", "任务详情");
  //     localStorage.setItem("showType", "missionDoing");
  //     localStorage.setItem("missionType", "scene");
  //     window.location.href = "missionDetail.html";
  // });

  // //缺陷整改
  // $("#dealMission3").click(function () {
  //     localStorage.setItem("fSubname", "任务详情");
  //     localStorage.setItem("showType", "missionDoing");
  //     localStorage.setItem("missionType", "defect");
  //     window.location.href = "missionDetail.html";
  // });

  //点击卡片
  // $(".card").click(function () {
  //     var id = this.attr("id");
  //     localStorage.setItem("fSubname", "任务详情");
  //     localStorage.setItem("showType", "missionFinish");
  //     window.location.href = "missionDetail.html";
  // });

  //右上角按钮事件
  $(".clickrightbtn").click(function () {
    $.modal({
      title: Operation['ui_taskTypeSelect'],
      text: "",
      verticalButtons: true,
      buttons: [{
          text: Operation['ui_All'],
          onClick: function () {
            $(".clickrightbtn").text(Operation['ui_All']);
            tasktypeid = "";
            tasktypeName = Operation['ui_All'];
            localStorage.setItem("taskTypeId", tasktypeid);
            localStorage.setItem("taskTypeName", tasktypeName);
            pageNum = 1;
            getFirstPage(tabName);
          }
        },
        // {
        //     text: '首次拜访',
        //     onClick: function () {
        //         $(".clickrightbtn").text("首次拜访");
        //     }
        // },
        // {
        //     text: '拜访',
        //     onClick: function () {
        //         $(".clickrightbtn").text("拜访");
        //     }
        // },
        // {
        //     text: '交接驱动',
        //     onClick: function () {
        //         $(".clickrightbtn").text("交接驱动");
        //     }
        // },
        /*        {
                  text: "现场交接",
                  onClick: function() {
                    $(".clickrightbtn").text("现场交接");
                    tasktypeid = 2;
                    pageNum = 1;
                    getFirstPage(tabName);
                  }
                },*/
        {
          text: Operation['ui_xunjian'],
          onClick: function () {
            $(".clickrightbtn").text(Operation['ui_xunjian']);
            tasktypeid = 1;
            tasktypeName = Operation['ui_xunjian'];
            localStorage.setItem("taskTypeId", tasktypeid);
            localStorage.setItem("taskTypeName", tasktypeName);
            pageNum = 1;
            getFirstPage(tabName);
          }
        },
        {
          text: Operation['ui_xiaoque'],
          onClick: function () {
            $(".clickrightbtn").text(Operation['ui_xiaoque']);
            tasktypeid = 3;
            tasktypeName = Operation['ui_xiaoque'];
            localStorage.setItem("taskTypeId", tasktypeid);
            localStorage.setItem("taskTypeName", tasktypeName);
            pageNum = 1;
            getFirstPage(tabName);
          }
        },
        {
          text: "消警",
          onClick: function () {
            $(".clickrightbtn").text("消警");
            tasktypeid = 5;
            tasktypeName = "消警";
            localStorage.setItem("taskTypeId", tasktypeid);
            localStorage.setItem("taskTypeName", tasktypeName);
            pageNum = 1;
            getFirstPage(tabName);
          }
        }
        // {
        //     text: '合同收款',
        //     onClick: function () {
        //         $(".clickrightbtn").text("合同收款");
        //     }
        // },
        // {
        //     text: '合同续签',
        //     onClick: function () {
        //         $(".clickrightbtn").text("合同续签");
        //     }
        // },
      ]
    });
  });

  function getFirstPage(clickNum) {
    var num = "#tab" + clickNum;
    // if (num == 1) {
    //     $("#tab1").empty();
    //     addItems(itemsPerLoad, 0);
    //     lastIndex = 10;
    // } else if (num == 2) {
    //     $("#tab2").empty();
    //     addItems(itemsPerLoad, 0);
    //     lastIndex = 10;
    // } else {
    //     $("#tab3").empty();
    //     addItems(itemsPerLoad, 0);
    //     lastIndex = 10;
    // }
    // $(".list-container").empty();

    // $(num).empty();
    // $(num).html(
    //     '<div class="pull-to-refresh-layer"><div class ="preloader"></div><div class ="pull-to-refresh-arrow"></div></div><div class="list-container"></div><div class="infinite-scroll-preloader"><div class = "preloader"></div></div>'
    // );

    var list = "#listtab" + clickNum;
    $(list).empty();
    $(num + " .infinite-scroll-preloader").html(
      '<div class="preloader"></div>'
    );
    pageNum = 1;
    addItems(itemsPerLoad, 0, clickNum);
    lastIndex = 10;
    // $('.infinite-scroll-preloader').html('<div class="list-container"></div>');
    loading = false;
    // $.initPullToRefresh($('.pull-to-refresh-layer'));
    $.attachInfiniteScroll($(".infinite-scroll"));
  }

  //下拉刷新
  $(document).on("refresh", ".pull-to-refresh-content", function (e) {
    setTimeout(function () {
      pageNum = 1;
      tabName = $(".tab-link.button.active").attr("name");
      getFirstPage(Number(tabName));
      // done
      $.pullToRefreshDone(".pull-to-refresh-content");
    }, 2000);
  });

  //下拉刷新
  // $(document).on("pageInit", "#page-ptr-tabs", function (e, id, page) {
  //     $(page)
  //         .find(".pull-to-refresh-content")
  //         .on("refresh", function (e) {
  //             // 2s timeout
  //             var $this = $(this);
  //             setTimeout(function () {
  //                 $this.find(".content-block").prepend("<p>New Content......</p>");
  //                 // Done
  //                 $.pullToRefreshDone($this);
  //             }, 2000);
  //         });
  // });

  //初始化页面接口
  function addItems(number, lastIndex, clickNum) {
    var text = "";
    var url = "/selectByStateAndType";
    var searchStr = $("#searchDaiban").val();
    if (!searchStr) {
      searchStr = "";
    }
    var params = {
      pageNum: pageNum,
      pageSize: number,
      fTaskstateid: clickNum,
      fTasktypeid: tasktypeid,
      // fSubid: 10100001
      searchKey: searchStr
    };
    Substation.getDataByAjaxNoLoading(url, params, function (data) {
      var taskList = data.taskList;
      if (taskList.hasOwnProperty("list") && taskList.list.length > 0) {
        if (lastIndex == 0) {
          var list = "#listtab" + clickNum;
          $(list).empty();
        }
        if (clickNum == 3) {
          $(taskList.list).each(function () {
            var user = this.fTaskcreateusername;
            var username = "";
            if (user != undefined) {
              username = user;
            }
            text +=
              '                            <div class="card card1"  id="' +
              this.fTaskid +
              '"  name="' +
              this.fTasktypeid +
              '" data-taskid="' +
              this.fTasktypeid +
              '">';
            text +=
              '                                <div class="card-content">';
            text +=
              '                                    <div class="row no-gutter sub_card">';
            text +=
              '                                        <div class="col-10">';
            text +=
              '                                            <img class="showImg"';
            if (this.fTasktypeid == 2) {
              //现场
              text +=
                '                                                src="img/missionxian.png" />';
            } else if (this.fTasktypeid == 3) {
              //缺陷
              text +=
                '                                                src="img/missionque.png" />';
            } else if (this.fTasktypeid == 5) {
              //消警
              text +=
                '                                                src="img/missionjing.png" />';
            } else {
              //巡检
              text +=
                '                                                src="img/missionxun.png" />';
            }
            text += "                                        </div>";
            text +=
              '                                        <div class="col-85">';
            text +=
              '                                            <p class="subName limit-length">' +
              this.fSubName;
            text += "                                            </p>";
            text +=
              "<p>" + Operation['ui_taskid'] + "：" +
              (this.fTasknumber == undefined ? "" : this.fTasknumber) +
              "</p><p>" + Operation['ui_donetime'] + "：" +
              (this.sortDate == undefined ? "" : this.sortDate) +
              "</p>";
            text += "                                        </div>";
            text +=
              '                                        <div class="col-5">';
            text += "<i class=\"icon icon-right\"></i></div>";
            text += "                                    </div>";
            text += "                                </div>";
            text += "                            </div>";
          });
          var list = "#listtab" + clickNum;
          $(list).append(text);
          // $(".list-container").append(text);
          //我要处理 巡视
          //声明一个控制点击的变量
          var upLoadClicktag = true;
          $(".card1").unbind().click(function () {
            if (!upLoadClicktag) {
              return;
            }
            upLoadClicktag = false;
            setTimeout(function () {
              upLoadClicktag = true;
            }, 1000);
            var taskID = $(this).attr("id");
            var tasktypeid = $(this).attr("name");
            //            localStorage.setItem("showType", "missionFinish");
            localStorage.setItem("tasktypeid", tasktypeid);
            localStorage.setItem("missionType", clickNum);
            localStorage.setItem("taskID", taskID);
            if (isAndroid) {
              android.goToIn();
            } else {
              window.location.href = "missionDetail.html";
            }
          });
        } else {
          $(taskList.list).each(function () {
            var showHasCommit = "";
            var showCommitClass = "";
            if (clickNum == 2) {
              var doNum = this.taskUserNum;
              var finishNum = this.taskUserFinishNum;
              if (doNum > 0) {
                if (doNum == finishNum) {
                  showHasCommit =
                    "<span class='greenColor'>(" +
                    finishNum +
                    "/" +
                    doNum +
                    ")</span>";
                  showCommitClass = " hasBoom";
                } else if (finishNum == 0) {
                  showHasCommit =
                    "<span class='grayColor'>(" +
                    finishNum +
                    "/" +
                    doNum +
                    ")</span>";
                  //                        showCommitClass=" hasBoom";
                } else {
                  showHasCommit =
                    "<span class='redColor'>(" +
                    finishNum +
                    "/" +
                    doNum +
                    ")</span>";
                  showCommitClass = " hasBoom";
                }
              }
            }
            var user = this.fTaskcreateusername;
            var username = "";
            if (user != undefined) {
              username = user;
            }

            text += '                            <div class="card card2" id="dealMission' +
              this.fTaskid +
              '"  name="' +
              this.fTaskid +
              '" data-taskid="' +
              this.fTasktypeid +
              '">';
            text +=
              '                                <div class="card-content">';
            text +=
              '                                    <div class="row no-gutter sub_card">';
            text +=
              '                                        <div class="col-10">';
            text +=
              '                                            <img class="showImg"';
            if (this.fTasktypeid == 2) {
              //现场
              text +=
                '                                                src="img/missionxian.png" />';
            } else if (this.fTasktypeid == 3) {
              //缺陷
              text +=
                '                                                src="img/missionque.png" />';
            } else if (this.fTasktypeid == 5) {
              //消警
              text +=
                '                                                src="img/missionjing.png" />';
            } else {
              //巡检
              text +=
                '                                                src="img/missionxun.png" />';
            }
            text += "                                        </div>";
            text +=
              '                                        <div class="col-85' +
              showCommitClass +
              '">';
            text +=
              '                                            <p class="subName limit-length">' +
              this.fSubName;
            text += "                                            </p>";
            text +=
              "<p>" + Operation['ui_taskid'] + "：" +
              (this.fTasknumber == undefined ? "" : this.fTasknumber) +
              "</p><p>" + Operation['ui_plandonetime'] + "：" +
              this.fDeadlinedate.substring(0, 11) +
              showHasCommit +
              "</p>";
            text += "                                        </div>";
            text +=
              '                                        <div class="col-5">';
            /*text +=
              '                                            <button class="button button-fill button-success" id="dealMission' +
              this.fTaskid +
              '"  name="' +
              this.fTaskid +
              '" data-taskid="' +
              this.fTasktypeid +
              '"';
            text +=
              '                                                type="button" name=' +
              this.fTaskid +
              " >处理";
            text += "                                            </button>";*/
            text += "<i class=\"icon icon-right\"></i>";
            text += "                                        </div>";
            text += "                                    </div>";
            text += "                                </div>";
            text += "                            </div>";
          });
          // $(".list-container").append(text);
          var list = "#listtab" + clickNum;
          $(list).append(text);
        }
        //addClick();
        //声明一个控制点击的变量
        var upLoadClicktag = true;
        $(".card2").unbind().click(function () {
          if (!upLoadClicktag) {
            return;
          }
          upLoadClicktag = false;
          setTimeout(function () {
            upLoadClicktag = true;
          }, 1000);
          var taskID = $(this).attr("name");
          var tasktypeid = $(this).attr("data-taskid");
          //          if (tasktypeid == 1) {
          //巡视任务
          //            localStorage.setItem("showType", "missionDoing");
          localStorage.setItem("tasktypeid", tasktypeid);
          localStorage.setItem("missionType", clickNum);
          localStorage.setItem("taskID", taskID);
          if (isAndroid) {
            android.goToIn();
          } else {
            window.location.href = "missionDetail.html";
          }
          //          } else if (tasktypeid == 3) {
          //            //缺陷登记
          ////            localStorage.setItem("showType", "missiondefect");
          ////            localStorage.setItem("missionType", clickNum);
          //            localStorage.setItem("taskID", taskID);
          //            if (isAndroid) {
          //              android.goToIn();
          //            } else {
          //              window.location.href = "missionDetail.html";
          //            }
          //          } else {
          //            //现场交接
          ////            localStorage.setItem("showType", "missiondefect");
          ////            localStorage.setItem("missionType", clickNum);
          //            localStorage.setItem("taskID", taskID);
          //            if (isAndroid) {
          //              android.goToIn();
          //            } else {
          //              window.location.href = "missionDetail.html";
          //            }
          //          }
        });
        pageNum++;
      } else {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
        return;
      }
      if (taskList.list.length < itemsPerLoad) {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
        return;
      }
    }, function (errorCode) {
      if (errorCode == 0) {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html("--" + Operation['ui_neterror'] + "--");
      } else {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html("");
      }
      return;
    });
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

  //  getFirstPage(tabName);

  var lastIndex = 10;
  //上拉加载
  $(document).on("infinite", ".infinite-scroll", function () {
    // 如果正在加载，则退出
    if (loading) return;

    // 设置flag
    loading = true;

    setTimeout(function () {
      loading = false;

      if (lastIndex >= maxItems) {
        $.detachInfiniteScroll($(".infinite-scroll"));
        $(".infinite-scroll-preloader").html("<span class='bottomTip'>--" + Operation['ui_nomoredata'] + "--</span>");
        return;
      }
      tabName = $(".tab-link.button.active").attr("name");
      addItems(itemsPerLoad, lastIndex, Number(tabName));
      lastIndex = $(".list-container .card").length;
      // $.pullToRefreshDone(".pull-to-refresh-content");
    }, 1000);
  });

  //记住状态
  $(".tab-link.button").click(function () {
    var thisId = $(this).attr("id");
    localStorage.setItem("thisItem", thisId);
    tabName = Number(this.name);
    pageNum = 1;
    getFirstPage(tabName);
  });

  $.init();
});