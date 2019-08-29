jQuery(document).ready(function () {

    //管理页面
    $(".bottom-btn").click(function () {
        localStorage.setItem("fSubname", "执行情况");
        window.location.href = "powerMeterCompute.html";
    });
});