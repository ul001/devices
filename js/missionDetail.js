 var titlename = localStorage.getItem("fSubname");
 $("#titleContent").text(titlename);

 //现场签到按钮事件
 $("#checkIn").click(function () {

 });

 //执行任务按钮事件
 $("#carryOut").click(function () {

 });

 //提交按钮事件
 $("#submitTo").click(function () {

 });

 //管理页面
 $("a[name='clickManager']").click(function () {
     localStorage.setItem("fSubname", "执行情况");
     window.location.href = "missionManager.html";
 });

 $.init();