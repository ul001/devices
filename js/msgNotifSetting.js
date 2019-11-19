jQuery(document).ready(function () {
    // $(function () {
    var titlename = localStorage.getItem("fSubname");
    $("#titleContent").text(titlename);
    //alert("1");
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓系统
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios系统

    $("#check1").click(function () {
        var showli = ' <li id="sli1"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">烟雾 </div><';
        showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
        showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';

        showli += ' <li id="sli2"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">越限 </div><';
        showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
        showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';
        if ($(this).prop("checked")) {
            // $(this).removeAttr("checked");
            $("#mostLi").after(showli);
        } else {
            $("#sli1").remove();
            $("#sli2").remove();
            // $(this).prop("checked", true);
        }
    });

    $("#check2").click(function () {
        var showli = ' <li id="sli3"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">开关门 </div><';
        showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
        showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';

        if ($(this).prop("checked")) {
            // $(this).removeAttr("checked");
            $("#moreLi").after(showli);
        } else {
            $("#sli3").remove();
            // $(this).prop("checked", true);
        }
    });

    $("#check3").click(function () {
        var showli = ' <li id="sli4"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">仪表离线 </div><';
        showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
        showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';
        showli += ' <li id="sli5"> <div class = "item-content"><div class = "item-inner" ><div class = "item-title label" style="text-indent:1rem;">网关离线 </div><';
        showli += 'div class = "item-input" ><label class = "label-switch" ><input type = "checkbox" checked="true">';
        showli += '<div class = "checkbox"></label> </div> </div> </div> </li>';
        if ($(this).prop("checked")) {
            // $(this).removeAttr("checked");
            $("#noremalLi").after(showli);
        } else {
            $("#sli4").remove();
            $("#sli5").remove();
            // $(this).prop("checked", true);
        }
    });


    window.addEventListener(
        "pageshow",
        function (event) {
            if (localStorage.getItem("need-refresh") == "true") {
                localStorage.removeItem("need-refresh");
                location.reload();
            }
        },
        false
    );

    $.init();
});