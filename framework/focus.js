/**
 * Handles focus over elements
 *
 * @author Mautilus s.r.o.
 * @class Focus
 * @singleton
 * @mixins Events
 */
var Focus = (function() {
	function Factory() {
		Events.call(this);

		/**
		 * @property {Object} config General config hash
		 */
		this.config = null;
		/**
		 * @property {Object} focused
		 * Currently focused element, jQuery collection
		 */
		this.focused = null;
		/**
		 * @property {Object} prevFocused
		 * Previously focused element, jQuery collection
		 */
		this.prevFocused = null;

		// Initialize this class when Inio is ready
		Inio.ready(function() {
			this.init();
		}, this);
	};

	Factory.prototype.__proto__ = Events.prototype;

	/**
	 * @event beforefocus
	 * Will be called when focus is going to be set, no className change yet, args: element, previously_focused_el
	 * @preventable
	 * @param {Object} target Target element, jQuery colleciton
	 * @param {Object} current Currently focused element
	 */

	/**
	 * @event focus
	 * Will be called after focus is set, args: element
	 * @param {Object} target Target element, jQuery colleciton
	 */

	/**
	 * @event blur
	 * Will be called when focus is removed, args: element
	 * @param {Object} element Element, jQuery colleciton
	 */

	Factory.prototype.init = function(config) {
		this.configure(config);

		if (typeof Control !== 'undefined') {
			Control.on('beforekey', function(keyCode, event) {
				if (this.focused && this.focused[0].nodeName === 'INPUT') {
					if (Control.isNumeric(keyCode) && !this.focused.hasClass('keyboard')) {
						this.focused[0].value = this.focused[0].value + Control.getTextValue(keyCode);
					}

					if (typeof Control.key[keyCode] !== 'undefined') {
						event.preventDefault();
					}
				}
			}, this);
		}
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
	 * Move focus on given element
	 *
	 * @param {HTMLElement} target DOM Element or jQuery collection
	 */
	Factory.prototype.to = function(target) {
		target = $(target).eq(0);

		if (!target.length) {
			return false;
		}

		if (this.trigger('beforefocus', target, this.prevFocused) === false) {
			return false;
		}

		if (this.focused && this.focused[0] !== target[0]) {
			this.prevFocused = this.focused;
			this.blur(this.focused);
		}

		this.focused = target;
		this.focused.addClass('focus');
		this.focused.trigger('focusin');

		if (this.focused.is('input')) {
			this.focused.focus();
		}

		this.trigger('focus', target);

		return true;
	};
	/**
	 * Alias for `to` method
	 *
	 * @inheritdoc Focus#to
	 */
	Factory.prototype.focus = function() {
		return this.to.apply(this, arguments);
	};
	/**
	 * Remove focus (blur) from give element
	 *
	 * @chainable
	 * @param {HTMLElement} el DOM Elemenet or jQuery collection
	 */
	Factory.prototype.blur = function(el) {
		if (!el) {
			el = this.focused;
		}

		if (el) {
			el = $(el);
			el.trigger('blur').removeClass('focus');
			this.trigger('blur', el);

			if (el.is('input')) {
				el.blur();
			}

			this.focused = null;
		}

		return this;
	};
	/**
	 * Revert focus on previously focused element
	 *
	 * @returns {Boolean} Return false, if there was no focus
	 */
	Factory.prototype.prev = function() {
		if (this.prevFocused) {
			return this.to(this.prevFocused);
		}

		return false;
	};
	/**
	 * Test if currently focused element is inside given wrapper
	 *
	 * @param {Object} wrapper jQuery collection
	 * @returns {Boolean}
	 */
	Factory.prototype.isIn = function(el) {
		if (!this.focused) {
			return false;
		}

		if (typeof el === 'object' && el[0] === this.focused[0]) {
			return true;
		}

		return this.focused.belongsTo(el);
	};

	return new Factory();
})();