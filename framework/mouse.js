/**
 * Handles mouse/pointer events
 *
 * @author Mautilus s.r.o.
 * @class Mouse
 * @singleton
 * @mixins Events
 */
var Mouse = (function() {
	function Factory() {
		Events.call(this);

		/**
		 * @property {Object} config General config hash
		 */
		this.config = null;

		// Initialize this class when Inio is ready
		Inio.ready(function() {
			this.init();
		}, this);
	};

	Factory.prototype.__proto__ = Events.prototype;

	/**
	 * @event click
	 * Will be called when a click event is triggered
	 * @param {Object} target Target element, jQuery colleciton
	 * @param {Event} event
	 */

	/**
	 * @event scroll
	 * Will be called when user scrolls
	 * @param {Object} target Target element, jQuery colleciton
	 * @param {Number} delta -1/+1
	 * @param {Event} event
	 */

	Factory.prototype.init = function(config) {
		var scope = this;
		this.enabled = true;

		this.configure(config);

		jQuery(document).on('mouseenter', '.focusable', function() {
			if (typeof Focus !== 'undefined') {
				Focus.to(this);
			}
		});

		jQuery(document).on('click', '.focusable, .clickable', function(event) {
			scope.onClick(this, event);
		});

		jQuery(document).on('mousewheel', function(event) {
			var delta = event.wheelDelta || event.originalEvent.wheelDelta;
			scope.onScroll(event.target || event.originalEvent.target, delta, event);
		});
	};
	/*
	 * Enable mouse click event.
	 *
	 */
	Factory.prototype.enable = function() {
		this.enabled = true;
		this.trigger('enable');
	};
	/*
	 * Disable mouse click event.
	 *
	 */
	Factory.prototype.disable = function() {
		this.enabled = false;
		this.trigger('disable');
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
	 * Handles click event
	 *
	 * @private
	 */
	Factory.prototype.onClick = function(target, event) {
		if (!this.enabled)
			return;
		target = $(target).eq(0);

		this.trigger('click', target, event);
	};
	/**
	 * Handles scroll event
	 *
	 * @private
	 */
	Factory.prototype.onScroll = function(target, delta, event) {
		target = $(target).eq(0);

		if (delta > 0) {
			delta = 1;

		} else {
			delta = -1;
		}

		this.trigger('scroll', target, delta, event);
	};

	return new Factory();
})();