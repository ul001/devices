var showDisItem = 1;

$(".item-link").click(function(){
    $(".parent-page").css("display","none");
    $(".child-page").css("display","block");
});

$(".back-parent").click(function(){
     $(".child-page").css("display","none");
     $(".parent-page").css("display","block");
});

$("#show-class").click(function(){
    if(showDisItem==0){
        showDisItem=1;
        $("#show-class").text("隐藏无设备分类");
        $(".item-dis").css("display","flex");
    }else{
        showDisItem=0;
        $("#show-class").text("显示无设备分类");
        $(".item-dis").css("display","none");
    }
});

$.init();