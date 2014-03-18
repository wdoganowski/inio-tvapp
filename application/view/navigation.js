/**
 * Navigation view
 *
 * @author Mautilus s.r.o.
 * @class View_Navigation
 * @extends View
 */
function View_Navigation() {
	View.apply(this, arguments);
};

View_Navigation.prototype.__proto__ = View.prototype;

View_Navigation.prototype.init = function() {
	this.on('show', function() {
		App.$overlay.show();
	});

	this.on('hide', function() {
		App.$overlay.hide();
	});
};
View_Navigation.prototype.setItems = function(collection) {
	this.items = [];

	collection.forEach(function(model) {
		var subitems, item = {
				id: model.id,
				icon: model.attr('icon'),
				label: model.attr('title'),
				href: model.attr('href'),
				hasSubmenu: model.length ? true : false
			};

		if (item.hasSubmenu) {
			subitems = [];

			item.submenu = new View_Navigation_Submenu(this, {
				items: subitems
			});

			model.forEach(function(subitem) {
				subitems.push({
					id: subitem.id,
					label: subitem.title || subitem.attr('title')
				});
			});
		}

		this.items.push(item);
	}, this);
};
/**
 * @inheritdoc View#render
 */
View_Navigation.prototype.render = function() {
	return Template.render('navigation', this).done(function(html) {
		this.$el.html(html);

		this.renderSubmenus();
	}, this);
};
View_Navigation.prototype.renderSubmenus = function() {
	for (var i in this.items) {
		if (this.items[i] && this.items[i].submenu) {
			this.items[i].submenu.renderTo(this.$el.find('[data-id="' + this.items[i].id + '"] .submenu'));
		}
	}
};
/**
 * @inheritdoc View#focus
 */
View_Navigation.prototype.focus = function() {
	return Focus.to(this.getFocusable(0, true));
};
/**
 * @inheritdoc View#navigate
 */
View_Navigation.prototype.navigate = function(direction) {
	var $el;

	if (Focus.focused.hasClass('main-item')) {
		if (direction === 'right') {
			Focus.to(this.getFocusable(1, true, null, '.main-item'));

		} else if (direction === 'left') {
			Focus.to(this.getFocusable(-1, true, null, '.main-item'));

		} else if (direction === 'up' && Focus.focused.attr('data-submenu')) {
			this.focusSubmenu(Focus.focused);
		}

		return false;

	} else {
		$el = this.$el.find('li.active').find('.main-item');

		if (direction === 'left') {
			Focus.to(this.getFocusable(-1, $el, null, '.main-item'));

		} else if (direction === 'right') {
			Focus.to(this.getFocusable(1, $el, null, '.main-item'));
		}
	}
};
/**
 * @inheritdoc View#onClick
 */
View_Navigation.prototype.onClick = function() {
	return this.onEnter.apply(this, arguments);
};
/**
 * @inheritdoc View#onEnter
 */
View_Navigation.prototype.onEnter = function($el) {
	var href = $el.attr('data-href');

	if (href) {
		this.hide();
		Router.go(href);
		return false;

	} else if ($el.attr('data-submenu')) {
		this.focusSubmenu($el);
		return false;
	}
};
/**
 * @inheritdoc View#onFocus
 */
View_Navigation.prototype.onFocus = function($el) {
	if ($el.hasClass('main-item')) {
		this.$el.find('li.active').removeClass('active');
		$el.parent().addClass('active');
	}
};
/**
 * @inheritdoc View#onReturn
 */
View_Navigation.prototype.onReturn = function() {
	this.hide();
	App.sidebar.focus();
	return false;
};
View_Navigation.prototype.focusSubmenu = function($el) {
	Focus.to($el.parent().find('.submenu').find('.focusable:last'));
};
View_Navigation.prototype.blurSubmenu = function() {
	var $el = this.$el.find('li.active');
	Focus.to($el.find('.main-item'));
};