$(".goPhoto").on("click", function() {
    window.location.href = "selectPhoto.html";
});

$(".goLocation").on("click", function() {
    window.location.href = "location.html";
});

$(document).on('refresh', '.pull-to-refresh-content', function(e) {
    setTimeout(function() {

        // done
        $.pullToRefreshDone('.pull-to-refresh-content');
    }, 2000);
});

var loading = false;
var maxItems = 30;

var itemsPerLoad = 10;

function addItems(number, lastIndex) {
    var html = '';
    for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
        html += "<div class=\"card\">\n" +
            "                    <div class=\"card-content\">\n" +
            "                        <div class=\"content-padded\">\n" +
            "                            <div class=\"row  no-gutter sub_card\">\n" +
            "                                <div class=\"col-80\">\n" +
            "                                    <p class=\"subName\">安科瑞变电所</p>\n" +
            "                                    <P><span>dst</span> <span>138546486142</span></P>\n" +
            "                                    <p>地址：上海嘉定</p>\n" +
            "                                </div>\n" +
            "                                <div class=\"col-20\">\n" +
            "                                    <button class='bg-primary external goPhoto' type=\"button\">照片\n" +
            "                                    </button>\n" +
            "                                    <br>\n" +
            "                                    <button class='bg-primary external goLocation' type=\"button\">位置\n" +
            "                                    </button>\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>";
    }
    $('.list-container').append(html);
}
addItems(itemsPerLoad, 0);


var lastIndex = 10;

$(document).on('infinite', '.infinite-scroll', function() {

    // 如果正在加载，则退出
    if (loading) return;

    // 设置flag
    loading = true;

    setTimeout(function() {
        loading = false;

        if (lastIndex >= maxItems) {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').remove();
            return;
        }

        addItems(itemsPerLoad, lastIndex);
        lastIndex = $('.list-container .card').length;
    }, 1000);
});
$.init();