/**
 * @author xuhang,panhong
 * @date 2017-04-26 09:46
 * @description 存放常用工具类
 */
var baseUrlFromAPP = "http://116.236.149.165:8090/SubstationWEBV2/v5";
var tokenFromAPP =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTEwMzg4NTEsInVzZXJuYW1lIjoibmFuYXlhIn0.6zMB5Q4YDPjOz6e5X9_IC5uvTTYGabskjpJwETIOUIA";
var ipAddress = "http://116.236.149.165:8090/";
var userId = "312";
var userPhoneNum = "1";
//语言字段传参
var languageOption = "zh";
var appId = "";
var serviceId = "219626";

//iOS安卓基础传参
var u = navigator.userAgent,
  app = navigator.appVersion;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统
if (isAndroid) {
  appId = "ab55ce55Ac213hlkhl23419f179c5f6f";
} else if (isIOS) {
  appId = "iose70eeb320a58230925c02e7";
}

//判断数组中是否包含某字符串
try {
  if (isIOS) {
    //ios系统的处理
    window.webkit.messageHandlers.iOS.postMessage(null);
    var storage = localStorage.getItem("accessToken");
    // storage = storage ? JSON.parse(storage):[];
    storage = JSON.parse(storage);
    baseUrlFromAPP = storage.baseurl;
    tokenFromAPP = storage.token;
    ipAddress = storage.ipAddress;
    userId = storage.userID;
    appId = storage.appId;
    serviceId = storage.serviceId;
    languageOption = storage.languageType;
    // localStorage.setItem("ImagePath", ipAddress);
  } else {
    baseUrlFromAPP = android.getBaseUrl();
    tokenFromAPP = android.getToken();
    ipAddress = android.getIpAddress();
    userId = android.getUserid();
    appId = android.getAppId();
    serviceId = android.getServiceId();
    languageOption = android.postLanguage();
    // localStorage.setItem("ImagePath", ipAddress);
  }
} catch (e) {
  languageOption = "zh";
}


//取消回车事件
$(document).keydown(function (event) {
  if (event.keyCode == 13) {
    window.event.returnValue = false;
  }
});

var Substation = {
  ipAddressFromAPP: ipAddress + "/",

  loginUserid: userId,

  removeUndefined: function (data) {
    var dataStr = data == undefined ? "-" : data;
    return dataStr;
  },

  removeUnDefinedStr: function (data) {
    Substation
    var dataStr = data == undefined ? "-" : data;
    return dataStr;
  },

  GetQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },

  loadL7LanguageJS: function () {
    if (languageOption == "zh") {
      var script = document.createElement("script");
      script.src = "libs/cn.min.js";
      document.body.appendChild(script);
    }
  },

  loadLanguageJS: function () {
    //    var script = document.createElement("script");
    if (languageOption == "en") {
      //        script.src = "libs/language_en.js";
      getEnLanguage();
    } else {
      //        script.src = "libs/language_zh.js";
      getZhLanguage();
      //      var script = document.createElement("script");
      //      script.src = "libs/cn.min.js";
      //      document.body.appendChild(script);
      $("head").append('<script src="libs/cn.min.js"></script>');
    }
    this.loadLanguageData();
    //    document.body.appendChild(script);
  },

  loadLanguagePro: function () {
    $.i18n.properties({
      name: "strings", //资源文件名称
      path: "i18n/", //资源文件路径
      mode: "both", //用Map的方式使用资源文件中的值
      language: languageOption,
      //       async: true,
      cache: false,
      encoding: "UTF-8",
      callback: function () {
        $("[data-i18n]").each(function () {
          $(this).html($.i18n.prop($(this).data("i18n")));
        });
        $("[data-placeholder]").each(function () {
          $(this).attr("placeholder", $.i18n.prop($(this).data("placeholder")));
        });
      }
    });
  },

  loadLanguageData: function () {
    $("[data-i18n]").each(function () {
      $(this).html(Operation[$(this).data("i18n")]);
    });
    $("[data-placeholder]").each(function () {
      $(this).attr("placeholder", Operation[$(this).data("placeholder")]);
    });
  },

  showCodeTips: function (code) {
    if (code == "422" || code == "420") {
      return;
    }
    if (
      Operation["code_" + code] == undefined ||
      Operation["code_" + code] == null
    ) {
      $.alert(Operation["code_other"]);
    } else {
      $.alert(Operation["code_" + code]);
    }
  },

  loadGroupList: function (successCallback) {
    Substation.getDataByAjax(
      "/selectSubDeviceGroupList", {
        fSubid: selectSubid
      },
      function (data) {
        var thisTemids = [];
        var thisList = data.subdevicegroupList;
        $(thisList).each(function () {
          if (this.hasOwnProperty("fPagedesigntemplateid")) {
            thisTemids.push(this);
          }
        });
        var devicelist = [];
        $(data.deviceList).each(function (index, obj) {
          $(thisTemids).each(function () {
            if (this.fSubdevicegroupid == obj.fSubdevicegroupid) {
              devicelist.push(this);
              return false;
            }
          });
        });
        Substation.addState(
          devicelist,
          thisList,
          "fSubdevicegroupid",
          "fParentid"
        );
        //        localStorage.setItem("subDeviceGroupTree",JSON.stringify(thisList));
        successCallback(thisList);
      }
    );
  },

  getDeviceGroupListByPid: function (pid, successCallback) {
    this.loadGroupList(function (groupList) {
      var deviceGroupTree = groupList;
      var list = [];
      $(deviceGroupTree).each(function () {
        if (this.fParentid == pid) {
          list.push(this);
        }
      });
      successCallback(list);
    });
    //        var deviceGroupTree = JSON.parse(localStorage.getItem("subDeviceGroupTree"));
  },

  changeSortNum: function (arrList, firstId, secordId) {
    var firstIndex, secordIndex;
    var firstNum, secordNum;
    $(arrList).each(function (index, obj) {
      if (obj.fSubdevicegroupid == firstId) {
        firstIndex = index;
        firstNum = obj.fSortnum;
        return false;
      }
    });
    $(arrList).each(function (index, obj) {
      if (obj.fSubdevicegroupid == secordId) {
        secordIndex = index;
        secordNum = obj.fSortnum;
        return false;
      }
    });
    arrList[firstIndex]["fSortnum"] = secordNum;
    arrList[secordIndex]["fSortnum"] = firstNum;
    swapArr(arrList, firstIndex, secordIndex);

    function swapArr(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    }
    localStorage.setItem("tempSortTree", JSON.stringify(deviceGroupTree));
  },

  getTemplateListByPid: function (pid, successCallback) {
    var templateTree = JSON.parse(localStorage.getItem("templateTree"));
    var list = [];
    $(templateTree).each(function () {
      if (this.pId == pid) {
        list.push(this);
      }
    });
    successCallback(list);
  },

  addState: function (deviceList, list, thisid, pid) {
    if (deviceList.length > 0) {
      var lastdids = [];
      $(deviceList).each(function (index, obj) {
        $(list).each(function () {
          if (obj[thisid] == this[thisid]) {
            this["state"] = "true";
          }
          if (this[thisid] == obj[pid]) {
            lastdids.push(this);
          }
        });
      });
      this.addState(lastdids, list, thisid, pid);
    }
  },

  reportError: function (jsonStr) {
    $.ajax({
      url: "http://www.acrelcloud.cn/SubstationWEBV2/main/uploadExceptionLog",
      type: "POST",
      data: {
        ip: ipAddress,
        exceptionMessage: jsonStr
      },
      success: function (data) {},
      error: function () {}
    });
  },

  getDataByAjax: function (url, params, successCallback) {
    $.showPreloader(Operation["ui_loading"]);
    $.ajax({
      type: "GET",
      url: baseUrlFromAPP + url,
      data: params,
      beforeSend: function (request) {
        // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        request.setRequestHeader("Authorization", tokenFromAPP);
      },
      success: function (data) {
        $.hidePreloader();
        if (data == undefined) {
          $.toast(Operation["ui_nodata"]);
          return;
        } else {
          if (data.code == "200") {
            successCallback(data.data);
          } else if (data.code == "5000") {
            Substation.showCodeTips(data.code);
            Substation.reportError(JSON.stringify(data.data.stackTrace));
          } else {
            if (data.msg && data.msg.length > 0) {
              $.toast(data.msg);
            } else {
              Substation.showCodeTips(data.code);
            }
          }
        }
      },
      error: function (data) {
        $.hidePreloader();
        if (data.status == 0) {
          $.toast(Operation["ui_neterror"]);
        } else {
          $.toast(Operation["code_fail"]);
        }
      }
    });
  },

  getDataByAjaxMain: function (url, params, successCallback) {
    $.showPreloader(Operation["ui_loading"]);
    $.ajax({
      type: "GET",
      url: ipAddress + "/SubstationWEBV2" + url,
      data: params,
      beforeSend: function (request) {
        // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        request.setRequestHeader("Authorization", tokenFromAPP);
      },
      success: function (data) {
        $.hidePreloader();
        if (data == undefined) {
          $.toast(Operation["ui_nodata"]);
          return;
        } else {
          if (data.code == "200") {
            successCallback(data.data);
          } else if (data.code == "5000") {
            Substation.showCodeTips("5000");
            Substation.reportError(JSON.stringify(data.data.stackTrace));
          } else {
            Substation.showCodeTips(data.code);
          }
        }
      },
      error: function (data) {
        $.hidePreloader();
        if (data.status == 0) {
          $.toast(Operation["ui_neterror"]);
        } else {
          $.toast(Operation["code_fail"]);
        }
      }
    });
  },

  //部分接口无Data但返回code码
  getDataByAjaxAllData: function (url, params, successCallback) {
    $.showPreloader(Operation["ui_loading"]);
    $.ajax({
      type: "GET",
      url: baseUrlFromAPP + url,
      data: params,
      beforeSend: function (request) {
        // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        request.setRequestHeader("Authorization", tokenFromAPP);
      },
      success: function (data) {
        $.hidePreloader();
        if (data == undefined) {
          $.toast(Operation["ui_nodata"]);
          return;
        } else {
          if (data.code == "200") {
            successCallback(data);
          } else if (data.code == "5000") {
            Substation.showCodeTips(data.code);
            Substation.reportError(JSON.stringify(data.data.stackTrace));
          } else {
            Substation.showCodeTips(data.code);
          }
        }
      },
      error: function (data) {
        $.hidePreloader();
        if (data.status == 0) {
          $.toast(Operation["ui_neterror"]);
        } else {
          $.toast(Operation["code_fail"]);
        }
      }
    });
  },

  getDataByAjaxNoLoading: function (
    url,
    params,
    successCallback,
    errorCallback
  ) {
    $.ajax({
      type: "GET",
      url: baseUrlFromAPP + url,
      data: params,
      beforeSend: function (request) {
        // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        request.setRequestHeader("Authorization", tokenFromAPP);
      },
      success: function (data) {
        if (data == undefined) {
          $.toast(Operation["ui_nodata"]);
          return;
        } else {
          if (data.code == "200") {
            successCallback(data.data);
          } else if (data.code == "5000") {
            Substation.showCodeTips(data.code);
            Substation.reportError(JSON.stringify(data.data.stackTrace));
          } else {
            Substation.showCodeTips(data.code);
          }
        }
      },
      error: function (data) {
        errorCallback(data.status);
        if (data.status == 0) {
          $.toast(Operation["ui_neterror"]);
        } else {
          $.toast(Operation["code_fail"]);
        }
      }
    });
  },

  postDataByAjaxNoLoading: function (
    url,
    params,
    successCallback,
    errorCallback
  ) {
    $.ajax({
      type: "POST",
      url: baseUrlFromAPP + url,
      data: params,
      beforeSend: function (request) {
        // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        request.setRequestHeader("Authorization", tokenFromAPP);
      },
      success: function (data) {
        if (data == undefined) {
          $.toast(Operation["ui_nodata"]);
          return;
        } else {
          if (data.code == "200") {
            successCallback(data.data);
          } else if (data.code == "5000") {
            Substation.showCodeTips(data.code);
            Substation.reportError(JSON.stringify(data.data.stackTrace));
          } else {
            Substation.showCodeTips(data.code);
          }
        }
      },
      error: function (data) {
        errorCallback(data.status);
        if (data.status == 0) {
          $.toast(Operation["ui_neterror"]);
        } else {
          $.toast(Operation["code_fail"]);
        }
      }
    });
  },

  postDataByAjax: function (url, params, successCallback) {
    $.showPreloader(Operation["ui_loading"]);
    $.ajax({
      url: baseUrlFromAPP + url,
      type: "POST",
      data: params,
      beforeSend: function (request) {
        request.setRequestHeader("Authorization", tokenFromAPP);
        // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
      },
      success: function (data) {
        $.hidePreloader();
        if (data == undefined) {
          $.toast(Operation["ui_nodata"]);
          return;
        } else {
          if (data.code == 200) {
            successCallback(data);
          } else if (data.code == "5000") {
            Substation.showCodeTips(data.code);
            Substation.reportError(JSON.stringify(data.data.stackTrace));
          } else {
            Substation.showCodeTips(data.code);
          }
        }
      },
      error: function (data) {
        $.hidePreloader();
        if (data.status == 0) {
          $.toast(Operation["ui_neterror"]);
        } else {
          $.toast(Operation["code_fail"]);
        }
      }
    });
  },

  postDataByAjaxForCarLoc: function (url, params, successCallback) {
    $.showPreloader(Operation["ui_loading"]);
    $.ajax({
      url: baseUrlFromAPP + url,
      type: "POST",
      data: params,
      beforeSend: function (request) {
        request.setRequestHeader("Authorization", tokenFromAPP);
        // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
      },
      success: function (data) {
        $.hidePreloader();
        if (data == undefined) {
          $.toast(Operation["ui_nodata"]);
          return;
        } else {
          if (data.code == 200) {
            successCallback(data);
          } else if (data.code == "5000") {
            Substation.showCodeTips(data.code);
            Substation.reportError(JSON.stringify(data.data.stackTrace));
          } else {
            Substation.showCodeTips(data.code);
            successCallback(data);
          }
        }
      },
      error: function (data) {
        $.hidePreloader();
        if (data.status == 0) {
          $.toast(Operation["ui_neterror"]);
        } else {
          $.toast(Operation["code_fail"]);
        }
      }
    });
  },

  postDataWithRawByAjax: function (url, params, successCallback) {
    $.showPreloader(Operation["ui_loading"]);
    $.ajax({
      url: baseUrlFromAPP + url,
      type: "POST",
      data: params,
      timeout: 10000,
      dataType: "JSON",
      beforeSend: function (request) {
        request.setRequestHeader("Authorization", tokenFromAPP);
        request.setRequestHeader("Content-Type", "application/json");
        // request.setRequestHeader('Content-Type', 'multipart/form-data');
        // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
      },
      success: function (data) {
        $.hidePreloader();
        if (data == undefined) {
          $.toast(Operation["ui_nodata"]);
          return;
        } else {
          if (data.code == 200) {
            successCallback(data);
          } else if (data.code == "5000") {
            $.toast(Operation["ui_datanoreturn"]);
          } else {
            Substation.showCodeTips(data.code);
          }
        }
      },
      error: function (data) {
        $.hidePreloader();
        $.toast(Operation["ui_datanoreturn"]);
      },
      complete: function (XMLHttpRequest, status) {
        //请求完成后最终执行参数
        if (status == "timeout") {
          //超时,status还有success,error等值的情况
          $.toast(Operation["ui_overtime"]);
        }
      }
    });
  },

  postFormDataByAjax: function (url, params, successCallback) {
    $.showPreloader(Operation["ui_loading"]);
    $.ajax({
        url: baseUrlFromAPP + url,
        type: "POST",
        data: params,
        dataType: "JSON",
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", tokenFromAPP);
          // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        }
      })
      .done(function (data) {
        $.hidePreloader();
        if (data.code == 200) {
          successCallback(data);
        } else if (data.code == "5000") {
          Substation.showCodeTips(data.code);
          Substation.reportError(JSON.stringify(data.data.stackTrace));
        } else {
          Substation.showCodeTips(data.code);
        }
      })
      .fail(function (data) {
        $.hidePreloader();
        if (data.status == 0) {
          $.toast(Operation["ui_neterror"]);
        } else {
          $.toast(Operation["code_fail"]);
        }
      });
  },

  postFormForImgDataByAjax: function (url, params, successCallback) {
    $.showPreloader(Operation["ui_loading"]);
    $.ajax({
        url: baseUrlFromAPP + url,
        type: "POST",
        data: params,
        // dataType: "JSON",
        // cache: false,
        // processData: false,
        // contentType: false,
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", tokenFromAPP);
          // request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
        }
      })
      .done(function (data) {
        $.hidePreloader();
        // if (data.code == 200) {
        //   successCallback(data);
        // } else 
        if (data.code == "5000") {
          Substation.showCodeTips(data.code);
          Substation.reportError(JSON.stringify(data.data.stackTrace));
        } else {
          // Substation.showCodeTips(data.code);
        }
      })
      .fail(function (data) {
        $.hidePreloader();
        // if (data.status == 0) {
        //   $.toast(Operation["ui_neterror"]);
        // } else {
        //   $.toast(Operation["code_fail"]);
        // }
      });
  },

  Common: {
    addHead: function () {
      // return "http://192.168.255.20:8080/SubstationWEBV2/";
      // return "http://116.236.149.165:8090/SubstationWEBV2/v4/";
      return "http://116.236.149.165:8090/SubstationWEBV2/";
    },

    //配电图
    showDataOnSVG: function (type, SvgInfo) {
      if (type == "updata") {
        var url = "Subimg/getSubimgInfo";
        var stationid = $.cookie("stationId");
        var customName = $("#Subimglist").val();
        var params = "fSubid=" + stationid + "&fCustomname=" + customName;
        Substation.Common.requestData(url, params, function (data) {
          showDataOnSVG(data.SvgInfo);
        });
      } else {
        showDataOnSVG(SvgInfo);
      }

      function showDataOnSVG(data) {
        var map = new Map();
        var group;
        if (data.length > 0) {
          $.each(data, function (key, val) {
            group = $("#" + val.fCircuitid);
            for (i = 0; i < val.meterParamValues.length; i++) {
              var paramCode = val.meterParamValues[i].fParamcode;
              var fvalue = val.meterParamValues[i].fValue;
              var valjoinunit = val.meterParamValues[i].fValuejoinunit;
              map.set(paramCode.toLowerCase(), valjoinunit);
              if (val.meterParamValues[i].fUnitGroup == "DI") {
                switch (paramCode.toUpperCase()) {
                  case "SWITCH":
                  case "SWITCHON":
                    1 === fvalue ?
                      (group.children('g[name="off"]').hide(),
                        group.children('g[name="on"]').show()) :
                      (group.children('g[name="on"]').hide(),
                        group.children('g[name="off"]').show());
                    break;
                  case "SWITCHOFF":
                    0 === fvalue ?
                      (group.children('g[name="off"]').hide(),
                        group.children('g[name="on"]').show()) :
                      (group.children('g[name="on"]').hide(),
                        group.children('g[name="off"]').show());
                    break;
                  default:
                    var string;
                    if (fvalue == 0) {
                      string = paramCode.toUpperCase() + ".1";
                    }
                    if (fvalue == 0) {
                      string = paramCode.toUpperCase() + ".0";
                    }
                    console.log(group.children("g[name='" + string + "']"));
                    group.children("g[name='" + string + "']").hide();
                }
              }
            }

            // 避免重复绑定
            group.unbind("click");
            group.bind("click", function () {
              detailData(val.fCircuitid, val.fCircuitname);
            });

            $.each(group.children("g text"), function (index, element) {
              try {
                var m = element.attributes.name.textContent;
                if (map.has(m.toLowerCase())) {
                  var v = map.get(m.toLowerCase());
                  var childName = "text[name='" + m + "']";

                  group.children(childName).text(map.get(m.toLowerCase()));
                }
              } catch (err) {}
            });
          });
        }
      }

      function detailData(fCircuitids, fCircuitname) {
        var circuitData;
        $("#fCircuitname").html(fCircuitname);
        $("#myModaldetail").modal("show");

        Substation.Common.requestData(
          "main/getCurrentValue",
          "fCircuitid=" + fCircuitids,
          function (data) {
            circuitData = data;
            var select = $(".active")[0].id;
            showDetailTable(fCircuitids, data, select);
          }
        );

        $(".nav.nav-tabs>li")
          .off("click")
          .click(function () {
            var select = $(this)[0].id;
            showDetailTable(fCircuitids, circuitData, select);
          });

        $("#myModaldetail").on("hide.bs.modal", function () {
          $("#detailUL a:first").tab("show");
        });
      }

      var tableData = [];

      function showDetailTable(fCircuitids, data, selectParam) {
        tableData = [];
        $.each(data, function (key, val) {
          var paramCode;
          if (selectParam == "P") {
            if (
              val.fParamCode == "P" ||
              val.fParamCode == "Q" ||
              val.fParamCode == "S" ||
              val.fParamCode == "PF"
            ) {
              switch (val.fParamCode) {
                case "P":
                  paramCode = "有功功率";
                  break;
                case "Q":
                  paramCode = "无功功率";
                  break;
                case "S":
                  paramCode = "视在功率";
                  break;
                case "PF":
                  paramCode = "功率因数";
                  break;
              }
              pushData(val, paramCode);
            }
          }
          if (selectParam == "I") {
            if (val.fParamCode.substring(0, 1) == selectParam) {
              switch (val.fParamCode) {
                case "Ia":
                  paramCode = "A相电流";
                  break;
                case "Ib":
                  paramCode = "B相电流";
                  break;
                case "Ic":
                  paramCode = "C相电流";
                  break;
              }
              pushData(val, paramCode);
            }
          }
          if (selectParam == "U") {
            if (val.fParamCode.substring(0, 1) == selectParam) {
              switch (val.fParamCode) {
                case "Ua":
                  paramCode = "A相电压";
                  break;
                case "Ub":
                  paramCode = "B相电压";
                  break;
                case "Uc":
                  paramCode = "C相电压";
                  break;
                case "Uab":
                  paramCode = "AB线电压";
                  break;
                case "Ubc":
                  paramCode = "BC线电压";
                  break;
                case "Uca":
                  paramCode = "CA线电压";
                  break;
              }
              pushData(val, paramCode);
            }
          }
          if (selectParam == "E") {
            if (val.fParamCode.substring(0, 1) == selectParam) {
              switch (val.fParamCode) {
                case "EPI":
                  paramCode = "正向有功总电能";
                  break;
              }
              pushData(val, paramCode);
            }
          }
          if (selectParam == "UnB") {
            if (val.fParamCode == "VUB" || val.fParamCode == "CUB") {
              switch (val.fParamCode) {
                case "VUB":
                  paramCode = "电压三相不平衡";
                  break;
                case "CUB":
                  paramCode = "电流三相不平衡";
                  break;
              }
              pushData(val, paramCode);
            }
          }
          if (selectParam == "Max") {
            if (val.fParamCode == "MD") {
              switch (val.fParamCode) {
                case "MD":
                  paramCode = "当月最大需量";
                  break;
              }
              pushData(val, paramCode);
            }
          }
        });

        var columns = [
          [{
              field: "Paramname",
              title: "参数",
              colspan: 1,
              rowspan: 3,
              valign: "middle",
              align: "center",
              class: "i18n"
            },
            {
              field: "fValue",
              title: "最新值",
              colspan: 1,
              rowspan: 3,
              valign: "middle",
              align: "center",
              class: "i18n"
            },
            {
              field: "extremum",
              title: "当日极值",
              colspan: 4,
              rowspan: 1,
              valign: "middle",
              align: "center",
              class: "i18n"
            },
            {
              field: "avg",
              title: "平均值",
              colspan: 1,
              rowspan: 3,
              valign: "middle",
              align: "center",
              class: "i18n"
            }
          ],
          [{
              field: "max",
              title: "最大值",
              colspan: 2,
              rowspan: 1,
              valign: "middle",
              align: "center",
              class: "i18n"
            },
            {
              field: "min",
              title: "最小值",
              colspan: 2,
              rowspan: 1,
              valign: "middle",
              align: "center",
              class: "i18n"
            }
          ],

          [{
              field: "maxvalue",
              title: "数值",
              valign: "middle",
              align: "center",
              class: "i18n"
            },
            {
              field: "maxtime",
              title: "发生时间",
              valign: "middle",
              align: "center",
              class: "i18n"
            },
            {
              field: "minvalue",
              title: "数值",
              valign: "middle",
              align: "center",
              class: "i18n"
            },
            {
              field: "mintime",
              title: "发生时间",
              valign: "middle",
              align: "center",
              class: "i18n"
            }
          ]
        ];
        $("#detailTable").html("");
        $("#detailTable").html("<table id='table'></table>");
        $("#table").bootstrapTable({
          data: tableData,
          columns: columns
        });
        language.common.tableSelect($("#table"));
        $("#table").css("white-space", "nowrap");
        $("#table").css("background-color", "black");
        $("#table th").css("background-color", "black");
      }

      function pushData(val, paramCode) {
        var row = {};
        row.Paramname = paramCode;
        if (!(typeof val.fValue == "undefined")) {
          row.fValue = parseFloat(val.fValue).toFixed(2);
        }
        if (!(typeof val.min == "undefined")) {
          row.minvalue = parseFloat(val.min).toFixed(2);
        }
        if (!(typeof val.max == "undefined")) {
          row.maxvalue = parseFloat(val.max).toFixed(2);
        }
        if (!(typeof val.maxTime == "undefined")) {
          row.maxtime = val.maxTime.substring(0, 16);
        }
        if (!(typeof val.minTime == "undefined")) {
          row.mintime = val.minTime.substring(0, 16);
        }
        if (!(typeof val.avg == "undefined")) {
          row.avg = parseFloat(val.avg).toFixed(2);
        }
        tableData.push(row);
      }
    },

    showDataOnMap: function (type, alarmSubList, mapInfo) {
      if (type == "clear") {
        var markers = userMap.getOverlays();
        $.each(markers, function (key, val) {
          var icon = new BMap.Icon(
            "app/image/map-blue.png",
            new BMap.Size(50, 50)
          );
          val.setIcon(icon);
        });
        return;
      }
      if (type == "updata") {
        var url = "main/survey/navigation";
        Substation.Common.requestData(url, "", function (data) {
          showMap(data);
          showInfo(data);
        });
        return;
      }
      if (type == "normal") {
        showInfo(mapInfo);
        return;
      }

      function showMap(data) {
        if (data.SubstationList.length == 0) return;
        var subnames = [];
        $.each(alarmSubList, function (key, val) {
          var subs = data.SubstationList.filter(function (point) {
            return point.fSubid === val;
          });

          if (subs.length > 0) subnames.push(subs[0].fSubname);
        });
        var markers = userMap.getOverlays();
        $.each(markers, function (key, val) {
          if (markers.length != data.SubstationList.length) return;

          var title = val.getTitle();

          var filterResults = subnames.filter(function (point) {
            return point === title;
          });

          if (filterResults.length > 0) {
            var icon = new BMap.Icon(
              "app/image/map.gif",
              new BMap.Size(50, 50)
            );
            val.setIcon(icon);
          }
        });
      }

      function showInfo(data) {
        if (data.TotalInfoOfAllSubstation != null) {
          $(".map-total1>p>span").html(
            data.TotalInfoOfAllSubstation.fSubstationNums
          );
          $(".map-total2>p>span").html(data.totalCapacityOfTransformers);
          if (
            data.currentTotalPValue != null ||
            data.currentTotalPValue != undefined
          ) {
            var currentTotal = data.currentTotalPValue;
            d = currentTotal.toString().split(".")[0];
            $(".map-total3>p>span").html(d);
          }
          if (data.totalDayValue != null || data.totalDayValue) {
            var totalDayV = data.totalDayValue;
            c = totalDayV.toString().split(".")[0];
            $(".map-total4>p>span").html(c);
          }
          $(".map-total5>p>span").html(data.gatewayTotalNums);
          $(".map-total5>p>label").html("(" + data.gatewayDisconnectNums + ")");
          $(".map-total6>p>span").html(data.meterTotalNums);
          $(".map-total6>p>label").html("(" + data.meterDisconnectNums + ")");
          $(".map-total7>p>span").html(data.overlimitTimes);
          $(".map-total8>p>span").html(data.signalSwitchTimes);
        }
      }
    },

    //上一天
    upDate: function () {
      var time = $("#daycalendarBox").val();
      var date = new Date(time);
      var timeUp = new Date(date.getTime() - 1000 * 60 * 60 * 24);
      $("#dayCalendar").datetimepicker("update", timeUp);
    },

    //下一天
    downDate: function () {
      var time = $("#daycalendarBox").val();
      var date = new Date(time);
      var timeDown = new Date(date.getTime() + 1000 * 60 * 60 * 24);
      $("#dayCalendar").datetimepicker("update", timeDown);
    },

    //上一月
    upMonth: function () {
      var time = $("#daycalendarBox").val();
      var date = new Date(time);
      var year = date.getFullYear();
      var month = date.getMonth();
      if (month == 0) {
        var tureTime = date.getFullYear() - 1 + "-" + "12";
      }
      if (month > 0 && month < 10) {
        month = "0" + month;
        var tureTime = year + "-" + month;
      }
      if (month >= 10) {
        var tureTime = year + "-" + month;
      }
      $("#daycalendarBox").val(tureTime);
    },

    //下一月
    downMonth: function () {
      var time = $("#daycalendarBox").val();
      var date = new Date(time);
      var year = date.getFullYear();
      var month = date.getMonth();
      if (month == 11) {
        var tureTime = date.getFullYear() + 1 + "-" + "01";
      } else {
        if (month >= 0 && month <= 7) {
          month = "0" + (month + 2);
          var tureTime = year + "-" + month;
        } else {
          month += 2;
          var tureTime = year + "-" + month;
        }
      }

      $("#daycalendarBox").val(tureTime);
    },

    //JSON所有key值转为大写
    upperJSONKey: function (jsonobj) {
      for (var key in jsonobj) {
        if (jsonobj[key.toUpperCase()] != jsonobj[key]) {
          jsonobj[key.toUpperCase()] = jsonobj[key];
          delete jsonobj[key];
        }
      }
      return jsonobj;
    },

    addZero: function (num) {
      if (num < 10) return "0" + num;
      else return num;
    },

    //input option设置选中状态
    setSelect: function ($option, info) {
      $.each($option, function (index, val) {
        if ($(val)[0].value == info) {
          $(val).attr("selected", true);
        }
      });
    },

    encryptByMD5: function (rawString) {
      return MD5(rawString);
    },

    //确认删除
    isDelete: function () {
      var isDel = confirm("是否要删除当前选中数据？");

      return isDel;
    },

    //单位
    getUnitOfParam: function (param) {
      var unit;
      switch (param) {
        case "I":
          unit = "A";
          break;
        case "U":
        case "UL":
        case "Voltage":
          unit = "V";
          minValue = 200;
          break;
        case "fFr":
          unit = "Hz";
          break;
        case "P":
          unit = "kW";
          break;
        case "Q":
          unit = "kVar";
          break;
        case "S":
          unit = "kVA";
          break;
        case "UnBalance":
        case "UnB":
          unit = "%";
          break;
        default:
          unit = "";
      }
      return unit;
    }
  },

  ObjectOperation: {
    /**
     * 日期时间格式化：根据type来生成日期或时间的格式化
     * type="TIMEONLY"=> HH:mm:ss
     * type = "DATEONLY" => yyyy-MM-dd
     * type="DATETIME" => yyyy-MM-dd HH:mm:ss
     */
    dateTimeFormat: function (type, date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var dayOfMonth = date.getDate();

      var hour = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();

      month = Substation.Common.addZero(month);
      dayOfMonth = Substation.Common.addZero(dayOfMonth);
      hour = Substation.Common.addZero(hour);
      minutes = Substation.Common.addZero(minutes);
      seconds = Substation.Common.addZero(seconds);

      var result = "";

      switch (type) {
        case "TIMEONLY":
          result = hour + ":" + minutes + ":" + seconds;
          break;
        case "DATEONLY":
          result = year + "-" + month + "-" + dayOfMonth;
          break;
        case "DATETIME":
          result =
            year +
            "-" +
            month +
            "-" +
            dayOfMonth +
            " " +
            hour +
            ":" +
            minutes +
            ":" +
            seconds;
          break;
        case "YEARMONTH":
          result = year + "-" + month;
          break;
        case "YEAR":
          result = year;
          break;
        case "DATE":
          result = dayOfMonth;
          break;
        case "HOUR":
          result = hour;
          break;
        case "MINUTE":
          result = minutes;
          break;
      }

      return result;
    },
    addZero: function (num) {
      if (num < 10) return "0" + num;
      else return num;
    },
    getAnyDateAgo: function (curDate, dayInterval) {
      var curMillis = curDate.getTime();
      var preMillis = curMillis - (dayInterval - 1) * 86400000;

      var preDate = new Date(preMillis);

      return preDate;
    },
    //strDate:'yyyy-MM-dd HH:mm:ss'结构
    getDateFromStringDate: function (strDate) {
      if (strDate == undefined) return;
      var dateTimeArr = strDate.split(" ");
      var datePart = dateTimeArr[0].split("-");
      var timePart = dateTimeArr[1].split(":");

      return new Date(
        datePart[0],
        datePart[1] - 1,
        datePart[2],
        timePart[0],
        timePart[1],
        timePart[2]
      );
    },

    isArrayEquals: function (array1, array2) {
      array1.sort();
      array2.sort();
      if (array1.length != array2.length) return false;

      for (var i = 0; i < array1.length; i++) {
        if (typeof array1[i] != typeof array2[i]) return false;

        if (array1[i] != array2[i]) return false;
      }

      return true;
    }
  },

  DOMOperator: {
    selectAppender: function (data, $select, text, value, name, selectOption) {
      $select.html("");
      $.each(data, function (key, val) {
        if (selectOption != undefined) {
          if (val[value] == selectOption) {
            $select.append(
              "<option class='i18n' value=" +
              val[value] +
              " name=" +
              val[name] +
              " selected>" +
              val[text] +
              "</option>"
            );
          } else {
            $select.append(
              "<option class='i18n' value=" +
              val[value] +
              " name=" +
              val[name] +
              ">" +
              val[text] +
              "</option>"
            );
          }
        } else {
          $select.append(
            "<option class='i18n' value=" +
            val[value] +
            " name=" +
            val[name] +
            ">" +
            val[text] +
            "</option>"
          );
        }
      });
      return this;
    },
    selectAppenderHarm: function (data, $select, text, value) {
      $select.html("");
      $.each(data, function (key, val) {
        $select.append(
          "<option value=" + val[value] + ">" + val[text] + "</option>"
        );
      });
      return this;
    },

    initDateTimePicker: function (date, $Date, $Box, initObj, format) {
      var initDate;
      if (format != null || format != undefined)
        initDate = Substation.ObjectOperation.dateTimeFormat(format, date);
      else
        initDate = Substation.ObjectOperation.dateTimeFormat("DATEONLY", date);

      $Box.val(initDate);

      if (initObj != null || initObj != undefined) {
        $Date.datetimepicker(initObj);
      } else {
        $Date.datetimepicker({
          format: "yyyy-mm-dd",
          language: "zh-CN",
          weekStart: 1,
          todayBtn: 1,
          todayHighlight: 1,
          autoclose: 1,
          startView: 2,
          minView: 2,
          forceParse: 0,
          pickerPosition: "bottom-left"
        });
      }
      return this;
    },
    initDateTimePicker2: function (date, $Date, $Box, initObj, format) {
      var initDate;
      if (format != null || format != undefined)
        initDate = Substation.ObjectOperation.dateTimeFormat(format, date);
      else
        initDate = Substation.ObjectOperation.dateTimeFormat("YEARMONTH", date);

      $Box.val(initDate);

      if (initObj != null || initObj != undefined) {
        $Date.datetimepicker(initObj);
      } else {
        $Date.datetimepicker({
          format: "yyyy-mm",
          language: "zh-CN",
          autoclose: 1,
          startView: 3,
          minView: 3,
          forceParse: 0,
          pickerPosition: "bottom-left"
        });
      }
      return this;
    },
    //显示上月第一天至最后一天
    lastMonthInitDate: function () {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      if (month == 0) {
        year = year - 1;
        var day = new Date(year, 12, 0);
        var lastDay = day.getDate();
        var newDate = year + "-" + "12" + "-" + "01";
        var lastDate = year + "-" + "12" + "-" + lastDay;
      } else {
        var day = new Date(year, month, 0);
        var lastDay = day.getDate(); //获取某月最后一天
        if (month < 9) {
          var newDate = year + "-" + "0" + month + "-" + "01";
          var lastDate = year + "-" + "0" + month + "-" + lastDay;
        }
        if (month >= 10) {
          var newDate = year + "-" + month + "-" + "01";
          var lastDate = year + "-" + month + "-" + lastDay;
        }
      }
      Substation.DOMOperator.initDateTimePicker(
        new Date(newDate),
        $("#startDate"),
        $("#startDateBox")
      );
      Substation.DOMOperator.initDateTimePicker(
        new Date(lastDate),
        $("#endDate"),
        $("#endDateBox")
      );
    },

    //日期限制为不能出现重复天数，例：1-01至1-31
    timeCompare: function () {
      var startTime = $("#startDateBox").val();
      var endTime = $("#endDateBox").val();
      var startYear = new Date(startTime).getFullYear();
      var startMon = new Date(startTime).getMonth() + 1;
      var start = new Date(startTime);
      var end = new Date(endTime);
      var days = end.getTime() - start.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24)); //选择日期间隔天数

      var monthDay = new Date(startYear, startMon, 0);
      var Days = monthDay.getDate(); //获取开始日期当月天数

      if (startTime > endTime) {
        return false;
      } else {
        if (day >= Days) {
          return false;
        } else {
          return true;
        }
      }
    },

    //请求变电所列表时分页
    pagenation: function (url, pageNo, pageSize) {
      var params = "pageNo=" + pageNo + "&pageSize=" + pageSize;
      Substation.Common.requestData(url, params, function (data) {
        showSubNameInfo(data, "normal");
      });
      //生成列表框
      function showSubNameInfo(data, type) {
        $("#tableSubName").html("<table></table>");
        $("#tableSubName>table").attr(
          "data-height",
          $(".substation-list").height()
        );
        var columns = [{
            field: "fSubstation",
            title: "变配电站名称",
            class: "i18n"
          },
          {
            field: "fAddress",
            title: "地址",
            class: "i18n"
          }
        ];
        var subNameRows = [];
        $.each(data.list, function (key, val) {
          var row = {};
          row.fSubid = val.fSubid;
          row.fSubstation = val.fSubname;
          row.fAddress = val.fAddress;
          subNameRows.push(row);
        });
        Substation.DOMOperator.tableSubstationName(
          $("#tableSubName>table"),
          columns,
          subNameRows,
          true,
          8,
          true,
          [4, 8]
        );

        $("#tableSubName").on("click-row.bs.table", function (e, row, $element) {
          $(".insideSelect")
            .css("background", "white")
            .removeClass("insideSelect");
          $element.css("background", "#cee4f9").addClass("insideSelect");
          selectedInfoModal = row;
        });

        pagination(data, type);
      }

      function pagination(data, type) {
        BootstrapPagination($("#table_pagination"), {
          layoutScheme: "firstpage,prevgrouppage,prevpage,pagenumber,nextpage,nextgrouppage,lastpage",
          total: data.total,
          pageSize: data.pageSize,
          pageIndex: data.prePage,
          pageGroupSize: 5,
          pageInputTimeout: 800,
          pageSizeList: [5, 10, 20, 50, 100, 200],
          //当分页更改后引发此事件。
          pageChanged: function (pageIndex, pageSize) {
            var pageIndex = pageIndex + 1;
            if (type == "normal") {
              var url = "main/getSubstationListByUser";
              var params = "pageNo=" + pageIndex + "&pageSize=" + pageSize;
            } else {
              var list = $(".substationlist").val();
              var params =
                "pageNo=" +
                pageIndex +
                "&pageSize=" +
                pageSize +
                "&fPartsubname=" +
                encodeURI(list);
              var url = "main/getSubstationListByFuzzyLookup";
            }

            Substation.Common.requestData(url, params, function (data) {
              showSubNameInfo(data);
            });
          }
        });
        $("#tableSubName").on("click-row.bs.table", function (e, row, $element) {
          $(".insideSelect")
            .css("background", "white")
            .removeClass("insideSelect");
          $element.css("background", "#cee4f9").addClass("insideSelect");
          selectedInfoModal = row;
        });
      }

      //模糊查询
      $("#refreshBtn")
        .off("click")
        .on("click", function () {
          var list = $(".substationlist").val();
          var params =
            "pageNo=" +
            1 +
            "&pageSize=" +
            8 +
            "&fPartsubname=" +
            encodeURI(list);
          var url = "main/getSubstationListByFuzzyLookup";
          Substation.Common.requestData(url, params, function (data) {
            showSubNameInfo(data, "fuzzy");
          });
        });
    },

    //变配电站选择确认时更改cookie
    yesBtnClick: function (row) {
      var stationId = row.fSubid;
      var subName = row.fSubstation;
      $.cookie("stationId", stationId);
      $.cookie("subName", subName);
      $("#StationName").html(subName);
      $("#StationName").attr("value", stationId);
    },

    chartSize: function ($container, isResize) {
      $container.removeAttr("_echarts_instance_");
      $container.html("");
      $container.css("width", "100%");
      $container.css("height", "100%");
      if (isResize != undefined) {
        $container.height($container.height() - isResize);
      }
    },

    //全选树结构
    checkAllTree: function (data) {
      $("#treeview").html("");

      var array = [];

      if (data == null || data.length == 0) {
        return array;
        return;
      }

      var initTree = {
        showIcon: false,
        showCheckbox: true,
        showBorder: true,
        levels: 2
      };
      Substation.DOMOperator.treeGenerate(data, $("#treeview"), initTree);
      if (array != null) {
        array = [];
      }
      $("#treeview").on("nodeChecked", function (event, node) {
        if ($.inArray(node.id, array) < 0) {
          array.push(node.id);
        }

        if ($("#multiState").prop("checked"))
          checkChildren(node, $("#treeview"));
        else
          $("#treeview").treeview("checkNode", [
            node.nodeId,
            {
              silent: true
            }
          ]);
      });

      $("#treeview").on("nodeUnchecked", function (event, node) {
        if (node.id == array[0]) {
          array.shift();
        } else if ($.inArray(node.id, array)) {
          var id = $.inArray(node.id, array);
          array.splice(id, 1);
        }

        if ($("#multiState").prop("checked"))
          unCheckChildren(node, $("#treeview"));
        else
          $("#treeview").treeview("uncheckNode", [
            node.nodeId,
            {
              silent: true
            }
          ]);
      });

      $("#treeview").treeview("checkAll");

      function checkChildren(node, $Tree) {
        var str = JSON.stringify(node);
        var pattern = new RegExp("nodes");
        if (pattern.test(str)) {
          $.each(node.nodes, function (key, val) {
            $Tree.treeview("checkNode", [val.nodeId]);
            checkChildren(val, $Tree);
          });
        }
      }

      function unCheckChildren(node, $Tree) {
        var str = JSON.stringify(node);
        var pattern = new RegExp("nodes");
        if (pattern.test(str)) {
          $.each(node.nodes, function (key, val) {
            $Tree.treeview("uncheckNode", [val.nodeId]);
            unCheckChildren(val, $Tree);
          });
        }
      }
      return array;
    },

    //单选树结构
    treeGenerate: function (data, $Tree, initObj) {
      var treedata = new Array();
      var pattern = new RegExp('\\,\\"nodes\\"\\:\\[\\]', "g");
      //2018/2/8修改BUG
      if (data != null) {
        for (var i = 0; i < data.length; i++) {
          if (i == 0) {
            var state = {
              expanded: true
            };
            data[i].state = state;
          }

          if (data[i].fChecked == true) {
            var state = {
              checked: true,
              expanded: true
            };
            data[i].state = state;
            $.each(data[i].nodes, function (key, val) {
              if (val.fChecked == true) {
                data[i].nodes[key].state = state;
              }
              if (val.nodes != undefined) {
                $.each(val.nodes, function (key, value) {
                  if (value.fChecked == true) {
                    value.state = state;
                  }
                });
              }
            });
          }
          var tempStr = JSON.stringify(data[i]);
          treedata.push(JSON.parse(tempStr.replace(pattern, "")));
        }
      }
      if (initObj != null || initObj != undefined) {
        initObj.levels = 1;
        initObj.data = treedata;
        $Tree.treeview(initObj);
      } else {
        $Tree.treeview({
          data: treedata,
          showIcon: true,
          showCheckbox: false,
          showBorder: true,
          levels: 1,
          multiSelect: false,
          highlightSearchResults: false
        });
      }
      return this;
    },

    checkTreeChildNode: function (node, $Tree) {
      var str = JSON.stringify(node);
      var pattern = new RegExp("nodes");
      if (pattern.test(str)) {
        $.each(node.nodes, function (key, val) {
          $Tree.treeview("checkNode", [val.nodeId]);
          Substation.DOMOperator.checkTreeChildNode(val, $Tree);
        });
      }
    },

    unCheckTreeChildNode: function (node, $Tree) {
      var str = JSON.stringify(node);
      var pattern = new RegExp("nodes");
      if (pattern.test(str)) {
        $.each(node.nodes, function (key, val) {
          $Tree.treeview("uncheckNode", [val.nodeId]);
          Substation.DOMOperator.unCheckTreeChildNode(val, $Tree);
        });
      }
    },

    setRole: function (meun, successCallback) {
      Substation.Common.requestData("authority/getRoleMenu", "", function (
        data
      ) {
        if (data.role.permissionlist.length > 0) {
          $.each(data.role.permissionlist, function (key, val) {
            if (val.fIcon == meun) {
              $.each(val.nodes, function (key, value) {
                if (value.fMenuurl == $.cookie("left-menu")) {
                  if (value.nodes != undefined) {
                    successCallback(value.nodes);
                  }
                }
              });
            }
          });
        }
      });
    },

    generateTable: function (
      $table,
      columns,
      data,
      isPagenation,
      pageSize,
      cardView,
      pageList,
      height
    ) {
      var size = 50;
      var view = false;
      if (pageSize == null || pageSize == undefined) {
        size = 50;
      } else {
        size = pageSize;
      }

      if (pageList == null || pageList == undefined) {
        pageList = [10, 25, 50, 100, "All"];
      }

      if (isPagenation) {
        if ($table.get(0).id == "eventTable")
          //报警模态框表格
          $table.bootstrapTable({
            height: height,
            striped: true,
            classes: "table table-border",
            pagination: true,
            cardView: view,
            pageSize: size,
            columns: columns,
            pageList: pageList,
            rowStyle: function (row, index) {
              if (row.isRed) {
                var style = {
                  css: {
                    color: "black"
                  }
                };
                return style;
              } else {
                var style = {
                  css: {
                    color: "red"
                  }
                };
                return style;
              }
            },
            data: data
          });
        else
          $table.bootstrapTable({
            height: height,
            striped: true,
            classes: "table table-border",
            pagination: true,
            cardView: view,
            pageSize: size,
            columns: columns,
            pageList: pageList,
            data: data
          });
      } else {
        $table.bootstrapTable({
          height: height,
          striped: true,
          editable: true,
          classes: "table table-border",
          columns: columns,
          data: data
        });
      }
      language.common.tableSelect($table);
    },
    tableSubstationName: function (
      $table,
      columns,
      data,
      isPagenation,
      pageSize,
      cardView,
      pageList,
      height
    ) {
      var size = 50;
      var view = false;
      if (pageSize == null || pageSize == undefined) {
        size = 50;
      } else {
        size = pageSize;
      }

      if (pageList == null || pageList == undefined) {
        pageList = [10, 25, 50, 100, "All"];
      }

      if (isPagenation) {
        $table.bootstrapTable({
          height: height,
          striped: true,
          classes: "table table-border",
          pagination: false,
          sidePagination: "server", //服务器端分页
          cardView: view,
          pageSize: size,
          columns: columns,
          pageList: pageList,
          data: data
        });
      } else {
        $table.bootstrapTable({
          height: height,
          striped: true,
          classes: "table table-border",
          columns: columns,
          data: data
        });
      }
      language.common.tableSelect($table);
    },

    //文件导出
    exportTable: function ($table, name) {
      $table.tableExport({
        type: "xlsx",
        fileName: name
      });
    },

    //视频监控
    generateVideo: function (divName, videoUrl, index) {
      $("#" + divName).html("");
      var value = videoUrl.split(";");
      $("#" + divName).append(
        '<video id="video-' +
        index +
        '" poster="" style="width:100%;height:100%" controls playsInline webkit-playsinline autoplay>' +
        '<source src="' +
        value[1] +
        '" type="" />' +
        '<source src="' +
        value[0] +
        '" type="application/x-mpegURL" />'
      );

      new EZUIPlayer("video-" + index);
    }
  },

  Validator: {
    setErrorStyle: function ($selector, message) {
      $(":text").css({
        border: "1px solid #ababab",
        "box-shadow": "0px 0px 0px #ababab"
      });
      $(".megbox").remove();
      $selector.css({
        border: "1px solid red",
        "box-shadow": "0px 0px 2px red"
      });

      new MessageBox($selector.get(0), $selector.get(0).id, message).Show();
    },
    setFocus: function ($selector) {
      var bubbleId = "megbox_" + $selector.get(0).id;

      if ($("#" + bubbleId).length > 0) $("#" + bubbleId).remove();

      $selector.css({
        border: "1px solid #ababab",
        "box-shadow": "0px 0px 0px #ababab"
      });
    },
    //条件筛选
    validate: function ($selector, name, type) {
      var validateContent = $selector.attr("validator");

      if (validateContent == undefined) return;
      var textValue = $selector.val();

      var validateArr = validateContent.split(";");

      var pass = true; //是否通过测试，true通过，false没通过

      var flag = false; //定义局部flag表示是否已经出现错误标记

      $.each(validateArr, function (index, val) {
        if (flag) return;

        switch (val.split(":")[0]) {
          case "required":
            if (textValue == "") {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "不允许为空！"
              );
            }
            break;
          case "number":
            var rule = new RegExp("^[0-9]*[0-9][0-9]*$");
            if (!rule.test(textValue)) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "必须非负整数！"
              );
            }
            break;
          case "int":
            var rule = new RegExp("^\\d+$");
            if (!rule.test(textValue)) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "必须整数！"
              );
            }
            break;
          case "litter":
            var rule = new RegExp("^0.([1-9][0-9]?|[0-9][1-9])|1$");
            if (!rule.test(textValue)) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "必须为(0,1]的小数！"
              );
            }
            break;
          case "long":
            var Long = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
            if (!Long.test(textValue)) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "格式不正确！"
              );
            }
            break;
          case "lat":
            var lat = new RegExp(
              "^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,10})?)|90(([.][0]{1,9})?))$"
            );
            if (!lat.test(textValue)) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "格式不正确！"
              );
            }
            break;
          case "Diff":
            var Diff = new RegExp("^[A-Za-z0-9]+$");
            if (!Diff.test(textValue)) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "格式不正确！"
              );
            }
            break;
          case "float":
            var rule = /^(-)?\d+(\.\d+)?$/;
            if (rule.exec(textValue) == null) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "必须为数字！"
              );
            }
            break;
          case "min":
            var size = parseInt(val.split(":")[1]);
            if (textValue.length < size) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "长度应大于" + size + "位！"
              );
            }
            break;
          case "max":
            var size = parseInt(val.split(":")[1]);
            if (textValue.length > size) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "长度应小于" + size + "位！"
              );
            }
            break;
          case "limitNum":
            var size = parseInt(val.split(":")[1]);
            if (textValue.length != size) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "长度为" + size + "位！"
              );
            }
            break;
          case "space":
            if ($.trim(textValue).indexOf(" ") > 0) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "格式错误，请检查其中是否包含空格！"
              );
            }
            break;

          case "Phone":
            if (textValue.length <= 0) {
              return;
            } else {
              var arr = textValue.split(";");
              $.each(arr, function (key, val) {
                PhoneNum = val;
                var phone = /^1[34578]\d{9}$/;
                if (!phone.test(PhoneNum)) {
                  flag = true;
                  if (type != undefined) {
                    $("#" + type).tab("show");
                  }
                  Substation.Validator.setErrorStyle(
                    $selector,
                    name + "格式不正确！"
                  );
                }
              });
            }
            break;
          case "transform":
            if (textValue.length <= 0) {
              return;
            } else {
              var arr = textValue.split(";");
              $.each(arr, function (key, val) {
                var num = val;
                var phone = /^1[0-9]+$/;
                if (!phone.test(num)) {
                  flag = true;
                  if (type != undefined) {
                    $("#" + type).tab("show");
                  }
                  Substation.Validator.setErrorStyle(
                    $selector,
                    name + "必须为1开头！"
                  );
                }
              });
            }
            break;

          case "noSpecial":
            var Special = new RegExp(/[\r\n\t]/g);
            if (Special.test(textValue)) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "含特殊字符"
              );
            }
            break;

          case "limit":
            var limit = new RegExp("^[\u4E00-\u9FA5A-Za-z0-9]+$");
            if (!limit.test(textValue)) {
              flag = true;
              if (type != undefined) {
                $("#" + type).tab("show");
              }
              Substation.Validator.setErrorStyle(
                $selector,
                name + "格式不正确！"
              );
            }
            break;
        }
      });

      pass = !flag;
      return pass;
    }
  },
  changeCalendar: function (changeVal, element, UpElement) {
    var child = document.getElementById(element);
    child.remove();
    var str =
      ' <input type="text" id="' +
      element +
      '" placeholder="" data-placeholder="ui_startTime" readonly />';
    $("#" + UpElement).html(str);
    $("#" + element).val(changeVal);
    $("#" + element).calendar({
      value: [changeVal]
    });
  }
};

function showToast(str) {
  $.toast(str);
}

//$(document).ready(function () {
//  Substation.loadLanguageJS()
//});
window.onload = Substation.loadLanguageJS();