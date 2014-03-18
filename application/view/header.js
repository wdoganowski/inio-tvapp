/**
 * Header view
 *
 * @author Mautilus s.r.o.
 * @class View_Header
 * @extends View
 */
function View_Header() {
	View.apply(this, arguments);
};

View_Header.prototype.__proto__ = View.prototype;

/**
 * @inheritdoc View#render
 */
View_Header.prototype.render = function() {
	return Template.render('header', this).done(function(html) {
		this.$el.html(html);

		this.$elBreadcrumb = this.$el.find('.breadcrumb');
	}, this);
};

View_Header.prototype.setBreadcrumbPath = function(steps) {
	if (steps && steps.length) {
		steps = steps.filter(function(str){
			return (str !== '' && str !== null);
		});

		this.$elBreadcrumb.html('<li>' + steps.join('</li><li>') + '</li>');

	} else {
		this.$elBreadcrumb.empty();
	}
};