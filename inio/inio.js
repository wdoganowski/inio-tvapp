/**
 * Inio main object
 *
 * @author Mautilus s.r.o.
 * @class Inio
 * @singleton
 */

// reference to the global scope
var __global = this;

var Inio = {
	VERSION: '2.0.0',
	// private properties
	stack: [],
	isReady: false,
	/**
	 * Initialization function is called when `document` is ready
	 */
	init: function() {
		if (typeof __global.CONFIG === 'undefined') {
			__global.CONFIG = {};
		}

		this.debug = new Inio_Debug(CONFIG.debug);
		this.device = null;
		this.player = null;
		this.storage = null;
		this.connector = null;
		this.monitor = null;

		if (typeof Inio_Connector !== 'undefined') {
			this.connector = new Inio_Connector(CONFIG.connector);

			if (this.debug.launchpad && this.debug.consoleAddr) {
				this.connector.setConsoleAddr(this.debug.consoleAddr);
			}

			this.connector.connect(function() {
				this.initCore();
			}, this);

		} else {
			this.initCore();
		}
	},
	/**
	 * De-initialization function is called on `document.unload` event
	 */
	deinit: function() {
		this.onUnload();
	},
	/**
	 * Push new callback to the onReady event
	 *
	 * @chainable
	 * @param {Function} callback
	 * @param {Object} scope
	 */
	ready: function(callback, cbscope) {
		this.stack.push(['ready', callback, cbscope]);

		if (this.isReady) {
			this.onReady();
		}

		return this;
	},
	/**
	 * Push new callback to the onUnload event
	 *
	 * @chainable
	 * @param {Function} callback
	 * @param {Object} scope
	 */
	unload: function(callback, cbscope) {
		this.stack.push(['unload', callback, cbscope]);
		return this;
	},
	/**
	 * @private
	 */
	initCore: function() {
		var device, driverName;

		device = this.getPlatform();
		driverName = String(device[0]).substr(0, 1).toUpperCase() + String(device[0]).substr(1);

		if (typeof __global['Inio_Device_' + driverName] === 'undefined') {
			throw new Error('Device driver `Inio_Device_' + driverName + '` is not defined');
		}

		if (typeof __global['Inio_Player_' + driverName] === 'undefined') {
			throw new Error('Player driver `Inio_Player_' + driverName + '` is not defined');
		}

		if (typeof __global['Inio_Storage_' + driverName] === 'undefined') {
			throw new Error('Storage driver `Inio_Storage_' + driverName + '` is not defined');
		}

		this.device = new __global['Inio_Device_' + driverName](CONFIG.device);

		this.device.init(function() {
			this.player = new __global['Inio_Player_' + driverName](CONFIG.player);
			this.storage = new __global['Inio_Storage_' + driverName](CONFIG.storage);

			if (typeof Inio_Monitor !== 'undefined') {
				this.monitor = new Inio_Monitor(CONFIG.monitor);
			}

			if (this.debug.launchpad) {
				this.launchpadOverride();
			}

			this.onReady();
		}, this);
	},
	/**
	 * @private
	 */
	onReady: function() {
		this.isReady = true;

		if (this.stack) {
			for (var i in this.stack) {
				if (this.stack.hasOwnProperty(i) && this.stack[i] && this.stack[i][0] === 'ready' && typeof this.stack[i][1] === 'function') {
					this.stack[i][1].call(this.stack[i][2] || this);
					this.stack[i] = null;
				}
			}
		}
	},
	/**
	 * @private
	 */
	onUnload: function() {
		if (this.stack) {
			for (var i in this.stack) {
				if (this.stack.hasOwnProperty(i) && this.stack[i] && this.stack[i][0] === 'unload' && typeof this.stack[i][1] === 'function') {
					this.stack[i][1].call(this.stack[i][2] || this);
					this.stack[i] = null;
				}
			}
		}
	},
	/**
	 * Detects runtime platform and its version, e.g. ['samsung', '2013']
	 *
	 * @returns {Array}
	 */
	getPlatform: function() {
		if (navigator.userAgent.indexOf('Maple 5') >= 0) {
			return ['samsung', '2010'];
		} else if (navigator.userAgent.indexOf('Maple 6') >= 0) {
			return ['samsung', '2011'];
		} else if (navigator.userAgent.indexOf('SmartTV; Maple2012') >= 0) {
			return ['samsung', '2012'];
		} else if (navigator.userAgent.indexOf('Maple') >= 0) {
			return ['samsung', '2013'];
		} else if (/LG NetCast\.(TV|Media)\-2011/.test(navigator.userAgent)) {
			return ['lg', '2011'];
		} else if (/LG NetCast\.(TV|Media)\-2012/.test(navigator.userAgent)) {
			return ['lg', '2012'];
		} else if (/LG NetCast\.(TV|Media)/.test(navigator.userAgent)) {
			return ['lg', '2013'];
		} else if (navigator.userAgent.indexOf('NETTV\/3') >= 0) {
			return ['philips', '2011'];
		} else if (navigator.userAgent.indexOf('NETTV\/4\.0') >= 0) {
			return ['philips', '2012'];
		} else if (navigator.userAgent.indexOf('NETTV\/') >= 0) {
			return ['philips', '2013'];
		} else if (navigator.userAgent.indexOf('DuneHD\/') >= 0) {
			return ['dunehd', ''];
		} else if (navigator.userAgent.indexOf('SmartTvA\/') >= 0) {
			return ['alliance', 'generic'];
		} else if (navigator.userAgent.indexOf('ToshibaTP\/') >= 0) {
			return ['alliance', 'toshiba'];
		} else if (navigator.userAgent.indexOf('Viera\/3\.') >= 0) {
			return ['viera', '2013'];
		}

		return ['default', ''];
	},
	/**
	 * Extend object
	 *
	 * @param {Object} target
	 * @param {Object} source (1...n)
	 * @returns {Object}
	 */
	extend: function(target) {
		var i = 1, o, n, isDefinedProperty, defineProperty;

		isDefinedProperty = function(obj) {
			return (typeof obj == 'object' && (
				obj.hasOwnProperty('value') || obj.hasOwnProperty('writable') || obj.hasOwnProperty('configurable') || obj.hasOwnProperty('get') || obj.hasOwnProperty('set')
			));
		};

		defineProperty = function(obj, prop, desc) {
			if (Object.defineProperty) {
				return Object.defineProperty(obj, prop, desc);
			}

			obj[prop] = desc.value;
		};

		for (; i < arguments.length; i++) {
			if ((o = arguments[i]) !== null) {
				for (n in o) {
					if (o[n] === null || target[n] === null || (typeof o[n] === 'object' && o[n].constructor !== Object)) {
						target[n] = o[n];

					} else if (o[n] instanceof Array || target[n] instanceof Array) {
						target[n] = this.extend([], target[n], o[n]);

					} else if (typeof o[n] === 'object' || typeof target[n] === 'object') {
						if (isDefinedProperty(o[n])) {
							defineProperty(target, n, o[n]);

						} else {
							target[n] = this.extend({}, target[n], o[n]);
						}

					} else {
						target[n] = o[n];
					}
				}
			}
		}

		return target;
	},
	/*
	 * Binding function for prevent scope or global variables.
	 *
	 * @param {Function} func called function
	 * @param {Object} scope which scope has to function use ?
	 * @param {Array} addArg array of arguments which are passed to function
	 * @returns {Function} returns new function
	 */
	bind: function(func, scope, addArg) {
		return function() {
			if (addArg) {
				var args = Array.prototype.slice.call(arguments);
				return func.apply(scope, args.concat(addArg));
			} else
				return func.apply(scope, arguments);
		};
	},
	/**
	 * Serialize object into query string
	 *
	 * @param {Object} obj
	 * @returns {String}
	 */
	param: function(obj) {
		var parts = [];

		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
			}
		}

		return parts.join("&").replace(/%20/g, "+");
	},
	/**
	 *
	 * @private
	 */
	launchpadOverride: function() {
		this.device.exit = function() {
			window.location.href = Inio.debug.launchpad;
		};
	}
};

if (typeof document.head === 'undefined') {
	document.head = document.getElementsByTagName('head')[0];
}

if (typeof document.body === 'undefined') {
	document.body = document.getElementsByTagName('body')[0];
}

if (typeof document.addEventListener === 'function') {
	document.addEventListener('DOMContentLoaded', function() {
		Inio.init();
	}, false);

} else {
	document.onload = function() {
		Inio.init();
	};
}

document.unload = function() {
	Inio.deinit();
};