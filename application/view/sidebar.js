/**
 * Sidebar view
 *
 * @author Mautilus s.r.o.
 * @class View_Sidebar
 * @extends View
 */
function View_Sidebar() {
	View.apply(this, arguments);
};

View_Sidebar.prototype.__proto__ = View.prototype;

/**
 * @inheritdoc View#render
 */
View_Sidebar.prototype.render = function() {
	return Template.render('sidebar', this).done(function(html) {
		this.$el.html(html);
	}, this);
};
/**
 * @inheritdoc View#focus
 */
View_Sidebar.prototype.focus = function() {
	return Focus.to(this._focused || this.getFocusable(0, true));
};
/**
 * @inheritdoc View#navigate
 */
View_Sidebar.prototype.navigate = function(direction) {
	if (direction === 'down') {
		Focus.to(this.getFocusable(1, true));

	} else if (direction === 'up') {
		Focus.to(this.getFocusable(-1, true));
	}
};
/**
 * @inheritdoc View#onFocus
 */
View_Sidebar.prototype.onFocus = function($el) {
	this._focused = $el;
};
/**
 * @inheritdoc View#onClick
 */
View_Sidebar.prototype.onClick = function() {
	return this.onEnter.apply(this, arguments);
};
/**
 * @inheritdoc View#onEnter
 */
View_Sidebar.prototype.onEnter = function($el) {
	var action = $el.attr('data-action');

	if (action === 'menu') {
		App.navigation.show();
		App.navigation.focus();
	}

	return false;
};
/**
 * @inheritdoc View#onReturn
 */
View_Sidebar.prototype.onReturn = function() {
	App.exit();
	return false;
};
View_Sidebar.prototype.navigate = function(direction) {
	if (direction === 'right') {
		Router.activeScene.focus();
		return false;
	}
};