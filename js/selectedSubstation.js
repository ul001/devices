/*    function addClick(){
        $(".card").click(function(){
            localStorage.setItem("fSubid",10100001);
            window.location.href="deviceClass.html";
        });

        $(".goPhoto").click(function(e) {
            e.stopPropagation();
            window.location.href = "selectPhoto.html";
        });

        $(".goLocation").click(function(e) {
            e.stopPropagation();
            window.location.href = "location.html";
        });
    }*/

function goToLocation(lat,lon,subname){
    var locationItem = {fLat:lat,fLon:lon,fSubName:subname};
    localStorage.setItem("locationItem",JSON.stringify(locationItem));
    window.location.href = "location.html";
}

function goToDevice(subId){
    localStorage.setItem("fSubid",subId);
    window.location.href = "deviceClass.html";
}

function goToPhoto(subId){
    localStorage.setItem("fSubid",subId);
    window.location.href = "selectPhoto.html";
}

var loading = false;
var maxItems = 1000;
var itemsPerLoad = 10;
var pageNum = 1;

$(document).on('refresh', '.pull-to-refresh-content', function(e) {
    setTimeout(function() {
        $(".list-container").empty();
        pageNum = 1;
        addItems(itemsPerLoad, 0);
        lastIndex = 10;
        $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
        loading = false;
        // done
        $.pullToRefreshDone('.pull-to-refresh-content');
    }, 2000);
});

function addItems(number, lastIndex) {
    var html = '';
    var url ="/getSubstationListByUser";
    var params = {
        pageNo:pageNum,
        pageSize:number
    }
    Substation.getDataByAjax(url,params,function(data){
        if(data.hasOwnProperty("list")&&data.list.length>0){
            $(data.list).each(function(){
            html += "<div class=\"card\">\n" +
            "                    <div class=\"card-content\">\n" +
            "                        <div class=\"content-padded\">\n" +
            "                            <div class=\"row  no-gutter sub_card\">\n" +
            "                                <div class=\"col-80\"  onClick=\"goToDevice("+this.fSubid+")\">\n" +
            "                                    <p class=\"subName\">"+this.fSubname+"</p>\n" +
            "                                    <P><span>"+Substation.removeUndefined(this.fContacts)+"</span> <span>"+Substation.removeUndefined(this.fContactsPhone)+"</span></P>\n" +
            "                                    <p>地址："+this.fAddress+"</p>\n" +
            "                                </div>\n" +
            "                                <div class=\"col-20\">\n" +
            "                                    <button class='bg-primary external goPhoto' type=\"button\" onclick=\"goToPhoto("+this.fSubid+")\">照片\n" +
            "                                    </button>\n" +
            "                                    <br>\n" +
            "                                    <button class='bg-primary external goLocation' onclick=\"goToLocation("+this.fLatitude+","+this.fLongitude+",'"+this.fSubname+"')\" type=\"button\">位置\n" +
            "                                    </button>\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>";
            });
    $('.list-container').append(html);
    //addClick();
    pageNum++;
        }else{
            $('.infinite-scroll-preloader').html("--end--");
            return;
        }
    });
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
            $('.infinite-scroll-preloader').html("--end--");
            return;
        }

        addItems(itemsPerLoad, lastIndex);
        lastIndex = $('.list-container .card').length;
    }, 1000);
});


$.init();