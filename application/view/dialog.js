/**
 * Dialog view
 *
 * @author Mautilus s.r.o.
 * @class View_Dialog
 * @extends View
 */
function View_Dialog() {
	View.apply(this, arguments);
};

View_Dialog.prototype.__proto__ = View.prototype;

/**
 * Open dialog
 */
View_Dialog.prototype.open = function() {
	App.$overlay.show();

	this.render().done(function() {
		this.show();
		this.trigger('open');
	}, this);
};
/**
 * Close dialog
 */
View_Dialog.prototype.close = function() {
	App.$overlay.hide();
	this.hide();
	this.trigger('close');
};
/**
 * @inheritdoc View#create
 */
View_Dialog.prototype.create = function() {
	return $('<div class="dialog" />').appendTo(App.$viewport);
};
/**
 * @inheritdoc View#render
 */
View_Dialog.prototype.render = function() {
	return Template.render('dialog', this).done(function(html) {
		this.$el.html(html);
	}, this);
};
/**
 * @inheritdoc View#focus
 */
View_Dialog.prototype.focus = function() {
	return Focus.to(this.getFocusable(0, true));
};
/**
 * @inheritdoc View#activate
 */
View_Dialog.prototype.activate = function() {
	this.focus();
};
/**
 * @inheritdoc View#navigate
 */
View_Dialog.prototype.navigate = function(direction) {
	if (direction === 'left') {
		Focus.to(this.getFocusable(-1, true));

	} else if (direction === 'right') {
		Focus.to(this.getFocusable(1, true));
	}

	return false;
};
/**
 * @inheritdoc View#onReturn
 */
View_Dialog.prototype.onReturn = function() {
	this.close();
	return false;
};