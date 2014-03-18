/**
 * Inio Developer Console Connector / core class
 *
 * @author Mautilus s.r.o.
 * @class Inio_Connector
 * @singleton
 */
function Inio_Connector() {
	this.init.apply(this, arguments);
};

/**
 * Initialize Debug
 *
 * @param {Object} config
 */
Inio_Connector.prototype.init = function(config) {
	this.config = {
		/**
		 * @cfg {Number} timeout Remote console connection timeout [ms]
		 */
		timeout: 3000,
		/**
		 * @cfg {String} consoleAddr Remote console IP address and port (e.g. 192.168.0.5:8383)
		 */
		consoleAddr: null
	};

	/**
	 * @property {Boolean} connected Whether console is connected or not
	 */
	this.connected = false;

	/**
	 * @property {Boolean} catchLogs Whether to catch all logs (not to propagate to Inio.debug)
	 */
	this.catchLogs = false;

	/**
	 * @property {Object} socket Opened socket
	 */
	this.socket = null;

	this.configure(config);
};
/**
 * Set class config hash
 *
 * @param {Object} config Hash of parameters
 */
Inio_Connector.prototype.configure = function(config) {
	this.config = Inio.extend(this.config || {}, config);
};
/**
 * Set remote addr
 *
 * @param {String} addr IP address and port (e.g. 192.168.0.5:8383)
 */
Inio_Connector.prototype.setConsoleAddr = function(addr) {
	this.config.consoleAddr = addr;
};
/**
 * Get remote addr
 *
 * @returns {String}
 */
Inio_Connector.prototype.getConsoleAddr = function() {
	return this.config.consoleAddr;
};
/**
 * Connect to the remote console
 *
 * @param {Function} callback
 * @param {Object} cbscope
 */
Inio_Connector.prototype.connect = function(callback, cbscope) {
	var scope = this,
		checkIo, status = true;

	if (!this.getConsoleAddr()) {
		if (callback) {
			callback.call(cbscope || this, false);
		}
		return;
	}

	if (this.connected && this.socket) {
		this.socket.disconnect();
		io = null;
	}

	this._timeout = setTimeout(function() {
		status = false;

		if (callback) {
			callback.call(cbscope || scope, false);
		}
	}, scope.config.timeout || 10000);

	checkIo = function() {
		if (typeof io === 'undefined' || !io) {
			setTimeout(function() {
				checkIo();
			}, 50);

			return;
		}

		if (scope._timeout) {
			clearTimeout(scope._timeout);
		}

		if (status) {
			scope.initIo(callback, cbscope);
		}
	};

	this.loadJS('http://' + this.getConsoleAddr() + '/socket.io/socket.io.js', function() {
		status = false;

		if (scope._timeout) {
			clearTimeout(scope._timeout);
		}

		if (callback) {
			callback.call(cbscope || scope, false);
		}
	});

	checkIo();
};
/**
 * @private
 */
Inio_Connector.prototype.initIo = function(callback, cbscope) {
	var scope = this;

	this.socket = io.connect('http://' + this.getConsoleAddr());

	this.socket.on('connect', function() {
		scope.connected = true;

		Inio.ready(function() {
			scope.register();
		});

		if (callback) {
			callback.call(cbscope || scope, true);
		}

		console.info('Connected to', scope.getConsoleAddr());
	});

	this.socket.on('disconnect', function(data) {
		scope.connected = false;

		console.info('Console Disconnected', scope.getConsoleAddr());
	});

	this.socket.on('exec', function(data) {
		if (data && data.cmd) {
			scope.exec(data.cmd);
		}
	});

	this.socket.on('execspecs', function(data) {
		if (data && data.url) {
			scope.execSpecs(data.url);
		}
	});

	this.socket.on('monitorstart', function() {
		scope.monitorStart();
	});

	this.socket.on('monitorstop', function() {
		scope.monitorStop();
	});

	this.socket.on('triggerevent', function(data) {
		if (data && data.event) {
			scope.triggerEvent(data);
		}
	});
};
/**
 * @private
 */
Inio_Connector.prototype.loadJS = function(src, onError) {
	var s = document.createElement('script');
	document.head.appendChild(s);

	if (onError) {
		s.onerror = onError;
	}

	s.src = src;
};
/**
 * Emit event
 *
 * @param {String} msg
 * @param {Object} data
 */
Inio_Connector.prototype.emit = function(msg, data) {
	if (!this.socket) {
		return;
	}

	this.socket.emit(msg, data);
};
/**
 * Execute javscript snippet
 *
 * @param {String} cmd
 */
Inio_Connector.prototype.exec = function(cmd) {
	try {
		eval(cmd);

	} catch (e) {

	}
};
/**
 * Send registration data to the console
 */
Inio_Connector.prototype.register = function() {
	this.emit('register', {
		uid: Inio.device.getUID(),
		ip: Inio.device.getIP(),
		name: Inio.device.getDeviceName()
	});
};
/**
 * Load (and execute) remote specs
 *
 * @param {String} url
 */
Inio_Connector.prototype.execSpecs = function(url) {
	this.loadJS(url, function() {
		console.error('Failed to load remote Specs (' + url + ')');
	});
};
/**
 * Turn on click/keydown monitoring
 *
 * @returns {Boolean}
 */
Inio_Connector.prototype.monitorStart = function() {
	if (!Inio.monitor) {
		return false;
	}

	Inio.monitor.start(this.monitorFlush, this);

	return true;
};
/**
 * Turn off click/keydown monitoring
 *
 * @returns {Boolean}
 */
Inio_Connector.prototype.monitorStop = function() {
	if (!Inio.monitor) {
		return false;
	}

	Inio.monitor.stop();

	return true;
};
/**
 * @private
 */
Inio_Connector.prototype.monitorFlush = function(log) {
	this.emit('monitor', {
		log: log
	});
};
/**
 * @private
 */
Inio_Connector.prototype.triggerEvent = function(data) {
	if (!Inio.monitor) {
		return false;
	}

	Inio.monitor.triggerEvent(data.event, data.path, data.data);

	return true;
};