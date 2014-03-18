/**
 * Handles keyboard/RC events
 *
 * @author Mautilus s.r.o.
 * @class Control
 * @singleton
 * @mixins Events
 */
var Control = (function() {
	function Factory() {
		Events.call(this);

		/**
		 * @property {Object} config General config hash
		 */
		this.config = null;
		/**
		 * @property {Boolean} enabled
		 * Enable or disable key handling
		 */
		this.enabled = true;
		/**
		 * @property {Object} key
		 * Key map, contains key:value pairs for key codes, e.g. {LEFT:37,...}
		 */
		this.key = {};

		// Initialize this class when Main is ready
		Inio.ready(function() {
			this.init();
		}, this);
	};

	Factory.prototype.__proto__ = Events.prototype;

	/**
	 * @event beforekey
	 * Will be called before a `key` event
	 * @preventable
	 * @param {Number} keyCode
	 * @param {Event} event
	 */

	/**
	 * @event key
	 * Will be called when a keyboard/RC event is triggered
	 * @param {Number} keyCode
	 * @param {Event} event
	 */

	Factory.prototype.init = function(config) {
		var scope = this;

		this.configure(config);

		this.setKeys(Inio.device.getKeyMap());

		jQuery(document).bind('keydown', function() {
			scope.onKeyDown.apply(scope, arguments);
		});
	};
	/**
	 * Set class config hash
	 *
	 * @param {Object} config Hash of parameters
	 */
	Factory.prototype.configure = function(config) {
		this.config = $.extend(true, this.config || {}, config);
	};
	/**
	 * Disable key handling, specify callback to catch keys by your function
	 *
	 * @param {Function} callback
	 * @param {Object} scope
	 */
	Factory.prototype.disable = function(callback, scope) {
		this.enabled = false;

		if (typeof callback === 'function') {

			if (this.disabledCallback) {
				this.off('beforekey', this.disabledCallback);
			}

			this.disabledCallback = callback;
			this.on('beforekey', this.disabledCallback, scope);

		} else {
			this.disabledCallback = null;
		}
	};
	/**
	 * Enable key handling
	 */
	Factory.prototype.enable = function() {
		this.enabled = true;

		if (this.disabledCallback) {
			this.off('beforekey', this.disabledCallback);
			this.disabledCallback = null;
		}
	};
	/**
	 * Set key map
	 *
	 * @param {Object} Key map, e.g. {LEFT:37,...}
	 * @returns {Object} Current key map
	 */
	Factory.prototype.setKeys = function(map) {
		$.extend(this.key, map || {});

		return this.key;
	};
	/**
	 * Test if given keycode belongs to some numeric key
	 *
	 * @param {Number} keycode
	 * @returns {Boolean}
	 */
	Factory.prototype.isNumeric = function(keycode) {
		if (keycode === this.key.ONE || keycode === this.key.TWO || keycode === this.key.THREE || keycode === this.key.FOUR || keycode === this.key.FIVE || keycode === this.key.SIX || keycode === this.key.SEVEN || keycode === this.key.EIGHT || keycode === this.key.NINE || keycode === this.key.ZERO) {
			return true;
		}

		return false;
	};
	/**
	 * Test if given keycode is navigation key (arrow, enter or return)
	 *
	 * @param {Number} keycode
	 * @returns {Boolean}
	 */
	Factory.prototype.isNavigational = function(keycode) {
		if (keycode === this.key.LEFT || keycode === this.key.RIGHT || keycode === this.key.UP || keycode === this.key.DOWN || keycode === this.key.ENTER || keycode === this.key.RETURN) {
			return true;
		}

		return false;
	};
	/**
	 * Test if given keycode is navigation arraow key
	 *
	 * @param {Number} keycode
	 * @returns {Boolean}
	 */
	Factory.prototype.isArrow = function(keycode) {
		if (keycode === this.key.LEFT || keycode === this.key.RIGHT || keycode === this.key.UP || keycode === this.key.DOWN) {
			return true;
		}

		return false;
	};
	/**
	 * Test if given keycode is playback control key
	 *
	 * @param {Number} keycode
	 * @returns {Boolean}
	 */
	Factory.prototype.isMedia = function(keycode) {
		if (keycode === this.key.PLAY || keycode === this.key.PAUSE || keycode === this.key.STOP || keycode === this.key.FF || keycode === this.key.RW) {
			return true;
		}

		return false;
	};
	/**
	 * Get textual value if give key
	 *
	 * @param {Number} keycode
	 * @returns {String}
	 */
	Factory.prototype.getTextValue = function(keycode) {
		if (keycode === this.key.ONE) {
			return '1';
		} else if (keycode === this.key.TWO) {
			return '2';
		} else if (keycode === this.key.THREE) {
			return '3';
		} else if (keycode === this.key.FOUR) {
			return '4';
		} else if (keycode === this.key.FIVE) {
			return '5';
		} else if (keycode === this.key.SIX) {
			return '6';
		} else if (keycode === this.key.SEVEN) {
			return '7';
		} else if (keycode === this.key.EIGHT) {
			return '8';
		} else if (keycode === this.key.NINE) {
			return '9';
		} else if (keycode === this.key.ZERO) {
			return '0';
		}

		return null;
	};
	/**
	 * Get arrow direction
	 *
	 * @param {Number} keycode
	 * @returns {String} left, right, up, down
	 */
	Factory.prototype.getArrow = function(keycode) {
		if (keycode === this.key.LEFT) {
			return 'left';
		} else if (keycode === this.key.RIGHT) {
			return 'right';

		} else if (keycode === this.key.UP) {
			return 'up';

		} else if (keycode === this.key.DOWN) {
			return 'down';
		}
	};
	/**
	 * Handles keyDown events
	 *
	 * @private
	 */
	Factory.prototype.onKeyDown = function(ev) {
		var keyCode;

		if (typeof ev === 'object') {
			keyCode = ev.keyCode;

		} else {
			keyCode = ev;
		}

		if (keyCode === this.key.RETURN) {
			ev.preventDefault();
		}

		if (this.trigger('beforekey', keyCode, ev) === false) {
			return;
		}

		if (!this.enabled) {
			return;
		}

		this.trigger('key', keyCode, ev);
	};

	return new Factory();
})();