/**
 * Exit dialog view
 *
 * @author Mautilus s.r.o.
 * @class View_Dialog_Exit
 * @extends View
 */
function View_Dialog_Exit() {
	View_Dialog.apply(this, arguments);
};

View_Dialog_Exit.prototype.__proto__ = View_Dialog.prototype;

/**
 * @inheritdoc View#render
 */
View_Dialog_Exit.prototype.render = function() {
	return Template.render('dialog-exit', this).done(function(html) {
		this.$el.html(html);
	}, this);
};
/**
 * @inheritdoc View#onEnter
 */
View_Dialog_Exit.prototype.onEnter = function($el) {
	var btn = $el.attr('data-btn');

	if (btn === 'yes') {
		this.trigger('exit');

	} else if (btn === 'no') {
		this.close();
	}

	return false;
};