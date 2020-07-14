var historyLog = localStorage.getItem("updateLog");
historyLog = JSON.parse(historyLog);
var reg = new RegExp("<br>", "g"); //g,表示全部替换。
historyLog.replace(reg, "/n");
$("#updateLog").html(historyLog);


var videoSrc = localStorage.getItem("videoUrl"); //新的视频播放地址
document.getElementById("videoplay").src = videoSrc;
document.getElementById("videoplay").play();