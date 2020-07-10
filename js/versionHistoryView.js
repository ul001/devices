var historyLog = localStorage.getItem("updateLog");
historyLog = JSON.parse(historyLog);
$("#updateLog").html(historyLog);

var videoSrc = "http://192.168.112.233:8080/web_manage/upload/video.mp4"; //新的视频播放地址
document.getElementById("videoplay").src = videoSrc;
document.getElementById("videoplay").play();



// var video1 = document.getElementById("videoPlay1"); //获取视频元素
// var audio = document.getElementById("bg-music"); //获取背景音乐
// $('.learn').click(function () {
//     audio.pause(); //背景音乐暂停
//     $('#videoPlay1').show(); //视频展示
//     video1.play(); //视频播放

//     video1.onended = function () { //视频播放结束执行的函数
//         $('#videoPlay1').hide(); //视频隐藏
//         $(".music-btn").hasClass("pause") ? audio.pause() : audio.play(); //音乐设置，如果音频播放视频前为暂停状态，音乐依然暂停，如果为播放状态，音乐播放
//     };
// });


/* < source
src = "http://192.168.112.233:8080/web_manage/upload/video.mp4"
type = "video/mp4" /
    >
    <
    !-- < source src = "video.ogg"
type = "video/ogg; codecs=dirac, speex" / > -- >
    <
    p > 你的浏览器不支持 < code > video < /code> 标签.</p > */