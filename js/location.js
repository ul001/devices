    /*var map = new AMap.Map('container', {
        resizeEnable: true
    });
    AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：5s
            buttonPosition: 'RB', //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
            'showMarker': false
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status, result) {
            if (status == 'complete') {
                onComplete(result)
            } else {
                onError(result)
            }
        });
    });
    //解析定位结果
    function onComplete(data) {
        var marker = new AMap.Marker({
            position: data.position,
            title: '我的位置'
        });
        marker.setLabel({
            offset: new AMap.Pixel(0, -5), //设置文本标注偏移量
            content: "<div class='info'>我的位置</div>", //设置文本标注内容
            direction: 'top' //设置文本标注方位
        });
        map.add(marker);
    }
    //解析定位错误信息
    function onError(data) {
        console.log(data.message);
    }*/
    var locationItem = JSON.parse(localStorage.getItem("locationItem"));
    var selectSubid = locationItem.fSubid;
    var lng = locationItem.fLon;
    var lat = locationItem.fLat;
    var map = new BMap.Map("container");
    var point = new BMap.Point(lng,lat);
    map.centerAndZoom(point, 15);
    map.addControl(new BMap.NavigationControl());
    var marker = new BMap.Marker(point);        // 创建标注
    marker.enableDragging();
    var lable = new BMap.Label(locationItem.fSubName,{offset :new BMap.Size(0,-32)});
    lable.setStyle({
                    maxWidth:'none',
                    fontSize:'15px',
                    padding:'5px',
                    border:'none',
                    color:'#fff',
                    background:'#ff8355',
                    borderRadius:'5px'
    				});
    marker.setLabel(lable);
    marker.addEventListener("dragend", function(e){
            lable.setContent("当前位置");
            marker.setLabel(lable);
            lng = e.point.lng;
            lat = e.point.lat;
            //alert("当前位置：" + e.point.lng + ", " + e.point.lat);
    })
    map.addOverlay(marker);

    function saveLocation(){
        alert(selectSubid+"\n"+"lng:"+lng+"\nlat:"+lat);
    }

    $.init();