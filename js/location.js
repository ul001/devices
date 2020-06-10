    $(".back_btn").click(function(){
        if(isAndroid){
            android.goBack();
        }else{
            window.history.back();
        }
    });

    var selectSubid = localStorage.getItem("fSubid");
    var subName="";
    var map;
    var geoc;
    var lable;
    var myValue;
    var dizhi = "";
    var lat;
    var lon;
    var myPp;
    Substation.getDataByAjax("/getSubInfoByfSubid",{fSubid:selectSubid},function(data){
        if(data.subInfo!=undefined){
            subName = data.subInfo.fSubname;
            lon = data.subInfo.fLongitude,
            lat = data.subInfo.fLatitude;
            dizhi = data.subInfo.fAddress;
            loadScript();
//            map.clearOverlays();    //清除地图上所有覆盖物
//            map.centerAndZoom(myPp, 18);
//            var marker = new BMap.Marker(myPp); // 创建标注
//            lable = new BMap.Label(subName, { offset: new BMap.Size(0, -32) });
//            lable.setStyle({
//                maxWidth: 'none',
//                fontSize: '15px',
//                padding: '5px',
//                border: 'none',
//                color: '#fff',
//                background: '#ff8355',
//                borderRadius: '5px'
//            });
//            marker.setLabel(lable);
//            map.addOverlay(marker);    //添加标注
        }
    });


    function initialize() {
      map = new BMap.Map("l-map");
      myPp = new BMap.Point(lon, lat);
      geoc = new BMap.Geocoder();
      map.centerAndZoom(myPp, 18);
      map.clearOverlays();    //清除地图上所有覆盖物
      map.addControl(new BMap.NavigationControl());
      var marker = new BMap.Marker(myPp); // 创建标注
      lable = new BMap.Label(subName, { offset: new BMap.Size(0, -32) });
      lable.setStyle({
          maxWidth: 'none',
          fontSize: '15px',
          padding: '5px',
          border: 'none',
          color: '#fff',
          background: '#ff8355',
          borderRadius: '5px'
      });
      marker.setLabel(lable);
      map.addOverlay(marker);
      // 添加带有定位的导航控件
      var navigationControl = new BMap.NavigationControl({
          // 靠左上角位置
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          // 启用显示定位
          //        enableGeolocation: true
      });
      map.addControl(navigationControl);
      var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
          {"input" : "suggestId"
          ,"location" : map,
          "onSearchComplete":function(data){
              var indexs = data.Qq.length;
              var html = "";
              if(indexs>0){
                  for(var i=0;i<indexs;i++){
                      var _value = data.getPoi(i);
                      var value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                      html += `<li class="item-content item-link" onclick="getMyPlace('${value}','${_value.business}')">
                                  <div class="item-inner">
                                      <div class="item-title-row">
                                          <div class="item-title">${_value.business}</div>
                                      </div>
                                      <div class="item-subtitle">${_value.province +  _value.city +  _value.district +  _value.street}</div>
                                  </div>
                              </li>`;
                  }
                  $("#results").show();
              }else{
                  $("#results").hide();
              }
              $("#list-container").html(html);
          }
      });
//      marker.enableDragging();
//      marker.addEventListener("dragend", function(e) {
//          lng = e.point.lng;
//          lat = e.point.lat;
//          geoc.getLocation(e.point, function(rs){
//              var addComp = rs.addressComponents;
//              dizhi = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
//              //lable.setContent(dizhi);
//              marker.setLabel(lable);
//          //alert("当前位置：" + e.point.lng + ", " + e.point.lat);
//          });
//      });
    }

    function loadScript() {
      var script = document.createElement("script");
      script.src = "http://api.map.baidu.com/api?v=3.0&ak=T9c1avrrhrkA5z5RacH7myHGg9VDt4Cb&callback=initialize";
      document.body.appendChild(script);
    }

    //声明一个控制点击的变量
    var upLoadClicktag = true;
    function saveLocation() {
        if(!upLoadClicktag){
            return;
        }
        upLoadClicktag = false;
        var params = {
            fSubid:selectSubid,
            fLongitude:myPp.lng,
            fLatitude:myPp.lat,
            fAddress:dizhi
        };
        Substation.postDataByAjax("/updateSubstationLocation",params,function(data){
            if(data.code==200){
                $.toast(Operation['ui_savesuccess']);
                upLoadClicktag = true;
                setTimeout(function(){
                    if(isAndroid){
                        android.goBack();
                    }else{
                        window.history.back();
                    }
                },1000);
            }
        });
        //alert(selectSubid + "\n" + "lng:" + lng + "\nlat:" + lat);
    }

    $("#suggestId").bind('keydown', function (event) {
        if (event.keyCode == 13) {
//            local.search($("#suggestId").val());
//            $("#results").show();
//            $("#l-map").addClass("search-map");
            document.activeElement.blur();
        }
    });

    $(".searchbar-cancel").click(function () {
        $("#suggestId").val("");
        $("#results").hide();
    });

    function getMyPlace(value,name){
        myValue = value;
        setPlace();
        $("#suggestId").val(name);
        setTimeout(function(){
            $("#results").hide();
        },500);
    }

    function setPlace(){
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            var marker = new BMap.Marker(pp);
            marker.setLabel(lable);
            map.addOverlay(marker);    //添加标注
            geoc.getLocation(pp, function(rs){
                var addComp = rs.addressComponents;
                dizhi = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            });
            myPp = pp;
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    $.init();