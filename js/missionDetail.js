 jQuery(document).ready(function () {
     // $(function () {
     var titlename = localStorage.getItem("fSubname");
     $("#titleContent").text(titlename);

     var showmissionBtn = localStorage.getItem("showType");
     if (showmissionBtn == "missionDoing") {
         var showStr = '<div class="row buttonsEvent"> <div class = "col-33" id = "checkInCss"> <a href = "# " class = "button button-big button-fill bottom-btn" id = "checkIn">现场签到</a> </div> <div class = "col-33" id = "carryOutCss"> <a href = "# " class = "button button-big button-fill bottom-btn" id = "carryOut" >执行任务</a> </div> <div class = "col-33" id = "submitToCss" > <a href = "#" class = "button button-big button-fill bottom-btn" id = "submitTo">提交</a> </div> </div>';
         $("#addVarContain126").append(showStr);
     } else if (showmissionBtn == "missionFinish") {
         var showstr = '<div class="row buttonsEvent"> <div class = "col-80" id = "checkInCss" > <a href = "# "class = "button button-big button-fill bottom-btn" id = "checkIn" >查看任务</a> </div> </div>';
         $("#addVarContain126").append(showstr);
     }

     //现场签到按钮事件
     $("#checkIn").click(function () {
         $("#checkIn").removeClass("col-33");
         $("#checkIn").hide();
         $("#carryOutCss").removeClass("col-33");
         $("#submitToCss").removeClass("col-33");
         $("#carryOutCss").toggleClass("col-50");
         $("#submitToCss").toggleClass("col-50");
     });

     //执行任务按钮事件
     $("#carryOut").click(function () {

     });

     //提交按钮事件
     $("#submitTo").click(function () {

     });

     //管理页面
     $("#clickManager").click(function () {
         localStorage.setItem("fSubname", "执行情况");
         window.location.href = "missionManager.html";
     });
 });

 //  function alinkClick() {
 //      localStorage.setItem("fSubname", "执行情况");
 //      window.location.href = "missionManager.html";
 //  }

 //  $.init();