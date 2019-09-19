var selectSubid = localStorage.getItem("fSubid");
var selectSubname = localStorage.getItem("fSubname");
var subAddress = localStorage.getItem("subAddress");
$("#subName").text(selectSubname);
$(".title_color").text(selectSubname);
$("#goToWrite").click(function(){
    window.location.href="draw.html";
});