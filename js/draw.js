let canvas = document.getElementById("drawing-board");
let ctx = canvas.getContext("2d");
let eraser = document.getElementById("eraser");
let brush = document.getElementById("brush");
let reSetCanvas = document.getElementById("clear");
let aColorBtn = document.getElementsByClassName("color-item");
let save = document.getElementById("save");
let undo = document.getElementById("undo");
let range = document.getElementById("range");
let clear = false;
let activeColor = 'black';
let lWidth = 4;

autoSetSize(canvas);

setCanvasBg('white');

listenToUser(canvas);

getColor();

/*window.onbeforeunload = function () {
    return "Reload site?";
};*/

function autoSetSize(canvas) {
    canvasSetSize();

    function canvasSetSize() {
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;

        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }

    window.onresize = function () {
        canvasSetSize();
    }
}

function setCanvasBg(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
}

function listenToUser(canvas) {
    let painting = false;
    let lastPoint = {
        x: undefined,
        y: undefined
    };

    if (document.body.ontouchstart !== undefined) {
        canvas.ontouchstart = function (e) {
            this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height); //在这里储存绘图表面
            saveData(this.firstDot);
            painting = true;
            let x = e.touches[0].clientX;
            let y = e.touches[0].clientY;
            lastPoint = {
                "x": x,
                "y": y
            };
            ctx.save();
            drawCircle(x, y, 0);
        };
        canvas.ontouchmove = function (e) {
            if (painting) {
                let x = e.touches[0].clientX;
                let y = e.touches[0].clientY;
                let newPoint = {
                    "x": x,
                    "y": y
                };
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }
        };

        canvas.ontouchend = function () {
            painting = false;
        }
    } else {
        canvas.onmousedown = function (e) {
            this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height); //在这里储存绘图表面
            saveData(this.firstDot);
            painting = true;
            let x = e.clientX;
            let y = e.clientY;
            lastPoint = {
                "x": x,
                "y": y
            };
            ctx.save();
            drawCircle(x, y, 0);
        };
        canvas.onmousemove = function (e) {
            if (painting) {
                let x = e.clientX;
                let y = e.clientY;
                let newPoint = {
                    "x": x,
                    "y": y
                };
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, clear);
                lastPoint = newPoint;
            }
        };

        canvas.onmouseup = function () {
            painting = false;
        };

        canvas.mouseleave = function () {
            painting = false;
        }
    }
}

function drawCircle(x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (clear) {
        ctx.clip();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}

function drawLine(x1, y1, x2, y2) {
    ctx.lineWidth = lWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (clear) {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    } else {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
}

range.onchange = function () {
    lWidth = this.value;
};

eraser.onclick = function () {
    clear = true;
    this.classList.add("active");
    brush.classList.remove("active");
};

brush.onclick = function () {
    clear = false;
    this.classList.add("active");
    eraser.classList.remove("active");
};

reSetCanvas.onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBg('white');
};

save.onclick = function () {
    var imgBase64 = canvas.toDataURL("image/png");
    // var fileName = (new Date()).getTime() + ".jpeg"; //随机文件名

    // // var imgfile = convertBase64UrlToImgFile(imgUrl, fileName, 'image/jpeg'); //转换成file
    // var blob = dataURLtoBlob(imgUrl);
    // var imgfile = blobToFile(blob, fileName);
    // var taskID = localStorage.getItem("missiontaskID");
    // var formData = new FormData();
    // formData.append('file', imgfile); //放到表单中，此处的file要和后台取文件时候的属性名称保持一致
    // formData.append('fTaskid', taskID);
    //var blob = dataURLtoBlob(imgBase64);
    //var imgFile = blobToFile(blob,"signName.png");
    var taskID = localStorage.getItem("missiontaskID");
    var param = new FormData();
    param.append('file', dataURLtoFile(imgBase64)); //放到表单中，此处的file要和后台取文件时候的属性名称保持一致
    param.append('fTaskid', taskID);
    // downloadFile('emmm', imgUrl);

    Substation.postFormDataByAjax("/saveClientSignImg", param, function (data) {
        if (data.code == 200) {
            $.toast("保存成功");
            localStorage.setItem("need-update", "true");
            window.history.back();
        }
    });

    // var b64 = imgUrl.substring(22);
    // $.ajax({
    //     url: "RotateCanvas.aspx",
    //     data: {
    //         data: b64,
    //         name: "i.toString"
    //     },
    //     success: function () {
    //         //alert('OK');
    //     }
    // });
    // let saveA = document.createElement("a");
    // document.body.appendChild(saveA);
    // saveA.href = imgUrl;
    // saveA.download = "zspic" + (new Date).getTime();
    // saveA.target = "_blank";
    // saveA.click();
    // savePicture(imgUrl);
};

function downloadFile(content, fileName) { //下载base64图片
    var base64ToBlob = function (code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {
            type: contentType
        });
    };
    let aLink = document.createElement('a');
    let blob = base64ToBlob(content); //new Blob([content]);
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
};

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

function savePicture(Url) {
    var blob = new Blob([''], {
        type: 'application/octet-stream'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = Url;
    a.download = Url.replace(/(.*\/)*([^.]+.*)/ig, "$2").split("?")[0];
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
    URL.revokeObjectURL(url);
    var imgDtask = plus.downloader.createDownload(imgurl, {
        //                                method: 'GET'
    }, function (d, status) {
        if (status == 200) {
            plus.gallery.save(d.filename, function () { //保存到相册
                plus.io.resolveLocalFileSystemURL(d.filename, function (enpty) {
                    // 关闭弹框
                    mui('#picture').popover('toggle');
                    // mui.toast('保存成功')
                });

            })
        } else {
            // mui.toast('保存失败')
        }
    });
    imgDtask.start();
}

function getColor() {
    for (let i = 0; i < aColorBtn.length; i++) {
        aColorBtn[i].onclick = function () {
            for (let i = 0; i < aColorBtn.length; i++) {
                aColorBtn[i].classList.remove("active");
                this.classList.add("active");
                activeColor = this.style.backgroundColor;
                ctx.fillStyle = activeColor;
                ctx.strokeStyle = activeColor;
            }
        }
    }
}

let historyDeta = [];

function saveData(data) {
    (historyDeta.length === 10) && (historyDeta.shift()); // 上限为储存10步，太多了怕挂掉
    historyDeta.push(data);
}

undo.onclick = function () {
    if (historyDeta.length < 1) return false;
    ctx.putImageData(historyDeta[historyDeta.length - 1], 0, 0);
    historyDeta.pop()
};

/**
 * 有些浏览器(如edge)不支持new File，所以为了兼容，base64要先转换成blob再设置type，name，lastModifiedDate
 * 属性间接转换成文件，而不推荐直接new File()的方式
 **/
function convertBase64UrlToImgFile(urlData, fileName, fileType) {
    var bytes = window.atob(urlData); //转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Int8Array(ab);
    var i;
    for (i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    //转换成文件，添加文件的type，name，lastModifiedDate属性
    var blob = new Blob([ab], {
        type: fileType
    });
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob;
}

//将base64转换为blob
var dataURLtoBlob = function (dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

//将blob转换为file
var blobToFile = function (theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

function dataURLtoFile(dataurl, filename = 'file') {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}