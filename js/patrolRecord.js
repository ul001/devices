var selectSubid = localStorage.getItem("fSubid");
var selectSubname = localStorage.getItem("fSubname");
$("#subName").text(selectSubname);

$(".list-container .item-footer").click(function(){
    window.location.href="patrolContent.html";
});
$("#allPatrol").click(function(){
    window.location.href="allPatrolRecord.html";
});
$.init();