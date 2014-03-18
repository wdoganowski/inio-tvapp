/**
 * View abstract class
 *
 * @author Mautilus s.r.o.
 * @class View
 * @abstract
 * @mixins Events
 * @mixins Deferrable
 */
function View() {
	Events.call(this);
	Deferrable.call(this);

	this.construct.apply(this, arguments);
};

View.prototype.__proto__ = Events.prototype;
View.prototype.__proto__.__proto__ = Deferrable.prototype;

/**
 * Construct object
 *
 * @constructor
 * @param {String} [parent=null] Another View instance this view belongs to
 * @param {Object} [attributes={}] Object attrs
 */
View.prototype.construct = function(parent, attributes) {
	if (typeof attributes === 'undefined' && parent && !parent.construct) {
		// parent is not provided, but attributes are
		attributes = $.extend(true, {}, parent);
		parent = null;
	}

	/**
	 * @property {Object} parent Parent snippet or scene
	 */
	this.parent = parent;

	this.reset(attributes);

	this.$el = this.create();

	if (this.id) {
		this.$el.attr('id', this.id);
	}

	if (this.cls) {
		this.$el.addClass(this.cls);
	}

	this.init.apply(this, arguments);
	this.bindEvents();
};
/**
 * Destruct object
 *
 * @private
 */
View.prototype.desctruct = function() {
	this.deinit.apply(this, arguments);
	this.destroy();
};
/**
 * Set focus to the scene
 *
 * @template
 */
View.prototype.focus = function() {

};
/**
 * Reset properties
 *
 * @param {Object} [attributes] Object attrs
 */
View.prototype.reset = function(attributes) {
	this.isVisible = false;
	this.isActive = false;

	if (attributes) {
		this.setAttributes(attributes);
	}
};
/**
 * Set object properties, functions and attributes that start with '_' are not allowed
 *
 * @param {Object} attributes
 */
View.prototype.setAttributes = function(attributes) {
	for (var i in attributes) {
		if (typeof attributes[i] !== 'undefined' && typeof attributes[i] !== 'function' && typeof this[i] !== 'fucntion' && i.substr(0, 1) !== '_') {
			this[i] = attributes[i];
		}
	}
};
/**
 * Bind listeners to the `key` event and some others
 */
View.prototype.bindEvents = function() {
	if (this.parent) {
		this.parent.on('key', this._onKey, this);
		this.parent.on('click', this._onClick, this);
		this.parent.on('scroll', this._onScroll, this);
		this.parent.on('focus', this._onFocus, this);

	} else {
		Control.on('key', this._onKey, this);
		Mouse.on('click', this._onClick, this);
		Mouse.on('scroll', this._onScroll, this);
		Focus.on('focus', this._onFocus, this);
	}

	I18n.on('langchange', this._onLangChange, this);
};
/**
 * Un-bind all default listeners
 */
View.prototype.unbindEvents = function() {
	if (this.parent) {
		this.parent.off('key', this._onKey, this);
		this.parent.off('click', this._onClick, this);
		this.parent.off('scroll', this._onScroll, this);
		this.parent.off('focus', this._onFocus, this);

	} else {
		Control.off('key', this._onKey, this);
		Mouse.off('click', this._onClick, this);
		Mouse.off('scroll', this._onScroll, this);
		Focus.off('focus', this._onFocus, this);
	}

	I18n.off('langchange', this._onLangChange, this);
};
/**
 * Create scene's element, is called when scene is being constructed
 *
 * @template
 * @returns {Object} Element, jQuery collection
 */
View.prototype.create = function() {
	return $('<div />');
};
/**
 * Remove scene's elements when scene is hiding
 *
 * @template
 */
View.prototype.remove = function() {

};
/**
 * Remove or hide scene's element, is called when scene is being destructed
 *
 * @template
 * @return {Boolean/Promise} Return FALSE when you don't want to hide this scene, Promise may be also returned
 */
View.prototype.destroy = function() {

};
/**
 * Initialise scene
 *
 * @template
 */
View.prototype.init = function() {

};
/**
 * De-initialise scene
 *
 * @template
 */
View.prototype.deinit = function() {

};
/**
 * Activate and focus scene when its shown
 *
 * @template
 * @return {Boolean/Promise} Return FALSE when you don't want to show this scene, Promise may be also returned
 */
View.prototype.activate = function() {

};
/**
 * Deactivate scene when its hidden
 *
 * @template
 * @return {Boolean} Return FALSE when you don't want to destroy this scene when its hidden
 */
View.prototype.deactivate = function() {

};
/**
 * This method is called when and 'activate' method fails
 *
 * @template
 * @return {Boolean} If TRUE is returned, router will call goBack (default action)
 */
View.prototype.revert = function() {
	return true;
};
/**
 * Render snippet
 *
 * @template
 * @return {Promise}
 */
View.prototype.render = function() {

};
/**
 * Render snippet into specified target element
 *
 * @param {Object} target jQuery collection or HTMLElement
 */
View.prototype.renderTo = function(target) {
	var p;

	this.$el.appendTo(target);

	p = this.render();

	if (p instanceof Promise) {
		p.done(function() {
			this.show();
		}, this);

	} else {
		this.show();
	}

	return p;
};
/**
 * Display scene's element and set `this.isVisible` to TRUE
 */
View.prototype.show = function() {
	var args = arguments;

	return this.when(function(promise) {
		var activated;

		if (this.onBeforeShow() === false) {
			promise.reject();
			return false;
		}

		this.$el.show();
		this.isVisible = true;
		this.isActive = false;
		this.onShow();
		this.trigger('show');

		promise.fail(function() {
			this.hide();
		}, this);

		activated = this.activate.apply(this, args);

		if (activated instanceof Promise) {
			activated.then(function(status) {
				this.isActive = status;

				if (status) {
					promise.resolve();

				} else {
					promise.reject();
				}
			}, this);

		} else if (activated !== false) {
			this.isActive = true;
			promise.resolve();

		} else {
			this.isActive = false;
			promise.reject();
		}

	}, this);
};
/**
 * Fired before the view is being shown and before `activate` method
 *
 * @template
 * @return {Boolean}
 */
View.prototype.onBeforeShow = function() {

};
/**
 * Fired when this view is displayed
 *
 * @template
 */
View.prototype.onShow = function() {

};
/**
 * Hide scene's element and set `this.isVisible` to FALSE
 */
View.prototype.hide = function() {
	return this.when(function(promise) {
		var deactivated;

		promise.done(function() {
			this.onBeforeHide();
			this.$el.hide();
			this.isVisible = false;
			this.onHide();
			this.trigger('hide');
		}, this);

		deactivated = this.deactivate();

		if (deactivated instanceof Promise) {
			deactivated.then(function(status) {
				if (status) {
					this.isActive = false;
					promise.resolve();

				} else {
					promise.reject();
				}
			}, this);

		} else if (deactivated !== false) {
			this.isActive = false;
			promise.resolve();

		} else {
			promise.reject();
		}

	}, this);
};
/**
 * Fired before the view is being hidden but after `deactivate` method (no return value)
 *
 * @template
 */
View.prototype.onBeforeHide = function() {

};
/**
 * Fired when this view is hidden
 *
 * @template
 */
View.prototype.onHide = function() {

};
/**
 * Test if this scene has focus (or any snippet inside this scene)
 *
 * @returns {Boolean}
 */
View.prototype.hasFocus = function() {
	return Focus.isIn(this.$el);
};
/**
 * @private
 */
View.prototype._onKey = function(keyCode, ev, stop) {
	if (!this.isVisible || !this.hasFocus()) {
		return;
	}

	if (this.trigger('beforekey', keyCode, ev) === false) {
		return false;
	}

	if (this.onKey(keyCode, ev, stop) === false) {
		return false;
	}

	if (Control.isArrow(keyCode) && this.navigate(Control.getArrow(keyCode), stop) === false) {
		return false;
	}

	if (keyCode === Control.key.ENTER && this.onEnter(Focus.focused, ev, stop) === false) {
		return false;

	} else if (keyCode === Control.key.RETURN && this.onReturn(Focus.focused, ev, stop) === false) {
		return false;
	}

	if (this.trigger('key', keyCode, ev) === false) {
		return false;
	}
};
/**
 * Handles keyDown events
 *
 * @template
 * @param {Number} keyCode
 * @param {Event} event
 * @param {Function} stop
 * @returns {Boolean}
 */
View.prototype.onKey = function(keyCode, ev, stop) {

};
/**
 * Handles ENTER event
 *
 * @template
 * @param {Object} $el Target element, jQuery collection
 * @param {Event} event
 * @returns {Boolean}
 */
View.prototype.onEnter = function($el, event) {

};
/**
 * Handles RETURN event
 *
 * @template
 * @param {Object} $el Target element, jQuery collection
 * @param {Event} event
 * @returns {Boolean}
 */
View.prototype.onReturn = function($el, event) {

};
/**
 * @private
 */
View.prototype._onClick = function($el, event) {
	if (!$el.belongsTo(this.$el)) {
		return;
	}

	if (this.onClick.apply(this, arguments) === false) {
		return false;
	}

	return this.trigger('click', $el, event);
};
/**
 * Handles Click event
 *
 * @param {Object} $el Target element, jQuery collection
 * @param {Event} event Mouse event
 * @returns {Boolean}
 */
View.prototype.onClick = function($el, event) {

};
/**
 * @private
 */
View.prototype._onScroll = function($el, delta, event) {
	if (!$el.belongsTo(this.$el)) {
		return;
	}

	if (this.onScroll.apply(this, arguments) === false) {
		return false;
	}

	return this.trigger('scroll', $el, delta, event);
};
/**
 * Handles Scroll event when this scene is visible
 *
 * @param {Object} $el Target element, jQuery collection
 * @param {Number} delta, 1 or -1
 * @param {Event} event Mouse event
 * @returns {Boolean}
 */
View.prototype.onScroll = function($el, delta, event) {

};
/**
 * @private
 */
View.prototype._onFocus = function($el) {
	if (!$el.belongsTo(this.$el)) {
		return;
	}

	if (this.onFocus.apply(this, arguments) === false) {
		return false;
	}

	return this.trigger('focus', $el);
};
/**
 * Handles Focus event
 *
 * @template
 * @param {Object} $el Target element, jQuery collection
 * @returns {Boolean}
 */
View.prototype.onFocus = function($el) {

};
/**
 * @private
 */
View.prototype._onLangChange = function() {
	if (this.onLangChange.apply(this, arguments) === false) {
		return false;
	}

	this.trigger('langchange');
};
/**
 * When app language is changed
 *
 * @template
 * @returns {Boolean}
 */
View.prototype.onLangChange = function() {

};
/**
 * Navigate in 4-way direction
 *
 * @template
 * @param {String} direction Possible values: 'left', 'right', 'up', 'down'
 * @param {Function} stop
 * @return {Boolean} Return FALSE to prevent event from bubeling
 */
View.prototype.navigate = function(direction, stop) {

};
/**
 * Get all focusable elements inside this snippet. This takes currentyl focused
 * element and calculates new one. If the new sibling is not exits, new focus
 * is getting from the start / end of collection - cyclic.
 *
 * Is the same like getFocusable, but you can specify parent and also you can
 * walkthrough all elements in cyclic.
 *
 * @param {Number} direction left is equal to -1, right to 1
 * @param {Object} parent jquery object. All focusable elements belongs only to this parent.
 * @returns {Object} jQuery collection
 */
View.prototype.getCircleFocusable = function(direction, parent) {
	var els = $('.focusable', parent || this.$el).not('.disabled').filter(':visible'),
		focusedIndex = Focus.focused ? els.index(Focus.focused) : -1;
	if (focusedIndex !== -1) {
		focusedIndex += direction;
		if (focusedIndex === -1)
			return els.eq(els.length - 1);
		else if (focusedIndex > els.length - 1)
			return els.eq(0);
		else
			return els.eq(focusedIndex);
	}
};
/**
 * Get all focusable elements inside this scene
 *
 * @param {Number} [index] If specified, then returns only one element at the specified position
 * @param {Boolean} [fromCurrentlyFocused=false] If TRUE, than elements before focused element are cut off
 * @param {Object} [$el=this.$el] Limit search for just this specified element, jQuery collection
 * @param {String} [selector=.focusable]
 * @returns {Object} jQuery collection
 */
View.prototype.getFocusable = function(index, fromCurrentlyFocused, $el, selector) {
	var els, focusedIndex, _index = index;

	if (!selector) {
		selector = '.focusable';
	}

	els = $(selector, $el || this.$el).filter(':visible').not('.disabled');

	if (fromCurrentlyFocused) {
		if(typeof fromCurrentlyFocused === 'boolean'){
			focusedIndex = Focus.focused ? els.index(Focus.focused) : -1;

		} else {
			focusedIndex = els.index(fromCurrentlyFocused);
		}

		if (typeof index !== 'undefined' && _index < 0) {
			els = els.slice(0, (focusedIndex >= 0 ? focusedIndex : 1));
			//_index += els.length;

		} else {
			els = els.slice(focusedIndex >= 0 ? focusedIndex : 0);
		}
	}

	if (typeof _index !== 'undefined') {
		return els.eq(_index >> 0);
	}

	return els;
};
/**
 * Convert View into string
 *
 * @returns {String}
 */
View.prototype.toString = function() {
	this.render();

	return this.$el[0].outerHTML;
};