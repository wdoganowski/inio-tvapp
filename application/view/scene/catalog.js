/**
 * Catalog scene
 *
 * @author Mautilus s.r.o.
 * @class Scene_Catalog
 * @extends Scene
 */
function Scene_Catalog() {
	Scene.apply(this, arguments);
};

Scene_Catalog.prototype.__proto__ = Scene.prototype;

Scene_Catalog.prototype.init = function() {
	this.catalog = new View_Catalog();

	this.catalog.on('select', function($el, title) {
		App.header.setBreadcrumbPath([this.filterName, title]);
	}, this);
};
/**
 * @inheritdoc Scene#create
 */
Scene_Catalog.prototype.create = function() {
	return $('<div class="scene" id="scene-catalog" />').appendTo(App.$viewport);
};
/**
 * @inheritdoc Scene#onShow
 */
Scene_Catalog.prototype.onShow = function() {
	App.throbber();
};
/**
 * @inheritdoc Scene#activate
 */
Scene_Catalog.prototype.activate = function(filterId, filterName) {
	this.filterName = filterName;
	this.collection = Content.find('content.catalog');

	return this.collection.load(filterId).done(function() {
		this.catalog.setCollection(this.collection);
	}, this);
};
/**
 * @inheritdoc Scene#render
 */
Scene_Catalog.prototype.render = function() {
	return this.when(function(promise) {
		Template.render('scene-catalog', this).done(function(html) {
			this.$el.html(html);

			this.catalog.renderTo(this.$el.find('.movies')).done(function() {
				promise.resolve();
				App.throbberHide();

			}).fail(function() {
				promise.reject();
				App.throbberHide();
			})
		}, this);
	});
};
/**
 * @inheritdoc Scene#focus
 */
Scene_Catalog.prototype.focus = function() {
	this.catalog.focus(0);
};
/**
 * @inheritdoc Scene#onEnter
 */
Scene_Catalog.prototype.onEnter = function($el) {
	var id = $el.attr('data-id');

	if (id) {
		Router.go('detail', id, this.filterName, this.collection);
		return false;
	}
};
/**
 * @inheritdoc Scene#onReturn
 */
Scene_Catalog.prototype.onReturn = function() {
	App.sidebar.focus();
	return false;
};