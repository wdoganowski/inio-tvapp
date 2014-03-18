/**
 * Navigation Submenu view
 *
 * @author Mautilus s.r.o.
 * @class View_Navigation_Submenu
 * @extends View
 */
function View_Navigation_Submenu() {
	View.apply(this, arguments);
};

View_Navigation_Submenu.prototype.__proto__ = View.prototype;

View_Navigation_Submenu.prototype.init = function() {
	this.index = 0;
	this.visibleItems = 7;
};
/**
 * @private
 */
View_Navigation_Submenu.prototype.setIndex = function(index) {
	var i = this.index;

	this.index = index >> 0;

	if (this.index < 0) {
		this.index = 0;

	} else if (this.index > (this.items.length - this.visibleItems + 2)) {
		this.index = (this.items.length - this.visibleItems + 2);
	}

	if (this.index < 0) {
		this.index = 0;
	}

	return (i !== this.index);
};
/**
 * @inheritdoc View#render
 */
View_Navigation_Submenu.prototype.render = function() {
	return Template.render('navigation-submenu', this).done(function(html) {
		this.$el.html(html);

		this.$elUl = this.$el.find('ul');

		this.renderItems();
	}, this);
};
/**
 * @inheritdoc View#focus
 */
View_Navigation_Submenu.prototype.focus = function(idx) {
	return Focus.to(this.getFocusable(idx || 0, true));
};
/**
 * @private
 */
View_Navigation_Submenu.prototype.renderItems = function() {
	var startAt = 0,
		str = '',
		idx, focusAt;

	startAt = this.index - 1;

	focusAt = this.$el.find('.focus').index();

	for (var i = 0; i < this.visibleItems; i++) {
		idx = startAt + i;

		if (this.items[idx]) {
			str = '<li class="' + ((i > 0 && i < (this.visibleItems - 1)) ? 'focusable' : '') + '" data-id="' + this.items[idx].id + '" data-title="' + this.items[idx].label + '">' + this.items[idx].label + '</li>' + str;

		} else {
			str = '<li class="empty">&nbsp;</li>' + str;
		}
	}

	this.$elUl.html(str);

	if (focusAt > -1) {
		this.focus(focusAt - 1);
	}
};
/**
 * @inheritdoc View#navigate
 */
View_Navigation_Submenu.prototype.navigate = function(direction) {
	if (direction === 'down') {
		if (Focus.to(this.getFocusable(1, true)) === false) {
			if (this.setIndex(this.index - 1) === true) {
				this.renderItems();
				return false;

			} else {
				this.parent.blurSubmenu();
			}

		} else {
			return false;
		}

	} else if (direction === 'up') {
		if (Focus.to(this.getFocusable(-1, true)) === false) {
			if (this.setIndex(this.index + 1) === true) {
				this.renderItems();
			}
		}

		return false;
	}
};
/**
 * @inheritdoc View#onScroll
 */
View_Navigation_Submenu.prototype.onScroll = function($el, delta) {
	if (this.setIndex(this.index + (-1 * delta)) === true) {
		this.renderItems();

		return false;
	}
};
/**
 * @inheritdoc View#onEnter
 */
View_Navigation_Submenu.prototype.onEnter = function($el) {
	var href = $el.attr('data-href'),
		id = $el.attr('data-id');

	if (!href && id) {
		// catalog
		this.parent.hide();
		Router.go('catalog', id, $el.attr('data-title'));
		return false;
	}
};