jQuery(document).ready(function () {
    // $(function () {
    var titlename = localStorage.getItem("fSubname");
    $("#titleContent").text(titlename);

    var showmissionBtn = localStorage.getItem("showType");
    var missionType = localStorage.getItem("missionType");

    $("#clickDefect").click(function () {
        localStorage.setItem("fSubname", "缺陷登记");
        window.location.href = "patrolContent.html";
    });

    //客户签名
    $("#checkIn").click(function () {
        localStorage.setItem("fSubname", "客户签名");
        window.location.href = "draw.html";
    });
});