var meterCode = localStorage.getItem("meterCode");

function initContent(){
    Substation.getDataByAjax("/selectOne",{meterCode:meterCode},function(data){
        console.log(data);
    });
}

initContent();