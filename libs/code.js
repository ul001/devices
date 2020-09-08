(function ($) {
    $.codeDraw = function (select, inputSelect, successCallback) {
        $(inputSelect).val('')
        var canvas_width = $(select).attr('width');
        var canvas_height = $(select).attr('height');
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        var sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
        var aCode = sCode.split(",");
        var aLength = aCode.length;
        var value = [];
        for (var i = 0; i <= 3; i++) {
            var j = Math.floor(Math.random() * aLength);
            var deg = Math.random() * 30 * Math.PI / 180;
            var txt = aCode[j];
            value[i] = txt.toLowerCase();
            var x = 10 + i * 20;
            var y = 20 + Math.random() * 8;
            context.font = "bold 23px 微软雅黑";
            context.translate(x, y);
            context.rotate(deg);
            context.fillStyle = code_randomColor();
            context.fillText(txt, 0, 0);
            context.rotate(-deg);
            context.translate(-x, -y);
        }
        value = value.join("");
        $(select).attr('data-code', value)
        for (var i = 0; i <= 5; i++) {
            context.strokeStyle = code_randomColor();
            context.beginPath();
            context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.stroke();
        }
        for (var i = 0; i <= 30; i++) {
            context.strokeStyle = code_randomColor();
            context.beginPath();
            var x = Math.random() * canvas_width;
            var y = Math.random() * canvas_height;
            context.moveTo(x, y);
            context.lineTo(x + 1, y + 1);
            context.stroke();
        }

        $(select).off('click').on('click', function () {
            $.codeDraw(select, inputSelect, successCallback)
        })

        $(inputSelect).unbind('input propertychange');
        $(inputSelect).bind('input propertychange', function () {
            var text = $(inputSelect).val();
            if (text.length >= 4) {
                var val = $(inputSelect).val().toLowerCase();
                // 获取生成验证码值
                var num = $(canvas).attr('data-code');
                if (val === num) {
                    successCallback()
                } else {
                    console.log('error')
                }
            }
        })
    }

    function code_randomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    var InterValObj1; //timer变量，控制时间

    $.countInterval = function (phoneSelect, btnSelect, successCallback) {
        var status = $(btnSelect).attr('disabled') === 'disabled' && $(btnSelect).val() === '获取验证码'

        if (!status) {
            return;
        }
        $(btnSelect).removeAttr("disabled"); //启用按钮

        var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; //手机号正则
        var curCount1; //当前剩余秒数
        var count = 60; //间隔函数，1秒执行

        $(btnSelect).off('click').on('click', function () {
            curCount1 = count;
            var phone = $.trim($(phoneSelect).val());
            if (!phoneReg.test(phone)) {
                alert(" 请输入有效的手机号码");
                return false;
            }
            $(btnSelect).attr("disabled", "true");
            $(btnSelect).val(+curCount1 + "秒再获取");
            InterValObj1 = window.setInterval(function () {
                if (curCount1 === 0) {
                    window.clearInterval(InterValObj1); //停止计时器
                    $(btnSelect).removeAttr("disabled"); //启用按钮
                    $(btnSelect).val("获取验证码");
                } else {
                    curCount1--;
                    $(btnSelect).val(+curCount1 + "秒再获取");
                }
            }, 1000); //启动计时器，1秒执行一次
            successCallback()
        })
    }

    $.clearInter = function (btnSelect) {
        window.clearInterval(InterValObj1); //停止计时器
        $(btnSelect).attr("disabled", "disabled"); //启用按钮
        $(btnSelect).val("获取验证码");
    }

})(jQuery);