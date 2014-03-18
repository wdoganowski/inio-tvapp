/**
 * Inio Debug / core class
 *
 * @author Mautilus s.r.o.
 * @class Inio_Debug
 * @singleton
 */
function Inio_Debug() {
	this.init.apply(this, arguments);
};

/**
 * Initialize Debug
 *
 * @param {Object} config
 */
Inio_Debug.prototype.init = function(config) {
	var m;

	this.config = {
		/**
		 * @cfg {Boolean} production If TRUE, debugging is disabled
		 */
		production: false,
		/**
		 * @cfg {Boolean} active If TRUE, console won't be overriden and native implementation will be used
		 */
		active: true,
		/**
		 * @cfg {Boolean} displayConsole Whether to display debug console at the bottom
		 */
		displayConsole: true
	};

	this.consoleStack = [];
	this.canAccessError = this.isErrorAvailable();

	// for launchpad and remote console
	this.launchpad = null;
	this.consoleAddr = null;

	if (window.location) {
		m = window.location.search.match(/launchpad=([^\?\&\=]+)/);

		if (m && m[1]) {
			this.launchpad = m[1];

			m = window.location.search.match(/consoleAddr=([\d\:\.]+)/);
			this.consoleAddr = m[1];
		}
	}

	this.configure(config);

	this.polyfillConsole();

	if (this.config.active && this.config.displayConsole) {
		this.displayConsole();
	}
};
/**
 * Set class config hash
 *
 * @param {Object} config Hash of parameters
 */
Inio_Debug.prototype.configure = function(config) {
	this.config = Inio.extend(this.config || {}, config);
};
/**
 * @private
 */
Inio_Debug.prototype.getDate = function() {
	return new Date();
};
/**
 * Test, if the current browser / viewer supports error object.
 *
 * @private
 * @returns {Boolean}
 */
Inio_Debug.prototype.isErrorAvailable = function() {
	try {
		var obj = new Error(),
			stack = obj.stack;
		return true;
	} catch (err) {
		return false;
	}
};
/**
 * Polyfill console object if not present
 *
 * @private
 */
Inio_Debug.prototype.polyfillConsole = function() {
	var scope = this,
		onerror;

	if (typeof window.console === 'undefined') {
		window.console = {
			log: function() {},
			warn: function() {},
			info: function() {},
			error: function() {},
			network: function() {},
			group: function() {},
			groupCollapsed: function() {},
			groupEnd: function() {}
		};

	} else if (window.console.polyfilled) {
		return;
	}

	if (!this.config.active) {
		window.console.network = function() {

		};

		return;
	}

	if (this.config.production) {
		this.offConsole();
		return;
	}

	onerror = window.onerror;

	window.onerror = function(message, url, lineNumber) {
		if (typeof onerror === 'function') {
			onerror.apply(window, arguments);
		}

		scope.toConsole('error', arguments);
	};

	window.console.polyfilled = true;
	window.console.__log = window.console.log;
	window.console.__warn = window.console.warn;
	window.console.__info = window.console.info;
	window.console.__error = window.console.error;
	window.console.__group = window.console.group;
	window.console.__groupCollapsed = window.console.groupCollapsed;
	window.console.__groupEnd = window.console.groupEnd;

	window.console.log = function() {
		var args = Array.prototype.slice.call(arguments, 0);

		if (scope.canAccessError) {
			var stack = new Error().stack,
				allFiles = (stack ? stack.match(new RegExp("[_a-zA-Z0-9]+\.js[^)]*", "g")) : []),
				file = "",
				splits = null,
				ind = 0,
				len = 0;
			if (allFiles && allFiles.length && allFiles[1]) {
				file = allFiles[1]; // first is console, second is a file
				splits = file.split(":");
				ind = splits[0].lastIndexOf("/");
				len = splits[0].length;
				args.push("[" + splits[0].substr(ind + 1, len - ind - 1) + ":" + splits[1] + "]");
			}
		}

		scope.toConsole('log', args);
		return window.console.__log.apply(window.console, args);
	};

	window.console.warn = function() {
		scope.toConsole('warn', arguments);
		return window.console.__warn.apply(window.console, arguments);
	};

	window.console.info = function() {
		scope.toConsole('info', arguments);
		return window.console.__info.apply(window.console, arguments);
	};

	window.console.error = function() {
		scope.toConsole('error', arguments);
		return window.console.__error.apply(window.console, arguments);
	};

	window.console.group = function() {
		scope.toConsole('group', arguments);
		return window.console.__group.apply(window.console, arguments);
	};

	window.console.groupCollapsed = function() {
		scope.toConsole('groupCollapsed', arguments);
		return window.console.__groupCollapsed.apply(window.console, arguments);
	};

	window.console.groupEnd = function() {
		scope.toConsole('groupEnd', arguments);
		return window.console.__groupEnd.apply(window.console, arguments);
	};

	window.console.network = function(uid) {
		if (uid === false) {
			return;
		}

		scope.toConsole('network', arguments);
		return false;
	};
};
/**
 * When debug mode is off, override console methods and turn off loggin
 *
 * @private
 */
Inio_Debug.prototype.offConsole = function() {
	window.console = {
		log: function() {},
		warn: function() {},
		info: function() {},
		error: function() {},
		network: function() {},
		group: function() {},
		groupCollapsed: function() {},
		groupEnd: function() {}
	};
};
/**
 * @private
 */
Inio_Debug.prototype.toConsole = function(type, args) {
	var line, t;

	args = Array.prototype.slice.apply(args);

	for (var i in args) {
		if (typeof args[i] === 'object') {
			try {
				args[i] = JSON.stringify(args[i]);
			} catch (error) {
				args[i] = "[Object]";
			}
		}
	}

	t = this.getDate();

	line = [type, (('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2) + ':' + ('0' + t.getSeconds()).slice(-2)), Array.prototype.slice.apply(args).join(' ').replace(/\&/g, '&amp;')];

	if (Inio.connector && Inio.connector.connected) {
		Inio.connector.emit('console', {
			time: t.getTime(),
			type: type,
			data: line[2]
		});

		if (Inio.connector.catchLogs) {
			return;
		}
	}

	if (this.config.limitStack && this.consoleStack.length >= this.config.limitStack) {
		this.consoleStack.splice(this.config.limitStack - 1, 10);
	}

	this.consoleStack.unshift(line);

	if (typeof this.onWrite === 'function') {
		this.onWrite(line);
	}

	if (this.config.displayConsole) {
		this.renderConsole();
	}
};
/**
 * @private
 */
Inio_Debug.prototype.displayConsole = function() {
	if (this.el) {
		return;
	}

	this.el = document.createElement('details');
	this.el.className = 'Inio-console';
	this.el.open = 'open';
	this.el.innerHTML = "<summary>Debug Console</summary>\n";
	this.el.style.position = 'absolute';
	this.el.style.zIndex = 99999;
	this.el.style.bottom = 0;
	this.el.style.left = 0;
	this.el.style.right = 0;
	this.el.style.width = '100%';
	this.el.style.maxHeight = '250px';
	this.el.style.overflow = 'auto';
	this.el.style.background = 'rgba(0,0,0,0.7)';
	this.el.style.color = '#fff';
	this.el.style.fontFamily = 'monospace';
	this.el.style.fontSize = '14px';
	this.el.style.whiteSpace = 'pre-wrap';

	document.body.appendChild(this.el);
};
/**
 * Remove console element from DOM
 *
 * @returns {Boolean}
 */
Inio_Debug.prototype.removeConsole = function() {
	if (!this.el) {
		return false;
	}

	this.config.displayConsole = false;

	this.el.parentNode.removeChild(this.el);

	return true;
};
/**
 * @private
 */
Inio_Debug.prototype.renderConsole = function() {
	var html = '';

	for (var i in this.consoleStack) {
		html += "[" + this.consoleStack[i][0] + "] " + this.consoleStack[i][1] + " " + this.consoleStack[i][2] + "\n";
	}

	this.el.innerHTML = "<summary>Debug Console</summary>\n" + html;
};
/**
 * @template
 */
Inio_Debug.prototype.onWrite = function(row) {

};
/**
 * Execute unit tests
 */
Inio_Debug.prototype.execTests = function() {
	if (typeof jasmine === 'undefined') {
		throw new Error('jasmine.js is not defined');
	}

	if (!this.jasmineEnv) {
		this.jasmineEnv = jasmine.getEnv();
		this.jasmineEnv.updateInterval = 1000;

		this.jasmineEnv.addReporter(new jasmine.ConsoleReporter());
	}

	this.jasmineEnv.execute();
};