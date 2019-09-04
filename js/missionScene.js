jQuery(document).ready(function () {
    // $(function () {
    var titlename = localStorage.getItem("fSubname");
    $("#titleContent").text(titlename);

    var showmissionBtn = localStorage.getItem("showType");
    var missionType = localStorage.getItem("missionType");

    //拍照
    $("#takeRoomPhoto").click(function () {
        localStorage.setItem("fSubname", "缺陷登记");
        window.location.href = "patrolContent.html";
    });

    //编辑
    $("#editRoom").click(function () {
        localStorage.setItem("fSubname", "编辑电房");
        window.location.href = "sceneEditRoom.html";
    });

    //删除
    $("#deleteRoom").click(function () {

    });
});