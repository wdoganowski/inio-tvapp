var Keyboard = function() {
    if (typeof $ == 'undefined') {
	throw new Error('Keyboard Error: jQuery variable `$` is not defined');
    }

    this._init.apply(this, arguments);
}

Keyboard.prototype = {
    layout: {
	'default': {
	    // value, cells=1, style=basic|gray|active, icon=none

	    1: [
		{value: '1'},
		{value: '2'},
		{value: '3'},
		{value: '4'},
		{value: '5'},
		{value: '6'},
		{value: '7'},
		{value: '8'},
		{value: '9'},
		{value: '0'},
		{value: 'q'},
		{value: 'w'},
		{value: 'e'},
		{value: 'r'},
		{value: 't'},
		{value: 'y'},
		{value: 'u'},
		{value: 'i'},
		{value: 'o'},
		{value: 'p'},
		{value: 'a'},
		{value: 's'},
		{value: 'd'},
		{value: 'f'},
		{value: 'g'},
		{value: 'h'},
		{value: 'j'},
		{value: 'k'},
		{value: 'l'},
		{value: '-'},
		{value: 'SHIFT', cells: 2, icon: 'shift'},
		{value: 'z'},
		{value: 'x'},
		{value: 'c'},
		{value: 'v'},
		{value: 'b'},
		{value: 'n'},
		{value: 'm'},
		{value: '_'},
		{value: 'LAYOUT_2', text: '!#$', style: 'gray kb-default-focus'},
		{value: '@'},
		{value: '.'},
		{value: ' ', cells: 3, icon: 'space'},
		{value: 'LEFT', style: 'gray', icon: 'left'},
		{value: 'RIGHT', style: 'gray', icon: 'right'},
		{value: 'BACKSPACE', cells: 2, icon: 'backspace'}
	    ],
	    2: [
		{value: '1'},
		{value: '2'},
		{value: '3'},
		{value: '4'},
		{value: '5'},
		{value: '6'},
		{value: '7'},
		{value: '8'},
		{value: '9'},
		{value: '0'},
		{value: '`'},
		{value: '~'},
		{value: '!'},
		{value: '@'},
		{value: '#'},
		{value: '$'},
		{value: '%'},
		{value: '^'},
		{value: '&'},
		{value: '*'},
		{value: '+'},
		{value: '-'},
		{value: '_'},
		{value: '('},
		{value: ')'},
		{value: '|'},
		{value: ','},
		{value: '/'},
		{value: ':'},
		{value: '?'},
		{value: '.com', cells: 2},
		{value: '.net', cells: 2},
		{value: '.co.uk', cells: 2},
		{value: '<'},
		{value: '>'},
		{value: ';'},
		{value: '\\'},
		{value: 'LAYOUT_1', text: 'abc', style: 'gray kb-default-focus'},
		{value: '@'},
		{value: '.'},
		{value: ' ', cells: 3, icon: 'space'},
		{value: 'LEFT', style: 'gray', icon: 'left'},
		{value: 'RIGHT', style: 'gray', icon: 'right'},
		{value: 'BACKSPACE', cells: 2, icon: 'backspace'}
	    ],
	    'info': [
		'<span class="kb-info-button" data-cmd="_onReturn"><span class="kb-icon kb-icon-return">&nbsp;</span> Done</span>'
	    ]
	},
	'arabic': {
	    // value, cells=1, style=basic|gray|active, icon=none

	    2: [
		{value: '1'},
		{value: '2'},
		{value: '3'},
		{value: '4'},
		{value: '5'},
		{value: '6'},
		{value: '7'},
		{value: '8'},
		{value: '9'},
		{value: '0'},
		{value: '', style: 'empty'},
		{value: '', style: 'empty'},
		{value: 'ض'},
		{value: 'ص'},
		{value: 'ث'},
		{value: 'ق'},
		{value: 'ف'},
		{value: 'غ'},
		{value: 'ع'},
		{value: 'ه'},
		{value: 'خ'},
		{value: 'ح'},
		{value: 'ج'},
		{value: 'د'},
		{value: 'ش'},
		{value: 'س'},
		{value: 'ي'},
		{value: 'ب'},
		{value: 'ل'},
		{value: 'ا'},
		{value: 'ت'},
		{value: 'ن'},
		{value: 'م'},
		{value: 'ك'},
		{value: 'ط'},
		{value: '', style: 'empty'},
		{value: '', style: 'empty'},
		{value: 'ئ'},
		{value: 'ء'},
		{value: 'ؤ'},
		{value: 'ر'},
		{value: 'لا'},
		{value: 'ى'},
		{value: 'ة'},
		{value: 'و'},
		{value: 'ز'},
		{value: 'ظ'},
		{value: '', style: 'empty'},
		{value: 'LAYOUT_1', text: 'English', cells: 2, style: 'gray kb-default-focus'},
		{value: '@'},
		{value: '.'},
		{value: ' ', cells: 3, icon: 'space'},
		{value: 'LEFT', style: 'gray', icon: 'left'},
		{value: 'RIGHT', style: 'gray', icon: 'right'},
		{value: 'BACKSPACE', cells: 2, icon: 'backspace'},
		{value: '', style: 'empty'},
	    ],
	    1: [
		{value: '1'},
		{value: '2'},
		{value: '3'},
		{value: '4'},
		{value: '5'},
		{value: '6'},
		{value: '7'},
		{value: '8'},
		{value: '9'},
		{value: '0'},
		{value: '.com', cells: 2},
		{value: 'q'},
		{value: 'w'},
		{value: 'e'},
		{value: 'r'},
		{value: 't'},
		{value: 'y'},
		{value: 'u'},
		{value: 'i'},
		{value: 'o'},
		{value: 'p'},
		{value: '.net', cells: 2},
		{value: 'a'},
		{value: 's'},
		{value: 'd'},
		{value: 'f'},
		{value: 'g'},
		{value: 'h'},
		{value: 'j'},
		{value: 'k'},
		{value: 'l'},
		{value: '-'},
		{value: '#'},
		{value: '$'},
		{value: 'SHIFT', cells: 2, icon: 'shift'},
		{value: 'z'},
		{value: 'x'},
		{value: 'c'},
		{value: 'v'},
		{value: 'b'},
		{value: 'n'},
		{value: 'm'},
		{value: '_'},
		{value: '%'},
		{value: '&'},
		{value: 'LAYOUT_2', text: 'Arabic', cells: 2, style: 'gray kb-default-focus'},
		{value: '@'},
		{value: '.'},
		{value: ' ', cells: 3, icon: 'space'},
		{value: 'LEFT', style: 'gray', icon: 'left'},
		{value: 'RIGHT', style: 'gray', icon: 'right'},
		{value: 'BACKSPACE', cells: 2, icon: 'backspace'},
		{value: '', style: 'empty'}
	    ],
	    'info': [
		'<span class="kb-info-button" data-cmd="_onReturn"><span class="kb-icon kb-icon-return">&nbsp;</span> Done</span>'
	    ],
	    'options': {
		cls: 'kb-cols-12 kb-bigger',
		cols: 12
	    }
	}
    },
    nineKeys: {
	'0': ['0', ' '],
	'1': ['1', '.', '@', '-', '_'],
	'2': ['2', 'a', 'b', 'c'],
	'3': ['3', 'd', 'e', 'f'],
	'4': ['4', 'g', 'h', 'i'],
	'5': ['5', 'j', 'k', 'l'],
	'6': ['6', 'm', 'n', 'o'],
	'7': ['7', 'p', 'q', 'r', 's'],
	'8': ['8', 't', 'u', 'v'],
	'9': ['9', 'w', 'x', 'y', 'z']
    },
    // public events, you are welcome to override these
    onShow: function() {
    },
    onHide: function() {
    },
    onEnter: function() {
    },
    onChange: function() {
    },
    // public methods
    show: function(target_el) {
	var scope = this;

	if (typeof target_el == 'undefined' && this.target_el) {

	} else if (target_el) {
	    target_el = $(target_el);

	} else {
	    this.target_el = null;
	}

	if (this.target_el && this.target_el[0] == target_el[0] && this.ACTIVE) {
	    return;
	}

	this.target_el = target_el;

	if (!this._rendered || this._rendered != 1) {
	    this._render();

	} else {
	    this.el.show();
	}

	this._focus();

	this.ACTIVE = true;

	if (this.target_el && document.activeElement && this.target_el[0] != document.activeElement) {
	    this.target_el.trigger('focus');
	    this._moveCursor('end');
	}

	if (this.target_el && this.target_el[0] && !this.target_el[0].kbInited) {
	    this.target_el[0].kbInited = true;

	    this.target_el.bind('click', function(e) {
		if (scope.ACTIVE && scope.target_el[0] === this) {
		    scope._onTargetClick.apply(scope, arguments);
		    e.preventDefault();
		    return false;
		}
	    });
	}

	if (typeof this.onShow == 'function') {
	    this.onShow(this.target_el)
	}
    },
    hide: function() {
	if (!this.ACTIVE) {
	    return false;
	}

	this.ACTIVE = false;
	this.el.hide();

	if (this.target_el && document.activeElement && this.target_el[0] == document.activeElement) {
	    this.target_el.trigger('blur');
	}

	if (typeof this.onHide == 'function') {
	    this.onHide(this.target_el);
	}
    },
    setCursorPosition: function(position) {
	return this._moveCursor(position);
    },
    // private methods
    _init: function(opts) {
	var scope = this;
	this.el = $('<div id="keyboard" />').appendTo('body');

	this.options = $.extend({
	    cls: '',
	    keymap: {},
	    layout: 'default',
	    infoButtons: [],
	    cols: 10,
	    allowNineKeys: true
	}, opts || {});

	this.options = $.extend(this.options, this.layout[this.options.layout].options || {});

	if (this.options.cls) {
	    this.el.addClass(this.options.cls);
	}

	this._num_press = {};
	this._num_press_timeout = {};
	this._num_press_last = null;
	this._keys = {};
	this._rendered = null;

	this.VALUE = '';
	this.ACTIVE = false;
	this.SHIFT = false;

	this._initKeys(this.options.keymap);

	var _cb = document.body.onkeydown;

	document.body.onkeydown = function() {
	    if (scope._onKeyDown.apply(scope, arguments) !== false) {
		if (typeof _cb == 'function') {
		    _cb.apply(window, arguments);
		}
	    }
	}

	$(document).bind('mousedown', function() {
	    if (scope.ACTIVE) {
		event.stopPropagation();
		event.preventDefault();
		return false;
	    }
	});
    },
    _initKeys: function(opts) {
	this.keys = $.extend(this._detectKeymap(), opts || {});
    },
    _detectKeymap: function() {
	var userAgent = String(navigator.userAgent);

	if (userAgent.match(/\sSMART-TV;|\sMaple\s/i)) {
	    // samsung TV
	    return {
		LEFT: 4,
		RIGHT: 5,
		UP: 29460,
		DOWN: 29461,
		ENTER: 29443,
		BACKSPACE: 259,
		RETURN: 88,
		SHIFT: 650,
		ZERO: 17,
		ONE: 101,
		TWO: 98,
		THREE: 6,
		FOUR: 8,
		FIVE: 9,
		SIX: 10,
		SEVEN: 12,
		EIGHT: 13,
		NINE: 14,
		RED: 108,
		GREEN: 20,
		YELLOW: 21,
		BLUE: 22,
		PLAY: 71,
		PAUSE: 74,
		STOP: 70,
		REC: 192,
		FF: 72,
		RW: 69,
		TOOLS: 75,
		PUP: 68,
		PDOWN: 65,
		CHLIST: 84,
		HUB: 261,
		EXIT: 45
	    };

	} else if (userAgent.match(/LG NetCast/i)) {
	    // LG Net TV

	    if (typeof window.NetCastEnableNumberKey != 'undefined') {
		window.NetCastEnableNumberKey(true);
	    }

	    return {
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		ENTER: 13,
		BACKSPACE: 0,
		RETURN: 461,
		SHIFT: 0,
		ZERO: 48,
		ONE: 49,
		TWO: 50,
		THREE: 51,
		FOUR: 52,
		FIVE: 53,
		SIX: 54,
		SEVEN: 55,
		EIGHT: 56,
		NINE: 57
	    };

	} else {
	    return {
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		ENTER: 13,
		BACKSPACE: 110, // Del
		RETURN: 8,
		SHIFT: 16,
		ZERO: 96,
		ONE: 97,
		TWO: 98,
		THREE: 99,
		FOUR: 100,
		FIVE: 101,
		SIX: 102,
		SEVEN: 103,
		EIGHT: 104,
		NINE: 105
	    };
	}
    },
    _onKeyDown: function(keycode) {
	if (!this.ACTIVE) {
	    return;
	}

	if (typeof keycode == 'object') {
	    keycode = keycode.keyCode;

	    if (keycode) {
		switch (keycode) {
		    case this.keys.LEFT:
			event.preventDefault();
			event.stopPropagation();
			event.stop = true;

			this._move('left');
			break;

		    case this.keys.RIGHT:
			event.preventDefault();
			event.stopPropagation();
			event.stop = true;

			this._move('right');
			break;

		    case this.keys.UP:
			event.preventDefault();
			event.stopPropagation();
			event.stop = true;

			this._move('up');
			break;

		    case this.keys.DOWN:
			event.preventDefault();
			event.stopPropagation();
			event.stop = true;

			this._move('down');
			break;

		    case this.keys.ENTER:
			event.preventDefault();
			event.stopPropagation();
			event.stop = true;

			this._onEnter();
			break;

		    case this.keys.BACKSPACE:
			event.preventDefault();
			event.stopPropagation();
			event.stop = true;

			this._onBackspace();
			break;

		    case this.keys.RETURN:
			event.preventDefault();
			event.stopPropagation();
			event.stop = true;

			this._onReturn();
			break;

		    case this.keys.ZERO:
		    case this.keys.ONE:
		    case this.keys.TWO:
		    case this.keys.THREE:
		    case this.keys.FOUR:
		    case this.keys.FIVE:
		    case this.keys.SIX:
		    case this.keys.SEVEN:
		    case this.keys.EIGHT:
		    case this.keys.NINE:
			event.preventDefault();
			event.stopPropagation();
			event.stop = true;

			this._onNumericKey(this._number(keycode));
			break;

		    case this.keys.HUB:
		    case this.keys.EXIT:
			break;

		    default:
			event.preventDefault();
			event.stopPropagation();
			event.stop = true;
			break;
		}
	    }
	}
    },
    _render: function(layout_page) {
	var scope = this;
	this.el.empty();
	this.el.show();

	if (!layout_page) {
	    layout_page = 1;
	}

	if (this._keys) {
	    for (var i in this._keys) {
		this._keys[i].remove();
	    }

	    this._keys = {};
	}

	var ul = $('<ul class="kb-keys" />');
	ul.appendTo(this.el);

	var j = 0;
	$.each(this.layout[this.options.layout][layout_page], function(i, cell) {
	    var el = $('<li data-value="' + cell.value + '" data-cells="' + (cell.cells || 1) + '" class="kb-cells-' + (cell.cells || 1) + (cell.style ? ' kb-' + cell.style : '') + (j % scope.options.cols === 0 ? ' kb-key-clearfix' : '') + '">'
		    + '<span class="kb-key-wrap"><span class="kb-key-inner">' + (cell.icon ? '<span class="kb-icon kb-icon-' + cell.icon + '">&nbsp;</span>' : (cell.text ? cell.text : cell.value)) + '</span></span>'
		    + '</li>');
	    el.appendTo(ul);

	    el.bind('mouseenter', function() {
		if(this && ! this.className.match(/kb\-empty/) && ! this.className.match(/kb\-focus/)){
		    scope._focus(this);
		}
		/*
		var el = $(this);

		if (!el.hasClass('kb-empty')) {
		    scope._focus(el);
		}*/

	    }).bind('click', function() {
		scope._onEnter();
	    });

	    j += (cell.cells || 1);
	});

	var info = $('<div class="kb-info" />');
	info.appendTo(this.el);

	if (this.layout[this.options.layout]['info']) {
	    $.each(this.layout[this.options.layout]['info'], function(i, el) {
		info.append(el);
	    });
	}

	info.find('.kb-info-button').bind('click', function() {
	    var cmd = $(this).attr('data-cmd');

	    if (cmd && scope[cmd]) {
		scope[cmd].call(scope);
	    }
	});

	this._getKeyByValue('SHIFT').toggleClass('kb-active', this.SHIFT);

	this._rendered = layout_page;
    },
    _move: function(direction, redirectedFrom) {
	var focused = this._getFocused();
	var cells = this.options.cols;
	var el;

	if (focused && focused.length == 1) {
	    if (direction == 'right') {
		if (focused.hasClass('kb-info-button')) {
		    return false;

		} else if (focused.next().hasClass('kb-key-clearfix') || !focused.next().length) {
		    this._focusInfoButton();
		    return false;

		} else {
		    el = focused.next();
		}

	    } else if (direction == 'left') {
		if (focused.hasClass('kb-info-button')) {
		    this._blurInfoButton();
		    return false;

		} else {
		    el = focused.prev();
		}

	    } else if (direction == 'up') {
		focused.prevAll().each(function(i, _el) {
		    _el = $(_el);
		    cells -= parseInt(_el.attr('data-cells')) || 1;

		    if (cells <= 0) {
			el = _el;
			return false;
		    }
		});

	    } else if (direction == 'down') {
		focused.nextAll().each(function(i, _el) {
		    _el = $(_el);
		    cells -= parseInt(_el.attr('data-cells')) || 1;

		    if (cells <= 0) {
			el = _el;
			return false;
		    }
		});
	    }

	    if (el && el.length) {
		this._focus(el);

		if (el.hasClass('kb-empty')) {
		    return this._move(direction, focused);
		}

	    } else if (redirectedFrom) {
		this._focus(redirectedFrom);

	    } else if (direction == 'up') {
		this.hide();
	    }
	}
    },
    _onEnter: function() {
	var el = this._getFocused();
	var key, cmd;
	var m;

	if (typeof this.onEnter == 'function') {
	    if (this.onEnter(this.target_el) === false) {
		return false;
	    }
	}

	if (el && el.length) {
	    key = el.attr('data-value');
	    
	    /*
	    el.addClass('kb-pressed');

	    setTimeout(function() {
		el.removeClass('kb-pressed');
	    }, 130);
	    */
	   
	    if (key == 'SHIFT') {
		this._toggleShift();

	    } else if (key && (m = key.match(/^LAYOUT_(\d+)/)) && m[1]) {
		this._toggleLayout(parseInt(m[1]));

	    } else if (key == 'BACKSPACE') {
		this._backspace();

	    } else if (key == 'LEFT') {
		this._moveCursor('left');

	    } else if (key == 'RIGHT') {
		this._moveCursor('right');

	    } else if (cmd = el.attr('data-cmd')) {
		if (cmd && this[cmd]) {
		    this[cmd].call(this);
		}

	    } else {
		this._write(key);
	    }
	}
    },
    _onBackspace: function() {
	this._backspace();
    },
    _onShift: function() {
	this._toggleShift();
    },
    _onReturn: function() {
	this.hide();
    },
    _onNumericKey: function(num) {
	var scope = this;

	if (!this.options.allowNineKeys) {
	    var el = scope._getKeyByValue(num);

	    if (el && el.length) {
		scope._focus(el);
		scope._onEnter();
	    }
	    return;
	}

	if (this._num_press_last !== num || typeof this._num_press[num] == 'undefined') {
	    this._num_press[num] = -1;
	}

	this._num_press[num]++;

	if ((this._num_press_last === null || this._num_press_last === num) && this._num_press_timeout[num]) {
	    clearTimeout(this._num_press_timeout[num]);
	}

	this._num_press_last = num;

	this._num_press_timeout[num] = setTimeout(function() {
	    var ch;

	    if (scope._num_press[num] == -1) {
		scope._num_press[num] = 0;
	    }

	    if (scope.nineKeys[num]) {
		if (scope._num_press[num] > (scope.nineKeys[num].length - 1)) {
		    scope._num_press[num] -= scope.nineKeys[num].length;
		}

		if (typeof (ch = scope.nineKeys[num][scope._num_press[num]]) != 'undefined') {
		    var el = scope._getKeyByValue(ch);

		    if (el && el.length) {
			scope._focus(el);
			scope._onEnter();
		    }
		}
	    }

	    scope._num_press[num] = -1;
	}, 1200);

	if (scope.nineKeys[num]) {
	    if (scope._num_press[num] > (scope.nineKeys[num].length - 1)) {
		scope._num_press[num] -= scope.nineKeys[num].length;
	    }

	    if (typeof (ch = scope.nineKeys[num][scope._num_press[num]]) != 'undefined') {
		scope._highlight(ch);
		scope._glow(scope.nineKeys[num]);
	    }
	}
    },
    _getFocused: function() {
	if (this._focused) {
	    return this._focused;
	}

	return this.el.find('ul.kb-keys').find('li.kb-focus').eq(0);
    },
    _focus: function(el) {
	if (!el) {
	    el = this.el.find('ul.kb-keys').find('li.kb-default-focus').eq(0);
	}
	
	el = $(el);

	if (el && el.length) {
	    if (this._focused) {
		this._focused.removeClass('kb-focus');

	    } else {
		this.el.find('.kb-focus').not(el).removeClass('kb-focus');
	    }

	    this._focused = el;
	}

	el.addClass('kb-focus');
    },
    _focusInfoButton: function() {
	this._lastFocusedKey = this._getFocused();
	var el = this.el.find('.kb-info-button').eq(0);

	this._focus(el);
    },
    _blurInfoButton: function() {
	var el = this._lastFocusedKey;

	if (!el) {
	    el = this.el.find('.kb-key-clearfix').eq(1);
	}

	while (el.length && el.hasClass('kb-empty')) {
	    el = el.prev();
	}

	this._focus(el);
    },
    _getKeyByValue: function(val) {
	if (this._keys[val]) {
	    return this._keys[val];
	}

	var el = this.el.find('li[data-value="' + val + '"]').eq(0);

	if (el && el.length) {
	    this._keys[val] = el;
	}

	return el;
    },
    _highlight: function(key) {
	var el = this._getKeyByValue(key);

	if (this._highlighted) {
	    this._highlighted.removeClass('kb-highlight');
	}

	this._highlighted = el;

	if (el && el.length) {
	    el.addClass('kb-highlight');

	    setTimeout(function() {
		el.removeClass('kb-highlight');
	    }, 1200);
	}
    },
    _glow: function(keys) {
	var scope = this;

	this.el.addClass('kb-glowing');

	if (this._glowed) {
	    this._glowed.removeClass('kb-glow');
	}

	this._glowed = null;

	var els = this.el.find('li[data-value="' + keys.join('"], li[data-value="') + '"]');

	if (els && els.length) {
	    this._glowed = els;
	    els.addClass('kb-glow');
	}

	if (this._glow_timeout) {
	    clearTimeout(this._glow_timeout);
	}

	this._glow_timeout = setTimeout(function() {
	    scope.el.removeClass('kb-glowing');
	    els.removeClass('kb-glow');
	}, 1200);
    },
    _number: function(number) {
	switch (number) {
	    case this.keys.ONE:
		return 1;
	    case this.keys.TWO:
		return 2;
	    case this.keys.THREE:
		return 3;
	    case this.keys.FOUR:
		return 4;
	    case this.keys.FIVE:
		return 5;
	    case this.keys.SIX:
		return 6;
	    case this.keys.SEVEN:
		return 7;
	    case this.keys.EIGHT:
		return 8;
	    case this.keys.NINE:
		return 9;
	    case this.keys.ZERO:
		return 0;
	}

	return 0;
    },
    _toggleLayout: function(layout_page) {
	this._render(layout_page);
	this._focus();
    },
    _toggleShift: function() {
	var shift = this.el.toggleClass('kb-shift');

	if (this.el.hasClass('kb-shift')) {
	    this.SHIFT = true;

	} else {
	    this.SHIFT = false;
	}

	this._getKeyByValue('SHIFT').toggleClass('kb-active', this.SHIFT);
    },
    _getCursor: function() {
	var el;

	if (this.target_el) {
	    el = this.target_el[0];

	    return el.selectionStart || 0;

	} else {
	    return this._cursor || 0;
	}
    },
    _getValue: function() {
	if (this.target_el) {
	    return String(this.target_el[0].value);
	}

	return this.VALUE;
    },
    _moveCursor: function(direction) {
	var el, pos = this._getCursor();

	if (direction == 'left') {
	    pos--;

	} else if (direction == 'right') {
	    pos++;

	} else if (direction == 'end') {
	    pos = String(this._getValue()).length;

	} else {
	    pos = parseInt(direction);
	}

	if (this.target_el) {
	    el = this.target_el[0];

	    if (el.setSelectionRange) {
		el.setSelectionRange(pos, pos);
	    }

	    this._moveText(pos);

	} else {
	    this._cursor = pos;
	}
    },
    _moveText: function(pos) {
	var elWidth, strWidth, currIndent, indent = 0;

	strWidth = this._getTextWidth(this._getValue().substring(0, pos));
	elWidth = this.target_el.innerWidth();
	currIndent = parseInt(this.target_el.css('text-indent')) * -1;

	if (strWidth >= currIndent && strWidth <= (currIndent + elWidth)) {
	    return;

	} else if (strWidth > elWidth) {
	    indent = strWidth - elWidth;

	} else if (strWidth < currIndent) {
	    indent = strWidth;
	}

	this.target_el.css('text-indent', -1 * indent);
    },
    _backspace: function() {
	var val = this._getValue(), pos = this._getCursor();

	if (pos > 0) {
	    val = val.substring(0, pos - 1) + val.substring(pos);
	    pos--;

	    this._moveCursor(pos);

	} else {
	    return false;
	}

	if (this.target_el) {
	    this.target_el[0].value = val;

	} else {
	    this.VALUE = val;
	}

	this._moveCursor(pos);

	if (typeof this.onChange == 'function') {
	    this.onChange(val, pos, this.target_el);
	}
    },
    _write: function(str) {
	var val = this._getValue(), pos = this._getCursor();
	var maxlength = parseInt(this.target_el.attr('maxlength'));

	if (maxlength && val.length >= maxlength) {
	    return;
	}

	if (this.SHIFT) {
	    str = str.toUpperCase();
	}

	if (pos == 0) {
	    val = str + val;
	    pos = str.length;

	} else if (pos == val.length) {
	    val += str;
	    pos = val.length;

	} else {
	    val = val.substring(0, pos) + str + val.substring(pos);
	    pos = pos + str.length;
	}

	if (this.target_el) {
	    this.target_el[0].value = val;

	} else {
	    this.VALUE = val;
	}

	this._moveCursor(pos);

	if (typeof this.onChange == 'function') {
	    this.onChange(val, pos, this.target_el);
	}
    },
    _getTextWidth: function(str) {
	var el, width;

	if (!this.target_el) {
	    return false;
	}

	el = $('<span />').css({
	    'font-family': this.target_el.css('font-family'),
	    'font-size': this.target_el.css('font-size'),
	    'letter-spacing': this.target_el.css('letter-spacing'),
	    'white-space': 'pre'
	}).text(str).appendTo('body');

	width = el.width();

	el.remove();

	return width;
    },
    _onTargetClick: function(e) {
	var val = this._getValue(),
		offsetX = 0, pos = 0, offset = this.target_el.offset();

	if (e && e.pageX) {
	    offsetX = e.pageX - offset.left;

	    while ((pos <= val.length) && this._getTextWidth(val.substring(0, pos)) < offsetX) {
		pos += 1;
	    }

	    this._moveCursor(pos);
	}
    }
};
