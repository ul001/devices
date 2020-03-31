var historyLog = localStorage.getItem("updateLog");
historyLog = JSON.parse(historyLog);
$("#updateLog").html(historyLog);