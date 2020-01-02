//  var browser = {
//      versions: function () {
//          var u = navigator.userAgent,
//              app = navigator.appVersion;
//          return { //移动终端浏览器版本信息
//              trident: u.indexOf('Trident') > -1, //IE内核
//              presto: u.indexOf('Presto') > -1, //opera内核
//              //  webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
//              //  gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
//              //  mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
//              ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
//              android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
//              iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
//              iPad: u.indexOf('iPad') > -1, //是否iPad
//              webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
//          };
//      }(),
//      language: (navigator.browserLanguage || navigator.language).toLowerCase()
//  }

//  if (browser.versions.mobile) { //判断是否是移动设备打开。browser代码在下面
//      var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
//      if (ua.match(/MicroMessenger/i) == "micromessenger") {
//          //在微信中打开
//          alert("在WeChat中打开");
//      }
//      if (ua.match(/WeiBo/i) == "weibo") {
//          //在新浪微博客户端打开
//      }
//      if (ua.match(/QQ/i) == "qq") {
//          //在QQ空间打开
//      }
//      if (browser.versions.ios) {
//          //是否在IOS浏览器打开
//          // alert("在IOS浏览器打开");
//      }
//      if (browser.versions.android) {
//          //是否在安卓浏览器打开
//          // alert("在安卓浏览器打开");
//      }
//  } else {
//      //否则就是PC浏览器打开
//      // alert("在PC中打开");
//      var strVar = "";
//      strVar += " <a href=\"itms-services:\/\/?action=download-manifest&amp;url=https:\/\/csales.189.cn\/MobileServiceResource\/app_apk\/2.25.0_ZSKSalesAide.plist\"";
//      strVar += "            class=\"downbtn\">iphone下载<\/a>";
//      strVar += "        <br>";
//      strVar += "        <p class=\"bbp1\">";
//      strVar += "            <span>版本号<\/span>：IOS 2.25.0";
//      strVar += "        <\/p>";
//      strVar += " <p class=\"bbp2\">发布日期：19-12-27 02:54:41<\/p>";
//      $(".wrapall").append(strVar);
//  }

function isWeixinFun() {
    var ua = window.navigator.userAgent.toLowerCase();
    console.log(ua); //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

//判断使用的手机是android还是IOS
function isAndroidFun() {
    var u = window.navigator.userAgent,
        app = window.navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
        return true;
    }
    if (isIOS) {
        return false;
    }
}

if (isWeixinFun()) {
    //在微信中打开
    alert("在WeChat中打开");
} else if (isAndroidFun()) {
    // alert("在PC中打开");
    var strVar = "";
    strVar += " <a href=\"itms-services:\/\/?action=download-manifest&amp;url=https:\/\/csales.189.cn\/MobileServiceResource\/app_apk\/2.25.0_ZSKSalesAide.plist\"";
    strVar += "            class=\"downbtn\">iphone下载<\/a>";
    strVar += "        <br>";
    strVar += "        <p class=\"bbp1\">";
    strVar += "            <span>版本号<\/span>：IOS 2.25.0";
    strVar += "        <\/p>";
    strVar += " <p class=\"bbp2\">发布日期：19-12-27 02:54:41<\/p>";
    $(".wrapall").append(strVar);
} else if (!isAndroidFun()) {
    // alert("在PC中打开");
    var strVar = "";
    strVar += " <a href=\"itms-services:\/\/?action=download-manifest&amp;url=https:\/\/csales.189.cn\/MobileServiceResource\/app_apk\/2.25.0_ZSKSalesAide.plist\"";
    strVar += "            class=\"downbtn\">iphone下载<\/a>";
    strVar += "        <br>";
    strVar += "        <p class=\"bbp1\">";
    strVar += "            <span>版本号<\/span>：IOS 2.25.0";
    strVar += "        <\/p>";
    strVar += " <p class=\"bbp2\">发布日期：19-12-27 02:54:41<\/p>";
    $(".wrapall").append(strVar);
}


(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' :
        'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth)
                return;
            docEl.style.fontSize = (clientWidth / 7.5) + 'px';
        };
    if (!doc.addEventListener)
        return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);