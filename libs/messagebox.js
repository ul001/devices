MessageBox = function (element, id, message) {
    // Init value
    this.message = "";
    this.element = undefined;
    this.id = "";

    this.message = message;
    this.element = element;
    this.id = id;
};

document.getElementView = function (element) {
    if (element != document)
        return {
            width: element.offsetWidth,
            height: element.offsetHeight
        }
    if (document.compatMode == "BackCompat") {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
};

document.getElementLeft = function (element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
};

document.getElementTop = function (element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
};

MessageBox.prototype = {

    constructor: MessageBox, // 声明构造函数

    Show: function () {
        if (!this.element) return false;
        if (this.element.box)
            this.element.box.Remove(true);
        var megbox = document.createElement("div");
        megbox.className = "megbox";
        megbox.id = "megbox_" + this.id; //把id加上前缀，作为气泡的id
        var megbox_top = document.createElement("div");
        megbox_top.className = "megbox_top";
        var megbox_meg = document.createElement("div");
        megbox_meg.className = "megbox_meg";
        var megbox_txt = document.createElement("div");
        megbox_txt.className = "megbox_txt";
        var megs = document.createTextNode(this.message);

        megbox.appendChild(megbox_top);
        megbox.appendChild(megbox_meg);
        megbox_meg.appendChild(megbox_txt);
        megbox_txt.appendChild(megs);
        this.element.box = this;

        document.getElementsByTagName("body")[0].appendChild(megbox);

        var node_view = document.getElementView(this.element);
        var node_top = document.getElementTop(this.element);
        var node_left = document.getElementLeft(this.element);

        megbox.style.top = (node_top + node_view.height + 5) + "px";
        megbox.style.left = node_left + "px";

        return true;
    },

    Remove: function () {
        var id = this.id;
        var node = document.getElementById("megbox_" + id);
        if (node) {
            node.parentNode.removeChild(node);
            return true;
        }
        return false;
    }
};