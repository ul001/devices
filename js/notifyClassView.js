var typeid = localStorage.getItem("typeId");
var typename = localStorage.getItem("titleName");
//localStorage.removeItem("typeId");
//localStorage.removeItem("titleName");
$(".title.title_color").text(typename);
$(".showlist").empty();
Substation.getDataByAjax("/selectByMessInfoTypeId",{fMessinfotypeid:typeid},function(data){
    if(data.tDtMessInfoType!=undefined && data.tDtMessInfoType.length>0){
        var strVar = "";
        $(data.tDtMessInfoType).each(function(i,obj){
            var checkVal = "";
            if(this.flag == true){
                checkVal = " checked=true";
            }
            strVar +=   "<li>\n"+
                        "   <div class=\"item-content\">\n" +
                        "       <div class=\"item-inner\">\n" +
                        "          <div class=\"item-title label\">"+obj.fMessinfoexplain+"</div>\n" +
                        "       <div class='item-input'><label class='label-switch'>\n"+
                        "          <input class=\"cbselect\" type=\"checkbox\" name=\"checkbox\" data-code=\""+obj.fMessinfocode+"\""+checkVal+">\n" +
                        "          <div class='imgSelect'></div>\n"+
                        "       </label></div>\n"+
                        "       </div>\n" +
                        "   </div>\n"+
                        "</li>";
        });
        $(".showlist").append(strVar);
        $(".cbselect").off("change",changeFunction).on("change",changeFunction);
    }
});

function changeFunction(){
    var params = {};
    var checkValue = $(this).prop("checked");
    var dataCode = $(this).attr("data-code");
    params['fMessinfocode'] = dataCode;
    if(checkValue){
        params['codeflag'] = true;
    }else{
        params['codeflag'] = false;
    }
    Substation.getDataByAjax("/subscribeMessInfoOrNot",params,function(data){

    });
}

$(".tab-allSelect").click(function(){
    var params = {};
    params['fMessinfotypeid'] = typeid;
    params['typeflag'] = true;
    Substation.getDataByAjax("/subscribeMessInfoOrNot",params,function(data){
        $(".cbselect").prop("checked",true);
    });
});

$(".tab-allNoSelect").click(function(){
    var params = {};
    params['fMessinfotypeid'] = typeid;
    params['typeflag'] = false;
    Substation.getDataByAjax("/subscribeMessInfoOrNot",params,function(data){
        $(".cbselect").removeAttr("checked");
    });
});

$(".manager_btn").on("click",manageSelect);

function manageSelect(){
    if (!$("#bar-footer").length || $("#bar-footer").is(":hidden")) {
        $(".manager_btn").text(Operation['ui_cancel']);
        $("#bar-footer").addClass("bar-tab");
        $("#bar-footer").toggle();
        $(".pull-left.click_btn").toggle();
    }else{
        $(".manager_btn").text(Operation['ui_manager']);
        $("#bar-footer").removeClass("bar-tab");
        $("#bar-footer").toggle();
        $(".pull-left.click_btn").toggle();
    }
}