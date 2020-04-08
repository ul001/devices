$(".showlist").empty();
//var isEnglish = 0;
//if (languageOption == "en") {
//isEnglish = 1;
//} else {
//isEnglish = 0;
//}
Substation.getDataByAjax("/getMessInfoType", {
//"english": isEnglish
}, function (data) {
    if (data.hasOwnProperty("tDtMessInfoType") && data.tDtMessInfoType.length > 0) {
        var strVar = "";
        $(data.tDtMessInfoType).each(function () {
            strVar += "<li onclick=\"goToNext("+this.fMessinfotypeid+",'"+this.fMessinfotypeexplain+"')\">"+
                            "<div class=\"item-content item-link\">"+
                                "<div class=\"item-inner\">"+
                                    "<div class=\"item-title label\">"+this.fMessinfotypeexplain+"</div>"+
                                "</div>"+
                            "</div>"+
                        "</li>";
        });
        $(".showlist").append(strVar);
    }
});

function goToNext(typeid,typename){
    localStorage.setItem("titleName",typename);
    localStorage.setItem("typeId",typeid);
    window.location.href = "notifyClassView.html";
}

function goBack(){
    if(isAndroid){
        android.goBack();
    }else{
        window.history.back();
    }
}

function manageSelect(){
    if (!$("#bar-footer").length || $("#bar-footer").is(":hidden")) {

    }
}