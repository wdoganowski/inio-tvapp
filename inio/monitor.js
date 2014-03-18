/**
 * Inio Monitor / core class
 *
 * @author Mautilus s.r.o.
 * @class Inio_Monitor
 * @singleton
 */
function Inio_Monitor() {
	this.init.apply(this, arguments);
};

/**
 * @property {Array} ignoreCls List of classNames to ignore within selectors
 */
Inio_Monitor.prototype.ignoreCls = ['focus'];
/**
 * @property {Array} buffer Log buffer
 */
Inio_Monitor.prototype.buffer = null;
/**
 * @property {Number} flushInterval Buffer flush interval in [ms]
 */
Inio_Monitor.prototype.flushInterval = 350;
/**
 * Initialize Monitor
 *
 * @param {Object} config
 */
Inio_Monitor.prototype.init = function(config) {
	var scope = this;

	this.config = {
		active: true
	};

	this.keyMap = Inio.device.getKeyMap();

	this.configure(config);

	if (!this.config.active) {
		return;
	}

	document.addEventListener('click', function(e) {
		var target = e.target;

		if (scope.running && target) {
			scope.buffer.push({
				e: 'click',
				t: new Date().getTime(),
				p: scope.getPath(target),
				d: e.clientX + ';' + e.clientY
			});
		}
	}, true);

	document.addEventListener('mouseenter', function(e) {
		var target = e.target;

		if (scope.running && target && target.className && scope.matchCls(target, 'focusable')) {
			scope.buffer.push({
				e: 'mouseenter',
				t: new Date().getTime(),
				p: scope.getPath(target),
				d: e.clientX + ';' + e.clientY
			});
		}
	}, true);

	document.addEventListener('mousewheel', function(e) {
		var target = e.target;

		if (scope.running && target && target.className) {
			scope.buffer.push({
				e: 'mousewheel',
				t: new Date().getTime(),
				p: scope.getPath(target),
				d: e.clientX + ';' + e.clientY
			});
		}
	}, true);

	document.addEventListener('keydown', function(e) {
		var keyCode = e.keyCode,
			keyName = 'N/A';

		if (scope.running && keyCode) {
			for (var i in scope.keyMap) {
				if (scope.keyMap[i] === keyCode) {
					keyName = i;
					break;
				}
			}

			scope.buffer.push({
				e: 'keydown',
				t: new Date().getTime(),
				p: keyName + ' / ' + keyCode
			});
		}
	}, true);
};
/**
 * Set class config hash
 *
 * @param {Object} config Hash of parameters
 */
Inio_Monitor.prototype.configure = function(config) {
	this.config = Inio.extend(this.config || {}, config);
};
/**
 * Start monitoring and flush logs into given callback
 *
 * @param {Function} flushCallback
 * @param {Object} cbscope
 */
Inio_Monitor.prototype.start = function(flushCallback, cbscope) {
	var scope = this;

	this.running = true;

	this.clearBuffer();

	if (this._flushInt) {
		clearInterval(this._flushInt);
	}

	this._flushInt = setInterval(function() {
		var tmp;

		if (!scope.buffer || !scope.buffer.length) {
			return;
		}

		tmp = scope.buffer.slice(0);

		scope.clearBuffer();

		if (flushCallback) {
			flushCallback.call(cbscope || scope, tmp);
		}
	}, this.flushInterval);
};
/**
 * Stop monitoring
 */
Inio_Monitor.prototype.stop = function() {
	this.running = false;

	if (this._flushInt) {
		clearInterval(this._flushInt);
	}
};
/**
 * @private
 */
Inio_Monitor.prototype.clearBuffer = function() {
	this.buffer = [];
};
/**
 * @private
 */
Inio_Monitor.prototype.normalizeCls = function(cls) {
	var m = '(' + this.ignoreCls.join('|') + ')',
		xp = new RegExp('^' + m + '\\s|^' + m + '$|\\s' + m + '\\s|\\s' + m + '$', 'g');
	return cls.replace(xp, ' ').replace(/\s{2,}/g, '').replace(/^\s+|\s+$/g, '');
};
/**
 * @private
 */
Inio_Monitor.prototype.matchCls = function(node, cls) {
	var c1 = node.className.split(/\s+/),
		c2 = cls.split(/\s+/);

	for (var i in c2) {
		if (c1.indexOf(c2[i]) < 0) {
			return false;
		}
	}

	return true;
};
/**
 * @private
 */
Inio_Monitor.prototype.getSelector = function(node) {
	var parent, cls = '',
		idx = 0;

	if (node.className) {
		cls = this.normalizeCls(node.className);
	}

	if (!node.id || node.id.match(/^uid\-/)) {
		parent = node.parentNode;

		if (parent && parent.childNodes) {
			for (var i in parent.childNodes) {
				if (parent.childNodes.hasOwnProperty(i) && parent.childNodes[i]) {
					if (parent.childNodes[i] === node) {
						break;
					}

					if (parent.childNodes[i].className && this.matchCls(parent.childNodes[i], cls)) {
						idx += 1;
					}
				}
			}
		}
	}

	return node.nodeName + ((node.id && !node.id.match(/^uid\-/)) ? '#' + node.id : (cls ? '.' + cls.split(/\s+/g).join('.') : '') + ':eq(' + idx + ')');
};
/**
 * @private
 */
Inio_Monitor.prototype.getPath = function(node) {
	var parent, path;

	path = this.getSelector(node);

	if (node === document.body) {
		return path;
	}

	parent = node.parentNode;

	while (parent && parent !== document.body) {
		path = this.getSelector(parent) + ' > ' + path;
		parent = parent.parentNode;
	}

	return path;
};
/**
 * Trigger click, keydown etc. event
 *
 * @param {String} event
 * @param {String} path CSS selector or KEYDOWN data
 * @param {String} [data]
 */
Inio_Monitor.prototype.triggerEvent = function(event, path, data) {
	var e, target, tmp;

	if (event === 'keydown') {
		tmp = String(path).split(/\s+\/\s+/);

		if (!tmp) {
			return false;
		}

		if (typeof KeyboardEvent !== 'function') {
			e = document.createEventObject ? document.createEventObject() : document.createEvent('Events');

			if (e.initEvent) {
				e.initEvent('keydown', true, true);
			}

			e.keyCode = tmp[1] >> 0;
			e.which = tmp[1] >> 0;

			document.dispatchEvent ? document.dispatchEvent(e) : document.fireEvent('onkeydown', e);

		} else {
			e = new KeyboardEvent('keydown', {
				altKey: false,
				ctrlKey: false,
				canBubble: true,
				bubbles: true,
				cancelable: true,
				view: window
			});

			delete e.keyCode;
			Object.defineProperty(e, 'keyCode', {
				'value': tmp[1] >> 0
			});

			document.dispatchEvent(e);
		}

	} else {
		// mouse events

		if (event === 'mouseenter') {
			event = 'mouseover';
		}

		if (!path) {
			return false;
		}

		tmp = String(data).split(/\;/);

		e = new MouseEvent(event, {
			canBubble: true,
			bubbles: true,
			cancelable: true,
			view: window
		});

		if (tmp.length === 2) {
			delete e.clientX;
			delete e.clientY;
			Object.defineProperty(e, 'clientX', {
				'value': tmp[0] >> 0
			});
			Object.defineProperty(e, 'clientY', {
				'value': tmp[1] >> 0
			});
		}

		if (typeof jQuery !== 'undefined') {
			target = $(path);

			if (!target.length) {
				return false;
			}

			target = target[0];

		} else if (typeof document.querySelector !== 'undefined') {
			target = document.querySelector(path.replace(/\:eq\((\d+)\)/g, function(m, eq) {
				return ':nth-child(' + ((eq >> 0) + 1) + ')';
			}));

		}

		if (!target) {
			return false;
		}

		target.dispatchEvent(e);
	}
};