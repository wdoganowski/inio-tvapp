var Keyboard = function() {
    // call constructor
    this.init.apply(this, arguments);
};

var KeyboardOnKeyDown;

Keyboard.prototype = {
    layouts: [
	{
	    lang: "EN",
	    // v - values; s - size; t - type (K key, F function key, S space); w - change width in %
	    layout: [
		[{v: "+", t: "K"}, {v: "$", t: "K"}, {v: "q", t: "K"}, {v: "w", t: "K"}, {v: "e", t: "K"}, {v: "r", t: "K"}, {v: "t", t: "K"}, {v: "y", t: "K"}, {v: "u", t: "K"}, {v: "i", t: "K"}, {v: "o", t: "K"}, {v: "p", t: "K"}, {v: "BSP", t: "F"}, {v: "7", t: "K"}, {v: "8", t: "K"}, {v: "9", t: "K"}],
		[{v: "Caps Lock", s: 2, t: "F", w: 94}, {v: "a", t: "K"}, {v: "s", t: "K"}, {v: "d", t: "K"}, {v: "f", t: "K"}, {v: "g", t: "K"}, {v: "h", t: "K"}, {v: "j", t: "K"}, {v: "k", t: "K"}, {v: "l", t: "K"}, {v: "Done", id: "done", t: "F", s: 2, w: 94}, {v: "4", t: "K"}, {v: "5", t: "K"}, {v: "6", t: "K"}],
		[{v: "SHIFT", s: 2, t: "F", w: 94}, {v: "&", t: "K"}, {v: "z", t: "K"}, {v: "x", t: "K"}, {v: "c", t: "K"}, {v: "v", t: "K"}, {v: "b", t: "K"}, {v: "n", t: "K"}, {v: "m", t: "K"}, {v: "-", t: "K"}, {v: "_", t: "K"}, {v: "#", t: "K"}, {v: "1", t: "K"}, {v: "2", t: "K"}, {v: "3", t: "K"}],
		[{v: "Arabic", s: 3, t: "F", w: 96}, {v: ".", s: 1, t: "K"}, {v: "SPACE", s: 5, t: "F", w: 98}, {v: "@", s: 1, t: "K"}, {v: "CA", s: 1, t: "F"}, {v: "LC", t: "F"}, {v: "RC", t: "F"}, {v: "0", s: 1, t: "K"}, {v: "/", s: 1, t: "K"}, {v: "*", s: 1, t: "K"}]
	    ],
	    getReturnElem: function() {
		return document.querySelector("#keyboard .posx10y1");
	    },
	    getLanguageElem: function() {
		return document.querySelector("#keyboard .posx0y3");
	    },
	    additionalInit: function(scope) {
		scope.elem.style.direction = "";
		scope.elem.style.fontFamily = scope.saveFontFamily;
	    }
	},
	{
	    lang: "AR",
	    // v - values; s - size; t - type (K key, F function key, S space); w - change width in %
	    layout: [
		[{v: "ض", t: "K"}, {v: "ص", t: "K"}, {v: "ث", t: "K"}, {v: "ق", t: "K"}, {v: "ف", t: "K"}, {v: "غ", t: "K"}, {v: "ع", t: "K"}, {v: "ه", t: "K"}, {v: "خ", t: "K"}, {v: "ح", t: "K"}, {v: "ج", t: "K"}, {v: "د", t: "K"}, {v: "BSP", t: "F"}, {v: "7", t: "K"}, {v: "8", t: "K"}, {v: "9", t: "K"}],
		[{v: "ش", t: "K"}, {v: "س", t: "K"}, {v: "ي", t: "K"}, {v: "ب", t: "K"}, {v: "ل", t: "K"}, {v: "ا", t: "K"}, {v: "ت", t: "K"}, {v: "ن", t: "K"}, {v: "م", t: "K"}, {v: "ك", t: "K"}, {v: "ط", t: "K"}, {v: "منتهى", id: "done", t: "F", s: 2, w: 94}, {v: "4", t: "K"}, {v: "5", t: "K"}, {v: "6", t: "K"}],
		[{v: "#", t: "K"}, {v: "ئ", t: "K"}, {v: "ء", t: "K"}, {v: "ؤ", t: "K"}, {v: "ر", t: "K"}, {v: "لا", t: "K"}, {v: "ى", t: "K"}, {v: "ة", t: "K"}, {v: "و", t: "K"}, {v: "ز", t: "K"}, {v: "ظ", t: "K"}, {v: "_", t: "K"}, {v: "-", t: "K"}, {v: "1", t: "K"}, {v: "2", t: "K"}, {v: "3", t: "K"}],
		[{v: "English", s: 3, t: "F", w: 96}, {v: ".", s: 1, t: "K"}, {v: "SPACE", s: 5, t: "F", w: 98}, {v: "@", s: 1, t: "K"}, {v: "CA", s: 1, t: "F"}, {v: "LC", t: "F"}, {v: "RC", t: "F"}, {v: "0", s: 1, t: "K"}, {v: "/", s: 1, t: "K"}, {v: "*", s: 1, t: "K"}]
	    ],
	    getReturnElem: function() {
		return document.querySelector("#keyboard .posx11y1");
	    },
	    getLanguageElem: function() {
		return document.querySelector("#keyboard .posx0y3");
	    },
	    additionalInit: function(scope) {
		scope.elem.style.direction = "rtl";
		scope.saveFontFamily = scope.elem.style.fontFamily;
		scope.elem.style.fontFamily = "sans-serif";
	    }
	}
    ],
    init: function(elem, lang) {
	var scope = this;

	if (!elem)
	    return; // no elem exit
	this.elem = elem;
	// default
	if (!lang)
	    lang = "EN";
	// position
	this.position = {x: 0, y: 0};
	this.capsLock = false;
	this.shift = false;
	this.saveFontFamily = "";
	this.setFocusByInput = true;
	this.isVisible = true;
	this.maxLength = this.elem.getAttribute('maxlength') || 120;
	// create
	this.create(lang);
	this.moveCaret(0, "end"); // move cursor to the end
	
	KeyboardOnKeyDown = function(e){
	    scope.keyDownCover(e);
	};
	
	// keys
	document.addEventListener("keydown", KeyboardOnKeyDown);
	// default focus on enter - return
	Focus.to(this.selLayout.getReturnElem(), this);
	this.selLayout.additionalInit(this);
    },
    onDestroy: function() {
    }, // call back function
    keyDownCover: function(e) {
	if(! this.isVisible){
	    return;
	}
	var keyCode = e.keyCode;
	var isn = Control.isNumeric(keyCode);
	if (keyCode == Control.key.RETURN) {
	    e.preventDefault();
	    this.destroy();
	    return;
	}
	else if (isn.isNum) {
	    e.preventDefault();
	    this.insertValue(isn.value);
	    if (this.setFocusByInput)
		this.focusByInput(isn.value);
	}
	else if (keyCode !== Control.key.ENTER && Control.isNavigational(keyCode)) {
	    e.preventDefault();
	    this.cursorKeys(keyCode);
	}
	else if (keyCode == Control.key.ENTER) {
	    var el = document.querySelector("#keyboard .focus");
	    if (el)
		this.onEnter(el);
	    
	    return;
	}
	else if(keyCode === 261 || keyCode === 45){
	    // HUB || EXIT
	    return;
	}
	
	e.preventDefault();
	return false;
	
	/*
	if (this.setFocusByInput && ((keyCode >= 65 && keyCode <= 90) || keyCode == 32)) {
	    var value = String.fromCharCode(e.keyCode);
	    value = value.toLowerCase();
	    this.focusByInput(value);
	    
	}else if (this.setFocusByInput && Main.getDevice()[0] !== 'samsung' && (keyCode >= 96 && keyCode <= 105)) {
	    var value = (96 - keyCode) * -1;
	    this.focusByInput(value);
	}
	*/
    },
    focusByInput: function(key) {
	for (var y = 0; y < this.selLayout.layout.length; y++)
	    for (var x = 0; x < this.selLayout.layout[y].length; x++) {
		var value = this.selLayout.layout[y][x].v;
		if (value == key || (key === ' ' && value == 'SPACE')) {
		    this.position.x = x;
		    this.position.y = y;
		    Focus.to(document.querySelector("#keyboard .posx" + this.position.x + "y" + this.position.y), this);
		    break;
		}
	    }
    },
    onEnter: function(el) {
	var pos = this.parseClassName(el.className);
	var elem = this.selLayout.layout[pos.y][pos.x];
	if (elem.t == "K") {
	    this.insertValue(elem.v);
	}
	else if (elem.t == "F") {
	    if (elem.v == "SPACE") {
		this.insertValue(" ");
	    }
	    else if (elem.id == "done") {
		this.destroy();
	    }
	    else if (elem.v == "CA") {
		this.moveCaret(0, "start");
		this.elem.value = "";
		this.elem.style.textIndent = 0;
	    }
	    else if (elem.v == "BSP") {
		this.backspace();
	    }
	    else if (elem.v == "LC") {
		var direction = (this.selLayout.lang == "AR" ? 1 : -1);
		this.moveCaret(direction);
	    }
	    else if (elem.v == "RC") {
		var direction = (this.selLayout.lang == "AR" ? -1 : 1);
		this.moveCaret(direction);
	    }
	    else if (elem.v == "Caps Lock") {
		this.capsLock = !this.capsLock;
		var tt = (this.capsLock ? "uppercase" : "");

		var all = document.querySelectorAll("#keyboard .tt");
		for (var i = 0; i < all.length; i++)
		    all[i].style.textTransform = tt;
	    }
	    else if (elem.v == "SHIFT") {
		this.shift = !this.shift;
		this.capsLock = false;

		var tt = (this.shift ? "uppercase" : "");

		var all = document.querySelectorAll("#keyboard .tt");
		for (var i = 0; i < all.length; i++)
		    all[i].style.textTransform = tt;
	    }
	    else if (elem.v == "English") {
		this.switchLayout("EN");
	    }
	    else if (elem.v == "Arabic") {
		this.switchLayout("AR");
	    }
	}
    },
    switchLayout: function(lang) {
	if (this.lang != lang) {
	    this.capsLock = false;
	    this.shift = false;
	    this.create(lang);
	    this.moveCaret(0, "end"); // move cursor to the end
	    // default focus on language
	    Focus.to(this.selLayout.getLanguageElem(), this);
	    this.selLayout.additionalInit(this);
	}
    },
    backspace: function() {
	var cur = this.elem.selectionStart;

	var len = this.elem.value.length;

	if (cur == len) {
	    this.elem.value = this.elem.value.slice(0, -1);
	    this.moveCaret(0);
	}
	else if (cur > 0) {
	    var left = this.elem.value.substr(0, cur - 1);
	    var right = this.elem.value.substr(cur, len - cur);
	    this.elem.value = left + right;
	    this.elem.setSelectionRange(cur - 1, cur - 1);
	}
    },
    insertValue: function(value) {
	var cur = this.elem.selectionStart;
	var len = this.elem.value.length;
	
	console.log('>>>', value);
	
	if(len > this.maxLength){
	    return;
	}

	if (this.capsLock)
	    value = value.toUpperCase();
	else if (this.shift) {
	    value = value.toUpperCase();
	    this.shift = false;
	    var all = document.querySelectorAll("#keyboard .tt");
	    for (var i = 0; i < all.length; i++)
		all[i].style.textTransform = "";
	}

	if (cur == len) {
	    this.elem.value += value;
	    this.moveCaret(1);
	}
	else if (cur == 0) {
	    this.elem.value = value + this.elem.value;
	    this.elem.setSelectionRange(1, 1);
	}
	else {
	    var left = this.elem.value.substr(0, cur);
	    var right = this.elem.value.substr(cur, len - cur);
	    this.elem.value = left + value + right;
	    this.elem.setSelectionRange(cur + 1, cur + 1);
	}
	
	this.moveText(cur);
    },
    moveCaret: function(direction, special) {
	var cur = this.elem.selectionStart;
	var len = this.elem.value.length;

	cur += direction;
	if (special) {
	    if (special == "end") {
		cur = len;
	    }
	    else if (special == "start") {
		cur = 0;
	    }
	}
	if (cur < 0)
	    cur = 0;
	else if (cur > len)
	    cur = len;
	this.elem.setSelectionRange(cur, cur);
	
	this.moveText(cur);
    },
    cursorKeys: function(key) {
	var el = document.querySelector("#keyboard .focus");
	if (el) {
	    this.position = this.parseClassName(el.className);
	    if (key == Control.key.LEFT)
		this.move(-1, 0, "X");
	    else if (key == Control.key.RIGHT)
		this.move(1, 0, "X");
	    else if (key == Control.key.UP)
		this.move(0, -1, "Y");
	    else if (key == Control.key.DOWN)
		this.move(0, 1, "Y");
	}
    },
    move: function(dirX, dirY, axis) {
	// current x
	var currentX = 0;
	for (var i = 0; i <= this.position.x; i++) {
	    var item = this.selLayout.layout[this.position.y][i];
	    var size = (item.s ? item.s : 1);
	    if (this.position.x == i)
		size = 1;
	    currentX += size;
	}

	this.position.x += dirX;
	this.position.y += dirY;
	this.assingIndToArray(axis, currentX);
	Focus.to(document.querySelector("#keyboard .posx" + this.position.x + "y" + this.position.y), this);
    },
    assingIndToArray: function(axis, currentX) {
	// for a line
	if (axis == "X") {
	    var len = this.selLayout.layout[this.position.y].length;
	    if (this.position.x < 0)
		this.position.x = len - 1;
	    if (this.position.x > len - 1)
		this.position.x = 0;
	}
	else if (axis == "Y") {
	    var len = this.selLayout.layout.length;
	    if (this.position.y < 0)
		this.position.y = len - 1;
	    if (this.position.y > len - 1)
		this.position.y = 0;

	    // change on axis x
	    var newCurrentX = 0;
	    var newSize = 0;

	    for (var i = 0; i < this.selLayout.layout[this.position.y].length; i++) {
		var item = this.selLayout.layout[this.position.y][i];
		var size = (item.s ? item.s : 1);
		newSize += size;
		if (newSize >= currentX) {
		    break;
		}
		newCurrentX++;
	    }

	    if (newCurrentX != this.position.x)
		this.position.x = newCurrentX;

	    // problem with x ?
	    var lenX = this.selLayout.layout[this.position.y].length;
	    if (this.position.x > lenX - 1)
		this.position.x = lenX - 1;
	}
    },
    parseClassName: function(className) {
	var data = className.replace(/^(.*)posx([^y]+)y([0-9]+)(.*)$/g, "$2,$3");
	data = data.split(",");
	return {x: parseInt(data[0]), y: parseInt(data[1])};
    },
    destroy: function() {
	this.isVisible = false;
	document.removeEventListener("keydown", KeyboardOnKeyDown);
	if(this.elemCover && this.elemCover.parentNode){
	    this.elemCover.parentNode.removeChild(this.elemCover);
	}
	this.onDestroy();
    },
    getLayoutByLang: function(lang) {
	for (var i = 0; i < this.layouts.length; i++) {
	    if (this.layouts[i].lang == lang)
		return this.layouts[i];
	}
    },
    create: function(lang) {
	var layout = this.getLayoutByLang(lang);

	// remove old keyboard
	var keyboardExists = document.getElementById("keyboard");
	if (keyboardExists)
	    keyboardExists.parentNode.removeChild(keyboardExists);

	this.selLayout = layout;
	this.elemCover = document.createElement("div");
	// append keyboard to body
	document.body.appendChild(this.elemCover);
	this.elemCover.setAttribute("id", "keyboard");
	// layouts
	var scope = this;
	var lineHeight = (99 / layout.layout.length).toFixed(2);
	for (var line = 0; line < layout.layout.length; line++) {
	    var oneLine = layout.layout[line];
	    var lineElem = document.createElement("div");
	    var valueText;
	    this.elemCover.appendChild(lineElem);
	    lineElem.setAttribute("class", "line");
	   //lineElem.style.height = lineHeight + "%";
	    // append child
	    var wholeSize = 0;
	    for (var lineSign = 0; lineSign < oneLine.length; lineSign++)
		wholeSize += (layout.layout[line][lineSign].s ? layout.layout[line][lineSign].s : 1);
	    var signElemSize = (100 / wholeSize).toFixed(2);

	    for (var lineSign = 0; lineSign < oneLine.length; lineSign++) {
		var signElem = document.createElement("span");
		lineElem.appendChild(signElem);
		var tt = (layout.layout[line][lineSign].t == "K" ? "tt" : "");
		signElem.setAttribute("class", "key " + tt + " posx" + lineSign + "y" + line);
		signElem.style.width = (layout.layout[line][lineSign].s ? layout.layout[line][lineSign].s : 1) * signElemSize + "%";
		var style = "";
		/*if (layout.layout[line][lineSign].w)
		    style = "width:" + layout.layout[line][lineSign].w + "%;";*/
		var value = layout.layout[line][lineSign].v;
		if (this.isBackgroundKey(value) || layout.layout[line][lineSign].id) {
		    valueText = (layout.layout[line][lineSign].id == "done" ? value : "&nbsp;");
		    signElem.innerHTML = "<span class='content sk" + (layout.layout[line][lineSign].id || value) + "' style='" + style + "'>" + valueText + "</span>";
		    
		    if(layout.layout[line][lineSign].id === 'done' && lang === 'AR'){
			signElem.style.direction = 'rtl';
		    }
		}
		else if (value == "Caps Lock") {
		    signElem.innerHTML = "<span class='content skCAPSLOCK' style='" + style + "'>" + value + "</span>";
		}
		else {
		    signElem.innerHTML = "<span class='content' style='" + style + "'>" + value + "</span>";
		}

		//signElem.style.lineHeight = signElem.offsetHeight + "px";

		signElem.addEventListener("mouseover", function() {
		    Focus.to(this, scope);
		});
		signElem.addEventListener("click", function(e) {
		    scope.onEnter(this);
		});
	    }
	}
    },
    isBackgroundKey: function(key) {
	if (key == "SHIFT" || key == "SPACE" || key == "BSP" || key == "Return" || key == "CA" || key == "LC" || key == "RC")
	    return true;
	else
	    return false;
    },
    moveText: function(pos) {
	var elWidth, strWidth, currIndent, indent = 0;

	strWidth = this.getTextWidth(this.elem.value.substring(0, pos)) + 10;
	elWidth = this.elem.clientWidth;
	currIndent = this.elem.style.textIndent ? parseInt(this.elem.style.textIndent) * -1 : 0;

	if (strWidth >= currIndent && strWidth <= (currIndent + elWidth)) {
	    return;

	} else if (strWidth > elWidth) {
	    indent = strWidth - elWidth;

	} else if (strWidth < currIndent) {
	    indent = strWidth;
	}
	
	if(this.elem.type === 'password'){
	    return;
	}

	this.elem.style.textIndent = (-1 * indent)+'px';
    },
    getTextWidth: function(str) {
	var el, width;

	if (!this.elem) {
	    return false;
	}

	el = $('<span />').css({
	    'font-family': this.elem.style.fontFamily,
	    'font-size': this.elem.style.fontSize,
	    'letter-spacing': this.elem.style.letterSpacing,
	    'white-space': 'pre'
	}).text(str).appendTo('body');

	width = el.width();

	el.remove();

	return width;
    }
};