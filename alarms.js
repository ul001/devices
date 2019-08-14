var unreadCountSum = 0;
var bianweiCount = 5;
var yuexianCount = 37;
var platformCount = 2;

var string = '<span class="badge">' + bianweiCount + '</span>';
$("#bianwei").html(string);

var string = '<span class="badge">' + yuexianCount + '</span>';
$("#yuexian").html(string);

var string = '<span class="badge">' + platformCount + '</span>';
$("#platform").html(string);

unreadCountSum = bianweiCount + yuexianCount + platformCount;

//iOS回调未读数
var message = {
    'unreadCountSum': unreadCountSum
};
window.webkit.messageHandlers.jsToOcWithPrams.postMessage(message);